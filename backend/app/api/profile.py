from fastapi import APIRouter, HTTPException, Cookie
from sqlmodel import select, func
from sqlmodel.ext.asyncio.session import AsyncSession
from pydantic import BaseModel
from typing import Optional, Dict, Any
from ..core.database import get_async_session
from ..models.user import User
from ..models.project import Project
from ..models.task import Task
from ..api.auth import decode_jwt_token

router = APIRouter()

class OnboardingData(BaseModel):
    # 1. Personal
    first_name: str
    last_name: str
    country: str
    city: Optional[str] = None
    timezone: str
    language: str
    
    # 2. Professional
    primary_role: str
    level: str
    
    # 3. Bio
    bio: str
    
    # 4. Skills
    skills: Dict[str, str]
    
    # 5. Experience
    work_experience: Optional[str] = None
    
    # 6. Social
    social_links: Dict[str, str]
    
    # 7. Goals
    primary_goal: str
    weekly_availability: str
    
    # 8. Work Preference
    work_preference: Dict[str, str] # { mode, size, style }
    
    # 9. AI Preference
    ai_preference: Dict[str, Any]   # { guidance, areas }

@router.get("/me")
async def get_my_profile(access_token: str = Cookie(None)):
    """
    Returns the full profile data for the authenticated user.
    """
    if not access_token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    user_id = decode_jwt_token(access_token)
    
    async with get_async_session() as session:
        stmt = select(User).where(User.id == user_id)
        result = await session.execute(stmt)
        user = result.scalar_one_or_none()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        # Get projects stats (kept from original)
        proj_stmt = select(Project).where(Project.owner_id == user_id)
        projects = (await session.execute(proj_stmt)).scalars().all()

        profile_projects = []
        total_tasks = 0
        total_done = 0
        
        for proj in projects:
            task_stmt = select(Task).where(Task.project_id == proj.id)
            tasks = (await session.execute(task_stmt)).scalars().all()
            done_count = len([t for t in tasks if t.status == "done"])
            total_tasks += len(tasks)
            total_done += done_count
            
            profile_projects.append({
                "id": proj.id,
                "title": proj.title,
                "stack": proj.stack,
                "type": proj.type,
                "tasks_count": len(tasks),
                "tasks_done": done_count
            })

        import json
        def safe_json_load(json_str):
            if not json_str: return {}
            try: return json.loads(json_str)
            except: return {}

        return {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "avatar_url": user.avatar_url,
            "bio": user.bio,
            "country": user.country,
            "city": user.city,
            "timezone": user.timezone,
            "primary_role": user.primary_role,
            "level": user.level,
            "skills": safe_json_load(user.skills),
            "social_links": safe_json_load(user.social_links),
            "work_experience": user.work_experience,
            "primary_goal": user.primary_goal,
            "weekly_availability": user.weekly_availability,
            "work_preferences": safe_json_load(user.work_preferences),
            "ai_preferences": safe_json_load(user.ai_preferences),
            "is_onboarding_completed": user.is_onboarding_completed,
            "projects": profile_projects,
            "stats": {
                "projects_count": len(projects),
                "total_tasks": total_tasks,
                "tasks_done": total_done
            }
        }

@router.put("/onboarding")
async def complete_onboarding(
    data: OnboardingData,
    access_token: str = Cookie(None)
):
    """
    Submit full profile data and mark onboarding as complete.
    """
    if not access_token:
        raise HTTPException(status_code=401, detail="Not authenticated")
        
    user_id = decode_jwt_token(access_token)
    
    async with get_async_session() as session:
        stmt = select(User).where(User.id == user_id)
        result = await session.execute(stmt)
        user = result.scalar_one_or_none()
        
        if not user:
             raise HTTPException(status_code=404, detail="User not found")
             
        # Update fields
        import json
        
        user.first_name = data.first_name
        user.last_name = data.last_name
        user.country = data.country
        user.city = data.city
        user.timezone = data.timezone
        user.language = data.language
        user.primary_role = data.primary_role
        user.level = data.level
        user.bio = data.bio
        user.work_experience = data.work_experience
        user.primary_goal = data.primary_goal
        user.weekly_availability = data.weekly_availability
        
        # Serialize dictionaries to JSON strings
        user.skills = json.dumps(data.skills)
        user.social_links = json.dumps(data.social_links)
        user.work_preferences = json.dumps(data.work_preference)
        user.ai_preferences = json.dumps(data.ai_preference)
        
        user.is_onboarding_completed = True
        
        session.add(user)
        await session.commit()
        await session.refresh(user)
        
        return {"status": "success", "user": user}
