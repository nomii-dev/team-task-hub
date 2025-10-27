# Team Task-Hub

A full-stack productivity application for small teams with task boards, collaboration features, and role-based permissions.

## 🚀 Features

- **User Authentication**: Secure sign-up/sign-in with NextAuth.js (credentials + optional OAuth)
- **Team Management**: Create teams, invite members, manage roles (Admin/Member)
- **Task Boards**: Kanban-style boards with customizable columns (To Do, In Progress, Done)
- **Task Management**: Create, edit, assign, and track tasks with due dates
- **Role-Based Access**: Admin-only features for team and board management
- **Responsive UI**: Beautiful Material-UI components with light/dark theme toggle
- **Real-time Ready**: Architecture supports WebSocket/SSE integration

## 🛠️ Technology Stack

- **Framework**: Next.js 15.x (App Router)
- **UI Library**: Material-UI (MUI) 7.3.x
- **Authentication**: NextAuth.js v4
- **Database**: PostgreSQL with Prisma ORM
- **Language**: TypeScript
- **Styling**: Emotion (CSS-in-JS)
- **Deployment**: Vercel-ready

## 📁 Project Structure

```
team-task-hub/
├── src/
│   ├── app/                      # Next.js App Router pages
│   │   ├── (auth)/              # Authentication pages
│   │   │   ├── signin/
│   │   │   └── signup/
│   │   ├── (protected)/         # Protected routes
│   │   │   ├── teams/
│   │   │   │   └── [teamId]/
│   │   │   │       ├── boards/
│   │   │   │       │   └── [boardId]/
│   │   │   │       └── page.tsx
│   │   │   └── profile/
│   │   ├── api/                 # API routes
│   │   │   ├── auth/
│   │   │   ├── teams/
│   │   │   ├── boards/
│   │   │   ├── tasks/
│   │   │   └── profile/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/              # React components
│   │   ├── board/              # Board and task components
│   │   ├── layout/             # Layout components
│   │   └── providers/          # Context providers
│   ├── lib/                     # Utility functions
│   │   ├── prisma.ts           # Prisma client
│   │   ├── auth.ts             # NextAuth config
│   │   └── utils.ts            # Helper functions
│   ├── types/                   # TypeScript types
│   └── middleware.ts            # Route protection
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── seed.ts                 # Seed data script
├── package.json
├── tsconfig.json
└── next.config.js
```

## 🗄️ Database Schema

### Models

- **User**: User accounts with authentication
- **Team**: Team/workspace entities
- **TeamMember**: Junction table with roles (ADMIN/MEMBER)
- **Board**: Task boards belonging to teams
- **Task**: Individual tasks with status, assignee, due dates
- **Account/Session**: NextAuth session management

### Relationships

- Users can belong to multiple teams
- Teams have multiple boards
- Boards contain multiple tasks
- Tasks can be assigned to users

## 🚦 Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd team-task-hub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   # Database
   DATABASE_URL="postgresql://user:password@localhost:5432/team_task_hub?schema=public"
   
   # NextAuth
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here"
   
   # Optional: Google OAuth
   # GOOGLE_CLIENT_ID="your-google-client-id"
   # GOOGLE_CLIENT_SECRET="your-google-client-secret"
   ```

   Generate a secret key:
   ```bash
   openssl rand -base64 32
   ```

4. **Set up the database**
   ```bash
   # Push schema to database
   npm run db:push
   
   # Seed with demo data
   npm run db:seed
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

### Demo Accounts

After seeding, you can sign in with:

- **Alice** (Dev Team Admin): `alice@example.com` / `password123`
- **Bob** (Marketing Team Admin): `bob@example.com` / `password123`
- **Charlie** (Team Member): `charlie@example.com` / `password123`

## 🎯 Usage Guide

### Creating a Team

1. Sign in to your account
2. Click "Create Team" in the sidebar
3. Enter team name and submit
4. You'll be added as the team admin

### Inviting Members

1. Navigate to your team dashboard
2. Click "Invite Member" (admin only)
3. Enter the email of an existing user
4. They'll be added to your team

### Creating Boards

1. Go to your team dashboard
2. Click "Create Board" (admin only)
3. Enter board name
4. Start adding tasks!

### Managing Tasks

1. Open a board
2. Click "+" in any column to create a task
3. Fill in task details (title, description, assignee, due date)
4. Click on tasks to edit or move them between columns
5. Use the menu (⋮) for more options

### Switching Themes

Click the sun/moon icon in the app bar to toggle between light and dark modes.

## 🔐 API Routes

### Authentication
- `POST /api/auth/signup` - Create new user
- `POST /api/auth/signin` - Sign in (handled by NextAuth)

### Teams
- `GET /api/teams` - List user's teams
- `POST /api/teams` - Create team
- `GET /api/teams/[teamId]` - Get team details
- `POST /api/teams/[teamId]/invite` - Invite member (admin)
- `GET /api/teams/[teamId]/boards` - List team boards
- `POST /api/teams/[teamId]/boards` - Create board (admin)

### Boards
- `GET /api/boards/[boardId]` - Get board with tasks
- `PUT /api/boards/[boardId]` - Update board (admin)
- `DELETE /api/boards/[boardId]` - Delete board (admin)
- `POST /api/boards/[boardId]/tasks` - Create task

### Tasks
- `PUT /api/tasks/[taskId]` - Update task
- `DELETE /api/tasks/[taskId]` - Delete task

### Profile
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update profile

## 🎨 Customization

### Theme

Edit `src/components/providers/ThemeProvider.tsx` to customize colors and styles:

```typescript
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Change primary color
    },
    // ... more customization
  },
});
```

### Task Statuses

Modify `prisma/schema.prisma` to add custom statuses:

```prisma
enum Status {
  TODO
  IN_PROGRESS
  IN_REVIEW    // Add new status
  DONE
}
```

Then update the UI in `src/components/board/BoardView.tsx`.

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

### Environment Variables for Production

```env
DATABASE_URL="your-production-database-url"
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="your-production-secret"
```

## 🧪 Development Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:push      # Push schema to database
npm run db:seed      # Seed database with demo data
```

## 📝 Key Features Explained

### Role-Based Access Control

- **Admin**: Can create/delete boards, invite members, manage team
- **Member**: Can view boards, create/edit tasks

Implemented in API routes with helper functions in `src/lib/utils.ts`.

### Protected Routes

Middleware (`src/middleware.ts`) protects routes under `/teams` and `/profile`, redirecting unauthenticated users to sign-in.

### Theme Persistence

Theme preference is saved to localStorage and persists across sessions.

### Type Safety

Full TypeScript coverage with Prisma-generated types and custom type definitions.

## 🔧 Troubleshooting

### Database Connection Issues

- Verify PostgreSQL is running
- Check DATABASE_URL format
- Ensure database exists

### Authentication Not Working

- Verify NEXTAUTH_SECRET is set
- Check NEXTAUTH_URL matches your domain
- Clear browser cookies and try again

### Build Errors

- Delete `.next` folder and rebuild
- Clear node_modules and reinstall
- Check for TypeScript errors

## 🤝 Contributing

This is a demo project. Feel free to fork and customize for your needs!

## 📄 License

MIT License - feel free to use this project for learning or production.

## 🙏 Acknowledgments

- Built with Next.js, Material-UI, and Prisma
- Inspired by modern project management tools
- Created as a full-stack demo application

---

**Happy Task Managing! 🎉**
