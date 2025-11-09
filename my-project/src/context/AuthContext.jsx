import React, { createContext, useContext, useState, useCallback } from 'react'

// Simple in-memory auth placeholder (no persistence)
const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null) // {email, role}

  const login = useCallback((email, role) => {
    setUser({ email, role })
  }, [])

  const logout = useCallback(() => setUser(null), [])

  const register = useCallback((email, role) => {
    // In real app: call API then setUser
    setUser({ email, role })
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
