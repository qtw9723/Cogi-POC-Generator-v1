import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import { useApi } from '../hooks/useApi'
import { API_ENDPOINTS } from '../lib/constants'

const ReferencesContext = createContext()

export function ReferencesProvider({ children }) {
  const [references, setReferences] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { request } = useApi()
  const hasLoadedRef = useRef(false)

  useEffect(() => {
    console.log('[ReferencesContext] Initializing...')
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
          console.log('[ReferencesContext] Admin references not available (not authenticated)')
          setError(null)
        } else {
          console.error('[ReferencesContext] Failed to fetch:', err)
          setError(err.message)
        }
        setReferences([])
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [request])

  const uploadReference = useCallback(async (name, jsonData) => {
    const data = await request(API_ENDPOINTS.ADMIN_REFERENCES, {
      method: 'POST',
      body: { name, json_data: jsonData }
    })
    setReferences([...references, data])
    return data
  }, [references, request])

  const learnRules = useCallback(async (id) => {
    const data = await request(API_ENDPOINTS.LEARN_RULES, {
      method: 'POST',
      body: { reference_id: id }
    })
    setReferences(references.map(r => r.id === id ? { ...r, template_status: 'completed' } : r))
    return data
  }, [references, request])

  const deleteReference = useCallback(async (id) => {
    await request(`${API_ENDPOINTS.ADMIN_REFERENCES}?id=${id}`, {
      method: 'DELETE'
    })
    setReferences(references.filter(r => r.id !== id))
  }, [references, request])

  const refetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await request(API_ENDPOINTS.ADMIN_REFERENCES)
      setReferences(data)
      setError(null)
    } catch (err) {
      if (err.message.includes('Unauthorized') || err.message.includes('401')) {
        console.log('[ReferencesContext] Admin references not available (not authenticated)')
        setError(null)
      } else {
        console.error('[ReferencesContext] Failed to refetch:', err)
        setError(err.message)
      }
      setReferences([])
    } finally {
      setLoading(false)
    }
  }, [request])

  return (
    <ReferencesContext.Provider value={{ references, loading, error, uploadReference, learnRules, deleteReference, refetch }}>
      {children}
    </ReferencesContext.Provider>
  )
}

export function useReferences() {
  const context = useContext(ReferencesContext)
  if (!context) {
    throw new Error('useReferences must be used within ReferencesProvider')
  }
  return context
}
