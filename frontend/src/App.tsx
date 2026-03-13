import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import { DashboardLayout } from './layouts/DashboardLayout'
import { LandingPage } from './pages/LandingPage'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { ResetPasswordPage } from './pages/ResetPasswordPage'
import { DashboardHome } from './pages/DashboardHome'
import { UploadPage } from './pages/UploadPage'
import { AnalysisDashboard } from './pages/AnalysisDashboard'
import { InterviewQuestionsPage } from './pages/InterviewQuestionsPage'
import { InterviewPrepPage } from './pages/InterviewPrepPage'
import { ResumeOptimizationPage } from './pages/ResumeOptimizationPage'
import { JobsPage } from './pages/JobsPage'
import { RecruiterDashboardPage } from './pages/RecruiterDashboardPage'
import { AIAssistantPage } from './pages/AIAssistantPage'
import { SettingsPage } from './pages/SettingsPage'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { token } = useAuth()
  if (!token) return <Navigate to="/login" replace />
  return <>{children}</>
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardHome />} />
        <Route path="upload" element={<UploadPage />} />
        <Route path="analysis" element={<AnalysisDashboard />} />
        <Route path="interview-prep" element={<InterviewPrepPage />} />
        <Route path="questions" element={<InterviewQuestionsPage />} />
        <Route path="optimization" element={<ResumeOptimizationPage />} />
        <Route path="assistant" element={<AIAssistantPage />} />
        <Route path="jobs" element={<JobsPage />} />
        <Route path="recruiter" element={<RecruiterDashboardPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
