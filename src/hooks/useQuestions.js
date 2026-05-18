import { useState, useEffect, useRef, useCallback } from 'react'
import { useApi } from './useApi'
import { API_ENDPOINTS } from '../lib/constants'

export function useQuestions() {
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { request } = useApi()
  const hasLoadedRef = useRef(false)

  const fetchQuestions = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await request(API_ENDPOINTS.ADMIN_QUESTIONS)
      setQuestions(data)
      setError(null)
    } catch (err) {
      console.error('Failed to fetch questions:', err)
      setError(err.message)
      setQuestions([])
    } finally {
      setLoading(false)
    }
  }, [request])

  useEffect(() => {
    if (hasLoadedRef.current) return
    hasLoadedRef.current = true
    fetchQuestions()
  }, [fetchQuestions])

  const createQuestion = async (question) => {
    const data = await request(API_ENDPOINTS.ADMIN_QUESTIONS, {
      method: 'POST',
      body: question
    })
    setQuestions([...questions, data])
    return data
  }

  const updateQuestion = async (id, updates) => {
    const data = await request(`${API_ENDPOINTS.ADMIN_QUESTIONS}?id=${id}`, {
      method: 'PATCH',
      body: updates
    })
    setQuestions(questions.map(q => q.id === id ? data : q))
    return data
  }

  const deleteQuestion = async (id) => {
    await request(`${API_ENDPOINTS.ADMIN_QUESTIONS}?id=${id}`, {
      method: 'DELETE'
    })
    setQuestions(questions.filter(q => q.id !== id))
  }

  return { questions, loading, error, createQuestion, updateQuestion, deleteQuestion, refetch: fetchQuestions }
}
