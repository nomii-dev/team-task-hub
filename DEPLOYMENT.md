# Deployment Guide - Team Task-Hub

Deploy your Team Task-Hub application to production.

## Deployment Options

### Option 1: Vercel (Recommended) ⭐

Vercel is the easiest way to deploy Next.js applications.

#### Prerequisites
- GitHub account
- Vercel account (free tier available)
- PostgreSQL database (see database options below)

#### Steps

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

3. **Configure Environment Variables**
   
   In Vercel project settings, add:
   ```
   DATABASE_URL=<your-production-database-url>
   NEXTAUTH_URL=https://your-app.vercel.app
   NEXTAUTH_SECRET=<generate-new-secret-for-production>
   ```

4. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy automatically
   - Future pushes to main branch auto-deploy

5. **Set Up Database**
   ```bash
   # After deployment, run migrations
   npx prisma db push
   
   # Optional: Seed with demo data
   npm run db:seed
   ```

#### Vercel Configuration

Create `vercel.json` (optional):
```json
{
  "buildCommand": "prisma generate && next build",
  "devCommand": "next dev",
  "installCommand": "npm install"
}
```

---

### Option 2: Railway

Railway provides easy PostgreSQL hosting with your app.

#### Steps

1. **Create Railway Account**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Add PostgreSQL**
   - Click "New" → "Database" → "PostgreSQL"
   - Railway will create a database and provide DATABASE_URL

4. **Configure Environment Variables**
   ```
   NEXTAUTH_URL=https://your-app.railway.app
   NEXTAUTH_SECRET=<your-secret>
   ```
   (DATABASE_URL is auto-configured)

5. **Deploy**
   - Railway auto-deploys on push
   - View logs in the dashboard

---

### Option 3: Docker + Any Cloud Provider

Deploy using Docker to AWS, GCP, Azure, or DigitalOcean.

#### Dockerfile

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build Next.js
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

#### Docker Compose (for local testing)

Create `docker-compose.yml`:
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/team_task_hub
      - NEXTAUTH_URL=http://localhost:3000
      - NEXTAUTH_SECRET=your-secret-here
    depends_on:
      - db

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=team_task_hub
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  postgres_data:
```

#### Build and Run
```bash
docker-compose up --build
```

---

## Database Options

### Option 1: Vercel Postgres
- Integrated with Vercel
- Easy setup
- Free tier available
- [vercel.com/storage/postgres](https://vercel.com/storage/postgres)

### Option 2: Supabase
- Free PostgreSQL hosting
- Generous free tier
- [supabase.com](https://supabase.com)

**Setup:**
1. Create project on Supabase
2. Get connection string from Settings → Database
3. Use as DATABASE_URL

### Option 3: Railway PostgreSQL
- Included with Railway deployment
- Auto-configured
- [railway.app](https://railway.app)

### Option 4: Neon
- Serverless PostgreSQL
- Free tier available
- [neon.tech](https://neon.tech)

### Option 5: AWS RDS
- Production-grade
- Scalable
- Requires AWS account

---

## Environment Variables

### Required Variables

```env
# Database connection
DATABASE_URL="postgresql://user:password@host:5432/database"

# NextAuth configuration
NEXTAUTH_URL="https://your-production-domain.com"
NEXTAUTH_SECRET="<generate-with-openssl-rand-base64-32>"
```

### Optional Variables

```env
# Google OAuth (if using)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Node environment
NODE_ENV="production"
```

### Generating Secrets

```bash
# Generate NEXTAUTH_SECRET
openssl rand -base64 32

# Or use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

---

## Pre-Deployment Checklist

- [ ] Environment variables configured
- [ ] Database created and accessible
- [ ] NEXTAUTH_SECRET is unique and secure
- [ ] NEXTAUTH_URL matches your domain
- [ ] Database schema pushed (`npx prisma db push`)
- [ ] Build succeeds locally (`npm run build`)
- [ ] All tests pass (if you have tests)
- [ ] .env file is in .gitignore (never commit secrets!)

---

## Post-Deployment Steps

### 1. Verify Deployment
- Visit your deployed URL
- Test sign up/sign in
- Create a team and board
- Create and move tasks

### 2. Set Up Database
```bash
# Connect to your production database
DATABASE_URL="your-production-url" npx prisma db push

# Optional: Seed demo data
DATABASE_URL="your-production-url" npm run db:seed
```

### 3. Monitor Application
- Check deployment logs
- Monitor database connections
- Set up error tracking (optional: Sentry)

### 4. Configure Custom Domain (Optional)
- Add custom domain in Vercel/Railway settings
- Update NEXTAUTH_URL to match custom domain
- Configure DNS records

---

## Troubleshooting

### Build Fails

**Error:** Prisma Client not generated

**Solution:**
```bash
# Add to build command
npx prisma generate && npm run build
```

### Database Connection Issues

**Error:** Can't connect to database

**Solution:**
- Verify DATABASE_URL is correct
- Check database is accessible from deployment platform
- Ensure SSL mode is configured if required
- For Vercel: Add `?sslmode=require` to DATABASE_URL

### Authentication Not Working

**Error:** NextAuth errors in production

**Solution:**
- Verify NEXTAUTH_URL matches your domain (including https://)
- Ensure NEXTAUTH_SECRET is set
- Check that cookies are allowed
- For custom domains: Update NEXTAUTH_URL

### Prisma Migration Issues

**Error:** Migration conflicts

**Solution:**
```bash
# Use db push for development/hobby projects
npx prisma db push

# For production with migrations
npx prisma migrate deploy
```

---

## Performance Optimization

### 1. Enable Caching
- Vercel automatically caches static assets
- Use Next.js ISR for dynamic pages

### 2. Database Connection Pooling
Add to DATABASE_URL:
```
?connection_limit=5&pool_timeout=10
```

### 3. Image Optimization
- Next.js automatically optimizes images
- Configure domains in `next.config.js`

### 4. Enable Compression
Already enabled in Next.js production builds

---

## Security Best Practices

1. **Never commit .env files**
   - Always in .gitignore
   - Use platform environment variables

2. **Use strong secrets**
   - Generate unique NEXTAUTH_SECRET
   - Rotate secrets periodically

3. **Enable HTTPS**
   - Automatic on Vercel/Railway
   - Required for production

4. **Database Security**
   - Use strong passwords
   - Enable SSL connections
   - Restrict IP access if possible

5. **Rate Limiting**
   - Consider adding rate limiting to API routes
   - Use Vercel Edge Config or Upstash Redis

---

## Monitoring & Maintenance

### Logging
- Vercel: Built-in logging in dashboard
- Railway: View logs in project dashboard
- Custom: Use services like Logtail or Papertrail

### Error Tracking
- Sentry: [sentry.io](https://sentry.io)
- LogRocket: [logrocket.com](https://logrocket.com)

### Uptime Monitoring
- UptimeRobot: [uptimerobot.com](https://uptimerobot.com)
- Pingdom: [pingdom.com](https://pingdom.com)

### Database Backups
- Vercel Postgres: Automatic backups
- Supabase: Automatic backups on paid plans
- Railway: Automatic backups
- Manual: Use `pg_dump` for PostgreSQL

---

## Scaling Considerations

### Database
- Start with connection pooling
- Consider read replicas for high traffic
- Use database indexes for performance

### Application
- Vercel scales automatically
- Consider Edge Functions for global performance
- Use CDN for static assets

### Caching
- Implement Redis for session storage
- Use Next.js ISR for dynamic content
- Cache API responses where appropriate

---

## Cost Estimates

### Free Tier (Hobby Projects)
- **Vercel**: Free for personal projects
- **Supabase**: 500MB database, 2GB bandwidth
- **Railway**: $5 credit/month
- **Total**: $0-5/month

### Production (Small Team)
- **Vercel Pro**: $20/month
- **Database**: $10-25/month
- **Total**: $30-45/month

### Enterprise
- Custom pricing based on usage
- Contact platforms for quotes

---

## Support & Resources

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)
- **Prisma Docs**: [prisma.io/docs](https://prisma.io/docs)
- **NextAuth Docs**: [next-auth.js.org](https://next-auth.js.org)

---

**Ready to deploy? Choose your platform and follow the steps above! 🚀**
