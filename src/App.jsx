import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { QuestionsProvider } from './context/QuestionsContext'
import { ReferencesProvider } from './context/ReferencesContext'
import { ResultsProvider } from './context/ResultsContext'
import { Header } from './components/layout/Header'
import QuestionnaireForm from './components/questionnaire/QuestionnaireForm'
import ResultsList from './components/results/ResultsList'
import ResultDetail from './components/ResultDetail'
import AdminLogin from './components/AdminLogin'
import QuestionManager from './components/QuestionManager'
import ReferenceManager from './components/ReferenceManager'

const ProtectedRoute = ({ element }) => {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? element : <Navigate to="/admin/login" replace />
}

const AppContent = () => {
  const { isAuthenticated } = useAuth()

  return (
    <>
      <Header />
      <main className="min-h-screen bg-neutral-bg">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<QuestionnaireForm />} />
          <Route path="/results" element={<ResultsList />} />
          <Route path="/results/:id" element={<ResultDetail />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={isAuthenticated ? <Navigate to="/admin/questions" /> : <AdminLogin />} />
          <Route
            path="/admin/questions"
            element={<ProtectedRoute element={<QuestionManager />} />}
          />
          <Route
            path="/admin/references"
            element={<ProtectedRoute element={<ReferenceManager />} />}
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  )
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <QuestionsProvider>
          <ReferencesProvider>
            <ResultsProvider>
              <AppContent />
            </ResultsProvider>
          </ReferencesProvider>
        </QuestionsProvider>
      </AuthProvider>
    </Router>
  )
}
