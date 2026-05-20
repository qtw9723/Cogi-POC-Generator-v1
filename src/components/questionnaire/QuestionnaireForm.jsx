import { useState, useEffect } from 'react'
import { useQuestions } from '../../context/QuestionsContext'
import { useResults } from '../../hooks/useResults'
import { useNavigate } from 'react-router-dom'
import { Button } from '../common/Button'
import { ProgressBar } from '../common/ProgressBar'
import { QuestionCard } from './QuestionCard'
import { Modal } from '../common/Modal'

export const QuestionnaireForm = () => {
  const navigate = useNavigate()
  const { questions } = useQuestions()
  const { createResult } = useResults()

  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [showCompletionModal, setShowCompletionModal] = useState(false)
  const [resultId, setResultId] = useState(null)

  const currentQuestion = questions[currentIndex]
  const isFirst = currentIndex === 0
  const isLast = currentIndex === questions.length - 1

  const handleAnswerChange = (value) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: value,
    }))
    // Clear error when user starts typing
    if (errors[currentQuestion.id]) {
      setErrors((prev) => ({
        ...prev,
        [currentQuestion.id]: null,
      }))
    }
  }

  const validateCurrentQuestion = () => {
    if (currentQuestion.required && !answers[currentQuestion.id]) {
      setErrors((prev) => ({
        ...prev,
        [currentQuestion.id]: '필수 항목입니다',
      }))
      return false
    }
    return true
  }

  const handleNext = () => {
    if (validateCurrentQuestion()) {
      if (isLast) {
        handleSubmit()
      } else {
        setCurrentIndex((prev) => prev + 1)
      }
    }
  }

  const handlePrevious = () => {
    if (!isFirst) {
      setCurrentIndex((prev) => prev - 1)
    }
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      const result = await createResult(answers)
      setResultId(result.id)
      setShowCompletionModal(true)
    } catch (error) {
      console.error('설문 작성 오류:', error)
      setErrors({ submit: '설문 작성 중 오류가 발생했습니다' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewResults = () => {
    setShowCompletionModal(false)
    navigate(`/results/${resultId}`)
  }

  const handleNewQuestionnaire = () => {
    setCurrentIndex(0)
    setAnswers({})
    setErrors({})
    setShowCompletionModal(false)
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-base p-8 text-center shadow-card">
          <p className="text-neutral-text-secondary">사용 가능한 설문이 없습니다</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Progress Bar */}
      <div className="mb-8">
        <ProgressBar
          current={currentIndex + 1}
          total={questions.length}
        />
      </div>

      {/* Question Card */}
      {currentQuestion && (
        <div className="mb-8">
          <QuestionCard
            question={currentQuestion}
            value={answers[currentQuestion.id] || ''}
            onChange={handleAnswerChange}
            error={errors[currentQuestion.id]}
          />
        </div>
      )}

      {/* Submit Error */}
      {errors.submit && (
        <div className="mb-4 p-4 bg-semantic-error/10 border border-semantic-error rounded-base text-semantic-error text-small">
          {errors.submit}
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex gap-4">
        <Button
          variant="secondary"
          size="lg"
          onClick={handlePrevious}
          disabled={isFirst}
        >
          이전
        </Button>
        <Button
          variant="primary"
          size="full"
          onClick={handleNext}
          disabled={isLoading}
        >
          {isLoading ? '작성 중...' : isLast ? '완료' : '다음'}
        </Button>
      </div>

      {/* Completion Modal */}
      <Modal
        isOpen={showCompletionModal}
        onClose={handleNewQuestionnaire}
        title="설문 작성 완료"
        size="md"
      >
        <div className="text-center">
          <p className="text-h3 text-primary-500 mb-4">축하합니다!</p>
          <p className="text-body text-neutral-text-secondary mb-8">
            설문 작성이 완료되었습니다. 작성하신 답변은 결과에 저장되었습니다.
          </p>
          <div className="flex gap-4">
            <Button
              variant="secondary"
              size="full"
              onClick={handleNewQuestionnaire}
            >
              새로운 설문 작성
            </Button>
            <Button
              variant="primary"
              size="full"
              onClick={handleViewResults}
            >
              결과 보기
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default QuestionnaireForm
