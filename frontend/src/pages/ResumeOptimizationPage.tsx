import { useState, useEffect } from 'react'
import { Sparkles, Target, ListChecks, FileText, Wand2 } from 'lucide-react'
import { resumeApi, aiApi } from '../services/api'
import { Button } from '../components/Button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card'

interface SuggestionsData {
  resumeScore: number
  missingKeywords: string[]
  improvementSuggestions: string[]
  optimizedSummary: string
}

interface ImprovedResumeData {
  improvedResume: string
  suggestions: string[]
}

export function ResumeOptimizationPage() {
  const [resumes, setResumes] = useState<{ id: number; fileName: string }[]>([])
  const [selectedResumeId, setSelectedResumeId] = useState<number | null>(null)
  const [jobDescription, setJobDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [improveLoading, setImproveLoading] = useState(false)
  const [error, setError] = useState('')
  const [data, setData] = useState<SuggestionsData | null>(null)
  const [improvedData, setImprovedData] = useState<ImprovedResumeData | null>(null)

  useEffect(() => {
    resumeApi.list()
      .then((r) => {
        setResumes(r.data)
        if (r.data.length && !selectedResumeId) setSelectedResumeId(r.data[0].id)
      })
      .catch(() => {})
  }, [])

  const runOptimization = async () => {
    if (!selectedResumeId) {
      setError('Please select a resume')
      return
    }
    setLoading(true)
    setError('')
    setData(null)
    try {
      const { data: res } = await resumeApi.getSuggestions(selectedResumeId, jobDescription || undefined)
      setData(res)
    } catch (err: unknown) {
      setError((err as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Optimization failed')
    } finally {
      setLoading(false)
    }
  }

  const runImproveResume = async () => {
    if (!selectedResumeId) {
      setError('Please select a resume')
      return
    }
    setImproveLoading(true)
    setError('')
    setImprovedData(null)
    try {
      const { data: resume } = await resumeApi.getById(selectedResumeId)
      const { data: res } = await aiApi.improveResume(resume.extractedText || '')
      setImprovedData({ improvedResume: res.improvedResume, suggestions: res.suggestions ?? [] })
    } catch (err: unknown) {
      setError((err as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Improvement failed')
    } finally {
      setImproveLoading(false)
    }
  }

  const scoreColor = data
    ? data.resumeScore >= 70
      ? 'text-green-600'
      : data.resumeScore >= 50
        ? 'text-amber-600'
        : 'text-red-600'
    : ''

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Resume Optimization</h1>
        <p className="mt-1 text-slate-600">AI-powered suggestions to improve your resume</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Get Suggestions</CardTitle>
          <p className="text-sm text-slate-500">Select a resume and optionally add a job description for targeted advice</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {resumes.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-slate-700">Resume</label>
              <select
                value={selectedResumeId ?? ''}
                onChange={(e) => setSelectedResumeId(parseInt(e.target.value, 10))}
                className="mt-1 rounded-lg border border-slate-300 px-3 py-2 text-sm"
              >
                {resumes.map((r) => (
                  <option key={r.id} value={r.id}>{r.fileName}</option>
                ))}
              </select>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-slate-700">Job Description (Optional)</label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste job description for tailored suggestions..."
              rows={3}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={runOptimization} disabled={loading || !selectedResumeId}>
              {loading ? 'Analyzing...' : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Get Suggestions
                </>
              )}
            </Button>
            <Button onClick={runImproveResume} disabled={improveLoading || !selectedResumeId} variant="secondary">
              {improveLoading ? 'Improving...' : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" />
                  AI Improve Resume
                </>
              )}
            </Button>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
        </CardContent>
      </Card>

      {improvedData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wand2 className="h-5 w-5 text-indigo-600" />
              AI Improved Resume
            </CardTitle>
            <p className="text-sm text-slate-500">Rewritten bullet points, ATS-optimized, with impact metrics</p>
          </CardHeader>
          <CardContent>
            <pre className="whitespace-pre-wrap rounded-lg bg-slate-50 p-4 text-sm text-slate-700 font-sans">
              {improvedData.improvedResume}
            </pre>
            {improvedData.suggestions?.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium text-slate-700">Suggestions</h4>
                <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-slate-600">
                  {improvedData.suggestions.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {data && (
        <>
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-indigo-600" />
                  Resume Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center">
                  <div
                    className={`text-5xl font-bold ${scoreColor}`}
                  >
                    {data.resumeScore}
                  </div>
                  <p className="mt-1 text-slate-500">out of 100</p>
                  <div className="mt-4 h-3 w-full max-w-xs overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${data.resumeScore}%`,
                        backgroundColor: data.resumeScore >= 70 ? '#22c55e' : data.resumeScore >= 50 ? '#f59e0b' : '#ef4444',
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-indigo-600" />
                  Optimized Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="rounded-lg bg-slate-50 p-4 text-slate-700">{data.optimizedSummary}</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Missing Keywords
                </CardTitle>
                <p className="text-sm text-slate-500">Add these to improve ATS matching</p>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {data.missingKeywords.length ? data.missingKeywords.map((k) => (
                    <span
                      key={k}
                      className="rounded-full bg-amber-100 px-3 py-1 text-sm text-amber-800"
                    >
                      {k}
                    </span>
                  )) : <p className="text-slate-500">No missing keywords detected</p>}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ListChecks className="h-5 w-5 text-indigo-600" />
                  Improvement Suggestions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-inside list-disc space-y-2 text-slate-700">
                  {data.improvementSuggestions.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {resumes.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="mx-auto h-12 w-12 text-slate-400" />
            <p className="mt-2 font-medium text-slate-600">Upload a resume first</p>
            <p className="text-sm text-slate-500">Go to Upload Resume to get started</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
