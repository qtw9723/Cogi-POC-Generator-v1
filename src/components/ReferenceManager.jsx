import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useReferences } from '../hooks/useReferences'

export default function ReferenceManager() {
  const { isAdmin, logout } = useAuth()
  const navigate = useNavigate()
  const { references, loading, uploadReference, learnRules, deleteReference } = useReferences()

  const [show, setShow] = useState(false)
  const [file, setFile] = useState(null)
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [learning, setLearning] = useState(null)

  useEffect(() => {
    if (!isAdmin) navigate('/admin')
  }, [isAdmin, navigate])

  const handleUpload = async (e) => {
    e.preventDefault()
    setError('')
    if (!file || !name) {
      setError('파일과 이름 필수')
      return
    }
    try {
      const text = await file.text()
      const json = JSON.parse(text)
      await uploadReference(name, json)
      setFile(null)
      setName('')
      setShow(false)
    } catch (err) {
      setError('파일 읽기 실패: ' + err.message)
    }
  }

  const handleLearn = async (id) => {
    setLearning(id)
    setError('')
    try {
      await learnRules(id)
    } catch (err) {
      setError('학습 실패: ' + err.message)
    } finally {
      setLearning(null)
    }
  }

  const handleDownload = (ref) => {
    const dataStr = JSON.stringify(ref.json_data, null, 2)
    const blob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${ref.name}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">레퍼런스 관리</h1>
        <button onClick={() => { logout(); navigate('/admin') }} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">로그아웃</button>
      </div>

      {error && <div className="p-4 bg-red-50 border border-red-200 rounded text-red-700 mb-6">{error}</div>}

      {!show && <button onClick={() => setShow(true)} className="mb-6 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700">+ 업로드</button>}

      {show && (
        <form onSubmit={handleUpload} className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8 space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">레퍼런스 이름</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="봇 이름" required />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">JSON 파일</label>
            <input type="file" accept=".json" onChange={(e) => setFile(e.target.files?.[0])} className="w-full px-4 py-2 border border-gray-300 rounded-lg" required />
            {file && <p className="text-sm text-gray-600 mt-1">{file.name}</p>}
          </div>

          <div className="flex gap-2">
            <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">업로드</button>
            <button type="button" onClick={() => { setShow(false); setFile(null); setName('') }} className="px-6 py-2 bg-gray-400 text-white rounded hover:bg-gray-500">취소</button>
          </div>
        </form>
      )}

      {loading ? <div className="text-center py-12">로딩...</div> : (
        <div className="space-y-3">
          {references.map(ref => (
            <div key={ref.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="font-semibold text-lg">{ref.name}</p>
                  <p className="text-sm text-gray-500">{new Date(ref.created_at).toLocaleString('ko-KR')}</p>
                  <p className="text-sm mt-2">
                    상태: <span className={ref.template_status === 'completed' ? 'text-green-600 font-semibold' : 'text-yellow-600 font-semibold'}>
                      {ref.template_status === 'completed' ? '✓ 완료' : '⚠️ 학습 필요'}
                    </span>
                  </p>
                </div>
                <div className="space-x-2">
                  {ref.template_status !== 'completed' && (
                    <button onClick={() => handleLearn(ref.id)} disabled={learning === ref.id} className="px-4 py-2 text-sm bg-purple-600 text-white rounded hover:bg-purple-700 disabled:bg-gray-400">
                      {learning === ref.id ? '중...' : '학습'}
                    </button>
                  )}
                  <button onClick={() => handleDownload(ref)} className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">다운</button>
                  <button onClick={() => { if (window.confirm('삭제?')) deleteReference(ref.id) }} className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700">삭제</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
