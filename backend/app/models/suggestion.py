from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime

class ProjectSuggestion(SQLModel, table=True):
    """
    Personalized AI project suggestion stored for the user.
    Persists until the user discards it or starts the project.
    """
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(index=True)
    
    title: str
    description: str
    stack: str  # JSON or comma-separated string
    difficulty: str
    
    created_at: datetime = Field(default_factory=datetime.utcnow)
