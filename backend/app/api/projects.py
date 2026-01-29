from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import select
from typing import List
from ..core.database import get_async_session
from ..models.project import Project

router = APIRouter()

@router.get("/", response_model=List[Project])
async def list_projects(session=Depends(get_async_session)):
    stmt = select(Project).order_by(Project.created_at.desc())
    result = await session.execute(stmt)
    return result.scalars().all()

@router.post("/", response_model=Project, status_code=status.HTTP_201_CREATED)
async def create_project(project: Project, session=Depends(get_async_session)):
    session.add(project)
    await session.commit()
    await session.refresh(project)
    return project

from ..core.ai import generate_project_idea
from ..api.auth import decode_jwt_token
from fastapi import Cookie

@router.post("/generate", response_model=Project)
async def generate_project(
    access_token: str = Cookie(None),
    session: Session = Depends(get_async_session)
):
    """
    Generate a new project idea for the logged-in user using AI.
    """
    if not access_token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    user_id = decode_jwt_token(access_token)
    
    # Fetch user preferences
    from ..models.user import User
    stmt = select(User).where(User.id == user_id)
    user = (await session.execute(stmt)).scalar_one_or_none()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Call AI Service
    ai_idea = await generate_project_idea(
        stack=user.stack or "Fullstack",
        level=user.level or "Junior",
        goal=user.goal or "Experience"
    )

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
    return new_project
