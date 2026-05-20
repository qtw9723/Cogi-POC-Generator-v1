import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Card } from './common/Card'
import { Button } from './common/Button'
import { FormInput } from './common/FormInput'

export const AdminLogin = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [token, setToken] = useState('')
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      await login(token)
      navigate('/admin/questions')
    } catch (err) {
      setError('로그인 토큰이 유효하지 않습니다')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Card className="p-8">
          <h1 className="text-h2 text-primary-500 mb-2 text-center">관리자 로그인</h1>
          <p className="text-small text-neutral-text-secondary text-center mb-8">
            관리자 토큰을 입력하여 관리 페이지에 접근하세요
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <FormInput
              type="password"
              label="관리자 토큰"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="토큰을 입력해주세요"
              required
              error={error}
            />

            {error && (
              <div className="p-4 bg-semantic-error/10 border border-semantic-error rounded-base text-semantic-error text-small">
                {error}
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="full"
              disabled={isLoading || !token}
            >
              {isLoading ? '로그인 중...' : '로그인'}
            </Button>
          </form>

          <p className="text-small text-neutral-text-secondary text-center mt-6">
            토큰이 없으신가요?{' '}
            <button
              onClick={() => navigate('/')}
              className="text-accent-500 hover:text-accent-600 font-medium"
            >
              설문 작성하기
            </button>
          </p>
        </Card>
      </div>
    </div>
  )
}

export default AdminLogin
