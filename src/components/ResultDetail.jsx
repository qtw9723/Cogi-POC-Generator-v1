import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useResults } from '../context/ResultsContext'

export default function ResultDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getResultById } = useResults()
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getResultById(id).then(setResult).catch(e => setError(e.message)).finally(() => setLoading(false))
  }, [id])

  const handleDownload = () => {
    if (!result) return
    const dataStr = JSON.stringify(result.generated_json, null, 2)
    const blob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `cogi-${result.id.slice(0, 8)}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (loading) return <div className="text-center py-12">로딩 중...</div>
  if (error) return <div className="text-center py-12 text-red-600">{error}</div>
  if (!result) return <div className="text-center py-12">없음</div>

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <button onClick={() => navigate('/results')} className="mb-6 px-4 py-2 text-blue-600 hover:underline">← 돌아가기</button>

      <h1 className="text-3xl font-bold mb-8">생성된 JSON</h1>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-gray-500">{new Date(result.created_at).toLocaleString('ko-KR')}</p>
          <button onClick={handleDownload} className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700">다운로드</button>
        </div>
        <pre className="bg-white border border-gray-200 rounded p-4 overflow-auto max-h-96 text-xs">{JSON.stringify(result.generated_json, null, 2)}</pre>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">입력 값</h2>
        <pre className="bg-white border border-gray-200 rounded p-4 overflow-auto text-xs">{JSON.stringify(result.responses, null, 2)}</pre>
      </div>
    </div>
  )
}
