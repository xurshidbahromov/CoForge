from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime

class Project(SQLModel, table=True):
    """Project entity – solo or team project created by a user."""
    id: Optional[int] = Field(default=None, primary_key=True)
    owner_id: int = Field(foreign_key="user.id")
    title: str
    description: str
    stack: str               # e.g. "React + FastAPI"
    type: str = "solo"      # "solo" or "team"
    created_at: datetime = Field(default_factory=datetime.utcnow)
