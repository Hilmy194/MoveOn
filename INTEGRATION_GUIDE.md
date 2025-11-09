# 🔗 Frontend-Backend Integration Guide

## 📌 Overview

Panduan lengkap untuk menghubungkan Frontend (React/Vite) dengan Backend (Express.js) agar data tersimpan di database dan bisa ditampilkan di UI.

**Status:** ✅ Ready for Implementation  
**Last Updated:** 29 Oktober 2024

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND (Vite/React)                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Pages (Login, CoachDashboard, CoachTasks, etc)      │  │
│  └────────────────┬─────────────────────────────────────┘  │
│                   │ useAuth / axios                         │
│  ┌────────────────▼─────────────────────────────────────┐  │
│  │  AuthContext + API Service Layer                     │  │
│  └────────────────┬─────────────────────────────────────┘  │
└─────────────────┼───────────────────────────────────────────┘
                  │ HTTP REST API
                  │ (localhost:5000/api/...)
┌─────────────────┼───────────────────────────────────────────┐
│                 ▼                                            │
│ ┌──────────────────────────────────────────────────────┐   │
│ │  BACKEND (Express.js)                                │   │
│ │  ┌──────────────────────────────────────────────────┐│   │
│ │  │ Routes → Controllers → Models                    ││   │
│ │  └──────────────────────────────────────────────────┘│   │
│ └────────────────┬─────────────────────────────────────┘   │
│                  │ SQL Queries                              │
│ ┌────────────────▼─────────────────────────────────────┐   │
│ │  DATABASE (PostgreSQL)                               │   │
│ │  users | coach_trainees | tasks | notifications etc  │   │
│ └──────────────────────────────────────────────────────┘   │
│                                                             │
│ BACKEND (Express.js Port 5000)                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Setup Instructions

### **Step 1: Backend Setup**

#### 1a. Environment Variables (.env)
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=moveon
DB_USER=postgres
DB_PASSWORD=your_password

# Server
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# JWT
JWT_SECRET=your_super_secret_key_change_in_production
JWT_EXPIRE=24h
```

#### 1b. Install Dependencies
```bash
cd Backend
npm install
```

**Dependencies needed:**
```json
{
  "express": "^4.18.2",
  "pg": "^8.11.3",
  "bcrypt": "^5.1.1",
  "jsonwebtoken": "^9.0.2",
  "cors": "^2.8.5",
  "dotenv": "^16.3.1",
  "body-parser": "^1.20.2",
  "morgan": "^1.10.0"
}
```

#### 1c. Database Setup
```bash
# Login ke PostgreSQL
psql -U postgres

# Jalankan init.sql
\i database/init.sql

# Verify tables created
\dt
```

#### 1d. Start Backend
```bash
npm run dev
```

**Expected output:**
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

---

### **Step 2: Frontend Setup**

#### 2a. Install Dependencies
```bash
cd Frontend
npm install

# Add axios untuk API calls
npm install axios
```

#### 2b. Create API Service Layer
Buat file baru: `src/services/api.js`

```javascript
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add JWT token to every request
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => Promise.reject(error)
)

// Handle response errors
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
```

#### 2c. Create .env.local file
```env
VITE_API_URL=http://localhost:5000/api
```

#### 2d. Start Frontend
```bash
npm run dev
```

**Expected:** Vite dev server running at `http://localhost:5173`

---

## 🔐 Update AuthContext untuk Backend Integration

### **Frontend: src/context/AuthContext.jsx**

```jsx
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import api from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Load user dari localStorage saat mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    const token = localStorage.getItem('token')
    if (savedUser && token) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  // Register user ke backend
  const register = useCallback(async (name, email, password, role, avatar = '👤') => {
    try {
      setError(null)
      const response = await api.post('/auth/register', {
        name,
        email,
        password,
        role,
        avatar,
      })

      const { data, token } = response.data

      // Save token dan user ke localStorage
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify({
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role,
        avatar: data.avatar,
        status: data.status,
      }))

      setUser(data)
      return data
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Registration failed'
      setError(errorMsg)
      throw new Error(errorMsg)
    }
  }, [])

  // Login user
  const login = useCallback(async (email, password, role) => {
    try {
      setError(null)
      const response = await api.post('/auth/login', {
        email,
        password,
      })

      const { data, token } = response.data

      // Verify role match
      if (data.role !== role) {
        throw new Error('Invalid role selected')
      }

      // Save token dan user ke localStorage
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify({
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role,
        avatar: data.avatar,
        status: data.status,
        bio: data.bio,
        phone: data.phone,
      }))

      setUser(data)
      return data
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Login failed'
      setError(errorMsg)
      throw new Error(errorMsg)
    }
  }, [])

  // Logout user
  const logout = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    setError(null)
  }, [])

  // Get current user
  const getCurrentUser = useCallback(async () => {
    try {
      const response = await api.get('/auth/me')
      setUser(response.data.data)
      return response.data.data
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch user')
      throw err
    }
  }, [])

  const value = {
    user,
    loading,
    error,
    register,
    login,
    logout,
    getCurrentUser,
    isAuthenticated: !!user,
    isCoach: user?.role === 'coach',
    isTrainee: user?.role === 'trainee',
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
```

---

## 📝 Update Login & Register Pages

### **Frontend: src/pages/Login.jsx**

```jsx
import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    email: '',
    password: '',
    role: 'trainee',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Validate
      if (!form.email || !form.password) {
        throw new Error('Email & password required')
      }

      // Call backend login
      await login(form.email, form.password, form.role)

      // Redirect to appropriate dashboard
      navigate(form.role === 'coach' ? '/coach/dashboard' : '/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#001a3d] text-white flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md bg-[#002451] border border-white/10 rounded-xl p-8 shadow-md">
        <h1 className="text-2xl font-bold text-yellow-400 mb-2">Log In</h1>
        <p className="text-sm text-white/60 mb-6">Access your dashboard based on your role.</p>

        {error && (
          <div className="mb-4 text-sm text-red-400 bg-red-400/10 px-3 py-2 rounded">
            ❌ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              disabled={loading}
              className="w-full rounded bg-[#001f47] border border-white/10 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 px-3 py-2 text-sm outline-none disabled:opacity-50"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              disabled={loading}
              className="w-full rounded bg-[#001f47] border border-white/10 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 px-3 py-2 text-sm outline-none disabled:opacity-50"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Role</label>
            <div className="grid grid-cols-2 gap-3">
              {['coach', 'trainee'].map(r => (
                <label
                  key={r}
                  className={`relative flex items-center justify-center rounded-lg border cursor-pointer px-3 py-2 text-sm font-medium transition ${
                    form.role === r
                      ? 'border-yellow-400 bg-[#003266]'
                      : 'border-white/10 hover:border-yellow-400/50'
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value={r}
                    checked={form.role === r}
                    onChange={handleChange}
                    disabled={loading}
                    className="sr-only"
                  />
                  {r === 'coach' ? '👨‍🏫 Coach' : '👤 Trainee'}
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-400 hover:bg-yellow-300 disabled:bg-gray-400 text-[#001a3d] font-semibold rounded py-2 transition disabled:cursor-not-allowed"
          >
            {loading ? '⏳ Logging in...' : '🔓 Log In'}
          </button>
        </form>

        <p className="mt-6 text-xs text-white/60 text-center">
          No account? <NavLink to="/register" className="text-yellow-400 hover:underline">
            Register here
          </NavLink>
        </p>
      </div>
    </div>
  )
}
```

---

### **Frontend: src/pages/Register.jsx (Buat Baru)**

```jsx
import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'trainee',
    avatar: '👤',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const avatarOptions = ['👨', '👩', '🧑', '👨‍🦱', '👩‍🦰', '👨‍🦲', '👩‍🦲', '👨‍🏫', '👩‍🏫']

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Validate
      if (!form.name || !form.email || !form.password) {
        throw new Error('All fields required')
      }

      if (form.password !== form.confirmPassword) {
        throw new Error('Passwords do not match')
      }

      if (form.password.length < 6) {
        throw new Error('Password must be at least 6 characters')
      }

      // Call backend register
      await register(form.name, form.email, form.password, form.role, form.avatar)

      // Redirect to dashboard
      navigate(form.role === 'coach' ? '/coach/dashboard' : '/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#001a3d] text-white flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md bg-[#002451] border border-white/10 rounded-xl p-8 shadow-md">
        <h1 className="text-2xl font-bold text-yellow-400 mb-2">Create Account</h1>
        <p className="text-sm text-white/60 mb-6">Join MoveOn as Coach or Trainee</p>

        {error && (
          <div className="mb-4 text-sm text-red-400 bg-red-400/10 px-3 py-2 rounded">
            ❌ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              disabled={loading}
              className="w-full rounded bg-[#001f47] border border-white/10 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 px-3 py-2 text-sm outline-none disabled:opacity-50"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              disabled={loading}
              className="w-full rounded bg-[#001f47] border border-white/10 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 px-3 py-2 text-sm outline-none disabled:opacity-50"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              disabled={loading}
              className="w-full rounded bg-[#001f47] border border-white/10 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 px-3 py-2 text-sm outline-none disabled:opacity-50"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Confirm Password</label>
            <input
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              disabled={loading}
              className="w-full rounded bg-[#001f47] border border-white/10 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 px-3 py-2 text-sm outline-none disabled:opacity-50"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Avatar</label>
            <div className="grid grid-cols-5 gap-2">
              {avatarOptions.map(avatar => (
                <button
                  key={avatar}
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, avatar }))}
                  className={`text-2xl p-2 rounded border transition ${
                    form.avatar === avatar
                      ? 'border-yellow-400 bg-[#003266]'
                      : 'border-white/10 hover:border-yellow-400/50'
                  }`}
                >
                  {avatar}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Role</label>
            <div className="grid grid-cols-2 gap-3">
              {['coach', 'trainee'].map(r => (
                <label
                  key={r}
                  className={`relative flex items-center justify-center rounded-lg border cursor-pointer px-3 py-2 text-sm font-medium transition ${
                    form.role === r
                      ? 'border-yellow-400 bg-[#003266]'
                      : 'border-white/10 hover:border-yellow-400/50'
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value={r}
                    checked={form.role === r}
                    onChange={handleChange}
                    disabled={loading}
                    className="sr-only"
                  />
                  {r === 'coach' ? '👨‍🏫 Coach' : '👤 Trainee'}
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-400 hover:bg-yellow-300 disabled:bg-gray-400 text-[#001a3d] font-semibold rounded py-2 transition disabled:cursor-not-allowed"
          >
            {loading ? '⏳ Creating account...' : '✨ Register'}
          </button>
        </form>

        <p className="mt-6 text-xs text-white/60 text-center">
          Already have account? <NavLink to="/login" className="text-yellow-400 hover:underline">
            Log in
          </NavLink>
        </p>
      </div>
    </div>
  )
}
```

---

## 🔄 Update Dashboard Pages untuk Fetch dari Backend

### **Frontend: src/pages/CoachDashboard.jsx (Updated)**

```jsx
import React, { useState, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

export default function CoachDashboard() {
  const { user, isCoach } = useAuth()
  const navigate = useNavigate()
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isCoach) {
      navigate('/login')
      return
    }

    fetchDashboardData()
  }, [isCoach, user?.id])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/coach/${user.id}/dashboard`)
      setDashboardData(response.data.data)
    } catch (err) {
      setError('Failed to load dashboard data')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#001a3d] flex items-center justify-center">
        <p className="text-white text-xl">⏳ Loading dashboard...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#001a3d] flex items-center justify-center">
        <div className="text-red-400 text-center">
          <p className="text-xl mb-2">❌ {error}</p>
          <button
            onClick={fetchDashboardData}
            className="bg-yellow-400 text-[#001a3d] px-4 py-2 rounded font-semibold"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#001a3d] to-[#002451] text-white pb-20">
      {/* Header */}
      <div className="px-6 md:px-16 py-8 border-b border-white/10">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-yellow-400 mb-2">
            👋 Welcome, {user?.name || 'Coach'}!
          </h1>
          <p className="text-white/70">Monitor your trainees and manage your coaching program</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="px-6 md:px-16 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {/* Total Trainees */}
            <div className="bg-gradient-to-br from-yellow-400/20 to-yellow-400/5 rounded-lg border border-yellow-400/30 p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-white/60 text-sm mb-2">Total Trainees</p>
                  <p className="text-4xl font-bold text-yellow-400">
                    {dashboardData?.stats?.totalTrainees || 0}
                  </p>
                </div>
                <span className="text-3xl">👥</span>
              </div>
            </div>

            {/* Active Tasks */}
            <div className="bg-gradient-to-br from-green-400/20 to-green-400/5 rounded-lg border border-green-400/30 p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-white/60 text-sm mb-2">Active Tasks</p>
                  <p className="text-4xl font-bold text-green-400">
                    {dashboardData?.stats?.activeTasks || 0}
                  </p>
                </div>
                <span className="text-3xl">📋</span>
              </div>
            </div>

            {/* Total Hours */}
            <div className="bg-gradient-to-br from-blue-400/20 to-blue-400/5 rounded-lg border border-blue-400/30 p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-white/60 text-sm mb-2">Total Hours</p>
                  <p className="text-4xl font-bold text-blue-400">
                    {dashboardData?.stats?.totalHours || 0}h
                  </p>
                </div>
                <span className="text-3xl">⏱️</span>
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-gradient-to-br from-red-400/20 to-red-400/5 rounded-lg border border-red-400/30 p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-white/60 text-sm mb-2">Notifications</p>
                  <p className="text-4xl font-bold text-red-400">
                    {dashboardData?.recentNotifications?.length || 0}
                  </p>
                </div>
                <span className="text-3xl">🔔</span>
              </div>
            </div>
          </div>

          {/* Rest of dashboard content */}
          {/* ... (keep existing code for sections below) ... */}
        </div>
      </div>
    </div>
  )
}
```

---

## 📊 Update CoachTraineesPage untuk Fetch dari Backend

### **Frontend: src/pages/CoachTraineesPage.jsx (Updated)**

```jsx
import React, { useState, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

export default function CoachTraineesPage() {
  const { user, isCoach } = useAuth()
  const navigate = useNavigate()
  const [trainees, setTrainees] = useState([])
  const [filteredTrainees, setFilteredTrainees] = useState([])
  const [viewMode, setViewMode] = useState('grid')
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isCoach) {
      navigate('/login')
      return
    }

    fetchTrainees()
  }, [isCoach, user?.id])

  useEffect(() => {
    // Filter dan sort trainees
    let filtered = trainees

    if (statusFilter !== 'all') {
      filtered = filtered.filter(t => t.status === statusFilter)
    }

    if (searchTerm) {
      filtered = filtered.filter(t =>
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Sort by streak and workouts
    filtered.sort((a, b) => {
      if (a.stats.streak !== b.stats.streak) {
        return b.stats.streak - a.stats.streak
      }
      return b.stats.workoutsCompleted - a.stats.workoutsCompleted
    })

    setFilteredTrainees(filtered)
  }, [trainees, statusFilter, searchTerm])

  const fetchTrainees = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/coach/${user.id}/trainees`)
      setTrainees(response.data.data)
    } catch (err) {
      setError('Failed to load trainees')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#001a3d] flex items-center justify-center">
        <p className="text-white text-xl">⏳ Loading trainees...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#001a3d] to-[#002451] text-white pb-20">
      {/* Header */}
      <div className="px-6 md:px-16 py-8 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-yellow-400 mb-2">
              👥 Your Trainees
            </h1>
            <p className="text-white/70">Monitor and manage all your trainees</p>
          </div>
          <NavLink
            to="/coach/add-trainees"
            className="bg-yellow-400 hover:bg-yellow-300 text-[#001a3d] px-4 py-2 rounded font-semibold transition"
          >
            ➕ Add Trainee
          </NavLink>
        </div>
      </div>

      {/* Controls */}
      <div className="px-6 md:px-16 py-6">
        <div className="max-w-7xl mx-auto space-y-4">
          <input
            type="text"
            placeholder="Search trainees by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-[#002451] border border-white/10 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 outline-none text-white placeholder-white/40"
          />

          <div className="flex flex-col sm:flex-row gap-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="flex-1 px-4 py-2 rounded-lg bg-[#002451] border border-white/10 focus:border-yellow-400 outline-none text-white"
            >
              <option value="all">All Trainees ({trainees.length})</option>
              <option value="active">
                Active ({trainees.filter(t => t.status === 'active').length})
              </option>
              <option value="inactive">
                Inactive ({trainees.filter(t => t.status === 'inactive').length})
              </option>
            </select>

            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  viewMode === 'grid'
                    ? 'bg-yellow-400 text-[#001a3d]'
                    : 'bg-[#002451] border border-white/10 text-white hover:border-white/30'
                }`}
              >
                📊 Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  viewMode === 'list'
                    ? 'bg-yellow-400 text-[#001a3d]'
                    : 'bg-[#002451] border border-white/10 text-white hover:border-white/30'
                }`}
              >
                📋 List
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Trainees Grid/List */}
      <div className="px-6 md:px-16 pb-10">
        <div className="max-w-7xl mx-auto">
          {filteredTrainees.length === 0 ? (
            <div className="bg-[#002451] rounded-lg border border-white/10 p-12 text-center">
              <p className="text-2xl mb-4">😞 No trainees found</p>
              <p className="text-white/60 mb-4">Try adding a trainee or adjusting your filters</p>
              <NavLink
                to="/coach/add-trainees"
                className="inline-block bg-yellow-400 hover:bg-yellow-300 text-[#001a3d] px-4 py-2 rounded font-semibold"
              >
                ➕ Add Trainee
              </NavLink>
            </div>
          ) : viewMode === 'grid' ? (
            // Grid view (keep existing grid code)
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {/* ... existing grid items code ... */}
            </div>
          ) : (
            // List view (keep existing list code)
            <div className="bg-[#002451] rounded-lg border border-white/10 overflow-hidden shadow-lg">
              {/* ... existing list items code ... */}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
```

---

## 🔌 Create API Service Helpers

### **Frontend: src/services/coachApi.js (New)**

```javascript
import api from './api'

// Trainees API
export const coachAPI = {
  // Get all trainees
  getTrainees: (coachId) =>
    api.get(`/coach/${coachId}/trainees`),

  // Get available trainees to add
  getAvailableTrainees: (coachId, search = '') =>
    api.get(`/coach/${coachId}/available-trainees`, { params: { search } }),

  // Get single trainee details
  getTraineeDetail: (coachId, traineeId) =>
    api.get(`/coach/${coachId}/trainee/${traineeId}`),

  // Add trainee
  addTrainee: (coachId, traineeId) =>
    api.post(`/coach/${coachId}/add-trainee`, { traineeId }),

  // Remove trainee
  removeTrainee: (coachId, traineeId) =>
    api.delete(`/coach/${coachId}/remove-trainee/${traineeId}`),

  // Tasks API
  getTasks: (coachId, params = {}) =>
    api.get(`/coach/${coachId}/tasks`, { params }),

  // Create task
  createTask: (coachId, taskData) =>
    api.post(`/coach/${coachId}/tasks`, taskData),

  // Update task
  updateTask: (coachId, taskId, taskData) =>
    api.put(`/coach/${coachId}/tasks/${taskId}`, taskData),

  // Delete task
  deleteTask: (coachId, taskId) =>
    api.delete(`/coach/${coachId}/tasks/${taskId}`),

  // Dashboard API
  getDashboard: (coachId) =>
    api.get(`/coach/${coachId}/dashboard`),

  // Notifications API
  getNotifications: (coachId, params = {}) =>
    api.get(`/coach/${coachId}/notifications`, { params }),

  // Mark notification as read
  markNotificationRead: (coachId, notificationId) =>
    api.patch(`/coach/${coachId}/notifications/${notificationId}`),

  // Mark all notifications as read
  markAllNotificationsRead: (coachId) =>
    api.patch(`/coach/${coachId}/notifications/mark-all-read`),

  // Templates API
  getTemplates: () =>
    api.get('/workout-templates'),

  getCoachTemplates: (coachId) =>
    api.get(`/coach/${coachId}/workout-templates`),
}

export default coachAPI
```

---

## 🧪 Testing Integration

### **Step 1: Test Backend dengan Postman**

```
1. POST /api/auth/register
   Body: { "name": "John Coach", "email": "coach@test.com", "password": "password123", "role": "coach" }
   Expected: 201 Created, token returned

2. POST /api/auth/login
   Body: { "email": "coach@test.com", "password": "password123" }
   Expected: 200 OK, token returned

3. GET /api/coach/1/dashboard
   Headers: Authorization: Bearer <token>
   Expected: 200 OK, dashboard data

4. GET /api/coach/1/trainees
   Headers: Authorization: Bearer <token>
   Expected: 200 OK, trainees list
```

### **Step 2: Test Frontend Login**

```
1. Buka http://localhost:5173/register
2. Isi form dengan data baru
3. Click Register
4. Data seharusnya tersimpan di database PostgreSQL
5. Auto redirect ke /coach/dashboard
6. Trainees, tasks, notifications loaded dari backend
```

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| **CORS Error** | Pastikan `FRONTEND_URL` di `.env` backend sudah benar |
| **401 Unauthorized** | Token expired atau tidak valid, user perlu login ulang |
| **Database connection error** | Cek `.env` database credentials, pastikan PostgreSQL running |
| **API 404 Not Found** | Cek URL endpoint, pastikan route sudah di-register |
| **Token tidak tersimpan** | Pastikan localStorage bukan di-disable, clear cache browser |
| **Data tidak tampil** | Cek response dari backend dengan Postman, lihat console.error |

---

## 📋 Checklist Integration

- [ ] Backend setup complete (server running di :5000)
- [ ] Database created dengan semua tables
- [ ] Frontend updated dengan api.js service
- [ ] AuthContext updated dengan backend integration
- [ ] Login page connect ke `/api/auth/login`
- [ ] Register page connect ke `/api/auth/register`
- [ ] CoachDashboard fetch dari `/api/coach/:id/dashboard`
- [ ] CoachTraineesPage fetch dari `/api/coach/:id/trainees`
- [ ] Token simpan/load dari localStorage
- [ ] Axios interceptor setup untuk auth header
- [ ] Test login/register flow end-to-end
- [ ] Test fetch trainees dari backend
- [ ] Verify data di database saat register

---

## 🚀 Next Steps

1. ✅ Setup backend (express, database, routes)
2. ✅ Setup frontend (axios, AuthContext, api service)
3. ✅ Connect login/register ke backend
4. ✅ Connect dashboard pages ke API
5. 🔄 Update remaining pages (CoachAssignTask, CoachTasks, etc)
6. 🔄 Add error handling dan loading states
7. 🔄 Test full flow dengan real data
8. 🔄 Deploy ke production

---

**Status:** ✅ Ready to Implement  
**Created:** 29 Oktober 2024  

Semuanya sudah siap! Mari mulai integrate! 🎯
