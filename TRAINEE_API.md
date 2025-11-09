# MoveOn Trainee API Documentation

Complete API documentation for Trainee endpoints in the MoveOn fitness application.

## 📋 Table of Contents

1. [Base URL](#base-url)
2. [Authentication](#authentication)
3. [Endpoints](#endpoints)
   - [Profile Management](#profile-management)
   - [Task Assignments](#task-assignments)
   - [Progress Tracking](#progress-tracking)
4. [Response Format](#response-format)
5. [Error Handling](#error-handling)

---

## Base URL

```
http://localhost:5000/api/trainee
```

## Authentication

All requests require JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

Token is obtained during login and stored in `localStorage` as `token`.

---

## Endpoints

### Profile Management

#### GET /profile

Retrieve current trainee's profile information.

**Request:**
```bash
GET /api/trainee/profile
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Profile retrieved",
  "data": {
    "id": 2,
    "name": "Budi Santoso",
    "email": "budi@trainee.com",
    "role": "trainee",
    "avatar": null,
    "status": "active",
    "bio": "Fitness enthusiast",
    "phone": "+628123456789",
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  }
}
```

#### PUT /profile

Update trainee's profile information.

**Request:**
```bash
PUT /api/trainee/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Budi Santoso",
  "bio": "Updated bio",
  "phone": "+6287654321098"
}
```

**Parameters:**
- `name` (string, optional): Updated name
- `bio` (string, optional): Updated bio (max 500 chars)
- `phone` (string, optional): Updated phone number

**Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": 2,
    "name": "Budi Santoso",
    "email": "budi@trainee.com",
    "role": "trainee",
    "bio": "Updated bio",
    "phone": "+6287654321098",
    "updated_at": "2024-01-15T14:20:00Z"
  }
}
```

---

### Task Assignments

#### GET /assignments

Get all task assignments for the current trainee.

**Request:**
```bash
GET /api/trainee/assignments
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "task_id": 5,
      "task_title": "Upper Body Strength",
      "task_description": "Complete upper body workout",
      "task_exercises": [
        {"name": "Push-ups", "reps": 15},
        {"name": "Pull-ups", "reps": 10}
      ],
      "difficulty": "Intermediate",
      "duration": 60,
      "due_date": "2024-01-25",
      "status": "assigned",
      "assigned_date": "2024-01-15T10:00:00Z",
      "started_date": null,
      "completed_date": null,
      "notes": null,
      "calories_burned": 0,
      "duration_actual": 0,
      "rating": 0
    }
  ],
  "count": 1
}
```

#### PUT /assignment/:assignmentId

Update task assignment status (mark as started, completed, skipped, etc).

**Request:**
```bash
PUT /api/trainee/assignment/1
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "in_progress",
  "notes": "Started the workout"
}
```

**Parameters:**
- `status` (string, required): One of `assigned`, `in_progress`, `completed`, `skipped`
- `notes` (string, optional): Additional notes about the task

**Response:**
```json
{
  "success": true,
  "message": "Assignment status updated",
  "data": {
    "id": 1,
    "task_id": 5,
    "status": "in_progress",
    "started_date": "2024-01-15T14:30:00Z",
    "notes": "Started the workout"
  }
}
```

#### POST /assignment/:assignmentId/submit

Submit task completion with performance data.

**Request:**
```bash
POST /api/trainee/assignment/1/submit
Authorization: Bearer <token>
Content-Type: application/json

{
  "duration_actual": 45,
  "calories_burned": 350,
  "rating": 4.5,
  "notes": "Great workout! Felt strong"
}
```

**Parameters:**
- `duration_actual` (number, optional): Actual duration in minutes
- `calories_burned` (number, optional): Calories burned
- `rating` (number, optional): User rating 0-5
- `notes` (string, optional): Completion notes

**Response:**
```json
{
  "success": true,
  "message": "Task submission received",
  "data": {
    "assignmentId": 1,
    "submitted": true
  }
}
```

---

### Progress Tracking

#### GET /progress

Get trainee's progress statistics and weekly activity.

**Request:**
```bash
GET /api/trainee/progress
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Progress data retrieved",
  "data": {
    "totalTasks": 10,
    "completedTasks": 6,
    "inProgressTasks": 2,
    "totalDuration": 450,
    "totalCalories": 2800,
    "streak": 5,
    "avgDuration": 75,
    "avgCalories": 467,
    "weeklyActivities": [
      { "day": "Mon", "tasks": 1, "duration": 60, "calories": 450 },
      { "day": "Tue", "tasks": 1, "duration": 45, "calories": 350 },
      { "day": "Wed", "tasks": 0, "duration": 0, "calories": 0 },
      { "day": "Thu", "tasks": 1, "duration": 60, "calories": 400 },
      { "day": "Fri", "tasks": 1, "duration": 75, "calories": 550 },
      { "day": "Sat", "tasks": 1, "duration": 90, "calories": 650 },
      { "day": "Sun", "tasks": 1, "duration": 60, "calories": 400 }
    ]
  }
}
```

**Response Fields:**
- `totalTasks`: Total number of assigned tasks
- `completedTasks`: Number of completed tasks
- `inProgressTasks`: Number of in-progress tasks
- `totalDuration`: Total workout duration (minutes)
- `totalCalories`: Total calories burned
- `streak`: Current streak (consecutive completion days)
- `avgDuration`: Average duration per task (minutes)
- `avgCalories`: Average calories per task
- `weeklyActivities`: Weekly breakdown of activity

---

## Response Format

### Success Response

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error description",
  "error": "ERROR_CODE",
  "status": 400
}
```

---

## Error Handling

### Common HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | OK - Request successful |
| 201 | Created - Resource created |
| 400 | Bad Request - Invalid parameters |
| 401 | Unauthorized - Token missing/invalid |
| 403 | Forbidden - Access denied |
| 404 | Not Found - Resource not found |
| 500 | Internal Server Error |

### Common Error Codes

| Error Code | Description |
|------------|-------------|
| UNAUTHORIZED | Token missing or invalid |
| NOT_FOUND | Resource not found |
| VALIDATION_ERROR | Invalid request parameters |
| UPDATE_FAILED | Failed to update resource |
| DUPLICATE_EMAIL | Email already registered |

---

## Example Usage

### JavaScript/Fetch

```javascript
// Get trainee profile
const response = await fetch('http://localhost:5000/api/trainee/profile', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});

const data = await response.json();
console.log(data);
```

### Axios

```javascript
import api from '@/services/api';

// Get assignments
const assignments = await api.get('/trainee/assignments');
console.log(assignments.data);

// Update profile
const updated = await api.put('/trainee/profile', {
  name: 'New Name',
  bio: 'New bio'
});
console.log(updated.data);
```

---

## Testing the Endpoints

### Using cURL

```bash
# Get profile
curl -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:5000/api/trainee/profile

# Update profile
curl -X PUT \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"name":"New Name","bio":"New bio"}' \
     http://localhost:5000/api/trainee/profile

# Get assignments
curl -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:5000/api/trainee/assignments

# Get progress
curl -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:5000/api/trainee/progress
```

---

## Integration with Frontend

The frontend automatically handles all trainee API calls through the `api.js` service:

1. **TraineeDashboard.jsx** → calls `GET /trainee/assignments`
2. **TraineeTasks.jsx** → calls `GET /trainee/assignments`
3. **TraineeProgress.jsx** → calls `GET /trainee/progress`
4. **TraineeProfile.jsx** → calls `GET /trainee/profile` and `PUT /trainee/profile`

All endpoints require JWT authentication which is automatically added via axios interceptors.

---

## Database Schema

### task_assignments table
```sql
CREATE TABLE task_assignments (
  id SERIAL PRIMARY KEY,
  task_id INTEGER NOT NULL,
  trainee_id INTEGER NOT NULL,
  coach_id INTEGER NOT NULL,
  status VARCHAR(20) DEFAULT 'assigned',
  assigned_date TIMESTAMP,
  started_date TIMESTAMP,
  completed_date TIMESTAMP,
  notes TEXT
);
```

### trainee_submissions table
```sql
CREATE TABLE trainee_submissions (
  id SERIAL PRIMARY KEY,
  assignment_id INTEGER NOT NULL,
  trainee_id INTEGER NOT NULL,
  duration_actual INTEGER,
  calories_burned INTEGER,
  rating FLOAT,
  notes TEXT,
  submitted_at TIMESTAMP
);
```

---

**Last Updated:** January 2024
