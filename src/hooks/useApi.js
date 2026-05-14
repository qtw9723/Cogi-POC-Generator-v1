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

      const headers = {
        'Content-Type': 'application/json',
        ...(adminToken && { 'Authorization': `Bearer ${adminToken}` })
      }

      const response = await fetch(endpoint, {
        method,
        headers,
        body: body ? JSON.stringify(body) : null
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'API request failed')
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
