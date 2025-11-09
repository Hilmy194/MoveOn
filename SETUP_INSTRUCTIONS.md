# 🚀 MoveOn - Setup & Integration Instructions

**Status:** ✅ Ready for Setup  
**Date:** 29 Oktober 2024

---

## 📋 Quick Setup Guide

### **Prerequisites:**
- ✅ Node.js v16+ installed
- ✅ PostgreSQL v12+ installed dan running
- ✅ Git (optional)

---

## 🔧 STEP 1: Backend Setup

### **1a. Navigate to Backend Folder**
```bash
cd Backend
```

### **1b. Update .env File**
Edit `.env` dan sesuaikan dengan PostgreSQL credentials:

```env
PORT=5000
PG_HOST=localhost
PG_PORT=5432
PG_USER=postgres
PG_PASSWORD=your_password_here  # ← Change this!
PG_DATABASE=moveon
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
JWT_EXPIRE=24h
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### **1c. Create PostgreSQL Database**
Buka PostgreSQL client (pgAdmin atau psql):

```sql
-- Create database
CREATE DATABASE moveon;

-- Connect to database
\c moveon

-- Run init script
\i database/init.sql  -- Copy paste isi file init.sql ke sini
```

Atau lewat command line:
```bash
psql -U postgres -c "CREATE DATABASE moveon;"
psql -U postgres -d moveon -f database/init.sql
```

**Verify:** Database dan tables berhasil dibuat
```sql
\dt  -- List all tables
```

### **1d. Install Dependencies**
```bash
npm install
```

**Expected packages:**
```
✅ express
✅ pg (PostgreSQL driver)
✅ bcrypt
✅ jsonwebtoken
✅ cors
✅ dotenv
✅ body-parser
✅ morgan
```

### **1e. Start Backend Server**
```bash
npm run dev
```

**Expected Output:**
```
╔════════════════════════════════════════╗
║   🚀 MoveOn Backend Server Running   ║
╚════════════════════════════════════════╝

📡 Server:        http://localhost:5000
🌍 Environment:   development
🗄️  Database:      PostgreSQL
🔑 JWT Secret:    Configured

📚 API Documentation:
   - Root:         http://localhost:5000/
   - Health:       http://localhost:5000/health
   - Auth:         http://localhost:5000/api/auth
   - Coach:        http://localhost:5000/api/coach

✅ Server is ready to accept connections
```

### **Test Backend Health:**
```bash
curl http://localhost:5000/health
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Server is healthy",
  "database": {
    "postgres": "connected"
  }
}
```

---

## 🎨 STEP 2: Frontend Setup

### **2a. Navigate to Frontend Folder (di terminal baru!)**
```bash
cd Frontend
```

### **2b. Install Dependencies**
```bash
npm install
```

**Key packages added:**
```
✅ axios (for API calls)
✅ react
✅ react-router-dom
✅ vite
```

### **2c. Verify .env.local File**
File sudah dibuat dengan content:
```env
VITE_API_URL=http://localhost:5000/api
```

Jika belum ada, buat dengan content di atas.

### **2d. Start Frontend Server**
```bash
npm run dev
```

**Expected Output:**
```
  VITE v7.1.7  ready in 324 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

---

## ✅ STEP 3: Verify Integration

### **3a. Open Browser**
Navigate to: `http://localhost:5173`

### **3b. Test Register Flow**
1. Click **"Register"** (atau go to `/register`)
2. Fill form:
   - **Name:** John Coach
   - **Email:** john.coach@test.com (baru!)
   - **Password:** password123
   - **Confirm:** password123
   - **Avatar:** 👨‍🏫 (atau pilih yg lain)
   - **Role:** Coach
3. Click **"✨ Register"**

### **Expected Success:**
```
✅ User berhasil dibuat di database
✅ Token received dan disimpan di localStorage
✅ Auto redirect ke /coach/dashboard
✅ Lihat nama Anda di navbar (Welcome, John Coach!)
```

### **3c. Check Browser Console**
Buka DevTools (F12) → Console tab → Should see:
```
✅ API Base URL: http://localhost:5000/api
✅ User registered and logged in
✅ Token added to request
✅ Response received: 201
```

### **3d. Verify Database**
Di PostgreSQL, query users table:
```sql
SELECT * FROM users;

-- Expected output:
-- id | name       | email                  | role    | status
-- ---|------------|------------------------|---------|--------
--  1 | John Coach | john.coach@test.com    | coach   | active
```

---

## 🔓 STEP 4: Test Login dengan Demo Account

### **4a. Logout (jika masih login)**
Click navbar → Logout atau refresh page

### **4b. Go to Login Page**
Navigate to: `http://localhost:5173/login`

### **4c. Use Demo Credentials**
Credentials sudah di database dari `init.sql`:
```
Email: hendra@coach.com
Password: password123
Role: Coach
```

### **Expected:**
```
✅ Login success
✅ Redirect to /coach/dashboard
✅ Data loaded dari database
```

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| **CORS Error** | Pastikan Backend running di :5000, check FRONTEND_URL di .env |
| **Cannot connect to database** | Cek PostgreSQL running, credentials di .env benar |
| **"Invalid token"** | Clear localStorage, logout, login ulang |
| **404 Not Found** | Pastikan Backend server running, check route paths |
| **"API Base URL: undefined"** | Buat/check .env.local di Frontend, content: `VITE_API_URL=http://localhost:5000/api` |
| **Password hashing error** | Pastikan bcrypt installed: `npm install bcrypt` |
| **Module not found** | Run `npm install` di folder yang error |

---

## 📝 File Structure After Setup

```
MoveOn/
├── Backend/                 (Port 5000)
│   ├── .env               ✅ Updated
│   ├── database/
│   │   └── init.sql       ✅ Database schema
│   ├── src/
│   │   ├── config/
│   │   │   └── jwt.js     ✅ JWT config
│   │   ├── controllers/
│   │   │   └── auth.controller.js  ✅ Auth logic
│   │   ├── models/
│   │   │   └── UserModel.js  ✅ User DB operations
│   │   └── routes/
│   │       └── auth.routes.js  ✅ Auth routes
│   ├── server.js          ✅ Main server
│   └── package.json       ✅ Dependencies
│
├── Frontend/              (Port 5173)
│   ├── .env.local         ✅ Created
│   ├── src/
│   │   ├── context/
│   │   │   └── AuthContext.jsx  ✅ Updated with API
│   │   ├── services/
│   │   │   └── api.js     ✅ Created - Axios config
│   │   └── pages/
│   │       ├── Login.jsx      ✅ Updated
│   │       └── Register.jsx   ✅ Updated
│   ├── package.json       ✅ Updated (axios added)
│   └── vite.config.js     ✅ Config
```

---

## 🧪 Test Endpoints dengan Postman

### **1. Register (Create Account)**
```
POST http://localhost:5000/api/auth/register

Body (JSON):
{
  "name": "Test Coach",
  "email": "test.coach@test.com",
  "password": "password123",
  "role": "coach",
  "avatar": "👨‍🏫"
}

Expected Response (201):
{
  "success": true,
  "message": "Registrasi berhasil",
  "data": {
    "id": 5,
    "name": "Test Coach",
    "email": "test.coach@test.com",
    "role": "coach",
    "avatar": "👨‍🏫",
    "status": "active"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### **2. Login**
```
POST http://localhost:5000/api/auth/login

Body (JSON):
{
  "email": "hendra@coach.com",
  "password": "password123"
}

Expected Response (200):
{
  "success": true,
  "message": "Login berhasil",
  "data": {
    "id": 1,
    "name": "Pak Hendra",
    "email": "hendra@coach.com",
    "role": "coach",
    "avatar": "👨‍🏫",
    "status": "active"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### **3. Get Current User**
```
GET http://localhost:5000/api/auth/me

Headers:
Authorization: Bearer <token_dari_login>

Expected Response (200):
{
  "success": true,
  "message": "User profile retrieved",
  "data": { ... }
}
```

---

## 🔐 Database Sample Data

Database sudah memiliki sample data dari `init.sql`:

### **Users:**
```
ID | Name         | Email              | Role    | Avatar   | Status
---|--------------|-------------------|---------|----------|--------
1  | Pak Hendra   | hendra@coach.com   | coach   | 👨‍🏫     | active
2  | Budi Santoso | budi@trainee.com   | trainee | 👨       | active
3  | Siti Nuraini | siti@trainee.com   | trainee | 👩       | active
4  | Ahmad Rizki  | ahmad@trainee.com  | trainee | 👨       | active
```

### **Workout Templates:**
- Strength Training (💪)
- Cardio Blast (🏃)
- Yoga Flow (🧘)

---

## 📊 Next Steps Setelah Setup

1. ✅ Register akun baru dan verify di database
2. ✅ Login dengan akun yang baru dibuat
3. ✅ Test logout & login ulang
4. 🔄 Update pages lainnya untuk fetch dari API:
   - CoachDashboard → GET /api/coach/:id/dashboard
   - CoachTraineesPage → GET /api/coach/:id/trainees
   - CoachTasks → GET /api/coach/:id/tasks
   - Etc...
5. 🔄 Implement "Add Trainee" feature
6. 🔄 Implement "Create Task" feature
7. 🔄 Setup real-time notifications
8. 🔄 Deploy to production

---

## 🎯 Success Indicators

✅ Backend running on port 5000  
✅ Frontend running on port 5173  
✅ PostgreSQL database connected  
✅ Register page working → User created in DB  
✅ Login page working → Token received  
✅ Redirect berdasarkan role (coach/trainee)  
✅ Console shows no errors  
✅ localStorage berisi token & user data  

---

## 🆘 Need Help?

1. **Check Backend Console** - Lihat error messages
2. **Check Frontend Console** - F12 → Console tab
3. **Check Network Tab** - Lihat request/response
4. **Check .env files** - Pastikan semua configured
5. **Check PostgreSQL** - Verify database & tables exist
6. **Restart servers** - Kill & restart npm run dev

---

## ✨ Congratulations!

Jika semua langkah berhasil, Frontend dan Backend sudah terhubung! 🎉

Sekarang Anda bisa:
- ✅ Register user baru
- ✅ Login dengan credentials
- ✅ Data tersimpan di PostgreSQL database
- ✅ Token management dengan JWT
- ✅ Role-based redirects

**Next: Update remaining pages untuk fetch data dari API** 🚀

---

**Last Updated:** 29 Oktober 2024  
**Version:** 1.0.0  
**Status:** ✅ Complete
