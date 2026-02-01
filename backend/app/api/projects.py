from fastapi import APIRouter, Depends, HTTPException, status, Cookie
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession
from typing import List
from ..core.database import get_async_session
from ..models.project import Project
from ..models.user import User
from ..core.ai import generate_project_idea
from ..api.auth import decode_jwt_token

router = APIRouter()

@router.get("/", response_model=List[Project])
async def list_projects(access_token: str = Cookie(None)):
    """List all projects for the authenticated user."""
    if not access_token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    user_id = decode_jwt_token(access_token)
    
    async with get_async_session() as session:
        stmt = select(Project).where(Project.owner_id == user_id).order_by(Project.created_at.desc())
        result = await session.execute(stmt)
        return result.scalars().all()

@router.post("/", response_model=Project, status_code=status.HTTP_201_CREATED)
async def create_project(project: Project, access_token: str = Cookie(None)):
    if not access_token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    user_id = decode_jwt_token(access_token)
    project.owner_id = user_id
    
    async with get_async_session() as session:
        session.add(project)
        await session.commit()
        await session.refresh(project)
        return project

@router.post("/generate", response_model=dict)
async def generate_project(access_token: str = Cookie(None)):
    """
    Generate a new project idea for the logged-in user using AI.
    Also automatically generates tasks for the project.
    """
    from ..models.task import Task
    from ..core.ai import break_down_tasks
    
    if not access_token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    user_id = decode_jwt_token(access_token)
    
    # First, fetch user preferences
    async with get_async_session() as session:
        stmt = select(User).where(User.id == user_id)
        user = (await session.execute(stmt)).scalar_one_or_none()
        
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        user_stack = user.stack or "Fullstack"
        user_level = user.level or "Junior"
        user_goal = user.goal or "Experience"

    # Call AI Service OUTSIDE of database session
    ai_idea = await generate_project_idea(
        stack=user_stack,
        level=user_level,
        goal=user_goal
    )

    # Create project in database
    async with get_async_session() as session:
        new_project = Project(
            owner_id=user_id,
            title=ai_idea["title"],
            description=ai_idea["description"],
            stack=ai_idea["stack_details"],
            type="solo"
        )
        
        session.add(new_project)
        await session.commit()
        await session.refresh(new_project)
        
        project_id = new_project.id
        project_data = {
            "id": new_project.id,
            "owner_id": new_project.owner_id,
            "title": new_project.title,
            "description": new_project.description,
            "stack": new_project.stack,
            "type": new_project.type,
            "created_at": str(new_project.created_at)
        }

    # Generate tasks OUTSIDE of database session
    try:
        ai_tasks = await break_down_tasks(
            title=project_data["title"],
            description=project_data["description"],
            stack=project_data["stack"]
        )
        
        # Save tasks to database
        async with get_async_session() as session:
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
            
            for task in db_tasks:
                await session.refresh(task)
                
            return {
                "project": project_data,
                "tasks": [{"id": t.id, "title": t.title, "description": t.description, "status": t.status, "order": t.order} for t in db_tasks]
            }
    except Exception as e:
        # If task generation fails, still return the project
        return {
            "project": project_data,
            "tasks": []
        }


@router.get("/{project_id}", response_model=Project)
async def get_project(project_id: int, access_token: str = Cookie(None)):
    """Get a specific project by ID."""
    if not access_token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    user_id = decode_jwt_token(access_token)
    
    async with get_async_session() as session:
        stmt = select(Project).where(Project.id == project_id, Project.owner_id == user_id)
        result = await session.execute(stmt)
        project = result.scalar_one_or_none()
        
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
        
        return project

@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_project(project_id: int, access_token: str = Cookie(None)):
    """Delete a project."""
    if not access_token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    user_id = decode_jwt_token(access_token)
    
    async with get_async_session() as session:
        stmt = select(Project).where(Project.id == project_id, Project.owner_id == user_id)
        result = await session.execute(stmt)
        project = result.scalar_one_or_none()
        
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
        
        await session.delete(project)
        await session.commit()

from pydantic import BaseModel
class ProjectUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    stack: str | None = None

@router.patch("/{project_id}", response_model=Project)
async def update_project(project_id: int, project_update: ProjectUpdate, access_token: str = Cookie(None)):
    """Update a project."""
    if not access_token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    user_id = decode_jwt_token(access_token)
    
    async with get_async_session() as session:
        stmt = select(Project).where(Project.id == project_id, Project.owner_id == user_id)
        result = await session.execute(stmt)
        project = result.scalar_one_or_none()
        
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
        
        update_data = project_update.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(project, key, value)
            
        session.add(project)
        await session.commit()
        await session.refresh(project)
        return project
