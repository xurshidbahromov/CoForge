import os
import json
from groq import AsyncGroq

api_key = os.getenv("GROQ_API_KEY")
if not api_key:
    client = None
    print("WARNING: GROQ_API_KEY not found. AI features will be in dummy mode.")
else:
    client = AsyncGroq(api_key=api_key)
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
    
    try:
        response = await client.chat.completions.create(
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
    except Exception as e:
        print(f"Error generating project: {e}")
        return {
            "title": "Error Generating Project",
            "description": "Could not generate project. Please try again.",
            "stack_details": stack,
            "difficulty": "intermediate"
        }

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
    
    try:
        response = await client.chat.completions.create(
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
    except Exception as e:
        print(f"Error generating tasks: {e}")
        return []

async def generate_task_guide(task_title: str, task_description: str, stack: str):
    """
    Generate a detailed step-by-step implementation guide for a specific task.
    """
    if not client:
        return "## Guide not available\n(AI service is offline or GROQ_API_KEY is missing)"
    
    prompt = f"""
    Create a detailed, step-by-step implementation guide for a junior developer for the following task.
    The guide must be practical and actionable.
    
    Context:
    - Tech Stack: {stack}
    - Task: {task_title}
    - Details: {task_description}
    
    Response Structure (Markdown):
    1. **Objective**: Simple explanation of what we are building.
    2. **Prerequisites**: Any libraries to install (with npm/pip commands).
    3. **Step-by-Step Implementation**:
        - Specific instructions.
        - Code snippets (e.g., File: `src/components/MyComponent.tsx`).
        - Explain *why* we are doing this.
    4. **Testing & Verification**: How to check if it works.
    
    Tone: Encouraging, clear, and beginner-friendly.
    """
    
    try:
        response = await client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": "You are an expert friendly senior developer mentoring a junior. You provide clear, copy-pasteable code examples and specific instructions."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.5,
            max_tokens=1500
        )
        return response.choices[0].message.content
    except Exception as e:
        print(f"AI Generation Error: {e}")
        return "## Error Generating Guide\nCould not generate the guide at this time. Please try again later."

async def generate_brainstorm_ideas(stack: str):
    """
    Generate 3 distinct project ideas based on the tech stack.
    """
    if not client:
        return [
            {
                "title": "E-Commerce API (Dummy)",
                "description": "A RESTful API for an online store with product management and cart functionality.",
                "stack": stack,
                "difficulty": "Intermediate"
            },
            {
                "title": "Task Manager (Dummy)",
                "description": "A simple task management app with CRUD operations.",
                "stack": stack,
                "difficulty": "Beginner"
            },
            {
                "title": "Real-time Chat (Dummy)",
                "description": "A chat application using WebSockets.",
                "stack": stack,
                "difficulty": "Advanced"
            }
        ]

    prompt = f"""
    The user wants to build a project using this tech stack: {stack}.
    Generate 3 distinct, creative, and practical project ideas for them.
    
    Return the response as a JSON object with a field 'ideas' which is a list of objects.
    Each idea object must have:
    - title: Catchy project name
    - description: 1-2 sentence overview
    - stack: The tech stack (refine it if needed, e.g. add libraries)
    - difficulty: Beginner, Intermediate, or Advanced
    
    Return ONLY valid JSON, no other text.
    """
    
    try:
        response = await client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": "You are a creative technical mentor. Always respond with valid JSON only."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.8,
            max_tokens=800
        )
        
        content = response.choices[0].message.content
        if content.startswith("```"):
            content = content.split("```")[1]
            if content.startswith("json"):
                content = content[4:]
        
        result = json.loads(content.strip())
        return result.get("ideas", [])
    except Exception as e:
        print(f"Error brainstorming: {e}")
        return []

async def generate_personalized_ideas(role: str, level: str, skills: str):
    """
    Generate 3 distinct project ideas based on the user's profile.
    """
    if not client:
        # Fallback if no API key
        return [
            {
                "title": "Portfolio Website (Dummy)",
                "description": "A personal portfolio to showcase your skills.",
                "stack": skills or "HTML, CSS, JS",
                "difficulty": "Beginner"
            },
            {
                "title": "Blog Platform (Dummy)",
                "description": "A platform to write and share articles.",
                "stack": skills or "React, Node.js",
                "difficulty": "Intermediate"
            },
            {
                "title": "Bug Tracker (Dummy)",
                "description": "A tool to track issue reporting for projects.",
                "stack": skills or "Python, Django",
                "difficulty": "Advanced"
            }
        ]

    prompt = f"""
    The user is a {level} {role} with the following skills: {skills}.
    Generate 3 highly relevant, impressive project ideas that would strengthen their portfolio.
    
    Return the response as a JSON object with a field 'ideas' which is a list of objects.
    Each idea object must have:
    - title: Catchy project name
    - description: 1-2 sentence overview
    - stack: A specific tech stack using their skills (add complementary libs if needed)
    - difficulty: Beginner, Intermediate, or Advanced
    
    Return ONLY valid JSON, no other text.
    """
    
    try:
        response = await client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": "You are a career coach for software engineers. Always respond with valid JSON only."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=800
        )
        
        content = response.choices[0].message.content
        if content.startswith("```"):
            content = content.split("```")[1]
            if content.startswith("json"):
                content = content[4:]
        
        result = json.loads(content.strip())
        return result.get("ideas", [])
    except Exception as e:
        print(f"Error generating suggestions: {e}")
        return []
