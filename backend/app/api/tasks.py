from fastapi import APIRouter, Depends, HTTPException, status, Cookie
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession
from typing import List
from ..core.database import get_async_session
from ..models.task import Task
from ..models.project import Project
from ..core.ai import break_down_tasks
from ..api.auth import decode_jwt_token

router = APIRouter()

@router.get("/{project_id}", response_model=List[Task])
async def list_tasks(project_id: int):
    async with get_async_session() as session:
        stmt = select(Task).where(Task.project_id == project_id).order_by(Task.order)
        result = await session.execute(stmt)
        return result.scalars().all()

@router.post("/{project_id}/generate", response_model=List[Task])
async def generate_tasks(project_id: int, access_token: str = Cookie(None)):
    """
    Generate tasks for a project using AI.
    """
    if not access_token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    user_id = decode_jwt_token(access_token)
    
    async with get_async_session() as session:
        # Verify the project exists and belongs to the user
        proj_stmt = select(Project).where(Project.id == project_id, Project.owner_id == user_id)
        proj_res = await session.execute(proj_stmt)
        project = proj_res.scalar_one_or_none()
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")

        # Call AI to breakdown tasks
        ai_tasks = await break_down_tasks(
            title=project.title,
            description=project.description,
            stack=project.stack
        )

        db_tasks = []
        for t in ai_tasks:
            db_task = Task(
                project_id=project_id,
                title=t["title"],
                description=t["description"],
                order=t["order"]
            )
            session.add(db_task)
            db_tasks.append(db_task)
        
        await session.commit()
        
        # Refresh all tasks to get IDs
        for task in db_tasks:
            await session.refresh(task)
        
        return db_tasks

@router.patch("/{task_id}", response_model=Task)
async def update_task(task_id: int, task_update: dict):
    async with get_async_session() as session:
        stmt = select(Task).where(Task.id == task_id)
        result = await session.execute(stmt)
        db_task = result.scalar_one_or_none()
        if not db_task:
            raise HTTPException(status_code=404, detail="Task not found")
        
        for key, value in task_update.items():
            if hasattr(db_task, key):
                setattr(db_task, key, value)
        
        session.add(db_task)
        await session.commit()
        await session.refresh(db_task)
        return db_task
