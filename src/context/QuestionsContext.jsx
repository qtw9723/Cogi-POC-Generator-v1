import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import { useApi } from '../hooks/useApi'
import { API_ENDPOINTS } from '../lib/constants'

const QuestionsContext = createContext()

export function QuestionsProvider({ children }) {
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { request } = useApi()
  const hasLoadedRef = useRef(false)

  useEffect(() => {
    console.log('[QuestionsContext] Initializing...')
    if (hasLoadedRef.current) return
    hasLoadedRef.current = true

    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await request(API_ENDPOINTS.ADMIN_QUESTIONS)
        setQuestions(data)
      } catch (err) {
        console.error('[QuestionsContext] Failed to fetch:', err)
        setError(err.message)
        setQuestions([])
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [request])

  const createQuestion = useCallback(async (question) => {
    const data = await request(API_ENDPOINTS.ADMIN_QUESTIONS, {
      method: 'POST',
      body: question
    })
    setQuestions([...questions, data])
    return data
  }, [questions, request])

  const updateQuestion = useCallback(async (id, updates) => {
    const data = await request(`${API_ENDPOINTS.ADMIN_QUESTIONS}?id=${id}`, {
      method: 'PATCH',
      body: updates
    })
    setQuestions(questions.map(q => q.id === id ? data : q))
    return data
  }, [questions, request])

  const deleteQuestion = useCallback(async (id) => {
    await request(`${API_ENDPOINTS.ADMIN_QUESTIONS}?id=${id}`, {
      method: 'DELETE'
    })
    setQuestions(questions.filter(q => q.id !== id))
  }, [questions, request])

  const refetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await request(API_ENDPOINTS.ADMIN_QUESTIONS)
      setQuestions(data)
      setError(null)
    } catch (err) {
      console.error('[QuestionsContext] Failed to refetch:', err)
      setError(err.message)
      setQuestions([])
    } finally {
      setLoading(false)
    }
  }, [request])

  return (
    <QuestionsContext.Provider value={{ questions, loading, error, createQuestion, updateQuestion, deleteQuestion, refetch }}>
      {children}
    </QuestionsContext.Provider>
  )
}

export function useQuestions() {
  const context = useContext(QuestionsContext)
  if (!context) {
    throw new Error('useQuestions must be used within QuestionsProvider')
  }
  return context
}
