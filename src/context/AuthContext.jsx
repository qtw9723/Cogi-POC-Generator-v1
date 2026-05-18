import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

const ADMIN_ID = 'master'
const ADMIN_PW = 'master'

export function AuthProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log('[AuthContext] Initializing...')
    const token = localStorage.getItem('adminToken')
    setIsAdmin(!!token)
    setLoading(false)
  }, [])

  const login = (id, password) => {
    if (id === ADMIN_ID && password === ADMIN_PW) {
      const token = btoa(`${ADMIN_ID}:${Date.now()}`)
      localStorage.setItem('adminToken', token)
      setIsAdmin(true)
      return true
    }
    return false
  }

  const logout = () => {
    localStorage.removeItem('adminToken')
    setIsAdmin(false)
  }

  return (
    <AuthContext.Provider value={{ isAdmin, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
