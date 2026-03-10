import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Copy, Check } from 'lucide-react'
import { resumeApi } from '../services/api'
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card'

export function InterviewQuestionsPage() {
  const location = useLocation()
  const { resumeId, jobDescription } = (location.state as { resumeId?: number; jobDescription?: string }) ?? {}

  const [questions, setQuestions] = useState<{ technical: string[]; behavioral: string[] } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState<string | null>(null)
  const [resumes, setResumes] = useState<{ id: number; fileName: string }[]>([])
  const [selectedResumeId, setSelectedResumeId] = useState<number | null>(resumeId ?? null)

  useEffect(() => {
    resumeApi.list().then((r) => {
      setResumes(r.data)
      if (r.data.length && !selectedResumeId) setSelectedResumeId(r.data[0].id)
    }).catch(() => {})
  }, [])

  useEffect(() => {
    const id = selectedResumeId ?? resumeId
    if (!id) return
    setLoading(true)
    setError('')
    resumeApi.getQuestions(id, jobDescription)
      .then((r) => setQuestions(r.data))
      .catch(() => setError('Failed to load questions'))
      .finally(() => setLoading(false))
  }, [selectedResumeId, resumeId, jobDescription])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(text)
      setTimeout(() => setCopied(null), 2000)
    })
  }

  if (loading) return <div className="text-slate-600">Loading questions...</div>
  if (error) return <div className="text-red-600">{error}</div>
  if (!questions && !loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Interview Questions</h1>
        <p className="mt-4 text-slate-600">Upload and analyze a resume first to generate questions.</p>
      </div>
    )
  }

  const QuestionList = ({ items, title }: { items: string[]; title: string }) => (
    <div className="space-y-3">
      <h3 className="font-semibold text-slate-900">{title}</h3>
      <ul className="space-y-2">
        {items.map((q, i) => (
          <li
            key={i}
            className="group flex items-start gap-2 rounded-lg border border-slate-200 bg-white p-4 text-slate-700"
          >
            <span className="flex-1">{q}</span>
            <button
              onClick={() => copyToClipboard(q)}
              className="rounded p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              title="Copy"
            >
              {copied === q ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Interview Questions</h1>
        <p className="mt-1 text-slate-600">Personalized technical and behavioral questions based on your resume</p>
      </div>

      {resumes.length > 1 && (
        <Card>
          <CardContent className="pt-6">
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
          </CardContent>
        </Card>
      )}

      <div className="grid gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Technical Questions</CardTitle>
            <p className="text-sm text-slate-500">10 questions based on your technical background</p>
          </CardHeader>
          <CardContent>
            <QuestionList items={questions?.technical ?? []} title="" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Behavioral Questions</CardTitle>
            <p className="text-sm text-slate-500">5 questions to prepare for behavioral interviews</p>
          </CardHeader>
          <CardContent>
            <QuestionList items={questions?.behavioral ?? []} title="" />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
