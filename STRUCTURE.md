# Project Structure - Team Task-Hub

Visual guide to the project's file and folder organization.

## 📁 Complete Directory Tree

```
team-task-hub/
│
├── 📄 Configuration Files
│   ├── package.json                 # Dependencies and scripts
│   ├── tsconfig.json               # TypeScript configuration
│   ├── next.config.js              # Next.js configuration
│   ├── .env.example                # Environment variables template
│   ├── .gitignore                  # Git ignore rules
│   │
│   └── 📚 Documentation
│       ├── README.md               # Main documentation
│       ├── QUICKSTART.md           # Quick setup guide
│       ├── DEPLOYMENT.md           # Deployment instructions
│       ├── PROJECT_SUMMARY.md      # Project overview
│       ├── FEATURES.md             # Feature list
│       ├── TESTING_CHECKLIST.md    # Testing guide
│       └── STRUCTURE.md            # This file
│
├── 🗄️ prisma/                      # Database configuration
│   ├── schema.prisma               # Database schema definition
│   └── seed.ts                     # Demo data seed script
│
└── 📦 src/                         # Source code
    │
    ├── 🎯 app/                     # Next.js App Router
    │   │
    │   ├── 🔓 (auth)/             # Authentication pages (route group)
    │   │   ├── layout.tsx          # Auth layout (centered form)
    │   │   ├── signin/
    │   │   │   └── page.tsx        # Sign in page
    │   │   └── signup/
    │   │       └── page.tsx        # Sign up page
    │   │
    │   ├── 🔒 (protected)/        # Protected routes (route group)
    │   │   ├── layout.tsx          # Protected layout (with sidebar)
    │   │   │
    │   │   ├── teams/
    │   │   │   ├── new/
    │   │   │   │   └── page.tsx    # Create team page
    │   │   │   │
    │   │   │   └── [teamId]/       # Dynamic team routes
    │   │   │       ├── page.tsx    # Team dashboard
    │   │   │       │
    │   │   │       └── boards/
    │   │   │           └── [boardId]/
    │   │   │               └── page.tsx  # Board view
    │   │   │
    │   │   └── profile/
    │   │       └── page.tsx        # User profile page
    │   │
    │   ├── 🔌 api/                # API routes
    │   │   │
    │   │   ├── auth/
    │   │   │   ├── [...nextauth]/
    │   │   │   │   └── route.ts    # NextAuth handler
    │   │   │   └── signup/
    │   │   │       └── route.ts    # User registration
    │   │   │
    │   │   ├── teams/
    │   │   │   ├── route.ts        # List/create teams
    │   │   │   └── [teamId]/
    │   │   │       ├── route.ts    # Team details
    │   │   │       ├── invite/
    │   │   │       │   └── route.ts  # Invite members
    │   │   │       └── boards/
    │   │   │           └── route.ts  # Team boards
    │   │   │
    │   │   ├── boards/
    │   │   │   └── [boardId]/
    │   │   │       ├── route.ts    # Board CRUD
    │   │   │       └── tasks/
    │   │   │           └── route.ts  # Create tasks
    │   │   │
    │   │   ├── tasks/
    │   │   │   └── [taskId]/
    │   │   │       └── route.ts    # Task CRUD
    │   │   │
    │   │   └── profile/
    │   │       └── route.ts        # User profile
    │   │
    │   ├── layout.tsx              # Root layout (providers)
    │   └── page.tsx                # Landing page (redirects)
    │
    ├── 🧩 components/              # React components
    │   │
    │   ├── board/                  # Board-related components
    │   │   ├── BoardView.tsx       # Main board component
    │   │   ├── TaskColumn.tsx      # Column component
    │   │   ├── TaskCard.tsx        # Task card component
    │   │   └── TaskDialog.tsx      # Task create/edit modal
    │   │
    │   ├── layout/                 # Layout components
    │   │   ├── AppLayout.tsx       # Main app layout
    │   │   └── Sidebar.tsx         # Navigation sidebar
    │   │
    │   └── providers/              # Context providers
    │       ├── ThemeProvider.tsx   # Theme context
    │       └── SessionProvider.tsx # Auth session wrapper
    │
    ├── 🛠️ lib/                     # Utilities and configuration
    │   ├── prisma.ts               # Prisma client singleton
    │   ├── auth.ts                 # NextAuth configuration
    │   └── utils.ts                # Helper functions
    │
    ├── 📝 types/                   # TypeScript definitions
    │   ├── index.ts                # Common types
    │   └── next-auth.d.ts          # NextAuth type extensions
    │
    └── middleware.ts               # Route protection middleware
```

## 📂 Folder Purposes

### Root Level

| Folder/File | Purpose |
|-------------|---------|
| `prisma/` | Database schema and seed scripts |
| `src/` | All application source code |
| `package.json` | Project dependencies and scripts |
| `tsconfig.json` | TypeScript compiler configuration |
| `next.config.js` | Next.js framework configuration |
| `.env.example` | Environment variables template |
| Documentation files | Setup and usage guides |

### src/app/

| Folder | Purpose |
|--------|---------|
| `(auth)/` | Public authentication pages |
| `(protected)/` | Private authenticated pages |
| `api/` | Backend API route handlers |
| `layout.tsx` | Root layout with providers |
| `page.tsx` | Home page with redirects |

### src/components/

| Folder | Purpose |
|--------|---------|
| `board/` | Kanban board and task components |
| `layout/` | App shell and navigation |
| `providers/` | React context providers |

### src/lib/

| File | Purpose |
|------|---------|
| `prisma.ts` | Database client singleton |
| `auth.ts` | Authentication configuration |
| `utils.ts` | Shared utility functions |

### src/types/

| File | Purpose |
|------|---------|
| `index.ts` | Application type definitions |
| `next-auth.d.ts` | NextAuth type extensions |

## 🔍 Key Files Explained

### Configuration Files

```
📄 package.json
   ├── Dependencies (Next.js, MUI, Prisma, etc.)
   ├── Dev dependencies (TypeScript, types)
   └── Scripts (dev, build, db:push, db:seed)

📄 tsconfig.json
   ├── Compiler options (strict mode, paths)
   └── Include/exclude patterns

📄 next.config.js
   ├── React strict mode
   ├── Image domains
   └── Experimental features

📄 .env.example
   ├── DATABASE_URL
   ├── NEXTAUTH_URL
   ├── NEXTAUTH_SECRET
   └── Optional OAuth credentials
```

### Database Files

```
🗄️ prisma/schema.prisma
   ├── User model
   ├── Team model
   ├── TeamMember model
   ├── Board model
   ├── Task model
   ├── Account/Session models
   └── Enums (Role, Status)

🗄️ prisma/seed.ts
   ├── Demo users (Alice, Bob, Charlie)
   ├── Demo teams (Dev, Marketing)
   ├── Demo boards (Sprint, Backlog, Campaign)
   └── Demo tasks (13 tasks with various states)
```

### Core Application Files

```
🎯 src/app/layout.tsx
   ├── HTML structure
   ├── SessionProvider wrapper
   ├── ThemeProvider wrapper
   └── Font configuration

🎯 src/app/page.tsx
   ├── Check authentication
   ├── Find user's first team
   └── Redirect appropriately

🔒 src/middleware.ts
   ├── Route protection logic
   ├── Authentication checks
   └── Redirect rules
```

### Component Files

```
🧩 src/components/layout/AppLayout.tsx
   ├── AppBar (header)
   ├── Drawer (sidebar)
   ├── User menu
   ├── Theme toggle
   └── Main content area

🧩 src/components/layout/Sidebar.tsx
   ├── Team list
   ├── Board navigation
   ├── Create team button
   └── Expand/collapse logic

🧩 src/components/board/BoardView.tsx
   ├── Board header
   ├── Three columns (To Do, In Progress, Done)
   ├── Task distribution
   └── Create task dialog

🧩 src/components/board/TaskCard.tsx
   ├── Task title
   ├── Description preview
   ├── Assignee avatar
   ├── Due date
   └── Context menu
```

### API Route Files

```
🔌 src/app/api/auth/[...nextauth]/route.ts
   └── NextAuth handler (GET, POST)

🔌 src/app/api/auth/signup/route.ts
   └── User registration (POST)

🔌 src/app/api/teams/route.ts
   ├── List teams (GET)
   └── Create team (POST)

🔌 src/app/api/teams/[teamId]/route.ts
   └── Team details (GET)

🔌 src/app/api/teams/[teamId]/invite/route.ts
   └── Invite member (POST)

🔌 src/app/api/teams/[teamId]/boards/route.ts
   ├── List boards (GET)
   └── Create board (POST)

🔌 src/app/api/boards/[boardId]/route.ts
   ├── Board details (GET)
   ├── Update board (PUT)
   └── Delete board (DELETE)

🔌 src/app/api/boards/[boardId]/tasks/route.ts
   └── Create task (POST)

🔌 src/app/api/tasks/[taskId]/route.ts
   ├── Update task (PUT)
   └── Delete task (DELETE)

🔌 src/app/api/profile/route.ts
   ├── Get profile (GET)
   └── Update profile (PUT)
```

## 🗺️ Route Structure

### Public Routes
```
/                           → Landing (redirects)
/signin                     → Sign in page
/signup                     → Sign up page
```

### Protected Routes
```
/teams/new                  → Create team
/teams/[teamId]             → Team dashboard
/teams/[teamId]/boards/[boardId]  → Board view
/profile                    → User profile
```

### API Routes
```
POST   /api/auth/signup
POST   /api/auth/signin     (NextAuth)
GET    /api/teams
POST   /api/teams
GET    /api/teams/[teamId]
POST   /api/teams/[teamId]/invite
GET    /api/teams/[teamId]/boards
POST   /api/teams/[teamId]/boards
GET    /api/boards/[boardId]
PUT    /api/boards/[boardId]
DELETE /api/boards/[boardId]
POST   /api/boards/[boardId]/tasks
PUT    /api/tasks/[taskId]
DELETE /api/tasks/[taskId]
GET    /api/profile
PUT    /api/profile
```

## 📊 File Count Summary

```
Total Files: 50+

Configuration:     6 files
Documentation:     7 files
Database:          2 files
Pages:            8 files
API Routes:       10 files
Components:        7 files
Utilities:         3 files
Types:            2 files
Other:            5 files
```

## 🎯 Navigation Flow

```
User Journey:

1. Landing (/)
   ↓
2. Sign In (/signin) or Sign Up (/signup)
   ↓
3. Team Dashboard (/teams/[teamId])
   ├── Create Team (/teams/new)
   ├── Invite Members (dialog)
   └── Create Board (dialog)
   ↓
4. Board View (/teams/[teamId]/boards/[boardId])
   ├── Create Task (dialog)
   ├── Edit Task (dialog)
   └── Move/Delete Task (menu)
   ↓
5. Profile (/profile)
   └── Update Settings
```

## 🔄 Data Flow

```
Component → API Route → Prisma → Database
    ↑                                ↓
    └────────── Response ←───────────┘

Example: Create Task
1. TaskDialog.tsx (component)
2. POST /api/boards/[boardId]/tasks
3. Prisma task.create()
4. PostgreSQL INSERT
5. Return task data
6. Update UI
```

## 📝 Naming Conventions

### Files
- **Pages**: `page.tsx`
- **Layouts**: `layout.tsx`
- **API Routes**: `route.ts`
- **Components**: `PascalCase.tsx`
- **Utilities**: `camelCase.ts`
- **Types**: `camelCase.ts` or `kebab-case.d.ts`

### Folders
- **Route Groups**: `(groupName)/`
- **Dynamic Routes**: `[paramName]/`
- **Regular Folders**: `lowercase/`

### Code
- **Components**: `PascalCase`
- **Functions**: `camelCase`
- **Constants**: `UPPER_SNAKE_CASE`
- **Types/Interfaces**: `PascalCase`
- **Variables**: `camelCase`

## 🎨 Import Paths

Using TypeScript path aliases:

```typescript
// Instead of: '../../../lib/prisma'
import prisma from '@/lib/prisma';

// Instead of: '../../components/board/TaskCard'
import TaskCard from '@/components/board/TaskCard';

// Instead of: '../../../types'
import { TaskWithDetails } from '@/types';
```

Configured in `tsconfig.json`:
```json
{
  "paths": {
    "@/*": ["./src/*"]
  }
}
```

---

**This structure follows Next.js 15 App Router best practices and provides a scalable foundation for growth! 🚀**
