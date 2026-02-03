from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime

class User(SQLModel, table=True):
    """User profile stored in database."""
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str = Field(index=True, unique=True)
    email: str = Field(index=True, unique=True)
    hashed_password: str
    
    # 1. Personal Info
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    country: Optional[str] = None
    city: Optional[str] = None
    timezone: Optional[str] = None
    language: Optional[str] = "English"
    
    # 2. Professional Identity
    primary_role: Optional[str] = None  # Frontend, Backend, etc.
    level: Optional[str] = None         # Beginner, Junior, Mid
    
    # 3. Bio
    bio: Optional[str] = None
    
    # 4. Skills (JSON)
    skills: Optional[str] = None        # {"React": "Intermediate"}
    
    # 5. Work Experience (Text/JSON)
    work_experience: Optional[str] = None 
    
    # 6. Social Links (JSON)
    social_links: Optional[str] = None  # {"github": "...", "linkedin": "..."}
    
    # 7. Goals & Availability
    primary_goal: Optional[str] = None
    weekly_availability: Optional[str] = None
    
    # 8. Work Preferences (JSON)
    work_preferences: Optional[str] = None # { "mode": "Team", "size": "3-5" }
    
    # 9. AI Preferences (JSON)
    ai_preferences: Optional[str] = None   # { "guidance": "High", "areas": ["Code Explanation"] }
    
    # System
    avatar_url: Optional[str] = None
    is_onboarding_completed: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
