# Invitations Troubleshooting Guide

## ✅ Issues Fixed

### 1. **Invitations Page Not Accessible**
**Problem:** Page was in wrong directory structure  
**Solution:** Moved from `(dashboard)` to `(protected)` directory  
**Status:** ✅ Fixed

### 2. **No Navigation Link to Invitations**
**Problem:** No way to access invitations page from UI  
**Solution:** Added "Invitations" link to sidebar navigation  
**Status:** ✅ Fixed

### 3. **No Notification Bell**
**Problem:** Users couldn't see notification count  
**Solution:** Added NotificationBell component to AppLayout header  
**Status:** ✅ Fixed

---

## 🎯 How to Access Invitations

### Method 1: Sidebar Navigation
1. Look at the left sidebar
2. Click on **"Invitations"** (mail icon)
3. You'll see all pending invitations

### Method 2: Notification Bell
1. Look at the top-right header
2. Click the **bell icon** (🔔)
3. Click on any invitation notification
4. You'll be redirected to invitations page

### Method 3: Direct URL
Navigate to: `http://localhost:3000/invitations`

---

## 📋 Testing Checklist

### Step 1: Create Test Users
You need at least 2 users to test invitations:

**User A (Admin):**
- Email: `admin@test.com`
- Will send the invitation

**User B (Member):**
- Email: `member@test.com`
- Will receive the invitation

### Step 2: Create a Team (as User A)
1. Log in as `admin@test.com`
2. Click "Create Team"
3. Enter team name: "Test Team"
4. Click "Create"

### Step 3: Send Invitation (as User A)
1. Go to the team page
2. Look for "Invite Member" button
3. Enter email: `member@test.com`
4. Select role: "MEMBER"
5. Click "Send Invitation"
6. ✅ Should see: "Invitation sent successfully"

### Step 4: View Invitation (as User B)
1. Log out from User A
2. Log in as `member@test.com`
3. **Option 1:** Click "Invitations" in sidebar
4. **Option 2:** Click notification bell (should show badge)
5. ✅ Should see the pending invitation

### Step 5: Accept Invitation (as User B)
1. On invitations page, click "Accept"
2. ✅ Should see: "You have joined 'Test Team'"
3. ✅ Page should refresh
4. ✅ Team should now appear in sidebar

---

## 🔍 Common Issues & Solutions

### Issue: "No invitations found"

**Possible Causes:**
1. No invitations have been sent yet
2. All invitations have been accepted/rejected
3. Logged in as wrong user

**Solution:**
- Make sure you're logged in as the user who was invited
- Check if invitation was actually sent (check as admin)
- Try sending a new invitation

### Issue: "Notification bell not showing"

**Possible Causes:**
1. Dev server not restarted after adding NotificationBell
2. Component import error

**Solution:**
```bash
# Restart dev server
# Press Ctrl+C to stop
npm run dev
```

### Issue: "Internal Server Error when inviting"

**Possible Causes:**
1. Database not migrated
2. Prisma client not regenerated

**Solution:**
```bash
npx prisma generate
npx prisma db push
# Then restart dev server
```

### Issue: "User not found when inviting"

**Possible Causes:**
1. Email doesn't exist in database
2. Typo in email address

**Solution:**
- Make sure the user has signed up first
- Check exact email in database
- Email is case-sensitive

---

## 🧪 Quick Test Script

Run this to check your setup:

```bash
node check-invitations.js
```

This will show:
- All invitations in database
- All users in database
- All notifications in database

---

## 📊 Expected UI Elements

### Sidebar (Left)
```
┌─────────────────────┐
│ Create Team         │
├─────────────────────┤
│ 📧 Invitations      │ ← NEW!
├─────────────────────┤
│ 👥 Team 1           │
│   └ Dashboard       │
│   └ New Board       │
└─────────────────────┘
```

### Header (Top Right)
```
┌──────────────────────────────┐
│  🌙  🔔(2)  👤              │
│      ↑                       │
│   Notification Bell (NEW!)   │
└──────────────────────────────┘
```

### Invitations Page
```
┌─────────────────────────────────────┐
│ Team Invitations                    │
│ Review and respond to invitations   │
├─────────────────────────────────────┤
│ 👤 Test Team                        │
│    John Doe invited you as MEMBER   │
│    Jan 1, 2024                      │
│    [Accept] [Decline]               │
└─────────────────────────────────────┘
```

---

## 🔧 Manual Verification

### 1. Check Files Exist
```bash
# Invitations page
ls src/app/(protected)/invitations/page.tsx

# API routes
ls src/app/api/invitations/route.ts
ls src/app/api/invitations/[invitationId]/route.ts
ls src/app/api/notifications/route.ts

# Components
ls src/components/invitations/InvitationsList.tsx
ls src/components/notifications/NotificationBell.tsx
```

### 2. Check Database Tables
```bash
npx prisma studio
# Look for:
# - team_invitations table
# - notifications table
```

### 3. Check API Endpoints
```bash
# Get invitations (must be logged in)
curl http://localhost:3000/api/invitations

# Get notifications (must be logged in)
curl http://localhost:3000/api/notifications
```

---

## 🎯 Success Criteria

You'll know everything is working when:

- ✅ "Invitations" link appears in sidebar
- ✅ Notification bell appears in header
- ✅ Can navigate to `/invitations` page
- ✅ Can send invitation as admin
- ✅ Invited user sees notification
- ✅ Invited user can accept/reject
- ✅ After accepting, user joins team

---

## 📞 Still Having Issues?

1. **Check browser console** for JavaScript errors
2. **Check server logs** for API errors
3. **Verify database connection** is working
4. **Restart dev server** completely
5. **Clear browser cache** and reload

---

## 🚀 Next Steps After Testing

Once invitations are working:

1. **Customize styling** to match your theme
2. **Add email notifications** (optional)
3. **Add invitation expiration warnings**
4. **Add bulk invitation feature**
5. **Add invitation history page**

---

## 📝 Quick Reference

**Invitations Page:** `/invitations`  
**API Endpoints:**
- `GET /api/invitations` - Get user's invitations
- `POST /api/invitations/[id]` - Accept/reject
- `GET /api/notifications` - Get notifications
- `POST /api/teams/[id]/invite` - Send invitation

**Components:**
- `<InvitationsList />` - Display invitations
- `<NotificationBell />` - Notification icon

**Database Tables:**
- `team_invitations` - Stores invitations
- `notifications` - Stores notifications
