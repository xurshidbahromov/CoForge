from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime

class TeamMember(SQLModel, table=True):
    """Link table between Users and Projects with role information."""
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    project_id: int = Field(foreign_key="project.id")
    role: str = "member"   # e.g. "owner", "maintainer", "member"
    joined_at: datetime = Field(default_factory=datetime.utcnow)
