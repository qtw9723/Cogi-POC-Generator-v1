import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export const Header = () => {
  const navigate = useNavigate()
  const { isAuthenticated, logout } = useAuth()

  const navItems = [
    { label: '생성기', path: '/' },
    { label: '결과', path: '/results' },
  ]

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-40 bg-primary-500 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <div className="w-8 h-8 bg-accent-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">MW</span>
          </div>
          <span className="font-bold text-lg hidden sm:inline">MindwareWorks</span>
        </button>

        {/* Navigation */}
        <nav className="flex items-center gap-6">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="text-sm font-medium hover:text-accent-100 transition-colors"
            >
              {item.label}
            </button>
          ))}

          {isAuthenticated && (
            <button
              onClick={() => navigate('/admin/questions')}
              className="text-sm font-medium hover:text-accent-100 transition-colors border-l border-white/20 pl-6"
            >
              관리
            </button>
          )}
        </nav>

        {/* User Menu */}
        {isAuthenticated && (
          <button
            onClick={handleLogout}
            className="text-sm font-medium hover:text-accent-100 transition-colors"
          >
            로그아웃
          </button>
        )}
      </div>
    </header>
  )
}

export default Header
