# CoForge Platform - Brainstorm Plan

## 1. Hozirgi Holat

### Mavjud Fayllar:
- ✅ `tech_stack.md` - To'liq texnologiyalar ro'yxati
- ✅ `ai_logic_plan.md` - AI funksional reja
- ✅ `user_flow_diagram.md` - Foydalanuvchi oqimi diagrammasi
- ✅ `wireframes.md` - Low-fidelity wireframes
- ✅ Backend struktura:
  - `main.py` - FastAPI asosiy app
  - `models/project.py` - Project modeli
  - `models/task.py` - Task modeli
  - `core/database.py` - Database ulanish

### Kamchiliklar:
- ❌ Frontend yo'q
- ❌ Backend API endpointlar to'liq yozilmagan
- ❌ Auth sistemasi yo'q
- ❌ AI integratsiyasi yo'q
- ❌ GitHub integratsiyasi yo'q
- ❌ Profile tizimi yo'q
- ❌ Team flow uchun kanban board yo'q

---

## 2. Loyiha Bosqichlari

### Phase 1: Backend Foundation
1. **Database Models** ✅ (Mavjud)
   - [ ] User modeli qo'shish
   - [ ] Team modeli qo'shish
   - [ ] Profile modeli qo'shish

2. **Authentication**
   - [ ] GitHub OAuth2 integratsiya
   - [ ] JWT token yaratish
   - [ ] Login/Register endpointlar

3. **API Endpoints**
   - [ ] Projects CRUD
   - [ ] Tasks CRUD
   - [ ] Profile endpoints
   - [ ] Team endpoints

### Phase 2: AI Integration
1. **OpenAI Setup**
   - [ ] API client yaratish
   - [ ] Prompt templates yozish

2. **AI Features**
   - [ ] Idea Generator
   - [ ] Task Breaker
   - [ ] Code Review
   - [ ] Skill Recommendations

### Phase 3: Frontend Development
1. **Setup**
   - [ ] Next.js project yaratish
   - [ ] Tailwind + Framer Motion o'rnatish

2. **Pages**
   - [ ] Login/Signup
   - [ ] Onboarding Survey
   - [ ] Project Hub
   - [ ] Solo Flow (Idea → Tasks → Code Review)
   - [ ] Team Flow (Kanban Board)
   - [ ] Profile Page

### Phase 4: GitHub Integration
- [ ] GitHub OAuth
- [ ] PR integration
- [ ] Repository cloning/syncing

### Phase 5: Polish & Deploy
- [ ] Testing
- [ ] CI/CD setup
- [ ] Vercel deployment
- [ ] Railway/Fly.io backend deployment

---

## 3. Priority Tartibi

| Priority | Component | Estimated Time |
|----------|-----------|----------------|
| 1 | User, Team, Profile Models | 2 hours |
| 2 | Auth (GitHub OAuth + JWT) | 4 hours |
| 3 | Projects/Tasks CRUD API | 4 hours |
| 4 | AI Client + Prompts | 6 hours |
| 5 | Next.js Frontend Setup | 2 hours |
| 6 | Onboarding + Project Hub UI | 6 hours |
| 7 | Solo Flow UI | 8 hours |
| 8 | Team Flow UI (Kanban) | 8 hours |
| 9 | Profile Page | 4 hours |
| 10 | GitHub Integration | 6 hours |
| 11 | Testing & Polish | 6 hours |
| 12 | Deployment | 4 hours |

**Jami taxminiy vaqt: ~60 soat**

---

## 4. Tanlov: Frontend First, keyin Full Stack Parallel

**1-Bosqich: Frontend (React/Next.js)**
- Next.js project yaratish
- Tailwind + Framer Motion o'rnatish
- Pages: Login, Onboarding, Project Hub, Solo Flow, Team Flow, Profile

**2-Bosqich: Full Stack Parallel**
- Backend + Auth rivojlantirish
- AI Integration
- GitHub Integration
- Testing & Deployment

---

## 5. Frontend Development Plan

### Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Icons**: Lucide React

### Pages Structure
```
frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx (Landing)
│   │   ├── login/
│   │   ├── onboarding/
│   │   ├── dashboard/
│   │   ├── project/[id]/
│   │   ├── team/[id]/
│   │   └── profile/
│   ├── components/
│   │   ├── ui/
│   │   ├── layout/
│   │   ├── auth/
│   │   ├── onboarding/
│   │   ├── project/
│   │   └── team/
│   ├── lib/
│   │   ├── api.ts
│   │   ├── auth.ts
│   │   └── constants.ts
│   └── styles/
│       └── globals.css
├── tailwind.config.js
├── next.config.js
└── package.json
```

### Komponentlar Priority
| Priority | Component | Description |
|----------|-----------|-------------|
| 1 | Layout | Navbar, Footer, Glassmorphism base |
| 2 | Landing Page | Hero, Features, CTA |
| 3 | Login Page | GitHub OAuth button |
| 4 | Onboarding Survey | Multi-step form |
| 5 | Project Hub | Grid of project cards |
| 6 | Solo Flow | Idea Generator, Task List, Code Review |
| 7 | Team Flow | Kanban Board |
| 8 | Profile Page | User stats, projects, skills |

