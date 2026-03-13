import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Github, Mail, Loader2, Facebook, Chrome } from 'lucide-react'
import { authApi } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { Button } from '../components/Button'
import { Input } from '../components/Input'

export function LoginPage() {
  const API_URL = (import.meta as any).env?.VITE_API_URL as string | undefined

  const [searchParams] = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [loading, setLoading] = useState(false)
  const [forgotOpen, setForgotOpen] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotLoading, setForgotLoading] = useState(false)
  const [forgotError, setForgotError] = useState('')
  const [forgotSuccess, setForgotSuccess] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const oauthToken = searchParams.get('oauthToken')
    const oauthEmail = searchParams.get('email')
    const oauthUserId = searchParams.get('userId')
    const oauthRole = searchParams.get('role') || 'USER'

    if (oauthToken && oauthEmail && oauthUserId) {
      login(oauthToken, oauthEmail, parseInt(oauthUserId, 10), oauthRole)
      navigate('/app', { replace: true })
    }
  }, [searchParams, login, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setInfo('')
    setLoading(true)
    try {
      const { data } = await authApi.login(email, password)
      login(data.token, data.email, data.userId, data.role)
      navigate('/app')
    } catch (err: unknown) {
      const res = err as { response?: { data?: { error?: string; message?: string } } }
      setError(
        res?.response?.data?.error ||
          res?.response?.data?.message ||
          'Login failed. Please check your credentials and try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setForgotError('')
    setForgotSuccess('')
    setForgotLoading(true)
    try {
      const { data } = await authApi.forgotPassword(forgotEmail)
      setForgotSuccess(data.message || 'If this email exists, a reset link has been sent.')
    } catch (err: unknown) {
      const res = err as { response?: { data?: { message?: string; error?: string } } }
      setForgotError(
        res?.response?.data?.message ||
          res?.response?.data?.error ||
          'Unable to process request. Please try again shortly.'
      )
    } finally {
      setForgotLoading(false)
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
          <h1 className="text-xl font-semibold text-slate-900">Sign in</h1>
          <p className="mt-1 text-sm text-slate-500">Use your email or a social account</p>

          <div className="mt-4 space-y-3">
            <Button
              type="button"
              variant="outline"
              className="flex w-full items-center justify-center gap-2"
              onClick={() => handleOAuth('google')}
            >
              <Chrome className="h-4 w-4 text-red-500" />
              <span>Continue with Google</span>
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex w-full items-center justify-center gap-2"
              onClick={() => handleOAuth('github')}
            >
              <Github className="h-4 w-4" />
              <span>Continue with GitHub</span>
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex w-full items-center justify-center gap-2"
              onClick={() => handleOAuth('facebook')}
            >
              <Facebook className="h-4 w-4 text-blue-600" />
              <span>Continue with Facebook</span>
            </Button>
          </div>

          <div className="my-4 flex items-center gap-3 text-xs text-slate-400">
            <div className="h-px flex-1 bg-slate-200" />
            <span>or continue with email</span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>}
            {info && <div className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">{info}</div>}
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
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-slate-700">Password</label>
                <button
                  type="button"
                  onClick={() => {
                    setForgotOpen(true)
                    setForgotEmail(email)
                    setForgotError('')
                    setForgotSuccess('')
                  }}
                  className="text-xs font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Forgot password?
                </button>
              </div>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1"
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <span className="inline-flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in...
                </span>
              ) : (
                <span className="inline-flex items-center justify-center gap-2">
                  <Mail className="h-4 w-4" />
                  Sign in with email
                </span>
              )}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-slate-500">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
              Sign up
            </Link>
          </p>
        </div>
      </div>

      {forgotOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/40 px-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-slate-900">Reset your password</h2>
            <p className="mt-1 text-sm text-slate-500">
              Enter the email associated with your account. If it exists, we'll send you a secure reset link.
            </p>
            <form onSubmit={handleForgotSubmit} className="mt-4 space-y-4">
              {forgotError && (
                <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{forgotError}</div>
              )}
              {forgotSuccess && (
                <div className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">{forgotSuccess}</div>
              )}
              <div>
                <label className="block text-sm font-medium text-slate-700">Email</label>
                <Input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="mt-1"
                  required
                />
              </div>
              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  className="text-sm font-medium text-slate-500 hover:text-slate-700"
                  onClick={() => setForgotOpen(false)}
                >
                  Cancel
                </button>
                <Button type="submit" disabled={forgotLoading}>
                  {forgotLoading ? (
                    <span className="inline-flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Sending...
                    </span>
                  ) : (
                    'Send reset link'
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
