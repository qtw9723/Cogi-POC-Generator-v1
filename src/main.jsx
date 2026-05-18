import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { QuestionsProvider } from './context/QuestionsContext'
import { ReferencesProvider } from './context/ReferencesContext'
import { ResultsProvider } from './context/ResultsContext'
import App from './App'
import QuestionnaireForm from './components/QuestionnaireForm'
import ResultList from './components/ResultList'
import ResultDetail from './components/ResultDetail'
import AdminLogin from './components/AdminLogin'
import QuestionManager from './components/QuestionManager'
import ReferenceManager from './components/ReferenceManager'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <QuestionsProvider>
      <ReferencesProvider>
        <ResultsProvider>
          <Router>
            <Routes>
              <Route element={<App />}>
                <Route path="/" element={<QuestionnaireForm />} />
                <Route path="/results" element={<ResultList />} />
                <Route path="/results/:id" element={<ResultDetail />} />
                <Route path="/admin" element={<AdminLogin />} />
                <Route path="/admin/questions" element={<QuestionManager />} />
                <Route path="/admin/references" element={<ReferenceManager />} />
              </Route>
            </Routes>
          </Router>
        </ResultsProvider>
      </ReferencesProvider>
    </QuestionsProvider>
  </AuthProvider>
)
