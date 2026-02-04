from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends, HTTPException, Query, Cookie
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession
from typing import List, Dict, Optional
import json
import asyncio

from ..core.database import get_async_session, async_engine
from ..models.chat import Channel, Message
from ..models.user import User
from ..api.auth import decode_jwt_token

router = APIRouter()

# Dependency wrapper for FastAPI
async def get_session():
    async with get_async_session() as session:
        yield session

# WebSocket Manager to handle connections
class ConnectionManager:
    def __init__(self):
        # channel_id -> List[WebSocket]
        self.active_connections: Dict[int, List[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, channel_id: int):
        # WebSocket is already accepted in the endpoint
        if channel_id not in self.active_connections:
            self.active_connections[channel_id] = []
        self.active_connections[channel_id].append(websocket)

    def disconnect(self, websocket: WebSocket, channel_id: int):
        if channel_id in self.active_connections:
            if websocket in self.active_connections[channel_id]:
                self.active_connections[channel_id].remove(websocket)
            if not self.active_connections[channel_id]:
                del self.active_connections[channel_id]

    async def broadcast(self, message: dict, channel_id: int):
        if channel_id in self.active_connections:
            # Iterate copy to avoid issues if remove happens during iteration
            for connection in self.active_connections[channel_id][:]:
                try:
                    await connection.send_json(message)
                except Exception:
                    # Connection might be closed
                    pass

manager = ConnectionManager()

@router.get("/channels")
async def get_channels(session: AsyncSession = Depends(get_session)):
    stmt = select(Channel)
    channels = (await session.execute(stmt)).scalars().all()
    
    if not channels:
        # Seed default channels
        defaults = [
            {"name": "general", "description": "Platform-wide discussions", "type": "public"},
            {"name": "help", "description": "Technical questions & support", "type": "public"},
            {"name": "projects", "description": "Share ideas & find teammates", "type": "public"},
            {"name": "learning", "description": "Resources & tutorials", "type": "public"},
            {"name": "career", "description": "Jobs, internships & advice", "type": "public"},
        ]
        new_channels = []
        for c in defaults:
            ch = Channel(**c)
            session.add(ch)
            new_channels.append(ch)
        await session.commit()
        for ch in new_channels:
            await session.refresh(ch)
        return new_channels
        
    return channels

@router.get("/channels/{channel_id}/messages")
async def get_messages(
    channel_id: int, 
    limit: int = 50, 
    offset: int = 0,
    session: AsyncSession = Depends(get_session)
):
    # Fetch messages with user info
    # We'll fetch messages and then users manually to be safe with async
    stmt = select(Message).where(Message.channel_id == channel_id).order_by(Message.created_at.desc()).offset(offset).limit(limit)
    messages = (await session.execute(stmt)).scalars().all()
    
    # Collect user IDs
    user_ids = {msg.user_id for msg in messages}
    if not user_ids:
        return []
        
    user_stmt = select(User).where(User.id.in_(user_ids))
    users = (await session.execute(user_stmt)).scalars().all()
    user_map = {u.id: u for u in users}
    
    results = []
    for msg in reversed(messages):
        user = user_map.get(msg.user_id)
        results.append({
            "id": msg.id,
            "content": msg.content,
            "user_id": msg.user_id,
            "username": user.username if user else "Unknown",
            "avatar_url": user.avatar_url if user else None,
            "created_at": msg.created_at.isoformat(),
            "parent_id": msg.parent_id
        })
    return results

@router.websocket("/ws/{channel_id}")
async def websocket_endpoint(
    websocket: WebSocket, 
    channel_id: int, 
    token: Optional[str] = Query(None)
):
    # Try to get from Cookie if query param is missing
    await websocket.accept()
    
    final_token = token
    if not final_token:
        final_token = websocket.cookies.get("access_token")
    
    if not final_token:
        print("WS Auth Failed: No token")
        await websocket.close(code=1008)
        return

    try:
        user_id = decode_jwt_token(final_token)
    except Exception as e:
        print(f"WS Auth Failed: {e}")
        await websocket.close(code=1008)
        return
        
    # If connection was already accepted, we maintain it.
    await manager.connect(websocket, channel_id)
    
    try:
        while True:
            data = await websocket.receive_json()
            # Expected: { "content": "..." }
            content = data.get("content")
            if not content:
                continue
                
            # Save to DB
            try:
                # We reuse the async_engine from global import
                # expire_on_commit=False is crucial to avoid MissingGreenlet on property access after commit
                async with AsyncSession(async_engine, expire_on_commit=False) as session:
                    # 1. Fetch user to get details for broadcast
                    u_stmt = select(User).where(User.id == user_id)
                    db_user = (await session.execute(u_stmt)).scalar_one_or_none()
                    
                    if db_user:
                        # 2. Create Message
                        msg = Message(
                            content=content,
                            channel_id=channel_id,
                            user_id=user_id
                        )
                        session.add(msg)
                        await session.commit()
                        
                        # Safe refresh: Check ID, then maybe reload if needed, 
                        # but usually commit populates ID. 
                        # We use session.get to be absolutely safe against implicit IO errors
                        # although refresh(msg) usually works if properly awaited.
                        # Let's try explicit get.
                        if msg.id:
                            refreshed_msg = await session.get(Message, msg.id)
                            if refreshed_msg:
                                msg = refreshed_msg
                        
                        # 3. Broadcast
                        response_data = {
                            "id": msg.id,
                            "content": msg.content,
                            "user_id": user_id,
                            "username": db_user.username,
                            "avatar_url": db_user.avatar_url,
                            "created_at": msg.created_at.isoformat(),
                            "parent_id": msg.parent_id
                        }
                        await manager.broadcast(response_data, channel_id)
            except Exception as e:
                print(f"Error processing message: {e}")
                # Do not close connection, just log error
                    
    except WebSocketDisconnect:
        manager.disconnect(websocket, channel_id)
