# Team Invitation System - Quick Start Guide

## 🚀 What Changed?

**Before**: When an admin invited a user, they were immediately added to the team.

**After**: When an admin invites a user, an invitation is created. The user receives a notification and must accept the invitation to join the team.

## ⚡ Quick Setup (5 Steps)

### Step 1: Update Database Schema
```bash
npx prisma generate
npx prisma db push
```

### Step 2: Add Notification Bell to Your Layout
```tsx
// src/app/(dashboard)/layout.tsx or your main layout
import NotificationBell from '@/components/notifications/NotificationBell';

// Add to your header/navbar
<NotificationBell />
```

### Step 3: Test the Invitation Flow

**As Admin:**
1. Go to team settings
2. Invite a user by email
3. See success message: "Invitation sent successfully"

**As User:**
1. See notification bell badge (red dot with count)
2. Click bell → see "Team Invitation" notification
3. Click notification → go to invitations page
4. Click "Accept" or "Decline"

### Step 4: Verify Everything Works
- [ ] Notification bell appears in header
- [ ] Admin can send invitations
- [ ] User receives notification
- [ ] User can accept/reject invitation
- [ ] User is added to team after accepting

### Step 5: (Optional) Customize
- Update notification polling interval (default: 30 seconds)
- Customize invitation expiration (default: 7 days)
- Add email notifications
- Style components to match your theme

## 📁 New Files Created

### API Routes
- `src/app/api/invitations/route.ts` - Get user's invitations
- `src/app/api/invitations/[invitationId]/route.ts` - Accept/reject
- `src/app/api/notifications/route.ts` - Get/update notifications

### Components
- `src/components/invitations/InvitationsList.tsx` - Display invitations
- `src/components/notifications/NotificationBell.tsx` - Notification icon

### Pages
- `src/app/(dashboard)/invitations/page.tsx` - Invitations page

### Documentation
- `INVITATION_SYSTEM_README.md` - Complete documentation
- `INVITATION_SYSTEM_MIGRATION.md` - Migration guide

## 🔧 Modified Files

### Database Schema
- `prisma/schema.prisma` - Added TeamInvitation and Notification models

### API Routes
- `src/app/api/teams/[teamId]/invite/route.ts` - Now creates invitations

## 🎯 Key Features

✅ **Invitation Management**
- Send, accept, reject invitations
- 7-day expiration
- Duplicate prevention

✅ **Notifications**
- Real-time notification bell
- Unread count badge
- Auto-refresh every 30 seconds
- Mark as read (individual or all)

✅ **Security**
- Only admins can invite
- Users can only respond to their own invitations
- Expired invitations cannot be accepted

## 📊 Database Models

### TeamInvitation
```
- id, teamId, invitedBy, invitedUser
- role (ADMIN/MEMBER)
- status (PENDING/ACCEPTED/REJECTED/EXPIRED)
- createdAt, expiresAt, respondedAt
```

### Notification
```
- id, userId, type, title, message
- read (boolean)
- data (JSON - additional info)
- createdAt
```

## 🔗 API Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/teams/[teamId]/invite` | Send invitation |
| GET | `/api/invitations` | Get user's invitations |
| POST | `/api/invitations/[id]` | Accept/reject invitation |
| GET | `/api/notifications` | Get notifications |
| PATCH | `/api/notifications` | Mark as read |

## 💡 Usage Examples

### Send Invitation (Admin)
```typescript
const response = await fetch(`/api/teams/${teamId}/invite`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    role: 'MEMBER'
  })
});
```

### Accept Invitation (User)
```typescript
const response = await fetch(`/api/invitations/${invitationId}`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ action: 'accept' })
});
```

### Get Notifications
```typescript
const response = await fetch('/api/notifications');
const { data: notifications, unreadCount } = await response.json();
```

## 🐛 Troubleshooting

**Problem**: Notification bell doesn't appear
- **Solution**: Make sure you added `<NotificationBell />` to your layout

**Problem**: Database errors
- **Solution**: Run `npx prisma db push` to update schema

**Problem**: Invitations not showing
- **Solution**: Check browser console for API errors

**Problem**: Badge count wrong
- **Solution**: Refresh the page or check database

## 📚 Full Documentation

For complete details, see:
- **INVITATION_SYSTEM_README.md** - Full feature documentation
- **INVITATION_SYSTEM_MIGRATION.md** - Detailed migration guide

## ✨ Next Steps

1. ✅ Run database migration
2. ✅ Add notification bell to layout
3. ✅ Test invitation flow
4. 🎨 Customize styling (optional)
5. 📧 Add email notifications (optional)
6. 🔔 Add push notifications (optional)

---

**Need Help?** Check the full documentation or review the component source code for implementation details.
