from sqlmodel import SQLModel, Field
from typing import Optional

class User(SQLModel, table=True):
    """User profile stored in PostgreSQL."""
    id: Optional[int] = Field(default=None, primary_key=True)
    github_id: str = Field(index=True, unique=True)   # GitHub numeric ID as string
    username: str                                   # GitHub login name
    email: Optional[str] = None
    avatar_url: Optional[str] = None
    stack: Optional[str] = None        # Frontend / Backend / Full‑stack
    level: Optional[str] = None        # Beginner / Junior / Confident Junior
    goal: Optional[str] = None         # Experience / Portfolio / Job‑ready
