import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FileText, BarChart3, TrendingUp, ArrowRight, Briefcase } from 'lucide-react'
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { resumeApi, jobsApi } from '../services/api'
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card'

export function DashboardHome() {
  const [resumes, setResumes] = useState<{ id: number; fileName: string }[]>([])
  const [jobCount, setJobCount] = useState(0)

  useEffect(() => {
    resumeApi.list()
      .then((r) => setResumes(r.data))
      .catch(() => {})
    jobsApi.recommendations()
      .then((r) => setJobCount(r.data?.length ?? 0))
      .catch(() => {})
  }, [])

  const chartData = [
    { name: 'Resumes', value: resumes.length, fill: '#4f46e5' },
    { name: 'Ready', value: Math.max(0, 5 - resumes.length), fill: '#e2e8f0' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="mt-1 text-slate-600">Overview of your resume analysis activity</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Resumes</CardTitle>
            <FileText className="h-5 w-5 text-slate-400" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-slate-900">{resumes.length}</p>
            <p className="mt-1 text-sm text-slate-500">Uploaded resumes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">ATS Score</CardTitle>
            <BarChart3 className="h-5 w-5 text-slate-400" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-indigo-600">Analyze</p>
            <Link
              to="/app/analysis"
              className="mt-2 inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-700"
            >
              Run analysis <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Job Matches</CardTitle>
            <Briefcase className="h-5 w-5 text-slate-400" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-slate-900">{jobCount}</p>
            <Link
              to="/app/jobs"
              className="mt-2 inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-700"
            >
              View recommendations <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Resume Health</CardTitle>
            <TrendingUp className="h-5 w-5 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="h-20">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={25}
                    outerRadius={35}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {chartData.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <p className="text-sm text-slate-500">Upload more to improve</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Resumes</CardTitle>
          <p className="text-sm text-slate-500">Your uploaded resumes</p>
        </CardHeader>
        <CardContent>
          {resumes.length === 0 ? (
            <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center">
              <FileText className="mx-auto h-12 w-12 text-slate-400" />
              <p className="mt-2 text-sm font-medium text-slate-600">No resumes yet</p>
              <p className="text-sm text-slate-500">Upload your first resume to get started</p>
              <Link
                to="/app/upload"
                className="mt-4 inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
              >
                Upload Resume
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-slate-200">
              {resumes.slice(0, 5).map((r) => (
                <li key={r.id} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50">
                      <FileText className="h-5 w-5 text-indigo-600" />
                    </div>
                    <span className="font-medium text-slate-900">{r.fileName}</span>
                  </div>
                  <Link
                    to="/app/analysis"
                    state={{ resumeId: r.id }}
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
                  >
                    Analyze
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
