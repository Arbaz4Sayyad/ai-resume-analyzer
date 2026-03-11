import { useState, useEffect } from 'react'
import { Users, Search, Filter } from 'lucide-react'
import { recruiterApi } from '../services/api'
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card'
import { Button } from '../components/Button'

interface Candidate {
  resumeId: number
  userId: number
  email: string
  fileName: string
  extractedTextPreview: string
  lastAtsScore: number | null
  skills: string[]
  uploadedAt: string
}

export function RecruiterDashboardPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [loading, setLoading] = useState(true)
  const [skillsFilter, setSkillsFilter] = useState('')
  const [minAtsScore, setMinAtsScore] = useState<number | ''>('')

  const loadCandidates = () => {
    setLoading(true)
    recruiterApi
      .searchCandidates({
        skills: skillsFilter || undefined,
        minAtsScore: minAtsScore !== '' ? Number(minAtsScore) : undefined,
      })
      .then((r) => setCandidates(r.data))
      .catch(() => setCandidates([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadCandidates()
  }, [])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Recruiter Dashboard</h1>
        <p className="mt-1 text-slate-600">Search candidates by skills and ATS score</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Skills (comma-separated)</label>
            <input
              type="text"
              value={skillsFilter}
              onChange={(e) => setSkillsFilter(e.target.value)}
              placeholder="e.g. Java, React, AWS"
              className="mt-1 rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Min ATS Score</label>
            <input
              type="number"
              min={0}
              max={100}
              value={minAtsScore}
              onChange={(e) => setMinAtsScore(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="e.g. 70"
              className="mt-1 rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <div className="flex items-end">
            <Button onClick={loadCandidates}>
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Candidates ({candidates.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-slate-500">Loading...</p>
          ) : candidates.length === 0 ? (
            <p className="text-slate-500">No candidates found</p>
          ) : (
            <div className="space-y-4">
              {candidates.map((c) => (
                <div
                  key={c.resumeId}
                  className="rounded-lg border border-slate-200 p-4 hover:bg-slate-50"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-slate-900">{c.email}</p>
                      <p className="text-sm text-slate-500">{c.fileName}</p>
                      {c.lastAtsScore != null && (
                        <span className="mt-2 inline-block rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700">
                          ATS: {c.lastAtsScore}
                        </span>
                      )}
                    </div>
                  </div>
                  {c.skills?.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {c.skills.slice(0, 8).map((s) => (
                        <span
                          key={s}
                          className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-700"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="mt-2 text-sm text-slate-600 line-clamp-2">{c.extractedTextPreview}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
