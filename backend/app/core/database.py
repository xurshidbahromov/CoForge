import os
from sqlmodel import SQLModel, create_engine, Session
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlalchemy.ext.asyncio import create_async_engine
from contextlib import asynccontextmanager

# Imports for SQLModel table creation
from ..models.user import User
from ..models.project import Project
from ..models.task import Task
from ..models.join_request import JoinRequest

# Default to SQLite for easy local dev
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///coforge.db")

if "sqlite" in DATABASE_URL:
    # Synchronous engine for simple scripts / init
    engine = create_engine(
        DATABASE_URL, 
        connect_args={"check_same_thread": False}, 
        echo=False
    )
    
    # Asynchronous engine for FastAPI
    # Ensure we use the aiosqlite driver
    async_url = DATABASE_URL.replace("sqlite://", "sqlite+aiosqlite://")
    async_engine = create_async_engine(
        async_url, 
        echo=False, 
        connect_args={"check_same_thread": False}
    )
else:
    # Postgres configuration
    engine = create_engine(DATABASE_URL.replace("postgresql+asyncpg://", "postgresql://"), echo=False)
    
    async_url = DATABASE_URL
    if async_url.startswith("postgresql://"):
        async_url = async_url.replace("postgresql://", "postgresql+asyncpg://")
    
    async_engine = create_async_engine(async_url, echo=False)

def create_db_and_tables():
    """Create tables based on SQLModel models."""
    SQLModel.metadata.create_all(engine)

@asynccontextmanager
async def get_async_session() -> AsyncSession:
    async with AsyncSession(async_engine) as session:
        yield session
