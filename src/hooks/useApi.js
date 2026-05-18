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
        'Authorization': `Bearer ${anonKey}`
      }

      // POST/PATCH/DELETE는 추가로 x-admin-token 헤더 필요
      if (method !== 'GET') {
        if (adminToken) {
          headers['x-admin-token'] = adminToken
          console.log(`[useApi] Using x-admin-token for ${method} request`)
        } else {
          console.warn(`[useApi] No adminToken found for ${method} request`)
        }
      }
      console.log(`[useApi] Headers:`, { ...headers, Authorization: headers.Authorization?.substring(0, 20) + '...' })

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
