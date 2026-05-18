import { useState, useEffect } from 'react'
import { useApi } from './useApi'
import { API_ENDPOINTS } from '../lib/constants'

export function useQuestions() {
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { request } = useApi()

  useEffect(() => {
    fetchQuestions()
  }, [])

  const fetchQuestions = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await request(API_ENDPOINTS.ADMIN_QUESTIONS)
      setQuestions(data)
    } catch (err) {
      console.error('Failed to fetch questions:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

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
