import { Link } from 'react-router-dom'
import { useResults } from '../context/ResultsContext'
import { useAuth } from '../context/AuthContext'

export default function ResultList() {
  const { results, loading, deleteResult } = useResults()
  const { isAdmin } = useAuth()

  const handleDelete = async (id) => {
    if (window.confirm('삭제?')) {
      try {
        await deleteResult(id)
      } catch (err) {
        alert('실패: ' + err.message)
      }
    }
  }

  if (loading) return <div className="text-center py-12">로딩 중...</div>

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <h1 className="text-3xl font-bold mb-8">생성된 JSON 목록</h1>

      {results.length === 0 ? (
        <p className="text-gray-500 text-center py-12">생성된 JSON이 없습니다</p>
      ) : (
        <div className="space-y-4">
          {results.map(r => (
            <div key={r.id} className="border border-gray-200 rounded-lg p-4 flex justify-between items-center">
              <div>
                <Link to={`/results/${r.id}`} className="text-blue-600 hover:underline font-semibold">
                  {new Date(r.created_at).toLocaleString('ko-KR')}
                </Link>
                <p className="text-sm text-gray-500">ID: {r.id.slice(0, 8)}...</p>
              </div>
              <div className="space-x-2">
                <Link to={`/results/${r.id}`} className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">보기</Link>
                {isAdmin && <button onClick={() => handleDelete(r.id)} className="px-4 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700">삭제</button>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
