import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { CheckCircle, XCircle, Lightbulb } from 'lucide-react'
import { resumeApi, analysisApi } from '../services/api'
import { Button } from '../components/Button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card'

interface AnalysisState {
  atsScore: number
  matchedSkills: string[]
  missingSkills: string[]
  recommendations: string[]
  experienceGaps?: string[]
  interviewQuestions?: { technical: string[]; behavioral: string[] }
}

// const COLORS = ['#4f46e5', '#22c55e', '#3b82f6', '#f59e0b']

export function AnalysisDashboard() {
  const location = useLocation()
  const navigate = useNavigate()
  const resumeId = (location.state as { resumeId?: number })?.resumeId

  const [jobDescription, setJobDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [data, setData] = useState<AnalysisState | null>(null)
  const [resumes, setResumes] = useState<{ id: number; fileName: string }[]>([])
  const [selectedResumeId, setSelectedResumeId] = useState<number | null>(resumeId ?? null)

  useEffect(() => {
    resumeApi.list().then((r) => {
      setResumes(r.data)
      if (r.data.length && !selectedResumeId) setSelectedResumeId(r.data[0].id)
    }).catch(() => {})
  }, [])

  const runAnalysis = async () => {
    const id = selectedResumeId ?? resumeId
    if (!id) {
      setError('Please upload a resume first')
      return
    }
    setLoading(true)
    setError('')
    try {
      const { data: matchData } = await analysisApi.match(id, jobDescription || '')
      const { data: questionsData } = await resumeApi.getQuestions(id, jobDescription || undefined).catch(() => ({ data: { technical: [], behavioral: [] } }))
      setData({
        atsScore: matchData.atsScore ?? 0,
        matchedSkills: matchData.matchingSkills ?? [],
        missingSkills: matchData.missingSkills ?? [],
        recommendations: matchData.suggestions ?? [],
        experienceGaps: matchData.experienceGaps ?? [],
        interviewQuestions: questionsData,
      })
    } catch (err: unknown) {
      const res = err as { response?: { data?: { error?: string; message?: string; success?: boolean } } }
      const msg = res?.response?.data?.message || res?.response?.data?.error
      if (msg === 'AI analysis temporarily disabled' || res?.response?.data?.success === false) {
        setError('AI analysis is disabled in this demo build.')
      } else {
        setError(msg || 'Analysis failed')
      }
    } finally {
      setLoading(false)
    }
  }

  const chartData = data
    ? [
        { name: 'Matched', value: data.matchedSkills.length, fill: '#22c55e' },
        { name: 'Missing', value: data.missingSkills.length, fill: '#ef4444' },
      ]
    : []

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Analysis Dashboard</h1>
        <p className="mt-1 text-slate-600">View ATS score, skills match, and improvement suggestions</p>
      </div>

      {resumes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Select Resume</CardTitle>
            <p className="text-sm text-slate-500">Choose which resume to analyze</p>
          </CardHeader>
          <CardContent>
            <select
                value={selectedResumeId ?? ''}
                onChange={(e) => setSelectedResumeId(parseInt(e.target.value, 10))}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
              >
                {resumes.map((r) => (
                  <option key={r.id} value={r.id}>{r.fileName}</option>
                ))}
              </select>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Job Description (Optional)</CardTitle>
          <p className="text-sm text-slate-500">Paste a job description for better matching and suggestions</p>
        </CardHeader>
        <CardContent>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste job description here..."
            rows={4}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
          <Button className="mt-4" onClick={runAnalysis} disabled={loading || !selectedResumeId}>
            {loading ? 'Analyzing...' : 'Run Analysis'}
          </Button>
          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        </CardContent>
      </Card>

      {data && (
        <>
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>ATS Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-indigo-100 text-3xl font-bold text-indigo-700">
                    {data.atsScore ?? 0}
                  </div>
                  <p className="text-slate-600">Compatibility score out of 100</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Skills Match</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={60}
                        paddingAngle={2}
                        dataKey="value"
                        nameKey="name"
                      >
                        {chartData.map((_, i) => (
                          <Cell key={i} fill={chartData[i].fill} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex gap-4 text-sm">
                  <span className="flex items-center gap-1"><span className="h-3 w-3 rounded-full bg-green-500" /> Matched: {data.matchedSkills.length}</span>
                  <span className="flex items-center gap-1"><span className="h-3 w-3 rounded-full bg-red-500" /> Missing: {data.missingSkills.length}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Matched Skills
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="flex flex-wrap gap-2">
                  {data.matchedSkills.length ? data.matchedSkills.map((s) => (
                    <li key={s} className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-800">
                      {s}
                    </li>
                  )) : <li className="text-slate-500">None detected</li>}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-red-600" />
                  Missing Skills
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="flex flex-wrap gap-2">
                  {data.missingSkills.length ? data.missingSkills.map((s) => (
                    <li key={s} className="rounded-full bg-red-100 px-3 py-1 text-sm text-red-800">
                      {s}
                    </li>
                  )) : <li className="text-slate-500">None - great match!</li>}
                </ul>
              </CardContent>
            </Card>
          </div>

          {data.experienceGaps && data.experienceGaps.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Experience Gaps</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-inside list-disc space-y-2 text-slate-700">
                  {data.experienceGaps.map((g, i) => (
                    <li key={i}>{g}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-amber-500" />
                Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-inside list-disc space-y-2 text-slate-700">
                {data.recommendations?.length ? data.recommendations.map((r, i) => (
                  <li key={i}>{r}</li>
                )) : <li>No specific recommendations.</li>}
              </ul>
            </CardContent>
          </Card>

          <Button onClick={() => navigate('/app/questions', { state: { resumeId: selectedResumeId ?? resumeId, jobDescription } })}>
            View Interview Questions
          </Button>
        </>
      )}
    </div>
  )
}
