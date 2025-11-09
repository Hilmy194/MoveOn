# 🔧 PostgreSQL Setup & Connection Fix

## ❌ Error: password authentication failed for user "postgres"

### Solusi 1: Setup PostgreSQL di Windows (Recommended)

#### **A. Download & Install PostgreSQL**

1. Download dari: https://www.postgresql.org/download/windows/
2. Jalankan installer
3. **IMPORTANT:** Catat password yang diset untuk user `postgres`
4. Port default: 5432
5. Selesaikan instalasi

---

#### **B. Verifikasi PostgreSQL Installation**

Buka Command Prompt atau PowerShell:

```cmd
# Cek PostgreSQL version
psql --version

# atau

psql -U postgres
```

Jika muncul prompt `Password for user postgres:`, berarti PostgreSQL sudah terinstall dengan benar.

---

#### **C. Update .env Backend dengan Password yang Benar**

File: `Backend/.env`

```env
PORT=5000

# PostgreSQL Configuration - GANTI SESUAI PASSWORD SAAT INSTALL
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=YOUR_ACTUAL_PASSWORD  # ← GANTI INI dengan password saat install
DB_NAME=moveon

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
JWT_EXPIRE=24h

# Environment
NODE_ENV=development

# Frontend URL for CORS
FRONTEND_URL=http://localhost:5173
```

---

#### **D. Create Database & Tables**

1. **Buka PostgreSQL Command Line:**
```cmd
psql -U postgres -h localhost
```

2. **Create Database:**
```sql
-- Create database
CREATE DATABASE moveon;

-- Connect to database
\c moveon

-- Copy semua SQL dari Backend/database/init.sql dan paste di sini
-- Atau gunakan command:
```

3. **Dari Command Prompt (better way):**
```cmd
# Navigate ke Backend folder
cd Backend

# Run init.sql
psql -U postgres -h localhost -d postgres -f database/init.sql

# Verify tables created
psql -U postgres -h localhost -d moveon -c "\dt"
```

---

### Solusi 2: Update Backend Database Config

File: `Backend/src/config/db_postgres.js`

Pastikan file ini sesuai dengan `.env`:

```javascript
import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'moveon',
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

export default pool;
```

---

## ✅ FIX 2: Frontend axios Module Error

### Solusi: Install Dependencies

Buka Terminal di Frontend folder:

```bash
cd Frontend

# Install axios yang mungkin belum terinstall
npm install axios

# Atau reinstall semua dependencies
npm install

# Pastikan semua dependency terinstall
npm list
```

---

## 🔄 FIX 3: Update Backend package.json

Pastikan Backend punya semua dependencies yang diperlukan:

File: `Backend/package.json`

```json
{
  "name": "moveon-backend",
  "version": "1.0.0",
  "description": "Backend API for MoveOn Fitness Web App",
  "main": "server.js",
  "type": "module",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "jest"
  },
  "keywords": ["fitness", "workout", "coach", "trainee"],
  "author": "",
  "license": "MIT",
  "dependencies": {
    "express": "^4.18.2",
    "pg": "^8.11.3",
    "dotenv": "^16.3.1",
    "cors": "^2.8.5",
    "bcrypt": "^5.1.1",
    "jsonwebtoken": "^9.0.2",
    "body-parser": "^1.20.2",
    "morgan": "^1.10.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.2",
    "jest": "^29.7.0",
    "supertest": "^6.3.3"
  }
}
```

Install dependencies:
```bash
cd Backend
npm install
```

---

## 🚀 Langkah-Langkah Setup Lengkap

### **1. Backend Setup**

```bash
# Navigate ke Backend folder
cd Backend

# Install dependencies
npm install

# Edit .env dengan password PostgreSQL yang benar
# Buka file .env dan update DB_PASSWORD

# Jalankan database initialization
psql -U postgres -h localhost -d postgres -f database/init.sql

# Start backend server
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

✅ Server is ready to accept connections
```

---

### **2. Frontend Setup**

```bash
# Navigate ke Frontend folder
cd Frontend

# Install dependencies (termasuk axios)
npm install

# Start frontend dev server
npm run dev
```

**Expected Output:**
```
VITE v7.1.7  ready in 234 ms

➜  Local:   http://localhost:5173/
➜  Press h to show help
```

---

## 🧪 Test Connection

### **Test 1: Check if PostgreSQL is Running**

```bash
# In Windows Command Prompt/PowerShell
psql -U postgres -h localhost -c "SELECT version();"
```

Expected: PostgreSQL version info

---

### **Test 2: Check if Backend is Responding**

```bash
# In another terminal
curl http://localhost:5000/

# Or use browser: http://localhost:5000/
```

Expected: JSON response with MoveOn Backend info

---

### **Test 3: Check Health Endpoint**

```bash
curl http://localhost:5000/health
```

Expected: 
```json
{
  "success": true,
  "message": "Server is healthy",
  "database": {
    "postgres": "connected"
  },
  "uptime": 12.34,
  "timestamp": "2024-10-29T10:30:00.000Z"
}
```

---

## 📋 Checklist Setup

- [ ] PostgreSQL terinstall dan running
- [ ] Database `moveon` sudah dibuat
- [ ] Tables sudah di-create via init.sql
- [ ] `.env` Backend sudah update dengan correct password
- [ ] Backend dependencies terinstall (`npm install`)
- [ ] Backend running di port 5000 (`npm run dev`)
- [ ] Frontend dependencies terinstall including axios
- [ ] Frontend running di port 5173 (`npm run dev`)
- [ ] CORS sudah configured di backend
- [ ] `.env.local` Frontend sudah ada dengan `VITE_API_URL`

---

## 🔗 Connection Flow

```
Frontend (localhost:5173)
    ↓
axios request to http://localhost:5000/api/...
    ↓
Backend Express Server (localhost:5000)
    ↓
Database Query via pg pool
    ↓
PostgreSQL (localhost:5432)
    ↓
Return data back through the chain
```

---

## 💡 Tips

1. **PostgreSQL Password Lupa:**
   - Uninstall dan reinstall PostgreSQL
   - Atau reset password via pgAdmin UI (included with installation)

2. **Port 5432 sudah terpakai:**
   - Change port di PostgreSQL installer
   - Update `.env` dengan port baru

3. **Database setup masih error:**
   - Cek file `Backend/database/init.sql`
   - Run manually line by line di pgAdmin

4. **Backend still not starting:**
   - Check if port 5000 is available
   - Try different port: update `.env` PORT value

---

Semuanya sudah siap! Mari kita coba step by step. Mulai dari mana? 🎯
