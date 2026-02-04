from typing import Optional, List
from datetime import datetime
from sqlmodel import SQLModel, Field, Relationship

class Channel(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(index=True, unique=True)
    description: str
    type: str = Field(default="public") 
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    messages: List["Message"] = Relationship(back_populates="channel")

class Message(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    content: str
    channel_id: int = Field(foreign_key="channel.id")
    user_id: int = Field(foreign_key="user.id")
    parent_id: Optional[int] = Field(default=None, foreign_key="message.id")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    channel: Optional[Channel] = Relationship(back_populates="messages")
    
class Reaction(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    emoji: str
    message_id: int = Field(foreign_key="message.id")
    user_id: int = Field(foreign_key="user.id")
