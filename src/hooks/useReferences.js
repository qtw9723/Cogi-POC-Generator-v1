import { useState, useEffect } from 'react'
import { useApi } from './useApi'
import { API_ENDPOINTS } from '../lib/constants'

export function useReferences() {
  const [references, setReferences] = useState([])
  const [loading, setLoading] = useState(true)
  const { request } = useApi()

  useEffect(() => {
    fetchReferences()
  }, [])

  const fetchReferences = async () => {
    try {
      const data = await request(API_ENDPOINTS.ADMIN_REFERENCES)
      setReferences(data)
    } catch (err) {
      console.error('Failed to fetch references:', err)
    } finally {
      setLoading(false)
    }
  }

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

  return { references, loading, uploadReference, learnRules, deleteReference, refetch: fetchReferences }
}
