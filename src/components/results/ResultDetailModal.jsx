import { Modal } from '../common/Modal'
import { Button } from '../common/Button'

export const ResultDetailModal = ({
  isOpen,
  onClose,
  result,
}) => {
  const handleCopy = () => {
    const jsonString = JSON.stringify(result.data, null, 2)
    navigator.clipboard.writeText(jsonString)
    alert('JSON이 복사되었습니다')
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="결과 상세보기"
      size="lg"
    >
      <div className="space-y-4">
        <div>
          <p className="text-label text-neutral-text-primary mb-2">생성된 데이터</p>
          <pre className="bg-neutral-bg p-4 rounded-base overflow-x-auto text-small text-neutral-text-primary max-h-96 overflow-y-auto">
            {JSON.stringify(result.data, null, 2)}
          </pre>
        </div>

        <Button
          variant="primary"
          size="full"
          onClick={handleCopy}
        >
          JSON 복사
        </Button>
      </div>
    </Modal>
  )
}

export default ResultDetailModal
