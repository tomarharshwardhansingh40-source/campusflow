import { createContext, useContext, useState, useEffect } from 'react'
import { api } from '../api/client.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const cached = localStorage.getItem('campusflow_user')
    try {
      return cached ? JSON.parse(cached) : null
    } catch {
      return null
    }
  })
  const [token, setToken] = useState(() => localStorage.getItem('campusflow_token') || null)
  const [loading, setLoading] = useState(true)

  // Validate and restore session on mount
  useEffect(() => {
    async function restoreSession() {
      const storedToken = localStorage.getItem('campusflow_token')
      if (!storedToken) {
        setUser(null)
        setLoading(false)
        return
      }

      try {
        const data = await api.get('/auth/me')
        setUser(data.user)
        localStorage.setItem('campusflow_user', JSON.stringify(data.user))
      } catch (err) {
        console.warn('Failed to restore session:', err.message)
        localStorage.removeItem('campusflow_token')
        localStorage.removeItem('campusflow_user')
        setUser(null)
        setToken(null)
      } finally {
        setLoading(false)
      }
    }

    restoreSession()

    // Listen for unauthorized 401 events from any API call
    const handleUnauthorized = () => {
      setUser(null)
      setToken(null)
    }
    window.addEventListener('campusflow:unauthorized', handleUnauthorized)
    return () => window.removeEventListener('campusflow:unauthorized', handleUnauthorized)
  }, [])

  const login = async (email, password) => {
    const data = await api.post('/auth/login', { email, password })
    localStorage.setItem('campusflow_token', data.token)
    localStorage.setItem('campusflow_user', JSON.stringify(data.user))
    setToken(data.token)
    setUser(data.user)
    return data.user
  }

  const register = async ({ name, email, password, role, inviteCode }) => {
    const payload = { name, email, password, role }
    if (role === 'faculty' && inviteCode) {
      payload.inviteCode = inviteCode
    }

    const data = await api.post('/auth/register', payload)
    localStorage.setItem('campusflow_token', data.token)
    localStorage.setItem('campusflow_user', JSON.stringify(data.user))
    setToken(data.token)
    setUser(data.user)
    return data.user
  }

  const logout = () => {
    localStorage.removeItem('campusflow_token')
    localStorage.removeItem('campusflow_user')
    setUser(null)
    setToken(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
