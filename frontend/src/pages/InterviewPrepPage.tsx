import { useState, useEffect } from 'react'
import { FileQuestion, Target } from 'lucide-react'
import { resumeApi, aiApi } from '../services/api'
import { Button } from '../components/Button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card'

type QuestionSet = {
  technical: string[]
  hr: string[]
  systemDesign: string[]
}

export function InterviewPrepPage() {
  const [resumes, setResumes] = useState<{ id: number; fileName: string; extractedText?: string }[]>([])
  const [selectedResumeId, setSelectedResumeId] = useState<number | null>(null)
  const [resumeText, setResumeText] = useState('')
  const [questions, setQuestions] = useState<QuestionSet | null>(null)
  const [mockResult, setMockResult] = useState<{
    score: number
    feedback: string
    improvementAreas: string[]
  } | null>(null)
  const [jobDescription, setJobDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'questions' | 'mock'>('questions')

  useEffect(() => {
    resumeApi.list().then((r) => {
      setResumes(r.data)
      if (r.data.length && !selectedResumeId) setSelectedResumeId(r.data[0].id)
    }).catch(() => {})
  }, [])

  useEffect(() => {
    if (selectedResumeId) {
      resumeApi
        .getById(selectedResumeId)
        .then((r) => setResumeText(r.data.extractedText?.slice(0, 8000) ?? ''))
        .catch(() => setResumeText(''))
    }
  }, [selectedResumeId])

  const generateQuestions = async () => {
    let text = resumeText
    if (!text && selectedResumeId) {
      const r = resumes.find((x) => x.id === selectedResumeId)
      text = r?.extractedText ?? ''
    }
    if (!text?.trim()) return
    setLoading(true)
    setQuestions(null)
    try {
      const { data } = await aiApi.interviewQuestions(text)
      setQuestions({
        technical: data.technical ?? [],
        hr: data.hr ?? [],
        systemDesign: data.systemDesign ?? [],
      })
    } catch {
      setQuestions({ technical: [], hr: [], systemDesign: [] })
    } finally {
      setLoading(false)
    }
  }

  const runMockInterview = async () => {
    let text = resumeText
    if (!text && selectedResumeId) {
      const r = resumes.find((x) => x.id === selectedResumeId)
      text = r?.extractedText ?? ''
    }
    if (!text?.trim()) return
    setLoading(true)
    setMockResult(null)
    try {
      const { data } = await aiApi.mockInterview(text, jobDescription || undefined)
      setMockResult({
        score: data.score ?? 0,
        feedback: data.feedback ?? '',
        improvementAreas: data.improvementAreas ?? [],
      })
    } catch {
      setMockResult({ score: 0, feedback: 'Evaluation failed', improvementAreas: [] })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Interview Prep</h1>
        <p className="mt-1 text-slate-600">AI-generated questions and mock interview evaluation</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Select Resume</CardTitle>
          <p className="text-sm text-slate-500">Choose a resume to generate questions or run mock interview</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {resumes.length > 0 && (
            <select
              value={selectedResumeId ?? ''}
              onChange={(e) => setSelectedResumeId(parseInt(e.target.value, 10))}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
            >
              {resumes.map((r) => (
                <option key={r.id} value={r.id}>{r.fileName}</option>
              ))}
            </select>
          )}
          <textarea
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            placeholder="Or paste resume text here..."
            rows={4}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Job description (optional, for mock interview)"
            rows={2}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab('questions')}
          className={`rounded-lg px-4 py-2 text-sm font-medium ${activeTab === 'questions' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'}`}
        >
          <FileQuestion className="inline h-4 w-4 mr-2" />
          Generate Questions
        </button>
        <button
          onClick={() => setActiveTab('mock')}
          className={`rounded-lg px-4 py-2 text-sm font-medium ${activeTab === 'mock' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'}`}
        >
          <Target className="inline h-4 w-4 mr-2" />
          Mock Interview
        </button>
      </div>

      {activeTab === 'questions' && (
        <Card>
          <CardHeader>
            <CardTitle>Interview Questions (10–15)</CardTitle>
            <Button onClick={generateQuestions} disabled={loading || !resumeText?.trim()}>
              {loading ? 'Generating...' : 'Generate Questions'}
            </Button>
          </CardHeader>
          <CardContent>
            {questions && (
              <div className="space-y-6">
                {questions.technical?.length > 0 && (
                  <div>
                    <h3 className="font-medium text-slate-700">Technical</h3>
                    <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-slate-600">
                      {questions.technical.map((q, i) => (
                        <li key={i}>{q}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {questions.hr?.length > 0 && (
                  <div>
                    <h3 className="font-medium text-slate-700">HR / Behavioral</h3>
                    <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-slate-600">
                      {questions.hr.map((q, i) => (
                        <li key={i}>{q}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {questions.systemDesign?.length > 0 && (
                  <div>
                    <h3 className="font-medium text-slate-700">System Design</h3>
                    <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-slate-600">
                      {questions.systemDesign.map((q, i) => (
                        <li key={i}>{q}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === 'mock' && (
        <Card>
          <CardHeader>
            <CardTitle>Mock Interview Evaluation</CardTitle>
            <Button onClick={runMockInterview} disabled={loading || !resumeText?.trim()}>
              {loading ? 'Evaluating...' : 'Run Mock Interview'}
            </Button>
          </CardHeader>
          <CardContent>
            {mockResult && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-2xl font-bold text-indigo-700">
                    {mockResult.score}/10
                  </div>
                  <p className="text-slate-600">Overall readiness score</p>
                </div>
                <div>
                  <h3 className="font-medium text-slate-700">Feedback</h3>
                  <p className="mt-2 whitespace-pre-wrap text-sm text-slate-600">{mockResult.feedback}</p>
                </div>
                {mockResult.improvementAreas?.length > 0 && (
                  <div>
                    <h3 className="font-medium text-slate-700">Improvement Areas</h3>
                    <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-slate-600">
                      {mockResult.improvementAreas.map((a, i) => (
                        <li key={i}>{a}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
