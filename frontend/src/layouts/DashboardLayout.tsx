import { Outlet } from 'react-router-dom'
import { Sidebar } from '../components/Sidebar'

export function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="border-b border-slate-200 bg-white px-6 py-4 space-y-2">
          <div>
            <h1 className="text-lg font-semibold text-slate-900">AI Resume Analyzer</h1>
            <p className="text-sm text-slate-500">Optimize your resume and ace your interviews</p>
          </div>
          <div className="rounded-md border border-amber-300 bg-amber-50 px-4 py-2 text-sm text-amber-900">
            <p className="font-medium">
              This is a demonstration version of the project.
            </p>
            <p>
              The AI Resume Analysis feature is currently disabled because the API key has expired or billing was removed.
            </p>
          </div>
        </div>
        <div className="p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
