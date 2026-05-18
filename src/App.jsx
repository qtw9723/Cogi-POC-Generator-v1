import { Link, useLocation, Outlet, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'

export default function App() {
  const { isAdmin, loading, logout } = useAuth()
  const location = useLocation()

  const isAdminRoute = location.pathname.startsWith('/admin')

  // Debug: Track renders
  console.log('[App] Rendering, isAdmin=', isAdmin, 'location=', location.pathname)

  // Redirect to /admin if trying to access admin routes without auth
  if (isAdminRoute && !loading && !isAdmin && location.pathname !== '/admin') {
    return <Navigate to="/admin" replace />
  }

  // Redirect to questions page if already authenticated and accessing login page
  if (location.pathname === '/admin' && !loading && isAdmin) {
    return <Navigate to="/admin/questions" replace />
  }

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
