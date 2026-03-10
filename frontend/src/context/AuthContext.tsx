import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface AuthContextType {
  token: string | null
  email: string | null
  userId: number | null
  login: (token: string, email: string, userId: number) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'))
  const [email, setEmail] = useState<string | null>(() => localStorage.getItem('email'))
  const [userId, setUserId] = useState<number | null>(() => {
    const id = localStorage.getItem('userId')
    return id ? parseInt(id, 10) : null
  })

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token)
    } else {
      localStorage.removeItem('token')
    }
  }, [token])

  useEffect(() => {
    if (email) localStorage.setItem('email', email)
    else localStorage.removeItem('email')
  }, [email])

  useEffect(() => {
    if (userId) localStorage.setItem('userId', String(userId))
    else localStorage.removeItem('userId')
  }, [userId])

  const login = (t: string, e: string, id: number) => {
    setToken(t)
    setEmail(e)
    setUserId(id)
  }

  const logout = () => {
    setToken(null)
    setEmail(null)
    setUserId(null)
  }

  return (
    <AuthContext.Provider value={{ token, email, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
