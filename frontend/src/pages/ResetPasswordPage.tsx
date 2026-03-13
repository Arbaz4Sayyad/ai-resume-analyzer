import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Loader2, Lock } from 'lucide-react'
import { authApi } from '../services/api'
import { Button } from '../components/Button'
import { Input } from '../components/Input'

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token') || ''

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!token) {
      setError('Reset link is invalid or has expired.')
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    try {
      const { data } = await authApi.resetPassword(token, password)
      setSuccess(data.message || 'Your password has been reset. You can now sign in.')
      setTimeout(() => navigate('/login'), 1500)
    } catch (err: unknown) {
      const res = err as { response?: { data?: { message?: string; error?: string } } }
      setError(
        res?.response?.data?.message ||
          res?.response?.data?.error ||
          'Unable to reset password. The link may have expired.'
      )
    } finally {
      setLoading(false)
    }
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
          <h1 className="text-xl font-semibold text-slate-900">Set a new password</h1>
          <p className="mt-1 text-sm text-slate-500">
            Choose a strong password to secure your account.
          </p>
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>}
            {success && (
              <div className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">{success}</div>
            )}
            <div>
              <label className="block text-sm font-medium text-slate-700">New password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1"
                minLength={8}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Confirm password</label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1"
                minLength={8}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <span className="inline-flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Updating password...
                </span>
              ) : (
                <span className="inline-flex items-center justify-center gap-2">
                  <Lock className="h-4 w-4" />
                  Reset password
                </span>
              )}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-slate-500">
            Remembered your password?{' '}
            <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              Go back to sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

