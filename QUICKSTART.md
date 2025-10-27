# Quick Start Guide - Team Task-Hub

Get up and running in 5 minutes! 🚀

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database running
- Terminal/Command line access

## Step-by-Step Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/team_task_hub?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-a-random-secret-key-here"
```

**Generate a secret key:**
```bash
openssl rand -base64 32
```

**Update DATABASE_URL** with your PostgreSQL credentials:
- Replace `user` with your PostgreSQL username
- Replace `password` with your PostgreSQL password
- Replace `localhost:5432` if using a different host/port
- The database `team_task_hub` will be created automatically

### 3. Set Up Database

```bash
# Push the schema to your database
npm run db:push

# Seed with demo data (optional but recommended)
npm run db:seed
```

### 4. Start Development Server

```bash
npm run dev
```

### 5. Open Your Browser

Navigate to: **http://localhost:3000**

## Demo Accounts (After Seeding)

| Email | Password | Role |
|-------|----------|------|
| alice@example.com | password123 | Admin of Dev Team |
| bob@example.com | password123 | Admin of Marketing Team |
| charlie@example.com | password123 | Team Member |

## First Steps

1. **Sign In** with one of the demo accounts (or create your own)
2. **Explore Teams** - View the pre-populated teams and boards
3. **Create a Task** - Click the "+" button in any column
4. **Try the Theme Toggle** - Click the sun/moon icon in the top bar
5. **Invite a Member** - Go to team dashboard and click "Invite Member"

## Common Issues

### Database Connection Error

**Problem:** Can't connect to PostgreSQL

**Solution:**
- Ensure PostgreSQL is running: `pg_ctl status` or check your PostgreSQL service
- Verify credentials in `.env` file
- Create the database manually if needed: `createdb team_task_hub`

### Port Already in Use

**Problem:** Port 3000 is already in use

**Solution:**
```bash
# Use a different port
PORT=3001 npm run dev
```

### Module Not Found Errors

**Problem:** Missing dependencies

**Solution:**
```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Next Steps

- 📖 Read the full [README.md](README.md) for detailed documentation
- 🎨 Customize the theme in `src/components/providers/ThemeProvider.tsx`
- 🔧 Modify the database schema in `prisma/schema.prisma`
- 🚀 Deploy to Vercel (see README for instructions)

## Project Structure Overview

```
src/
├── app/              # Pages and API routes
├── components/       # React components
├── lib/             # Utilities and config
└── types/           # TypeScript types

prisma/
├── schema.prisma    # Database schema
└── seed.ts          # Demo data
```

## Key Features to Try

✅ **Authentication** - Sign up, sign in, sign out  
✅ **Teams** - Create teams, invite members  
✅ **Boards** - Create Kanban boards  
✅ **Tasks** - Create, edit, move, assign tasks  
✅ **Roles** - Admin vs Member permissions  
✅ **Themes** - Light/dark mode toggle  
✅ **Profile** - Update user settings  

## Need Help?

- Check the [README.md](README.md) for detailed documentation
- Review the code comments - they explain what each part does
- Look at the API routes in `src/app/api/` for backend logic
- Examine components in `src/components/` for UI patterns

---

**Happy coding! 🎉**
