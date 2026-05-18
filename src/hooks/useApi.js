import { useState } from 'react'

export function useApi() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const request = async (endpoint, options = {}) => {
    setLoading(true)
    setError(null)
    try {
      const { method = 'GET', body = null } = options
      const adminToken = localStorage.getItem('adminToken')
      const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
      const token = adminToken || anonKey

      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }

      const response = await fetch(endpoint, {
        method,
        headers,
        body: body ? JSON.stringify(body) : null
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || errorData.error || 'API request failed')
      }

      const data = await response.json()
      return data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { request, loading, error }
}
