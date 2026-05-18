import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import App from './App'
import QuestionnaireForm from './components/QuestionnaireForm'
import ResultList from './components/ResultList'
import ResultDetail from './components/ResultDetail'
import AdminLogin from './components/AdminLogin'
import QuestionManager from './components/QuestionManager'
import ReferenceManager from './components/ReferenceManager'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
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
  </React.StrictMode>
)
