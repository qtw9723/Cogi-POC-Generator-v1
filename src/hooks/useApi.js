import { useState, useCallback } from 'react'

export function useApi() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const request = useCallback(async (endpoint, options = {}) => {
    setLoading(true)
    setError(null)
    const { method = 'GET', body = null } = options
    console.log(`[useApi] ${method} ${endpoint}`)
    try {
      const adminToken = localStorage.getItem('adminToken')
      const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
      console.log(`[useApi] adminToken exists: ${!!adminToken}, length: ${adminToken?.length || 0}`)
      console.log(`[useApi] Using token for ${method}:`, adminToken ? `adminToken (length: ${adminToken.length})` : 'anonKey')
      const token = method === 'GET' ? anonKey : (adminToken || anonKey)

      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
      console.log(`[useApi] Authorization header: Bearer ${token?.substring(0, 20)}...`)
      try {
        const decoded = JSON.parse(atob(token))
        console.log(`[useApi] Decoded token:`, decoded)
      } catch (e) {
        console.log(`[useApi] Failed to decode token:`, e.message)
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
  }, [])

  return { request, loading, error }
}
