from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime

class Task(SQLModel, table=True):
    """Task entity belonging to a project."""
    id: Optional[int] = Field(default=None, primary_key=True)
    project_id: int = Field(foreign_key="project.id")
    title: str
    description: str
    status: str = "todo"   # todo / in_progress / done
    order: int = 0
    created_at: datetime = Field(default_factory=datetime.utcnow)
    pr_url: Optional[str] = None
