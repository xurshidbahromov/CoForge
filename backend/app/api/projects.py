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

@router.get("/suggestions")
async def get_project_suggestions(access_token: str | None = Cookie(default=None, alias="access_token")):
    """
    Get personalized project suggestions based on user profile.
    Uses cached suggestions from DB if available, otherwise generates them.
    """
    from ..core.ai import generate_personalized_ideas
    from ..models.suggestion import ProjectSuggestion
    
    if not access_token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    user_id = decode_jwt_token(access_token)
    
    async with get_async_session() as session:
        user = await session.get(User, user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Check DB validation
        stmt = select(ProjectSuggestion).where(ProjectSuggestion.user_id == user_id)
        existing_suggestions = (await session.execute(stmt)).scalars().all()
        
        if existing_suggestions and len(existing_suggestions) >= 3:
            # Return top 3
            return [
                {
                    "id": s.id, 
                    "title": s.title, 
                    "description": s.description, 
                    "stack": s.stack, 
                    "difficulty": s.difficulty,
                    "created_at": s.created_at
                } 
                for s in existing_suggestions[:3]
            ]
            
        # If we have some but less than 3, keep them
        current_titles = {s.title for s in existing_suggestions}
        saved_ideas = list(existing_suggestions)

        # Generate new to fill the gap
        # Note: We ask for 3 (default) and filter, or we could update AI prompt to take 'count'
        # For simplicity, we ask for 3 and pick the first ones that are unique
        role = user.primary_role or "Fullstack Developer"
        level = user.level or "Junior"
        skills = user.skills or "React, Python, SQL"
        
        # Call AI
        ideas = await generate_personalized_ideas(role, level, skills)
        
        # Save new unique ones to DB
        count_needed = 3 - len(saved_ideas)
        added_count = 0
        
        for idea in ideas:
            if added_count >= count_needed:
                break
            if idea["title"] not in current_titles:
                db_suggestion = ProjectSuggestion(
                    user_id=user_id,
                    title=idea["title"],
                    description=idea["description"],
                    stack=idea["stack"] if isinstance(idea["stack"], str) else ", ".join(idea["stack"]),
                    difficulty=idea["difficulty"]
                )
                session.add(db_suggestion)
                saved_ideas.append(db_suggestion)
                current_titles.add(idea["title"])
                added_count += 1
            
        await session.commit()
        for s in saved_ideas:
            await session.refresh(s)
            
        return [
            {
                "id": s.id, 
                "title": s.title, 
                "description": s.description, 
                "stack": s.stack, 
                "difficulty": s.difficulty,
                "created_at": s.created_at
            } 
            for s in saved_ideas
        ]

@router.post("/suggestions/refresh")
async def refresh_suggestions(access_token: str | None = Cookie(default=None, alias="access_token")):
    """
    Force regenerate suggestions (clears old ones).
    """
    from ..core.ai import generate_personalized_ideas
    from ..models.suggestion import ProjectSuggestion
    
    if not access_token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    user_id = decode_jwt_token(access_token)
    
    async with get_async_session() as session:
        # 1. Clear existing
        stmt = select(ProjectSuggestion).where(ProjectSuggestion.user_id == user_id)
        existing = (await session.execute(stmt)).scalars().all()
        for s in existing:
            await session.delete(s)
            
        # 2. Get User data
        user = await session.get(User, user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
            
        role = user.primary_role or "Fullstack Developer"
        level = user.level or "Junior"
        skills = user.skills or "React, Python, SQL"
        
        # 3. Generate New
        ideas = await generate_personalized_ideas(role, level, skills)
        
        # 4. Save
        saved_ideas = []
        for idea in ideas:
            db_suggestion = ProjectSuggestion(
                user_id=user_id,
                title=idea["title"],
                description=idea["description"],
                stack=idea["stack"] if isinstance(idea["stack"], str) else ", ".join(idea["stack"]),
                difficulty=idea["difficulty"]
            )
            session.add(db_suggestion)
            saved_ideas.append(db_suggestion)
            
        await session.commit()
        for s in saved_ideas:
            await session.refresh(s)
            
        return [
            {
                "id": s.id, 
                "title": s.title, 
                "description": s.description, 
                "stack": s.stack, 
                "difficulty": s.difficulty,
                "created_at": s.created_at
            } 
            for s in saved_ideas
        ]

@router.delete("/suggestions/{suggestion_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_suggestion(suggestion_id: int, access_token: str | None = Cookie(default=None, alias="access_token")):
    """
    Remove a suggestion.
    """
    from ..models.suggestion import ProjectSuggestion
    
    if not access_token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    user_id = decode_jwt_token(access_token)
    
    async with get_async_session() as session:
        suggestion = await session.get(ProjectSuggestion, suggestion_id)
        if not suggestion:
            raise HTTPException(status_code=404, detail="Suggestion not found")
            
        if suggestion.user_id != user_id:
             raise HTTPException(status_code=403, detail="Not authorized")
             
        await session.delete(suggestion)
        await session.commit()

from pydantic import BaseModel

class ProjectCreate(BaseModel):
    title: str
    description: str
    stack: str
    type: str = "solo"

@router.post("/", response_model=Project, status_code=status.HTTP_201_CREATED)
async def create_project(project_in: ProjectCreate, access_token: str = Cookie(None)):
    if not access_token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    user_id = decode_jwt_token(access_token)
    
    # Create DB model from input + owner_id
    project = Project(
        owner_id=user_id,
        title=project_in.title,
        description=project_in.description,
        stack=project_in.stack,
        type=project_in.type
    )
    
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

@router.get("/community/all", response_model=List[dict])
async def list_community_projects(access_token: str = Cookie(None)):
    """
    List all projects NOT owned by the current user (Community Projects),
    with member counts.
    """
    from ..models.join_request import JoinRequest
    
    if not access_token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    user_id = decode_jwt_token(access_token)
    
    async with get_async_session() as session:
        # Fetch all projects (Community includes everyone's projects)
        stmt = select(Project).where(Project.type != "solo").order_by(Project.created_at.desc())
        projects = (await session.execute(stmt)).scalars().all()
        
        results = []
        for project in projects:
            # Count accepted members (Owner + Accepted Requests)
            count_stmt = select(JoinRequest).where(
                JoinRequest.project_id == project.id, 
                JoinRequest.status == "accepted"
            )
            accepted_requests = (await session.execute(count_stmt)).scalars().all()
            # Start with 1 (Owner) + accepted requests
            members_count = 1 + len(accepted_requests)
            
            project_dict = {
                "id": project.id,
                "owner_id": project.owner_id,
                "title": project.title,
                "description": project.description,
                "stack": project.stack,
                "type": project.type,
                "created_at": project.created_at,
                "members_count": members_count
            }
            results.append(project_dict)
            
        return results

@router.post("/{project_id}/join", status_code=status.HTTP_201_CREATED)
async def join_project(project_id: int, access_token: str = Cookie(None)):
    """
    Request to join a project.
    """
    from ..models.join_request import JoinRequest

    if not access_token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    user_id = decode_jwt_token(access_token)
    
    async with get_async_session() as session:
        # Check if project exists
        project = await session.get(Project, project_id)
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
            
        if project.owner_id == user_id:
             raise HTTPException(status_code=400, detail="You cannot join your own project")

        # Check if already requested
        stmt = select(JoinRequest).where(
            JoinRequest.user_id == user_id, 
            JoinRequest.project_id == project_id
        )
        existing = (await session.execute(stmt)).scalar_one_or_none()
        
        if existing:
            raise HTTPException(status_code=400, detail="Request already sent")
            
        # Create request
        join_req = JoinRequest(
            user_id=user_id,
            project_id=project_id,
            status="pending"
        )
        
        session.add(join_req)
        await session.commit()
        
        return {"status": "success", "message": "Join request sent"}

@router.get("/{project_id}/members", response_model=List[dict])
async def list_project_members(project_id: int, access_token: str = Cookie(None)):
    """
    List all accepted members of a project (including owner).
    """
    from ..models.join_request import JoinRequest

    if not access_token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    # We don't strictly enforce that the requester is a member to view members, 
    # but for privacy maybe we should? For now, let's allow it if they are logged in.
    
    async with get_async_session() as session:
        project = await session.get(Project, project_id)
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")

        # 1. Get Owner
        owner = await session.get(User, project.owner_id)
        
        # Helper to get stats
        from ..models.task import Task
        async def get_stats(uid):
            total_stmt = select(Task).where(Task.project_id == project_id, Task.assigned_to == uid)
            all_tasks = (await session.execute(total_stmt)).scalars().all()
            return {
                "tasks_done": len([t for t in all_tasks if t.status == "done"]),
                "tasks_active": len([t for t in all_tasks if t.status != "done"])
            }

        owner_stats = await get_stats(owner.id)

        members = [{
            "id": owner.id,
            "username": owner.username,
            "first_name": owner.first_name,
            "last_name": owner.last_name,
            "avatar_url": owner.avatar_url,
            "role": "Owner",
            "primary_role": owner.primary_role,
            "level": owner.level,
            "skills": owner.skills,
            "stats": owner_stats
        }]

        # 2. Get Accepted Join Requests
        stmt = select(JoinRequest).where(
            JoinRequest.project_id == project_id, 
            JoinRequest.status == "accepted"
        )
        join_requests = (await session.execute(stmt)).scalars().all()

        for req in join_requests:
            user = await session.get(User, req.user_id)
            if user:
                 user_stats = await get_stats(user.id)
                 members.append({
                    "id": user.id,
                    "username": user.username,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "avatar_url": user.avatar_url,
                    "role": "Member",
                    "primary_role": user.primary_role,
                    "level": user.level,
                    "skills": user.skills,
                    "stats": user_stats
                })
        
        return members

@router.get("/{project_id}/requests", response_model=List[dict])
async def list_project_requests(project_id: int, access_token: str = Cookie(None)):
    """
    List pending join requests (Owner only).
    """
    from ..models.join_request import JoinRequest

    if not access_token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    user_id = decode_jwt_token(access_token)
    
    async with get_async_session() as session:
        project = await session.get(Project, project_id)
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
            
        if project.owner_id != user_id:
             raise HTTPException(status_code=403, detail="Only the project owner can view requests")

        stmt = select(JoinRequest).where(
            JoinRequest.project_id == project_id, 
            JoinRequest.status == "pending"
        )
        requests = (await session.execute(stmt)).scalars().all()
        
        result = []
        for req in requests:
            user = await session.get(User, req.user_id)
            if user:
                result.append({
                    "request_id": req.id,
                    "message": req.message,
                    "user": {
                        "id": user.id,
                        "username": user.username,
                        "first_name": user.first_name,
                        "last_name": user.last_name,
                        "avatar_url": user.avatar_url,
                        "primary_role": user.primary_role,
                        "level": user.level,
                        "availability": user.weekly_availability,
                        "skills": user.skills
                    },
                    "created_at": req.created_at
                })
        
        return result

@router.post("/{project_id}/requests/{request_id}/{action}")
async def handle_join_request(project_id: int, request_id: int, action: str, access_token: str = Cookie(None)):
    """
    Accept or reject a join request (Owner only).
    Action must be 'accept' or 'reject'.
    """
    from ..models.join_request import JoinRequest

    if not access_token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    user_id = decode_jwt_token(access_token)
    
    if action not in ["accept", "reject"]:
        raise HTTPException(status_code=400, detail="Invalid action")

    async with get_async_session() as session:
        # Verify Project Ownership
        project = await session.get(Project, project_id)
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
        
        if project.owner_id != user_id:
             raise HTTPException(status_code=403, detail="Only the project owner can manage requests")

        # Get Request
        req = await session.get(JoinRequest, request_id)
        if not req:
             raise HTTPException(status_code=404, detail="Request not found")
             
        if req.project_id != project_id:
             raise HTTPException(status_code=400, detail="Request does not belong to this project")

        if action == "accept":
            req.status = "accepted"
            # If this was a solo project, upgrade it to team?
            if project.type == "solo":
                project.type = "team"
                session.add(project)
        else:
            req.status = "rejected"
            
        session.add(req)
        await session.commit()
        
        return {"status": "success", "action": action}

@router.get("/teams/mine", response_model=List[dict])
async def list_my_teams(access_token: str = Cookie(None)):
    """
    List all 'team' projects the current user is part of (Owner OR Member).
    """
    from ..models.join_request import JoinRequest
    from ..models.task import Task
    from sqlalchemy import or_

    if not access_token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    user_id = decode_jwt_token(access_token)
    
    async with get_async_session() as session:
        # 1. Projects I own that are type='team'
        stmt_owned = select(Project).where(
            Project.owner_id == user_id, 
            Project.type == "team"
        )
        owned_projects = (await session.execute(stmt_owned)).scalars().all()

        # 2. Projects I have joined (status='accepted')
        stmt_joined = select(Project).join(JoinRequest).where(
            JoinRequest.user_id == user_id,
            JoinRequest.status == "accepted"
        )
        joined_projects = (await session.execute(stmt_joined)).scalars().all()

        # Combine and deduplicate (though logic shouldn't overlap usually, unless I joined my own project which is blocked)
        all_projects = list({p.id: p for p in (owned_projects + joined_projects)}.values())
        
        results = []
        for project in all_projects:
            # Get Member Count
            count_stmt = select(JoinRequest).where(
                JoinRequest.project_id == project.id, 
                JoinRequest.status == "accepted"
            )
            accepted_requests = (await session.execute(count_stmt)).scalars().all()
            members_count = 1 + len(accepted_requests)

            # Get User Role in this project
            is_owner = (project.owner_id == user_id)
            user_role_in_project = "Owner"
            if not is_owner:
                # Find the specific request to see if there's any specialized role info? 
                # For now just 'Member' or fetch from User profile
                 user_role_in_project = "Member"

            # Get User's specific info for this project (e.g. assigned role if we had one in JoinRequest? No.)
            # We'll use the User's primary_role from their profile for display
            user = await session.get(User, user_id)
            display_role = user.primary_role if user else "Member"

            # Get some member avatars (for the circles)
            # Owner
            owner = await session.get(User, project.owner_id)
            preview_members = [owner]
            # Add up to 3 others
            for req in accepted_requests[:3]:
                m = await session.get(User, req.user_id)
                if m: preview_members.append(m)
            
            # Deduplicate just in case
            preview_members = list({u.id: u for u in preview_members}.values())

            results.append({
                "id": project.id,
                "title": project.title,
                "description": project.description,
                "stack": project.stack,
                "user_role": display_role if not is_owner else "Team Lead", # Mock logic for "Your Role"
                "members_count": members_count,
                "preview_members": [
                    {"id": m.id, "username": m.username, "avatar_url": m.avatar_url} 
                    for m in preview_members[:4]
                ]
            })

        return results

class BrainstormRequest(BaseModel):
    stack: str
    level: str = "Junior"

@router.post("/brainstorm")
async def brainstorm_project(request: BrainstormRequest, access_token: str | None = Cookie(default=None, alias="access_token")):
    """
    Brainstorm project ideas based on the provided stack and level.
    """
    from ..core.ai import generate_brainstorm_ideas
    
    if not access_token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    ideas = await generate_brainstorm_ideas(request.stack, request.level)
    return ideas


