from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime

class JoinRequest(SQLModel, table=True):
    """
    Represents a request from a user to join a project.
    """
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    project_id: int = Field(foreign_key="project.id")
    
    status: str = "pending"  # pending, accepted, rejected
    message: Optional[str] = None
    
    created_at: datetime = Field(default_factory=datetime.utcnow)
