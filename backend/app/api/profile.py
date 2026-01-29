from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import select
from ..core.database import get_async_session
from ..models.user import User
from ..models.project import Project
from ..models.task import Task

router = APIRouter()

from ..api.auth import decode_jwt_token
from fastapi import Cookie

@router.get("/me")
async def get_my_profile(
    access_token: str = Cookie(None),
    session=Depends(get_async_session)
):
    """
    Returns the full profile data for the authenticated user.
    """
    if not access_token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    user_id = decode_jwt_token(access_token)
    stmt = select(User).where(User.id == user_id)
    result = await session.execute(stmt)
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    proj_stmt = select(Project).where(Project.owner_id == user_id)
    projects = (await session.execute(proj_stmt)).scalars().all()

    profile_projects = []
    total_tasks_done = 0
    for proj in projects:
        task_stmt = select(Task).where(Task.project_id == proj.id)
        tasks = (await session.execute(task_stmt)).scalars().all()
        done_count = len([t for t in tasks if t.status == "done"])
        total_tasks_done += done_count
        profile_projects.append({
            "id": proj.id,
            "title": proj.title,
            "stack": proj.stack,
            "type": proj.type,
            "tasks_count": len(tasks),
            "tasks_done": done_count
        })

    }
