import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import { useApi } from '../hooks/useApi'
import { API_ENDPOINTS } from '../lib/constants'

const ResultsContext = createContext()

export function ResultsProvider({ children }) {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { request } = useApi()
  const hasLoadedRef = useRef(false)

  useEffect(() => {
    console.log('[ResultsContext] Initializing...')
    if (hasLoadedRef.current) return
    hasLoadedRef.current = true

    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await request(API_ENDPOINTS.RESULTS)
        setResults(data)
      } catch (err) {
        console.error('[ResultsContext] Failed to fetch:', err)
        setError(err.message)
        setResults([])
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [request])

  const getResultById = useCallback(async (id) => {
    return await request(API_ENDPOINTS.RESULT_DETAIL(id))
  }, [request])

  const createResult = useCallback(async (responses, referenceId) => {
    const data = await request(API_ENDPOINTS.COGI_GENERATOR, {
      method: 'POST',
      body: { responses, reference_id: referenceId }
    })
    setResults([data, ...results])
    return data
  }, [results, request])

  const deleteResult = useCallback(async (id) => {
    await request(`${API_ENDPOINTS.RESULTS}?id=${id}`, {
      method: 'DELETE'
    })
    setResults(results.filter(r => r.id !== id))
  }, [results, request])

  const refetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await request(API_ENDPOINTS.RESULTS)
      setResults(data)
      setError(null)
    } catch (err) {
      console.error('[ResultsContext] Failed to refetch:', err)
      setError(err.message)
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [request])

  return (
    <ResultsContext.Provider value={{ results, loading, error, getResultById, createResult, deleteResult, refetch }}>
      {children}
    </ResultsContext.Provider>
  )
}

export function useResults() {
  const context = useContext(ResultsContext)
  if (!context) {
    throw new Error('useResults must be used within ResultsProvider')
  }
  return context
}
