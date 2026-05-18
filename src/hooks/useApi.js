import { useState, useCallback } from 'react'

export function useApi() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const request = useCallback(async (endpoint, options = {}) => {
    setLoading(true)
    setError(null)
    const { method = 'GET', body = null } = options
    const adminToken = localStorage.getItem('adminToken')
    const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

    // 관리자 토큰이 있으면 쿼리 파라미터로 추가
    let url = endpoint
    if (method !== 'GET' && adminToken) {
      const separator = endpoint.includes('?') ? '&' : '?'
      url = `${endpoint}${separator}token=${encodeURIComponent(adminToken)}`
    }

    console.log(`[useApi] ${method} ${endpoint}${adminToken && method !== 'GET' ? ' (with token)' : ''}`)

    try {
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${anonKey}`,
        'x-admin-token': adminToken || ''
      }

      const response = await fetch(url, {
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
