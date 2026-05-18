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

      const headers = {
        'Content-Type': 'application/json',
      }

      // GET 요청: Authorization 헤더 사용 (anonKey)
      // POST/PATCH/DELETE: x-admin-token 헤더 사용 (adminToken)
      if (method === 'GET') {
        headers['Authorization'] = `Bearer ${anonKey}`
        console.log(`[useApi] Using anonKey for GET request`)
      } else {
        if (adminToken) {
          headers['x-admin-token'] = adminToken
          console.log(`[useApi] Using x-admin-token for ${method} request`)
          try {
            const decoded = JSON.parse(atob(adminToken))
            console.log(`[useApi] Decoded admin token:`, decoded)
          } catch (e) {
            console.log(`[useApi] Failed to decode admin token:`, e.message)
          }
        } else {
          console.warn(`[useApi] No adminToken found for ${method} request`)
        }
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
