from fastapi import FastAPI

from .api import auth, projects, tasks, profile

app = FastAPI(title="CoForge Backend")

app.include_router(auth.router, prefix="/auth")
app.include_router(projects.router, prefix="/projects")
app.include_router(tasks.router, prefix="/tasks")
app.include_router(profile.router, prefix="/profile")
