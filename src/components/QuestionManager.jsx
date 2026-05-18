import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useQuestions } from '../context/QuestionsContext'
import { INPUT_TYPES } from '../lib/constants'

export default function QuestionManager() {
  const { isAdmin, logout } = useAuth()
  const navigate = useNavigate()
  const { questions, loading, error: fetchError, createQuestion, updateQuestion, deleteQuestion, refetch } = useQuestions()

  // Debug: Track renders
  console.log('[QuestionManager] Rendering, isAdmin=', isAdmin)

  const [show, setShow] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState({ text: '', input_type: INPUT_TYPES.TEXT, is_required: true, options: [], order_index: 0 })
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      if (editId) {
        await updateQuestion(editId, form)
        setEditId(null)
      } else {
        await createQuestion(form)
      }
      setForm({ text: '', input_type: INPUT_TYPES.TEXT, is_required: true, options: [], order_index: 0 })
      setShow(false)
    } catch (err) {
      setError(err.message)
    }
  }

  const handleEdit = (q) => {
    setForm(q)
    setEditId(q.id)
    setShow(true)
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">질문 관리</h1>
        <button onClick={() => { logout(); navigate('/admin') }} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">로그아웃</button>
      </div>

      {fetchError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded text-red-700 mb-6 flex justify-between items-center">
          <span>{fetchError}</span>
          <button onClick={() => refetch()} className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm">다시 시도</button>
        </div>
      )}

      {error && <div className="p-4 bg-red-50 border border-red-200 rounded text-red-700 mb-6">{error}</div>}

      {!loading && !fetchError && !show && <button onClick={() => setShow(true)} className="mb-6 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700">+ 질문 추가</button>}

      {show && (
        <form onSubmit={handleSubmit} className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8 space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">질문 텍스트</label>
            <input type="text" value={form.text} onChange={(e) => setForm({...form, text: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg" required />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">입력 타입</label>
            <select value={form.input_type} onChange={(e) => setForm({...form, input_type: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg">
              <option value={INPUT_TYPES.TEXT}>텍스트</option>
              <option value={INPUT_TYPES.TEXTAREA}>여러 줄</option>
              <option value={INPUT_TYPES.SELECT}>선택지</option>
            </select>
          </div>

          {form.input_type === INPUT_TYPES.SELECT && (
            <div>
              <label className="block text-sm font-semibold mb-2">선택지 (줄 단위)</label>
              <textarea value={form.options.join('\n')} onChange={(e) => setForm({...form, options: e.target.value.split('\n').filter(x => x)})} className="w-full px-4 py-2 border border-gray-300 rounded-lg" rows="4" />
            </div>
          )}

          <label className="flex items-center text-sm font-semibold">
            <input type="checkbox" checked={form.is_required} onChange={(e) => setForm({...form, is_required: e.target.checked})} className="mr-2" />필수
          </label>

          <div className="flex gap-2">
            <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">{editId ? '수정' : '추가'}</button>
            <button type="button" onClick={() => { setShow(false); setEditId(null); setForm({ text: '', input_type: INPUT_TYPES.TEXT, is_required: true, options: [], order_index: 0 }) }} className="px-6 py-2 bg-gray-400 text-white rounded hover:bg-gray-500">취소</button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="text-center py-12">로딩 중...</div>
      ) : (
        <div className="space-y-3">
          {questions.map(q => (
          <div key={q.id} className="border border-gray-200 rounded-lg p-4 flex justify-between items-center">
            <div>
              <p className="font-semibold">{q.text}</p>
              <p className="text-sm text-gray-500">타입: {q.input_type} | 필수: {q.is_required ? '예' : '아니오'}</p>
            </div>
            <div className="space-x-2">
              <button onClick={() => handleEdit(q)} className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600">수정</button>
              <button onClick={() => { if (window.confirm('삭제?')) deleteQuestion(q.id) }} className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600">삭제</button>
            </div>
          </div>
          ))}
        </div>
      )}
    </div>
  )
}
