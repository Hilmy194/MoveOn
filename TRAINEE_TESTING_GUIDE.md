# 🧪 Trainee System Testing Guide

Complete testing guide for the MoveOn Trainee Dashboard System

## 📋 Overview

This guide covers testing all trainee features:
- ✅ Registration as trainee
- ✅ Auto-redirect to trainee dashboard
- ✅ Dashboard with KPI cards
- ✅ Tasks page with filtering
- ✅ Progress page with charts
- ✅ Profile management

---

## Prerequisites

### Backend Requirements
- PostgreSQL running on `localhost:5432`
- Database: `moveon`
- Backend server running on `http://localhost:5000`

### Frontend Requirements
- Node.js packages installed: `npm install`
- Frontend server running on `http://localhost:5173` (Vite)

### Sample Data
The database should have:
- 1 Coach user (already in init.sql)
- 2+ Trainee users (register new ones during testing)

---

## 🚀 Step-by-Step Testing

### Step 1: Start the Backend

```bash
cd Backend
npm install
npm start
```

Expected output:
```
🗄️  PostgreSQL connected successfully
╔════════════════════════════════════════╗
║   🚀 MoveOn Backend Server Running   ║
╚════════════════════════════════════════╝
📡 Server:        http://localhost:5000
🌍 Environment:   development
🗄️  Database:      PostgreSQL
```

### Step 2: Start the Frontend

```bash
cd Frontend
npm install
npm run dev
```

Expected output:
```
VITE v7.1.7  ready in 123 ms

➜  Local:   http://localhost:5173/
➜  press h to show help
```

### Step 3: Test Registration as Trainee

1. Open browser to `http://localhost:5173`
2. Click "Register" button
3. Fill in form:
   - Name: `Test Trainee`
   - Email: `test@trainee.com`
   - Password: `password123`
   - **Role: Select "Trainee"** ⚠️ IMPORTANT
4. Click "Register"

**Expected Result:**
- ✅ No emoji avatar picker shown
- ✅ Redirect to `/trainee/dashboard` (NOT `/coach/dashboard`)
- ✅ Navbar shows trainee navigation items
- ✅ No white screen

---

### Step 4: Test Dashboard Page

Navigate to `http://localhost:5173/trainee/dashboard`

**Check these elements:**

#### 📊 KPI Cards (5 cards)
- [ ] "Total Tasks" card with count (📋)
- [ ] "Completed" card with count (✅)
- [ ] "In Progress" card with count (⏳)
- [ ] "Total Hours" card with value (⏱️)
- [ ] "Completion %" card with percentage (🔥)

**Expected:** All show 0 values initially (no tasks assigned yet)

#### 📈 Overall Progress Bar
- [ ] Shows "0% Complete"
- [ ] Blue progress bar is empty
- [ ] Text below showing percentage

#### 📝 Active Tasks Section
- [ ] Shows "No tasks assigned yet" message initially
- [ ] After assigning tasks via coach, shows task list

#### ⚡ Quick Actions
- [ ] 3 buttons visible: "View Tasks", "View Progress", "Edit Profile"
- [ ] Buttons are clickable (test clicking them)

---

### Step 5: Test Tasks Page

Navigate to `http://localhost:5173/trainee/tasks`

**Check these elements:**

#### 🏷️ Filter Buttons (5 filters)
- [ ] "All" button (primary/active state)
- [ ] "Assigned" button with badge (📌)
- [ ] "In Progress" button with badge (⏳)
- [ ] "Completed" button with badge (✅)
- [ ] "Skipped" button with badge (⏭️)

#### 📋 Task Cards
- [ ] Shows "No tasks" message initially
- [ ] Each card shows: title, description, difficulty, duration, due date
- [ ] Color-coded status badges
- [ ] "Start Task" button on each card

#### 🔄 Filtering
- [ ] Click each filter, observe card count changes
- [ ] Click "Completed" shows 0 tasks (none completed yet)
- [ ] Click "All" shows all tasks

---

### Step 6: Test Progress Page

Navigate to `http://localhost:5173/trainee/progress`

**Check these elements:**

#### 📊 Stats Cards (4 cards)
- [ ] "Completion Rate" showing 0% initially
- [ ] "Current Streak" showing 0 days initially
- [ ] "Total Duration" showing 0 hours
- [ ] "Calories Burned" showing 0 calories

#### 📈 Weekly Activity Charts (3 charts)
- [ ] **Tasks Completed** chart with yellow bars
  - [ ] X-axis shows days (Mon-Sun)
  - [ ] Y-axis shows task count
  - [ ] Bars respond to data
  
- [ ] **Training Time** chart with blue bars
  - [ ] Shows duration in minutes
  - [ ] Responsive bars
  
- [ ] **Calories Burned** chart with green bars
  - [ ] Shows calorie values
  - [ ] Responsive bars

#### 🏆 Achievement Badges
- [ ] Shows "25% Complete", "Hot Streak", "Dedicated" badges
- [ ] Initially grayed out (no achievements unlocked)

---

### Step 7: Test Profile Page

Navigate to `http://localhost:5173/trainee/profile`

**Check these elements:**

#### 👤 Profile Header
- [ ] Shows user name
- [ ] Shows role "trainee"
- [ ] Shows joined date (e.g., "Jan 15, 2024")

#### ℹ️ User Info Display
- [ ] Email displayed (read-only)
- [ ] Status shows "Active"
- [ ] "Member Since" date displayed

#### ✏️ Edit Form
- [ ] **Name field** is editable (text input)
- [ ] **Bio field** is editable (textarea)
  - [ ] Character counter shows "0/500"
  - [ ] Counter updates as you type
  
- [ ] **Phone field** is editable (text input)
- [ ] **Email field** is read-only (grayed out)

#### ✅ Test Profile Update
1. Change name to "Updated Name"
2. Add bio "This is my bio"
3. Enter phone "+628123456789"
4. Click "Save Changes"

**Expected Result:**
- ✅ Success message appears: "Profile updated successfully!"
- ✅ Form resets with new values
- ✅ No errors in browser console

#### 🚪 Logout Button
- [ ] "Logout" button visible and clickable
- [ ] Clicking redirects to login page
- [ ] Token removed from localStorage

#### ⚠️ Danger Zone
- [ ] "Delete Account" button visible (grayed out for now)
- [ ] Warning text displayed

---

### Step 8: Test Navigation Between Pages

From any trainee page, test navbar navigation:

1. From Dashboard:
   - [ ] Click "Dashboard" → stay on dashboard ✓
   - [ ] Click "Tasks" → redirect to tasks page ✓
   - [ ] Click "Progress" → redirect to progress page ✓
   - [ ] Click "Profile" → redirect to profile page ✓

2. From Tasks:
   - [ ] Click "Dashboard" → redirect to dashboard ✓
   - [ ] Click "Tasks" → stay on tasks page ✓
   - [ ] Click "Profile" → redirect to profile page ✓

3. From Progress:
   - [ ] Click "Dashboard" → redirect to dashboard ✓
   - [ ] Click "Tasks" → redirect to tasks page ✓

---

### Step 9: Test API Integration

Open browser DevTools (F12) → Network tab

1. Navigate to trainee dashboard
2. Check network requests:

```
GET /api/trainee/assignments    [Should see 200 or 404 (no data yet)]
GET /api/trainee/progress        [Should see 200 or 404]
```

#### Expected Headers
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Expected Response
```json
{
  "success": true,
  "message": "Progress data retrieved",
  "data": {
    "totalTasks": 0,
    "completedTasks": 0,
    ...
  }
}
```

---

### Step 10: Test Error Handling

#### Test 1: Invalid Token
1. Open DevTools → Application → LocalStorage
2. Find `token` entry
3. Modify token (add random characters)
4. Refresh page

**Expected Result:**
- ✅ Redirect to login page
- ✅ Error message "Unauthorized"
- ✅ Token cleared from localStorage

#### Test 2: Missing Token
1. Open DevTools → Application → LocalStorage
2. Delete `token` entry
3. Refresh page

**Expected Result:**
- ✅ Redirect to login page

---

## 🐛 Common Issues & Debugging

### Issue: White screen after registration

**Solution:**
```javascript
// Check App.jsx has trainee redirect
if (user?.role === 'trainee' && !window.location.pathname.startsWith('/trainee')) {
  navigate('/trainee/dashboard')
}
```

### Issue: API returns 404 (Not Found)

**Solution:** Backend endpoints not implemented
```bash
# Check trainee routes registered in server.js
# Should have:
app.use('/api/trainee', traineeRoutes);
```

### Issue: CORS error in console

**Solution:** Backend CORS configuration
```javascript
// Check server.js CORS setup
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
}));
```

### Issue: Token not sent with request

**Solution:** Check axios interceptor in `Frontend/src/services/api.js`
```javascript
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
```

---

## 📋 Test Checklist

### Frontend Pages
- [ ] TraineeDashboard renders correctly
- [ ] TraineeTasks renders correctly
- [ ] TraineeProgress renders correctly
- [ ] TraineeProfile renders correctly

### Authentication
- [ ] Can register as trainee
- [ ] Auto-redirect works after registration
- [ ] Can logout successfully
- [ ] Token stored in localStorage
- [ ] Token sent with API requests

### Navigation
- [ ] All navbar links working
- [ ] Can navigate between pages
- [ ] Active page highlighted in navbar

### UI/UX
- [ ] No emoji in forms
- [ ] All cards display properly
- [ ] Charts render (even with 0 data)
- [ ] Buttons are clickable
- [ ] Form validation working
- [ ] Success/error messages display

### API Integration
- [ ] GET /trainee/assignments works
- [ ] GET /trainee/progress works
- [ ] PUT /trainee/profile works
- [ ] Error responses handled properly
- [ ] Loading states display correctly

### Data
- [ ] Dashboard shows real data from DB
- [ ] Profile shows actual user info
- [ ] Tasks list matches assigned tasks
- [ ] Progress calculations are correct

---

## 🔍 Additional Testing Commands

### Test API with cURL

```bash
# Register as trainee
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@trainee.com",
    "password": "password123",
    "role": "trainee"
  }'

# Get profile
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/trainee/profile

# Get assignments
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/trainee/assignments

# Get progress
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/trainee/progress
```

### Test in Browser Console

```javascript
// Check auth context
JSON.parse(localStorage.getItem('user'))

// Check token
localStorage.getItem('token')

// Make manual API call
fetch('/api/trainee/profile', {
  headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
}).then(r => r.json()).then(console.log)
```

---

## 📊 Performance Testing

### Page Load Time
- [ ] Dashboard loads in < 2 seconds
- [ ] Tasks page loads in < 2 seconds
- [ ] Progress page loads in < 2 seconds
- [ ] Profile page loads in < 2 seconds

### API Response Time
- [ ] GET /trainee/assignments < 500ms
- [ ] GET /trainee/progress < 500ms
- [ ] PUT /trainee/profile < 500ms

---

## ✅ Final Checklist

Before considering testing complete:

- [ ] All 4 pages render without errors
- [ ] All API endpoints respond correctly
- [ ] Navigation works between all pages
- [ ] Profile can be edited and saved
- [ ] Logout works properly
- [ ] No console errors
- [ ] No white screens
- [ ] Responsive design works (test on mobile)
- [ ] Dark theme applies correctly
- [ ] Tailwind styling looks good

---

**Last Updated:** January 2024
**Version:** 1.0.0
