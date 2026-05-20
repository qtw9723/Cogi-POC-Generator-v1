import { Card } from '../common/Card'
import { FormInput } from '../common/FormInput'

export const QuestionCard = ({
  question,
  value,
  onChange,
  error = null,
}) => {
  if (!question) return null

  const getOptions = () => {
    if (typeof question.options === 'string') {
      return JSON.parse(question.options)
    }
    return question.options || []
  }

  return (
    <Card className="p-8">
      <div className="mb-6">
        <h3 className="text-h3 text-primary-500 mb-2">{question.text}</h3>
        {question.description && (
          <p className="text-small text-neutral-text-secondary">{question.description}</p>
        )}
      </div>

      <FormInput
        type={question.type}
        value={value}
        onChange={(e) => {
          if (question.type === 'checkbox') {
            onChange(e)
          } else if (question.type === 'radio') {
            onChange(e.target.value)
          } else {
            onChange(e.target.value)
          }
        }}
        placeholder={`${question.text}를 입력해주세요`}
        options={getOptions()}
        rows={question.type === 'textarea' ? 4 : undefined}
        required={question.required}
        error={error}
      />
    </Card>
  )
}

export default QuestionCard
