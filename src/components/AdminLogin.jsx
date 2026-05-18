import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function AdminLogin() {
  const [id, setId] = useState('')
  const [pw, setPw] = useState('')
  const [error, setError] = useState('')
  const { isAdmin, login } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAdmin) navigate('/admin/questions')
  }, [isAdmin])

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    if (login(id, pw)) {
      navigate('/admin/questions')
    } else {
      setError('아이디/비밀번호 오류')
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">어드민 로그인</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">아이디</label>
            <input type="text" value={id} onChange={(e) => setId(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="master" />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">비밀번호</label>
            <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg" placeholder="master" />
          </div>

          {error && <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">{error}</div>}

          <button type="submit" className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700">로그인</button>
        </form>
      </div>
    </div>
  )
}
