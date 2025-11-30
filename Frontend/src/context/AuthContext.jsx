import React, { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token')
      const storedUser = localStorage.getItem('user')

      if (token && storedUser) {
        try {
          const userData = JSON.parse(storedUser)
          setUser(userData)
          console.log('✅ Auth initialized:', userData.username, 'Role:', userData.role)
        } catch (err) {
          console.error('❌ Failed to parse stored user:', err)
          localStorage.removeItem('token')
          localStorage.removeItem('user')
        }
      }

      setLoading(false)
    }

    initializeAuth()
  }, [])

  const login = async (username, password) => {
    try {
      console.log('\n🔐 [FRONTEND] ==================== LOGIN ATTEMPT ====================');
      console.log('📝 [FRONTEND] Username/Email:', username);
      console.log('📝 [FRONTEND] Password provided:', password ? 'YES (length: ' + password.length + ')' : 'NO');
      setError(null)

      // Send both username and email fields to be safe
      const loginData = {
        username: username,
        email: username,
        password: password
      };
      
      console.log('📤 [FRONTEND] Sending login request with data:', { 
        username: loginData.username, 
        email: loginData.email,
        password: '***' 
      });

      const response = await api.post('/auth/login', loginData)

      console.log('📥 Login response:', response.data)

      if (response.data.success) {
        const userData = response.data.data
        
        // Store in state
        setUser(userData)
        
        // Store in localStorage
        localStorage.setItem('token', userData.token)
        localStorage.setItem('user', JSON.stringify(userData))
        
        console.log('✅ Login successful:', userData.username, 'Role:', userData.role)
        
        return { success: true, user: userData }
      } else {
        const errorMsg = response.data.message || 'Login failed'
        setError(errorMsg)
        console.error('❌ Login failed:', errorMsg)
        return { success: false, error: errorMsg }
      }
    } catch (err) {
      console.error('❌ Login error:', err)
      
      let errorMessage = 'Login failed. Please try again.'
      
      if (err.response) {
        // Server responded with error
        errorMessage = err.response.data?.message || err.response.statusText || errorMessage
        console.error('Server error:', err.response.status, err.response.data)
      } else if (err.request) {
        // Request was made but no response
        errorMessage = 'Cannot connect to server. Please check your connection.'
        console.error('No response from server:', err.request)
      } else {
        // Something else happened
        errorMessage = err.message || errorMessage
        console.error('Request error:', err.message)
      }
      
      setError(errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  const register = async (userData) => {
    try {
      console.log('📝 Attempting registration:', userData)
      setError(null)

      const response = await api.post('/auth/register', userData)

      console.log('📥 Register response:', response.data)

      if (response.data.success) {
        const newUser = response.data.data
        
        setUser(newUser)
        localStorage.setItem('token', newUser.token)
        localStorage.setItem('user', JSON.stringify(newUser))
        
        console.log('✅ Registration successful:', newUser.username)
        
        return { success: true, user: newUser }
      } else {
        const errorMsg = response.data.message || 'Registration failed'
        setError(errorMsg)
        return { success: false, error: errorMsg }
      }
    } catch (err) {
      console.error('❌ Registration error:', err)
      
      let errorMessage = 'Registration failed. Please try again.'
      
      if (err.response) {
        errorMessage = err.response.data?.message || err.response.statusText || errorMessage
      } else if (err.request) {
        errorMessage = 'Cannot connect to server. Please check your connection.'
      } else {
        errorMessage = err.message || errorMessage
      }
      
      setError(errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  const logout = () => {
    console.log('👋 Logging out user:', user?.username)
    
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    
    console.log('✅ Logout successful')
  }

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isCoach: user?.role === 'coach',
    isTrainee: user?.role === 'trainee'
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}