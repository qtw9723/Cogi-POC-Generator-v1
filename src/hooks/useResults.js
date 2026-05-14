import { useState, useEffect } from 'react'
import { useApi } from './useApi'
import { API_ENDPOINTS } from '../lib/constants'

export function useResults() {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)
  const { request } = useApi()

  useEffect(() => {
    fetchResults()
  }, [])

  const fetchResults = async () => {
    try {
      const data = await request(API_ENDPOINTS.RESULTS)
      setResults(data)
    } catch (err) {
      console.error('Failed to fetch results:', err)
    } finally {
      setLoading(false)
    }
  }

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
    await request(API_ENDPOINTS.RESULTS + `/${id}`, {
      method: 'DELETE'
    })
    setResults(results.filter(r => r.id !== id))
  }

  return { results, loading, getResultById, createResult, deleteResult, refetch: fetchResults }
}
