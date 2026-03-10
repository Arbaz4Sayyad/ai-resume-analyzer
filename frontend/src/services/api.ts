import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (r) => r,
  (e) => {
    if (e.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('email')
      localStorage.removeItem('userId')
      window.location.href = '/login'
    }
    return Promise.reject(e)
  }
)

export const authApi = {
  login: (email: string, password: string) =>
    api.post<{ token: string; email: string; userId: number }>('/auth/login', { email, password }),
  register: (email: string, password: string) =>
    api.post<{ token: string; email: string; userId: number }>('/auth/register', { email, password }),
  getProfile: () =>
    api.get<{ id: number; email: string; createdAt: string }>('/auth/profile'),
}

export const resumeApi = {
  upload: (file: File) => {
    const form = new FormData()
    form.append('file', file)
    return api.post<{ id: number; fileName: string; extractedText: string; uploadedAt: string }>(
      '/resume/upload',
      form,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    )
  },
  list: () => api.get<Array<{ id: number; fileName: string; extractedText: string; uploadedAt: string }>>('/resume/list'),
  analyze: (resumeId: number, jobDescription?: string) =>
    api.post<{
      atsScore: number
      matchedSkills: string[]
      missingSkills: string[]
      recommendations: string[]
      interviewQuestions: { technical: string[]; behavioral: string[] }
    }>('/resume/analyze', null, { params: { resumeId, jobDescription } }),
  compare: (resumeId: number, jobDescription: string) =>
    api.post<{
      matchedSkills: string[]
      missingSkills: string[]
      skillMatchPercentage: number
      atsScore: number
      recommendations: string[]
    }>('/resume/compare', { resumeId, jobDescription }),
  getQuestions: (resumeId: number, jobDescription?: string) =>
    api.get<{ technical: string[]; behavioral: string[] }>('/resume/questions', {
      params: { resumeId, jobDescription },
    }),
  getSuggestions: (resumeId: number, jobDescription?: string) =>
    api.post<{
      resumeScore: number
      missingKeywords: string[]
      improvementSuggestions: string[]
      optimizedSummary: string
    }>('/resume/suggestions', { resumeId, jobDescription }),
  chat: (resumeId: number, question: string, jobDescription?: string) =>
    api.post<{ answer: string }>('/resume/chat', { resumeId, question, jobDescription }),
}
