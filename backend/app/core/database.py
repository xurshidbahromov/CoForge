import os
from sqlmodel import SQLModel, create_engine, Session
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlalchemy.ext.asyncio import create_async_engine
from contextlib import asynccontextmanager

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost/coforge")

# Synchronous engine for simple scripts / migrations
engine = create_engine(DATABASE_URL, echo=False)

# Asynchronous engine for FastAPI endpoints
async_engine = create_async_engine(DATABASE_URL, echo=False)

def create_db_and_tables():
    """Create tables based on SQLModel models."""
    SQLModel.metadata.create_all(engine)

@asynccontextmanager
async def get_async_session() -> AsyncSession:
    async with AsyncSession(async_engine) as session:
        yield session
