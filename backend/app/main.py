from dotenv import load_dotenv
load_dotenv()

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import auth, projects, tasks, profile
from app.core.database import create_db_and_tables

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Create DB tables
    create_db_and_tables()
    yield
    # Shutdown

app = FastAPI(lifespan=lifespan)

# CORS setup
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)


# Include Routers
app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(projects.router, prefix="/projects", tags=["projects"])
app.include_router(tasks.router, prefix="/tasks", tags=["tasks"])
app.include_router(profile.router, prefix="/profile", tags=["profile"])

@app.get("/hello")
async def read_root():
    return {"message": "Hello from FastAPI!"}
