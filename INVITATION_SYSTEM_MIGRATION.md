# Team Invitation System Migration Guide

## Overview
This migration adds a proper invitation system with notifications. Users must now accept invitations before joining teams.

## Database Changes

### New Models Added:
1. **TeamInvitation** - Stores pending, accepted, and rejected team invitations
2. **Notification** - Stores user notifications

### New Enums:
1. **InvitationStatus** - PENDING, ACCEPTED, REJECTED, EXPIRED
2. **NotificationType** - TEAM_INVITATION, TASK_ASSIGNED, TASK_UPDATED, TEAM_UPDATE, GENERAL

## Migration Steps

### 1. Apply Database Schema Changes

Run the following commands to update your database:

```bash
# Generate Prisma client with new schema
npx prisma generate

# Push schema changes to database
npx prisma db push
```

**Note:** If you have existing data and want to preserve it, use migrations instead:

```bash
# Create a migration
npx prisma migrate dev --name add_invitation_system

# Apply the migration
npx prisma migrate deploy
```

### 2. API Changes

#### Updated Endpoints:

**POST /api/teams/[teamId]/invite**
- **Before:** Directly added user to team
- **After:** Creates an invitation and notification
- Response now includes invitation details instead of team member

#### New Endpoints:

**GET /api/invitations**
- Get all pending invitations for the current user
- Returns: Array of invitations with team and inviter details

**POST /api/invitations/[invitationId]**
- Accept or reject an invitation
- Body: `{ "action": "accept" | "reject" }`
- On accept: Adds user to team and updates invitation status
- On reject: Updates invitation status only

**GET /api/notifications**
- Get all notifications for the current user
- Query params: `?unreadOnly=true` (optional)
- Returns: Notifications array and unread count

**PATCH /api/notifications**
- Mark notifications as read
- Body: `{ "notificationIds": ["id1", "id2"] }` or `{ "markAllAsRead": true }`

## Frontend Integration

### 1. Display Notifications
Users should see a notification icon/badge showing unread count.

### 2. Invitation List
Create a page/component to display pending invitations with Accept/Reject buttons.

### 3. Update Team Invite Flow
When an admin invites a user, show a success message indicating the invitation was sent (not that the user was added).

## Example Usage

### Sending an Invitation (Admin)
```typescript
const response = await fetch(`/api/teams/${teamId}/invite`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    role: 'MEMBER'
  })
});
// Response: { success: true, message: 'Invitation sent successfully', data: {...} }
```

### Getting Pending Invitations (User)
```typescript
const response = await fetch('/api/invitations');
const { data: invitations } = await response.json();
// invitations: [{ id, team: {...}, inviter: {...}, role, createdAt, ... }]
```

### Accepting an Invitation (User)
```typescript
const response = await fetch(`/api/invitations/${invitationId}`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ action: 'accept' })
});
// Response: { success: true, message: 'You have joined "Team Name"', data: {...} }
```

### Getting Notifications (User)
```typescript
const response = await fetch('/api/notifications');
const { data: notifications, unreadCount } = await response.json();
```

### Marking Notifications as Read
```typescript
// Mark specific notifications
await fetch('/api/notifications', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ notificationIds: ['id1', 'id2'] })
});

// Mark all as read
await fetch('/api/notifications', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ markAllAsRead: true })
});
```

## Features

### Invitation Expiration
- Invitations expire after 7 days by default
- Expired invitations cannot be accepted
- Status automatically updated to EXPIRED when accessed after expiration

### Duplicate Prevention
- Users cannot receive multiple pending invitations to the same team
- If a new invitation is sent, it updates the existing one

### Notification System
- Users receive notifications when invited to teams
- Notifications include team name, inviter name, and role
- Notifications can be marked as read individually or all at once
- Unread count is tracked

### Security
- Only team admins can send invitations
- Users can only accept/reject their own invitations
- Invitations are validated before processing

## Next Steps

1. **Run the migration** to update your database
2. **Create UI components** for:
   - Notification bell/dropdown
   - Invitations list page
   - Accept/Reject invitation buttons
3. **Update team management UI** to reflect new invitation flow
4. **Add real-time updates** (optional) using WebSockets or polling

## Rollback (if needed)

If you need to rollback:

```bash
# Revert schema changes
git checkout HEAD~1 prisma/schema.prisma

# Regenerate client
npx prisma generate

# Revert database (if using migrations)
npx prisma migrate resolve --rolled-back <migration_name>
```
