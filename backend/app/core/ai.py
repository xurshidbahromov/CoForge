import os
import json
from openai import AsyncOpenAI

api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    # Handle missing API key gracefully for development
    client = None
    print("WARNING: OPENAI_API_KEY not found. AI features will stay in dummy mode.")
else:
    client = AsyncOpenAI(api_key=api_key)

async def generate_project_idea(stack: str, level: str, goal: str):
    """
    Generate a project idea using OpenAI based on user preferences.
    """
    if not client:
        return {
            "title": "Example Project (No API Key)",
            "description": "Please set OPENAI_API_KEY significantly to get real AI-generated projects. For now, here is a placeholder.",
            "stack_details": "Next.js, FastAPI, PostgreSQL",
            "difficulty": "beginner"
        }

    prompt = f"""
    Suggest a full-stack project for a {level} developer.
    The primary tech stack should be: {stack}.
    The user's goal is: {goal}.
    
    Return the response as a JSON object with the following fields:
    - title: A catchy project name
    - description: A clear 2-3 sentence overview
    - stack_details: A specific list of technologies to use (e.g. "Next.js, FastAPI, PostgreSQL, Tailwind")
    - difficulty: beginner, junior, or intermediate
    """
    
    response = await client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": "You are an expert technical mentor who helps developers build real-world experience."},
            {"role": "user", "content": prompt}
        ],
        response_format={"type": "json_object"}
    )
    
    return json.loads(response.choices[0].message.content)

async def break_down_tasks(title: str, description: str, stack: str):
    """
    Break a project into 5-7 actionable tasks.
    """
    if not client:
        return [
            {"title": "Setup Project", "description": "Initialize repo and dependencies (Dummy Task)", "order": 1},
            {"title": "Build UI", "description": "Create frontend components (Dummy Task)", "order": 2}
        ]

    prompt = f"""
    Break the following project into 5-7 actionable tasks for a developer.
    Project Title: {title}
    Description: {description}
    Tech Stack: {stack}
    
    Return the response as a JSON object with a field 'tasks' which is a list of objects.
    Each task object should have:
    - title: Short task name
    - description: What needs to be done
    - order: Integer (1-7)
    """
    
    response = await client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": "You are a senior project manager who breaks down complex features into manageable developer tasks."},
            {"role": "user", "content": prompt}
        ],
        response_format={"type": "json_object"}
    )
    
    return json.loads(response.choices[0].message.content).get("tasks", [])
