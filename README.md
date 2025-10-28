# Team Task-Hub

A productivity app for small teams with task boards and collaboration features.

## Features

### 🔐 Authentication
- Email/password authentication
- Secure session management with NextAuth.js
- User profile management

### 👥 Team Management
- Create and manage teams
- **Full Member CRUD Operations:**
  - **Invite members** via email with role selection
  - **View all members** with roles and join dates
  - **Update member roles** (Admin/Member)
  - **Remove members** from team
  - Protection against removing last admin
  - Invitation system with notifications

### 📋 Board Management
- Create multiple boards per team
- Kanban-style task boards
- **Delete boards** with confirmation
- Boards visible in sidebar navigation

### ✅ Task Management
- Create, update, and delete tasks
- Drag-and-drop task organization
- Task status: To Do, In Progress, Done
- Assign tasks to team members
- Set due dates
- Task descriptions

### 🔔 Notifications
- Team invitation notifications
- Real-time notification bell
- Mark as read functionality

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** NextAuth.js
- **UI:** Material-UI (MUI)
- **Styling:** Emotion

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```

4. Configure your `.env` file:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/team_task_hub"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here"
   ```

5. Generate Prisma client and push schema:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

6. (Optional) Seed the database:
   ```bash
   npm run db:seed
   ```

7. Run the development server:
   ```bash
   npm run dev
   ```

8. Open [http://localhost:3000](http://localhost:3000)

## Member Management Guide

### For Team Admins

#### Invite Members
1. Go to team page
2. Click "Members" tab
3. Click "Invite Member" button
4. Enter email address
5. Select role (Admin or Member)
6. Click "Send Invitation"
7. User receives notification and must accept

#### Change Member Role
1. Go to "Members" tab
2. Click ⋮ (three dots) next to member
3. Click "Change Role"
4. Select new role
5. Click "Update Role"

#### Remove Member
1. Go to "Members" tab
2. Click ⋮ (three dots) next to member
3. Click "Remove Member"
4. Confirm removal
5. Member loses access immediately

### Permissions

**Admin:**
- Full team management access
- Invite/remove members
- Change member roles
- Create/delete boards
- All member permissions

**Member:**
- View team boards
- Create/edit/delete tasks
- View team members
- Cannot manage members or boards

### Safety Features

- ✅ Cannot remove the last admin
- ✅ Cannot remove yourself (ask another admin)
- ✅ Cannot demote last admin (promote someone first)
- ✅ Confirmation dialogs for destructive actions
- ✅ Clear error messages

## API Endpoints

### Teams
- `GET /api/teams` - Get user's teams
- `POST /api/teams` - Create team
- `GET /api/teams/[teamId]` - Get team details
- `POST /api/teams/[teamId]/invite` - Invite member

### Members (NEW)
- `GET /api/teams/[teamId]/members` - List members
- `PATCH /api/teams/[teamId]/members/[memberId]` - Update role
- `DELETE /api/teams/[teamId]/members/[memberId]` - Remove member

### Boards
- `GET /api/teams/[teamId]/boards` - List boards
- `POST /api/teams/[teamId]/boards` - Create board
- `GET /api/boards/[boardId]` - Get board details
- `DELETE /api/boards/[boardId]` - Delete board

### Tasks
- `POST /api/boards/[boardId]/tasks` - Create task
- `PATCH /api/tasks/[taskId]` - Update task
- `DELETE /api/tasks/[taskId]` - Delete task

### Invitations
- `GET /api/invitations` - Get user's invitations
- `POST /api/invitations/[invitationId]` - Accept/reject

### Notifications
- `GET /api/notifications` - Get notifications
- `PATCH /api/notifications` - Mark as read

## Project Structure

```
src/
├── app/
│   ├── (auth)/              # Authentication pages
│   ├── (protected)/         # Protected pages
│   │   ├── teams/
│   │   │   ├── [teamId]/
│   │   │   │   ├── boards/
│   │   │   │   └── page.tsx # Team dashboard with tabs
│   │   ├── invitations/
│   │   └── profile/
│   └── api/
│       ├── teams/
│       │   └── [teamId]/
│       │       ├── members/  # NEW: Member CRUD
│       │       ├── boards/
│       │       └── invite/
│       ├── boards/
│       ├── tasks/
│       ├── invitations/
│       └── notifications/
├── components/
│   ├── team/
│   │   └── MemberManagement.tsx  # NEW: Member CRUD UI
│   ├── board/
│   ├── invitations/
│   ├── notifications/
│   └── layout/
├── lib/
│   ├── auth.ts
│   ├── prisma.ts
│   └── utils.ts
└── types/
    └── index.ts
```

## Database Schema

### Key Models

**User**
- id, email, name, password, image
- Relations: teamMembers, tasks, invitations

**Team**
- id, name, createdAt, updatedAt
- Relations: members, boards, invitations

**TeamMember**
- id, userId, teamId, role, joinedAt
- Unique: (userId, teamId)

**Board**
- id, name, teamId, createdAt, updatedAt
- Relations: team, tasks

**Task**
- id, title, description, status, position
- boardId, assigneeId, createdById, dueDate

**TeamInvitation**
- id, teamId, invitedBy, invitedUser, role, status
- Status: PENDING, ACCEPTED, REJECTED, EXPIRED

**Notification**
- id, userId, type, title, message, read, data

## Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npx prisma studio    # Open Prisma Studio
npx prisma generate  # Generate Prisma Client
npx prisma db push   # Push schema to database
```

### Code Style

- TypeScript for type safety
- ESLint for code quality
- Functional components with hooks
- Material-UI for consistent design
- Server components where possible

## Security

- Passwords hashed with bcrypt
- JWT-based sessions
- CSRF protection
- Role-based access control
- Input validation with Zod
- SQL injection protection (Prisma)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.

---

**Built with ❤️ using Next.js and Material-UI**
