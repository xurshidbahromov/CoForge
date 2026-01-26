# AI Logic Plan

## 1. Idea Generator
- **Input**: Selected technology stack, experience level, goal.
- **Process**: Prompt OpenAI GPT with a structured template to generate a project idea (title, brief description, core features).
- **Output**: JSON containing `title`, `description`, `features`.
- **Safety**: Filter out ideas requiring paid APIs or unavailable services.

## 2. Task Breaker
- **Input**: Idea JSON.
- **Process**: Decompose the project into 5‑7 incremental tasks, each with estimated effort and required skill tags.
- **Output**: Ordered list of tasks with `title`, `description`, `estimatedHours`, `skillTags`.
- **Integration**: Store tasks in the user's project board (solo or team).

## 3. Code Review / Feedback
- **Trigger**: User submits code snippet or commits.
- **Process**:
  - Run static analysis (ESLint for frontend, Pylint for backend).
  - Send code to OpenAI with a prompt to provide feedback, highlight potential bugs, suggest improvements, and map to learning resources.
- **Output**: Annotated feedback panel with inline suggestions and links to docs.
- **Privacy**: Strip any personal identifiers before sending to the API.

## 4. Skill Recommendations
- **Input**: Completed tasks and review feedback.
- **Process**: Analyze gaps in skill tags, map to curated learning resources (articles, videos, interactive tutorials).
- **Output**: Personalized learning path displayed on the profile dashboard.

## 5. AI Assistant (Chat Interface)
- Provide a conversational UI where users can ask for clarifications, request re‑generation of ideas, or get help with specific tasks.
- Maintain context per project session.

## 6. Monitoring & Logging
- Log all AI interactions (timestamp, request type) for analytics and future model fine‑tuning.
- Ensure compliance with OpenAI usage policies.
