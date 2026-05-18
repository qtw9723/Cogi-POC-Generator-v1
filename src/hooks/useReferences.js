import { useState, useEffect, useRef, useCallback } from 'react'
import { useApi } from './useApi'
import { API_ENDPOINTS } from '../lib/constants'

export function useReferences() {
  const [references, setReferences] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { request } = useApi()
  const hasLoadedRef = useRef(false)

  const fetchReferences = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await request(API_ENDPOINTS.ADMIN_REFERENCES)
      setReferences(data)
      setError(null)
    } catch (err) {
      // If unauthorized (not admin), silently fail - references are optional for non-admin users
      if (err.message.includes('Unauthorized') || err.message.includes('401')) {
        console.log('Admin references not available (not authenticated)')
        setError(null)
      } else {
        console.error('Failed to fetch references:', err)
        setError(err.message)
      }
      setReferences([])
    } finally {
      setLoading(false)
    }
  }, [request])

  useEffect(() => {
    if (hasLoadedRef.current) return
    hasLoadedRef.current = true

    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await request(API_ENDPOINTS.ADMIN_REFERENCES)
        setReferences(data)
      } catch (err) {
        if (err.message.includes('Unauthorized') || err.message.includes('401')) {
          console.log('Admin references not available (not authenticated)')
          setError(null)
        } else {
          console.error('Failed to fetch references:', err)
          setError(err.message)
        }
        setReferences([])
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  const uploadReference = async (name, jsonData) => {
    const data = await request(API_ENDPOINTS.ADMIN_REFERENCES, {
      method: 'POST',
      body: { name, json_data: jsonData }
    })
    setReferences([...references, data])
    return data
  }

  const learnRules = async (id) => {
    const data = await request(API_ENDPOINTS.LEARN_RULES, {
      method: 'POST',
      body: { reference_id: id }
    })
    setReferences(references.map(r => r.id === id ? { ...r, template_status: 'completed' } : r))
    return data
  }

  const deleteReference = async (id) => {
    await request(`${API_ENDPOINTS.ADMIN_REFERENCES}?id=${id}`, {
      method: 'DELETE'
    })
    setReferences(references.filter(r => r.id !== id))
  }

  return { references, loading, error, uploadReference, learnRules, deleteReference, refetch: fetchReferences }
}
