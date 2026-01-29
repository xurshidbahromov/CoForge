from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .api import auth, projects, tasks, profile

from .core.database import create_db_and_tables

app = FastAPI(title="CoForge Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

app.include_router(auth.router, prefix="/auth")
app.include_router(projects.router, prefix="/projects")
app.include_router(tasks.router, prefix="/tasks")
app.include_router(profile.router, prefix="/profile")
