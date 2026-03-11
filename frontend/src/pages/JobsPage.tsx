import { useState, useEffect } from 'react'
import { Briefcase, TrendingUp } from 'lucide-react'
import { jobsApi } from '../services/api'
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card'

interface JobRec {
  id: number
  title: string
  company: string
  description: string
  requiredSkills: string[]
  matchScore: number
}

export function JobsPage() {
  const [jobs, setJobs] = useState<JobRec[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    jobsApi
      .recommendations()
      .then((r) => setJobs(r.data))
      .catch(() => setJobs([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Job Recommendations</h1>
        <p className="mt-1 text-slate-600">Roles matched to your resume skills</p>
      </div>

      {loading ? (
        <p className="text-slate-500">Loading recommendations...</p>
      ) : jobs.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Briefcase className="mx-auto h-12 w-12 text-slate-400" />
            <p className="mt-4 font-medium text-slate-600">No recommendations yet</p>
            <p className="text-sm text-slate-500">Upload a resume to get job recommendations</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {jobs.map((job) => (
            <Card key={job.id}>
              <CardHeader className="flex flex-row items-start justify-between">
                <div>
                  <CardTitle>{job.title}</CardTitle>
                  <p className="text-sm text-slate-500">{job.company}</p>
                </div>
                <div className="flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1">
                  <TrendingUp className="h-4 w-4 text-indigo-600" />
                  <span className="text-sm font-medium text-indigo-700">{job.matchScore}% match</span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600">{job.description}</p>
                {job.requiredSkills?.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {job.requiredSkills.map((s) => (
                      <span
                        key={s}
                        className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
