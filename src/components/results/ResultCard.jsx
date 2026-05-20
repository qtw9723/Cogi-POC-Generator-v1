import { Card } from '../common/Card'
import { Button } from '../common/Button'

export const ResultCard = ({
  result,
  onView,
  onDelete,
  isLoading = false,
}) => {
  const formattedDate = new Date(result.created_at).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <Card className="p-6" highlight={true}>
      <h3 className="text-h3 text-primary-500 mb-2">결과 #{result.id.slice(0, 8)}</h3>
      <p className="text-small text-neutral-text-secondary mb-6">{formattedDate}</p>

      <div className="flex gap-3">
        <Button
          variant="primary"
          size="md"
          onClick={() => onView(result)}
          disabled={isLoading}
        >
          보기
        </Button>
        <Button
          variant="danger"
          size="md"
          onClick={() => onDelete(result.id)}
          disabled={isLoading}
        >
          삭제
        </Button>
      </div>
    </Card>
  )
}

export default ResultCard
