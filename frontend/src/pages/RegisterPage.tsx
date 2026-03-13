import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Github, Facebook, Chrome, Loader2, Mail } from 'lucide-react'
import { authApi } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { Button } from '../components/Button'
import { Input } from '../components/Input'

const API_URL = (import.meta as any).env?.VITE_API_URL as string | undefined

export function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data } = await authApi.register(email, password)
      login(data.token, data.email, data.userId, data.role)
      navigate('/app')
    } catch (err: unknown) {
      const res = err as {
        response?: { data?: { error?: string; errors?: Record<string, string>; message?: string } }
      }
      const msg =
        res?.response?.data?.error ||
        res?.response?.data?.message ||
        (res?.response?.data?.errors && Object.values(res.response.data.errors).join(', ')) ||
        'Registration failed. Please try again.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  const handleOAuth = (provider: 'google' | 'github' | 'facebook') => {
    const baseUrl = (API_URL ?? '').replace(/\/+$/, '')
    const target = `${baseUrl || ''}/oauth2/authorization/${provider}`
    window.location.href = target
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold">
              AR
            </div>
            <span className="text-xl font-semibold text-slate-900">AI Resume Analyzer</span>
          </Link>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-xl font-semibold text-slate-900">Create account</h1>
          <p className="mt-1 text-sm text-slate-500">Get started with resume analysis</p>

          <div className="mt-4 space-y-3">
            <Button
              type="button"
              variant="outline"
              className="flex w-full items-center justify-center gap-2"
              onClick={() => handleOAuth('google')}
            >
              <Chrome className="h-4 w-4 text-red-500" />
              <span>Sign up with Google</span>
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex w-full items-center justify-center gap-2"
              onClick={() => handleOAuth('github')}
            >
              <Github className="h-4 w-4" />
              <span>Sign up with GitHub</span>
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex w-full items-center justify-center gap-2"
              onClick={() => handleOAuth('facebook')}
            >
              <Facebook className="h-4 w-4 text-blue-600" />
              <span>Sign up with Facebook</span>
            </Button>
          </div>

          <div className="my-4 flex items-center gap-3 text-xs text-slate-400">
            <div className="h-px flex-1 bg-slate-200" />
            <span>or continue with email</span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>}
            <div>
              <label className="block text-sm font-medium text-slate-700">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1"
                minLength={8}
                required
              />
              <p className="mt-1 text-xs text-slate-500">At least 8 characters</p>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <span className="inline-flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating account...
                </span>
              ) : (
                <span className="inline-flex items-center justify-center gap-2">
                  <Mail className="h-4 w-4" />
                  Create account with email
                </span>
              )}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

