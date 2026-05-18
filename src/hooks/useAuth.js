import { useState, useEffect } from 'react'

const ADMIN_ID = 'master'
const ADMIN_PW = 'master'

export function useAuth() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log('[useAuth] useEffect running, checking token...')
    const token = localStorage.getItem('adminToken')
    console.log('[useAuth] Token found:', !!token)
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

  return { isAdmin, loading, login, logout }
}
