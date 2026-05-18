import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuestions } from '../hooks/useQuestions'
import { useResults } from '../hooks/useResults'

export default function QuestionnaireForm() {
  const { questions, loading: qLoading } = useQuestions()
  const { createResult, loading: gLoading } = useResults()
  const navigate = useNavigate()

  const [responses, setResponses] = useState({})
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const missing = questions.filter(q => q.is_required && !responses[q.id]).map(q => q.text)
    if (missing.length > 0) {
      setError(`필수: ${missing.join(', ')}`)
      return
    }

    try {
      // 최신 학습된 reference는 백엔드에서 자동으로 찾음
      const result = await createResult(responses)
      navigate(`/results/${result.id}`)
    } catch (err) {
      setError(err.message)
    }
  }

  if (qLoading) return <div className="text-center py-12">로딩 중...</div>

  return (
    <div className="max-w-2xl mx-auto py-12 px-6">
      <h1 className="text-3xl font-bold mb-8">챗봇 JSON 생성기</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold mb-2">레퍼런스 선택 *</label>
          <select value={selectedRefId} onChange={(e) => setSelectedRefId(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg">
            <option value="">-- 선택하세요 --</option>
            {references.map(r => (
              <option key={r.id} value={r.id}>
                {r.name} {r.template_status === 'pending' ? '(학습 필요)' : '✓'}
              </option>
            ))}
          </select>
        </div>

        {error && <div className="p-4 bg-red-50 border border-red-200 rounded text-red-700">{error}</div>}

        {questions.map(q => (
          <div key={q.id}>
            <label className="block text-sm font-semibold mb-2">
              {q.text}
              {q.is_required && <span className="text-red-500 ml-1">*</span>}
            </label>

            {q.input_type === 'text' && (
              <input type="text" value={responses[q.id] || ''} onChange={(e) => setResponses({...responses, [q.id]: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
            )}

            {q.input_type === 'textarea' && (
              <textarea value={responses[q.id] || ''} onChange={(e) => setResponses({...responses, [q.id]: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg" rows="4" />
            )}

            {q.input_type === 'select' && (
              <select value={responses[q.id] || ''} onChange={(e) => setResponses({...responses, [q.id]: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg">
                <option value="">선택</option>
                {q.options?.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            )}
          </div>
        ))}

        <button type="submit" disabled={gLoading} className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400">
          {gLoading ? '생성 중...' : 'JSON 생성'}
        </button>
      </form>
    </div>
  )
}
