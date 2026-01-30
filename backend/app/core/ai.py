import os
import json
from groq import Groq

api_key = os.getenv("GROQ_API_KEY")
if not api_key:
    client = None
    print("WARNING: GROQ_API_KEY not found. AI features will be in dummy mode.")
else:
    client = Groq(api_key=api_key)
    print("✅ Groq AI client initialized successfully!")

async def generate_project_idea(stack: str, level: str, goal: str):
    """
    Generate a project idea using Groq AI based on user preferences.
    """
    if not client:
        return {
            "title": "Example Project (No API Key)",
            "description": "Please set GROQ_API_KEY to get real AI-generated projects.",
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
    
    Return ONLY valid JSON, no other text.
    """
    
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": "You are an expert technical mentor who helps developers build real-world experience. Always respond with valid JSON only."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.7,
        max_tokens=500
    )
    
    content = response.choices[0].message.content
    # Clean up response if needed
    if content.startswith("```"):
        content = content.split("```")[1]
        if content.startswith("json"):
            content = content[4:]
    
    return json.loads(content.strip())

async def break_down_tasks(title: str, description: str, stack: str):
    """
    Break a project into 5-7 actionable tasks using Groq AI.
    """
    if not client:
        return [
            {"title": "Setup Project", "description": "Initialize repo and dependencies", "order": 1},
            {"title": "Build UI", "description": "Create frontend components", "order": 2},
            {"title": "Add Backend", "description": "Create API endpoints", "order": 3}
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
    
    Return ONLY valid JSON, no other text.
    """
    
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": "You are a senior project manager who breaks down complex features into manageable developer tasks. Always respond with valid JSON only."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.7,
        max_tokens=800
    )
    
    content = response.choices[0].message.content
    # Clean up response if needed
    if content.startswith("```"):
        content = content.split("```")[1]
        if content.startswith("json"):
            content = content[4:]
    
    result = json.loads(content.strip())
    return result.get("tasks", [])
