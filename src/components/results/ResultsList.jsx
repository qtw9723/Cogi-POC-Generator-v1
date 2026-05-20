import { useEffect, useState } from 'react'
import { useResults } from '../../hooks/useResults'
import { Card } from '../common/Card'
import { Button } from '../common/Button'
import { ResultCard } from './ResultCard'
import { ResultDetailModal } from './ResultDetailModal'
import { FormInput } from '../common/FormInput'

export const ResultsList = () => {
  const { results, deleteResult } = useResults()
  const [filteredResults, setFilteredResults] = useState([])
  const [selectedResult, setSelectedResult] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortOrder, setSortOrder] = useState('newest')
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    let filtered = [...results]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter((result) =>
        result.id.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Sort
    filtered.sort((a, b) => {
      const dateA = new Date(a.created_at)
      const dateB = new Date(b.created_at)
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB
    })

    setFilteredResults(filtered)
  }, [results, searchTerm, sortOrder])

  const handleDelete = async (id) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      setIsDeleting(true)
      try {
        await deleteResult(id)
      } finally {
        setIsDeleting(false)
      }
    }
  }

  const handleViewResult = (result) => {
    setSelectedResult(result)
    setIsModalOpen(true)
  }

  if (results.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card className="p-8 text-center">
          <p className="text-neutral-text-secondary mb-6">아직 생성된 결과가 없습니다</p>
          <Button variant="primary" size="md">
            설문 작성하기
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-h2 text-primary-500 mb-8">생성된 결과</h1>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <FormInput
          type="text"
          label="검색"
          placeholder="결과 ID로 검색..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <FormInput
          type="select"
          label="정렬"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          options={[
            { value: 'newest', label: '최신순' },
            { value: 'oldest', label: '오래된순' },
          ]}
        />
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResults.map((result) => (
          <ResultCard
            key={result.id}
            result={result}
            onView={handleViewResult}
            onDelete={handleDelete}
            isLoading={isDeleting}
          />
        ))}
      </div>

      {filteredResults.length === 0 && searchTerm && (
        <div className="text-center py-8">
          <p className="text-neutral-text-secondary">검색 결과가 없습니다</p>
        </div>
      )}

      {/* Detail Modal */}
      <ResultDetailModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedResult(null)
        }}
        result={selectedResult}
      />
    </div>
  )
}

export default ResultsList
