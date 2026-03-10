import { Link } from 'react-router-dom'
import { FileSearch, BarChart3, MessageSquare, Sparkles } from 'lucide-react'
import { Button } from '../components/Button'

const features = [
  {
    icon: FileSearch,
    title: 'Smart Resume Parsing',
    desc: 'Upload PDF or DOCX and let AI extract skills, experience, and qualifications.',
  },
  {
    icon: BarChart3,
    title: 'ATS Score',
    desc: 'Get a 0–100 ATS compatibility score and actionable recommendations.',
  },
  {
    icon: MessageSquare,
    title: 'Interview Prep',
    desc: 'Receive tailored technical and behavioral interview questions.',
  },
  {
    icon: Sparkles,
    title: 'Job Matching',
    desc: 'Compare your resume against job descriptions for better fit.',
  },
]

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-slate-200">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold">
              AR
            </div>
            <span className="text-xl font-semibold text-slate-900">AI Resume Analyzer</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900">
              Sign in
            </Link>
            <Link to="/register">
              <Button>Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-24 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          Land more interviews with AI-powered resume optimization
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
          Upload your resume, get an ATS score, compare with job descriptions, and prepare with personalized interview questions—all in one place.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <Link to="/register">
            <Button size="lg" className="px-8">
              Upload Your Resume
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="outline" size="lg">
              Sign in
            </Button>
          </Link>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-slate-50 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center text-2xl font-bold text-slate-900">Everything you need</h2>
          <p className="mx-auto mt-2 max-w-xl text-center text-slate-600">
            A complete toolkit to improve your resume and ace your interviews.
          </p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-semibold text-slate-900">{title}</h3>
                <p className="mt-2 text-sm text-slate-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 py-8">
        <div className="mx-auto max-w-6xl px-6 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} AI Resume Analyzer. Built for job seekers.
        </div>
      </footer>
    </div>
  )
}
