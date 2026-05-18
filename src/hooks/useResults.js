import { useState, useEffect, useRef, useCallback } from 'react'
import { useApi } from './useApi'
import { API_ENDPOINTS } from '../lib/constants'

export function useResults() {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { request } = useApi()
  const hasLoadedRef = useRef(false)

  const fetchResults = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await request(API_ENDPOINTS.RESULTS)
      setResults(data)
      setError(null)
    } catch (err) {
      console.error('Failed to fetch results:', err)
      setError(err.message)
      setResults([])
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
        const data = await request(API_ENDPOINTS.RESULTS)
        setResults(data)
      } catch (err) {
        console.error('Failed to fetch results:', err)
        setError(err.message)
        setResults([])
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  const getResultById = async (id) => {
    return await request(API_ENDPOINTS.RESULT_DETAIL(id))
  }

  const createResult = async (responses, referenceId) => {
    const data = await request(API_ENDPOINTS.COGI_GENERATOR, {
      method: 'POST',
      body: { responses, reference_id: referenceId }
    })
    setResults([data, ...results])
    return data
  }

  const deleteResult = async (id) => {
    await request(`${API_ENDPOINTS.RESULTS}?id=${id}`, {
      method: 'DELETE'
    })
    setResults(results.filter(r => r.id !== id))
  }

  return { results, loading, getResultById, createResult, deleteResult, refetch: fetchResults }
}
