# Testing Checklist - Team Task-Hub

Use this checklist to verify all features are working correctly.

## 🚀 Initial Setup

- [ ] Dependencies installed (`npm install`)
- [ ] `.env` file created with correct values
- [ ] Database connection successful
- [ ] Schema pushed to database (`npm run db:push`)
- [ ] Seed data loaded (`npm run db:seed`)
- [ ] Development server starts (`npm run dev`)
- [ ] Application loads at http://localhost:3000

## 🔐 Authentication Tests

### Sign Up
- [ ] Navigate to sign up page
- [ ] Form validation works (empty fields, short password)
- [ ] Can create new account with valid data
- [ ] Duplicate email shows error
- [ ] Auto-redirects after successful signup
- [ ] New user appears in database

### Sign In
- [ ] Navigate to sign in page
- [ ] Can sign in with demo account (alice@example.com / password123)
- [ ] Invalid credentials show error
- [ ] Successful login redirects to dashboard
- [ ] Session persists on page refresh

### Sign Out
- [ ] Sign out button in user menu works
- [ ] Redirects to sign in page
- [ ] Session is cleared
- [ ] Cannot access protected routes after signout

## 👥 Team Management Tests

### View Teams
- [ ] Sidebar shows user's teams
- [ ] Team member count displays correctly
- [ ] Can expand/collapse team sections

### Create Team
- [ ] "Create Team" button visible in sidebar
- [ ] Can navigate to create team page
- [ ] Form validation works
- [ ] Can create team with valid name
- [ ] Creator is automatically admin
- [ ] New team appears in sidebar
- [ ] Redirects to team dashboard

### Team Dashboard
- [ ] Team name displays correctly
- [ ] Member count is accurate
- [ ] Board count is accurate
- [ ] Member list shows all team members
- [ ] Admin badge shows for admins
- [ ] User avatars display (or initials)

### Invite Members (Admin Only)
- [ ] "Invite Member" button visible for admins
- [ ] Button hidden for non-admin members
- [ ] Can open invite dialog
- [ ] Form validation works (email format)
- [ ] Can invite existing user by email
- [ ] Error shown for non-existent email
- [ ] Error shown for already-member email
- [ ] Invited member appears in team list
- [ ] Invited member can see team in their sidebar

## 📋 Board Management Tests

### View Boards
- [ ] Team dashboard shows all boards
- [ ] Board cards display correctly
- [ ] Task count shows on each board
- [ ] Can click board to open

### Create Board (Admin Only)
- [ ] "Create Board" button visible for admins
- [ ] Button hidden for non-admin members
- [ ] Can open create board dialog
- [ ] Form validation works
- [ ] Can create board with valid name
- [ ] New board appears on dashboard
- [ ] Can navigate to new board

### Board View
- [ ] Board name displays correctly
- [ ] Team name shows below board name
- [ ] Three columns visible (To Do, In Progress, Done)
- [ ] Task count shows in each column header
- [ ] Existing tasks display in correct columns
- [ ] Empty columns show "No tasks" message

### Delete Board (Admin Only)
- [ ] Admin can delete boards
- [ ] Non-admin cannot delete boards
- [ ] Confirmation required
- [ ] Board removed from dashboard
- [ ] Tasks deleted with board

## ✅ Task Management Tests

### Create Task
- [ ] "+" button visible in each column
- [ ] Can open create task dialog
- [ ] Form has all fields (title, description, status, assignee, due date)
- [ ] Title is required
- [ ] Can select status
- [ ] Can select assignee from team members
- [ ] Can select due date
- [ ] Can create task with minimal data (title only)
- [ ] Can create task with all fields filled
- [ ] New task appears in correct column
- [ ] Task count updates

### View Task
- [ ] Task card shows title
- [ ] Task card shows description (truncated)
- [ ] Task card shows assignee avatar/name
- [ ] Task card shows due date if set
- [ ] Unassigned tasks show "Unassigned"
- [ ] Can click task to open edit dialog

### Edit Task
- [ ] Clicking task opens edit dialog
- [ ] Form pre-filled with task data
- [ ] Can update title
- [ ] Can update description
- [ ] Can change status
- [ ] Can change assignee
- [ ] Can change due date
- [ ] Can remove assignee (set to unassigned)
- [ ] Can remove due date
- [ ] Changes save correctly
- [ ] Task updates in UI immediately

### Move Task
- [ ] Can open task menu (⋮)
- [ ] "Move to" options available
- [ ] Can move task to different column
- [ ] Task disappears from old column
- [ ] Task appears in new column
- [ ] Task counts update

### Delete Task
- [ ] Delete option in task menu
- [ ] Confirmation dialog appears
- [ ] Can cancel deletion
- [ ] Can confirm deletion
- [ ] Task removed from board
- [ ] Task count updates

### Task Assignment
- [ ] Can assign task to any team member
- [ ] Assignee avatar shows correctly
- [ ] Can change assignee
- [ ] Can unassign task
- [ ] Multiple tasks can be assigned to same user

### Due Dates
- [ ] Can set due date
- [ ] Date displays in readable format
- [ ] Can change due date
- [ ] Can remove due date
- [ ] Past due dates visible (no special styling yet)

## 👤 Profile Tests

### View Profile
- [ ] Can navigate to profile page
- [ ] User name displays
- [ ] Email displays
- [ ] Avatar/initials show correctly

### Update Profile
- [ ] Can change name
- [ ] Can change email
- [ ] Email validation works
- [ ] Duplicate email shows error
- [ ] Changes save successfully
- [ ] Success message appears
- [ ] Name updates in UI (app bar, etc.)

### Change Password
- [ ] Current password field works
- [ ] New password field works
- [ ] Confirm password field works
- [ ] Password mismatch shows error
- [ ] Incorrect current password shows error
- [ ] Valid password change succeeds
- [ ] Can sign in with new password
- [ ] Can leave password fields blank (no change)

## 🎨 UI/UX Tests

### Theme Toggle
- [ ] Theme toggle button visible in app bar
- [ ] Clicking toggles between light/dark
- [ ] Theme persists on page refresh
- [ ] All components render correctly in both themes
- [ ] No flash of wrong theme on load

### Responsive Design
- [ ] Desktop view (>960px): Sidebar always visible
- [ ] Tablet view (600-960px): Sidebar toggles
- [ ] Mobile view (<600px): Sidebar toggles, hamburger menu
- [ ] Board columns stack on mobile
- [ ] All dialogs work on mobile
- [ ] Touch interactions work

### Navigation
- [ ] Sidebar navigation works
- [ ] Breadcrumbs/back navigation works
- [ ] Browser back button works
- [ ] Direct URL access works (with auth check)
- [ ] 404 handling for invalid routes

### Loading States
- [ ] Loading spinner shows while fetching data
- [ ] Buttons show loading state during actions
- [ ] No content flash before data loads

### Error Handling
- [ ] API errors show user-friendly messages
- [ ] Network errors handled gracefully
- [ ] Invalid data shows validation errors
- [ ] 404 pages for missing resources

## 🔒 Security Tests

### Authorization
- [ ] Non-members cannot access team pages
- [ ] Non-members cannot access boards
- [ ] Members cannot perform admin actions
- [ ] API routes check permissions
- [ ] Direct API calls require authentication

### Route Protection
- [ ] Unauthenticated users redirected to signin
- [ ] Protected routes require login
- [ ] Auth routes redirect if already logged in

### Data Validation
- [ ] Server-side validation on all API routes
- [ ] Client-side validation on forms
- [ ] SQL injection prevented (Prisma)
- [ ] XSS prevented (React escaping)

## 📊 Data Integrity Tests

### Cascade Deletes
- [ ] Deleting team deletes team members
- [ ] Deleting team deletes boards
- [ ] Deleting board deletes tasks
- [ ] User deletion handled correctly

### Relationships
- [ ] Tasks link to correct board
- [ ] Tasks link to correct assignee
- [ ] Boards link to correct team
- [ ] Team members link to correct users

### Constraints
- [ ] Cannot create duplicate team membership
- [ ] Cannot assign task to non-team member
- [ ] Email uniqueness enforced

## 🌐 Browser Compatibility

- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

## ⚡ Performance Tests

### Page Load
- [ ] Initial page load < 3 seconds
- [ ] Subsequent navigation instant
- [ ] Images load efficiently
- [ ] No layout shift

### API Response
- [ ] API calls respond quickly (< 500ms)
- [ ] Large task lists load efficiently
- [ ] Database queries optimized

### User Experience
- [ ] No lag when typing
- [ ] Smooth animations
- [ ] Responsive interactions
- [ ] No memory leaks (check DevTools)

## 🐛 Edge Cases

### Empty States
- [ ] New user with no teams
- [ ] Team with no boards
- [ ] Board with no tasks
- [ ] Column with no tasks
- [ ] Unassigned tasks

### Boundary Cases
- [ ] Very long task titles
- [ ] Very long descriptions
- [ ] Many tasks in one column
- [ ] Many team members
- [ ] Many boards

### Error Scenarios
- [ ] Database connection lost
- [ ] Invalid session
- [ ] Concurrent edits
- [ ] Network timeout

## 📝 Demo Data Verification

After seeding, verify:

- [ ] 3 users exist (Alice, Bob, Charlie)
- [ ] 2 teams exist (Development, Marketing)
- [ ] 3 boards exist
- [ ] 13 tasks exist across boards
- [ ] Tasks have various statuses
- [ ] Some tasks have assignees
- [ ] Some tasks have due dates
- [ ] Can sign in as any demo user

## ✅ Final Checks

- [ ] No console errors in browser
- [ ] No TypeScript errors in code
- [ ] All environment variables set
- [ ] Database schema matches code
- [ ] README instructions accurate
- [ ] All features documented
- [ ] Code is commented
- [ ] Git repository clean

## 🎯 Acceptance Criteria

### Must Have (All ✓)
- [x] User authentication working
- [x] Team creation and management
- [x] Board creation and viewing
- [x] Task CRUD operations
- [x] Role-based permissions
- [x] Responsive UI
- [x] Theme toggle
- [x] Profile management

### Nice to Have (Future)
- [ ] Real-time updates
- [ ] Task comments
- [ ] File attachments
- [ ] Email notifications
- [ ] Advanced search
- [ ] Task labels

## 📊 Test Results Template

```
Date: ___________
Tester: ___________
Environment: Development / Production

Authentication: ✓ / ✗
Team Management: ✓ / ✗
Board Management: ✓ / ✗
Task Management: ✓ / ✗
Profile: ✓ / ✗
UI/UX: ✓ / ✗
Security: ✓ / ✗

Issues Found:
1. ___________
2. ___________

Overall Status: PASS / FAIL
```

## 🚀 Ready for Demo?

If all critical tests pass:
- ✅ Application is ready for demonstration
- ✅ Can be deployed to production
- ✅ Can be shared with stakeholders
- ✅ Can be used for real work

---

**Happy Testing! 🧪**
