from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional, List
import asyncio
import os

router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    context: Optional[str] = None
    history: Optional[List[dict]] = []

class ChatResponse(BaseModel):
    response: str

@router.post("/chat", response_model=ChatResponse)
async def chat_with_mentor(request: ChatRequest):
    """
    Chat with the AI Mentor. 
    Currently a mock implementation to verify frontend-backend connection.
    """
    
    # Simulate network delay for realism
    await asyncio.sleep(1)
    
    # Mock Response Logic
    user_msg = request.message.lower()
    
    if "hello" in user_msg or "hi" in user_msg:
        return {"response": "Hello! I'm your AI Mentor. I can help you with code reviews, debugging, or career advice. What are you working on today?"}
    
    if "code" in user_msg or "review" in user_msg:
        return {"response": "I'd be happy to review your code! Please paste the snippet you'd like me to look at."}
        
    if "bug" in user_msg:
        return {"response": "Debugging is part of the process! Tell me what error you're seeing or describe the unexpected behavior."}

    return {"response": f"That's an interesting point about '{request.message}'. As an AI Mentor, I'd suggest breaking this down into smaller steps. Could you provide a bit more context?"}
