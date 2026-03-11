import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  FileUp,
  BarChart3,
  MessageSquare,
  Sparkles,
  MessageCircle,
  Settings,
  LogOut,
  Briefcase,
  Users,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { cn } from '../utils/cn'

const userNav = [
  { to: '/app', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/app/upload', icon: FileUp, label: 'Upload Resume', end: false },
  { to: '/app/analysis', icon: BarChart3, label: 'Analysis', end: false },
  { to: '/app/interview-prep', icon: MessageSquare, label: 'Interview Prep', end: false },
  { to: '/app/optimization', icon: Sparkles, label: 'Resume Builder', end: false },
  { to: '/app/assistant', icon: MessageCircle, label: 'AI Assistant', end: false },
  { to: '/app/jobs', icon: Briefcase, label: 'Job Recommendations', end: false },
  { to: '/app/settings', icon: Settings, label: 'Settings', end: false },
]

export function Sidebar() {
  const { logout, email, role } = useAuth()
  const navigate = useNavigate()
  const nav =
    role === 'RECRUITER'
      ? [
          ...userNav,
          { to: '/app/recruiter', icon: Users, label: 'Recruiter Dashboard', end: false as const },
        ]
      : userNav

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <aside className="flex w-64 flex-col border-r border-slate-200 bg-white">
      <div className="flex h-16 items-center gap-2 border-b border-slate-200 px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white font-semibold">
          AR
        </div>
        <span className="font-semibold text-slate-900">Resume Analyzer</span>
      </div>
      <nav className="flex-1 space-y-0.5 overflow-y-auto p-4">
        {nav.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              )
            }
          >
            <Icon className="h-5 w-5 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-slate-200 p-4">
        <p className="truncate px-3 text-sm text-slate-500">{email}</p>
        <button
          onClick={handleLogout}
          className="mt-2 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
        >
          <LogOut className="h-5 w-5" />
          Sign out
        </button>
      </div>
    </aside>
  )
}
