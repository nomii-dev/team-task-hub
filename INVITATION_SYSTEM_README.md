# Team Invitation System

## Overview

The Team Task-Hub now includes a comprehensive invitation system that allows team administrators to invite users to join their teams. Instead of directly adding users, invitations are sent and users must explicitly accept them.

## Features

### ✅ Invitation Management
- **Send Invitations**: Team admins can invite users by email
- **Accept/Reject**: Users can accept or reject invitations
- **Expiration**: Invitations expire after 7 days
- **Duplicate Prevention**: Users cannot receive multiple pending invitations to the same team

### ✅ Notification System
- **Real-time Notifications**: Users receive notifications when invited
- **Notification Bell**: Visual indicator with unread count
- **Mark as Read**: Individual or bulk marking as read
- **Auto-refresh**: Notifications poll every 30 seconds

### ✅ Security
- **Authorization**: Only team admins can send invitations
- **Validation**: Users can only respond to their own invitations
- **Status Tracking**: Invitations track PENDING, ACCEPTED, REJECTED, EXPIRED states

## Database Schema

### TeamInvitation Model
```prisma
model TeamInvitation {
  id          String            @id @default(cuid())
  teamId      String
  invitedBy   String
  invitedUser String
  role        Role              @default(MEMBER)
  status      InvitationStatus  @default(PENDING)
  createdAt   DateTime          @default(now())
  expiresAt   DateTime?
  respondedAt DateTime?
  
  team    Team @relation(...)
  inviter User @relation("InvitationSender", ...)
  invitee User @relation("InvitationReceiver", ...)
  
  @@unique([teamId, invitedUser])
}
```

### Notification Model
```prisma
model Notification {
  id        String           @id @default(cuid())
  userId    String
  type      NotificationType
  title     String
  message   String           @db.Text
  read      Boolean          @default(false)
  data      Json?
  createdAt DateTime         @default(now())
  
  user User @relation(...)
}
```

## API Endpoints

### 1. Send Invitation
**POST** `/api/teams/[teamId]/invite`

**Authorization**: Team Admin only

**Request Body**:
```json
{
  "email": "user@example.com",
  "role": "MEMBER" // or "ADMIN"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Invitation sent successfully",
  "data": {
    "id": "invitation_id",
    "teamId": "team_id",
    "role": "MEMBER",
    "status": "PENDING",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "expiresAt": "2024-01-08T00:00:00.000Z"
  }
}
```

### 2. Get User's Invitations
**GET** `/api/invitations`

**Authorization**: Authenticated user

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "invitation_id",
      "role": "MEMBER",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "team": {
        "id": "team_id",
        "name": "Team Name"
      },
      "inviter": {
        "id": "user_id",
        "name": "John Doe",
        "email": "john@example.com",
        "image": null
      }
    }
  ]
}
```

### 3. Accept/Reject Invitation
**POST** `/api/invitations/[invitationId]`

**Authorization**: Invitation recipient only

**Request Body**:
```json
{
  "action": "accept" // or "reject"
}
```

**Response (Accept)**:
```json
{
  "success": true,
  "message": "You have joined \"Team Name\"",
  "data": {
    "invitation": { ... },
    "teamMember": { ... }
  }
}
```

**Response (Reject)**:
```json
{
  "success": true,
  "message": "Invitation rejected",
  "data": { ... }
}
```

### 4. Get Notifications
**GET** `/api/notifications`

**Query Parameters**:
- `unreadOnly=true` (optional): Only return unread notifications

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "notification_id",
      "type": "TEAM_INVITATION",
      "title": "Team Invitation",
      "message": "John Doe invited you to join \"Team Name\"",
      "read": false,
      "data": {
        "invitationId": "invitation_id",
        "teamId": "team_id",
        "teamName": "Team Name",
        "inviterName": "John Doe",
        "role": "MEMBER"
      },
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "unreadCount": 5
}
```

### 5. Mark Notifications as Read
**PATCH** `/api/notifications`

**Request Body (Specific notifications)**:
```json
{
  "notificationIds": ["id1", "id2", "id3"]
}
```

**Request Body (All notifications)**:
```json
{
  "markAllAsRead": true
}
```

**Response**:
```json
{
  "success": true,
  "message": "Notifications marked as read"
}
```

## Components

### InvitationsList
Displays pending invitations with accept/reject buttons.

**Location**: `src/components/invitations/InvitationsList.tsx`

**Usage**:
```tsx
import InvitationsList from '@/components/invitations/InvitationsList';

<InvitationsList />
```

### NotificationBell
Notification icon with badge and dropdown menu.

**Location**: `src/components/notifications/NotificationBell.tsx`

**Usage**:
```tsx
import NotificationBell from '@/components/notifications/NotificationBell';

// In your header/navbar
<NotificationBell />
```

**Features**:
- Badge showing unread count
- Dropdown menu with recent notifications
- Click notification to navigate to relevant page
- Mark all as read button
- Auto-refresh every 30 seconds

## Pages

### Invitations Page
**Route**: `/invitations`

**Location**: `src/app/(dashboard)/invitations/page.tsx`

Displays all pending invitations for the current user with accept/reject actions.

## Installation & Setup

### 1. Update Database Schema

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Or create a migration
npx prisma migrate dev --name add_invitation_system
```

### 2. Add NotificationBell to Layout

Update your dashboard layout to include the notification bell:

```tsx
// src/app/(dashboard)/layout.tsx
import NotificationBell from '@/components/notifications/NotificationBell';

// In your header/navbar
<NotificationBell />
```

### 3. Update Team Invite UI

Update your team management page to show the new invitation flow:

```tsx
// After sending invitation
const response = await fetch(`/api/teams/${teamId}/invite`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, role })
});

if (response.ok) {
  // Show success message
  alert('Invitation sent! The user will receive a notification.');
}
```

## User Flow

### Admin Inviting a User

1. Admin navigates to team settings
2. Enters user's email and selects role
3. Clicks "Send Invitation"
4. System creates invitation and notification
5. Admin sees success message: "Invitation sent successfully"

### User Receiving Invitation

1. User receives notification (bell icon shows badge)
2. User clicks notification bell
3. Sees "Team Invitation" notification
4. Clicks notification → redirected to `/invitations` page
5. Sees invitation details with Accept/Reject buttons
6. User clicks "Accept" or "Decline"
7. If accepted: User is added to team and redirected
8. If rejected: Invitation is marked as rejected

## Error Handling

### Common Errors

**User not found**:
```json
{
  "error": "User with this email does not exist",
  "status": 404
}
```

**Already a member**:
```json
{
  "error": "User is already a member of this team",
  "status": 400
}
```

**Pending invitation exists**:
```json
{
  "error": "User already has a pending invitation to this team",
  "status": 400
}
```

**Invitation expired**:
```json
{
  "error": "Invitation has expired",
  "status": 400
}
```

**Not authorized**:
```json
{
  "error": "Forbidden: Only team admins can invite members",
  "status": 403
}
```

## Future Enhancements

### Potential Features
- [ ] Email notifications (send actual emails)
- [ ] WebSocket support for real-time notifications
- [ ] Invitation links (invite via URL)
- [ ] Bulk invitations
- [ ] Custom invitation messages
- [ ] Invitation templates
- [ ] Notification preferences
- [ ] Push notifications (PWA)

## Testing

### Manual Testing Checklist

- [ ] Admin can send invitation
- [ ] User receives notification
- [ ] Notification bell shows correct count
- [ ] User can view invitations page
- [ ] User can accept invitation
- [ ] User is added to team after accepting
- [ ] User can reject invitation
- [ ] Invitation status updates correctly
- [ ] Cannot accept expired invitation
- [ ] Cannot accept someone else's invitation
- [ ] Duplicate invitations are prevented
- [ ] Mark as read works for single notification
- [ ] Mark all as read works
- [ ] Notifications auto-refresh

## Troubleshooting

### Notifications not appearing
1. Check database connection
2. Verify user is authenticated
3. Check browser console for errors
4. Verify API endpoints are accessible

### Invitations not working
1. Verify Prisma schema is up to date
2. Check database migrations
3. Verify user has correct permissions
4. Check API route logs

### Badge count incorrect
1. Refresh the page
2. Check notification read status in database
3. Verify API response includes unreadCount

## Support

For issues or questions:
1. Check the migration guide: `INVITATION_SYSTEM_MIGRATION.md`
2. Review API documentation above
3. Check component source code for implementation details
