import { Link, useLocation, Outlet } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'

export default function App() {
  const { isAdmin, logout } = useAuth()
  const location = useLocation()

  const isAdminRoute = location.pathname.startsWith('/admin')

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-blue-600">
            Cogi POC
          </Link>
          <div className="space-x-4">
            <Link to="/" className="text-gray-600 hover:text-blue-600">생성기</Link>
            <Link to="/results" className="text-gray-600 hover:text-blue-600">결과</Link>
            {!isAdmin && (
              <Link to="/admin" className="text-gray-600 hover:text-blue-600">어드민</Link>
            )}
            {isAdmin && (
              <>
                <Link to="/admin/questions" className="text-gray-600 hover:text-blue-600">질문</Link>
                <Link to="/admin/references" className="text-gray-600 hover:text-blue-600">레퍼런스</Link>
                <button onClick={() => { logout(); window.location.href = '/' }} className="text-red-600 hover:text-red-700">로그아웃</button>
              </>
            )}
          </div>
        </div>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  )
}
