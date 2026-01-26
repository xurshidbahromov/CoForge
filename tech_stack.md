# Tech Stack Documentation

## Frontend
- **Framework**: React with Next.js (SSR/SSG capabilities)
- **Styling**: Tailwind CSS (utility‑first) + custom CSS variables for glassmorphism theme
- **Animations**: Framer Motion for micro‑interactions and page transitions
- **UI Library**: Headless UI (accessible components) – optional
- **Fonts**: Inter (body), Playfair Display (headings)

## Backend
- **Framework**: FastAPI (Python 3.11) – high performance async API
- **Authentication**: OAuth2 with GitHub provider + JWT tokens
- **Database**: PostgreSQL (hosted on Supabase or AWS RDS) – relational data for users, projects, tasks
- **ORM**: SQLModel / SQLAlchemy
- **Background Jobs**: Celery with Redis for AI task processing

## AI Integration
- **Provider**: OpenAI GPT‑4o (or latest model) via official API
- **Prompt Templates**: Structured prompts for idea generation, task breakdown, code review, skill recommendation
- **Safety Layer**: Content filtering and usage monitoring

## DevOps / Deployment
- **Version Control**: Git + GitHub (CI/CD via GitHub Actions)
- **Frontend Hosting**: Vercel (edge network, automatic SSL)
- **Backend Hosting**: Railway / Fly.io (Docker containers) – can also be deployed on AWS Lambda via Zappa if needed
- **Database Hosting**: Supabase (managed PostgreSQL) or self‑hosted on AWS RDS
- **Environment Variables**: `OPENAI_API_KEY`, `DATABASE_URL`, `JWT_SECRET`, `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`

## Testing & Quality
- **Frontend Tests**: Jest + React Testing Library
- **Backend Tests**: Pytest + HTTPX for API testing
- **Linting**: ESLint (with Prettier) for JS/TS, Ruff for Python
- **CI**: Run lint, type‑check, and test suites on each PR

---
*All components are chosen to enable rapid MVP development while ensuring scalability for future phases.*
