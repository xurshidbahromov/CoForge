import os
import secrets
import httpx
from fastapi import APIRouter, Depends, Request, Response, HTTPException, status, Cookie
from sqlmodel import Session, select
from datetime import datetime, timedelta
import jwt

from ..core.database import get_async_session
from ..models.user import User

router = APIRouter()

# ----------------------------------------------------------------------
# Config
# ----------------------------------------------------------------------
GITHUB_CLIENT_ID = os.getenv("GITHUB_CLIENT_ID", "")
GITHUB_CLIENT_SECRET = os.getenv("GITHUB_CLIENT_SECRET", "")
JWT_SECRET = os.getenv("JWT_SECRET", "dev‑secret‑key")
JWT_ALGORITHM = "HS256"
JWT_EXPIRE_MINUTES = 60 * 24 * 30   # 30 days

# ----------------------------------------------------------------------
# Helpers
# ----------------------------------------------------------------------
def create_jwt_token(user_id: int) -> str:
    expire = datetime.utcnow() + timedelta(minutes=JWT_EXPIRE_MINUTES)
    payload = {"sub": str(user_id), "exp": expire}
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def decode_jwt_token(token: str) -> int:
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return int(payload["sub"])
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

# ----------------------------------------------------------------------
# Routes
# ----------------------------------------------------------------------
@router.get("/login")
def login():
    state = secrets.token_urlsafe(16)
    redirect_uri = "http://localhost:8000/auth/callback"
    github_auth_url = (
        f"https://github.com/login/oauth/authorize"
        f"?client_id={GITHUB_CLIENT_ID}"
        f"&redirect_uri={redirect_uri}"
        f"&state={state}"
        "&scope=read:user user:email"
    )
    return Response(status_code=status.HTTP_302_FOUND, headers={"Location": github_auth_url})

@router.get("/callback")
async def callback(code: str = None, state: str = None):
    if not code:
        raise HTTPException(status_code=400, detail="Missing code")

    token_url = "https://github.com/login/oauth/access_token"
    async with httpx.AsyncClient() as client:
        token_resp = await client.post(
            token_url,
            data={
                "client_id": GITHUB_CLIENT_ID,
                "client_secret": GITHUB_CLIENT_SECRET,
                "code": code,
            },
            headers={"Accept": "application/json"},
        )
        token_data = token_resp.json()
        access_token = token_data.get("access_token")
        
        if not access_token:
            raise HTTPException(status_code=400, detail="Failed to obtain access token")

        user_resp = await client.get(
            "https://api.github.com/user",
            headers={"Authorization": f"token {access_token}"},
        )
        gh_user = user_resp.json()

    async with get_async_session() as session:
        stmt = select(User).where(User.github_id == str(gh_user["id"]))
        result = await session.execute(stmt)
        db_user = result.scalar_one_or_none()

        if db_user:
            db_user.username = gh_user["login"]
            db_user.avatar_url = gh_user.get("avatar_url")
        else:
            db_user = User(
                github_id=str(gh_user["id"]),
                username=gh_user["login"],
                avatar_url=gh_user.get("avatar_url"),
                email=gh_user.get("email"),
            )
            session.add(db_user)

        await session.commit()
        await session.refresh(db_user)
        token = create_jwt_token(db_user.id)

    FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")
    response = Response(status_code=status.HTTP_302_FOUND, headers={"Location": f"{FRONTEND_URL}/dashboard"})
    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        max_age=JWT_EXPIRE_MINUTES * 60,
        samesite="lax"
    )
    return response

@router.get("/me")
async def me(access_token: str = Cookie(None)):
    """
    Return the logged‑in user's profile.
    """
    if not access_token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    user_id = decode_jwt_token(access_token)
    async with get_async_session() as session:
        stmt = select(User).where(User.id == user_id)
        result = await session.execute(stmt)
        user = result.scalar_one_or_none()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return user

@router.patch("/me")
async def update_me(
    user_update: dict,
    access_token: str = Cookie(None)
):
    """
    Update the logged‑in user's profile (stack, level, goal).
    """
    if not access_token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    user_id = decode_jwt_token(access_token)
    async with get_async_session() as session:
        stmt = select(User).where(User.id == user_id)
        result = await session.execute(stmt)
        db_user = result.scalar_one_or_none()
        if not db_user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Update fields – stack is expected as a shared string or comma‑separated for now
        # or we update the model to support JSON if needed
        if "stack" in user_update:
            db_user.stack = ",".join(user_update["stack"]) if isinstance(user_update["stack"], list) else user_update["stack"]
        if "level" in user_update:
            db_user.level = user_update["level"]
        if "goal" in user_update:
            db_user.goal = user_update["goal"]
            
        session.add(db_user)
        await session.commit()
        await session.refresh(db_user)
        return db_user
