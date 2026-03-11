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
    api.post<{ token: string; email: string; userId: number; role: string }>('/auth/login', { email, password }),

  register: (email: string, password: string) =>
    api.post<{ token: string; email: string; userId: number; role: string }>('/auth/register', { email, password }),

  getProfile: () =>
    api.get<{ id: number; email: string; role: string; createdAt: string }>('/auth/profile'),
}

export const analysisApi = {
  match: (resumeId: number, jobDescription: string) =>
    api.post<{
      atsScore: number
      matchingSkills: string[]
      missingSkills: string[]
      experienceGaps: string[]
      suggestions: string[]
    }>('/analysis/match', { resumeId, jobDescription }),
}

export const aiApi = {
  improveResume: (resumeText: string) =>
    api.post<{ improvedResume: string; suggestions: string[] }>('/ai/improve-resume', { resumeText }),

  interviewQuestions: (resumeText: string) =>
    api.post<{ technical: string[]; hr: string[]; systemDesign: string[] }>('/ai/interview-questions', { resumeText }),

  mockInterview: (resumeText: string, jobDescription?: string) =>
    api.post<{ score: number; feedback: string; improvementAreas: string[] }>('/ai/mock-interview', {
      resumeText,
      jobDescription: jobDescription ?? '',
    }),
}

export const jobsApi = {
  recommendations: () =>
    api.get<
      Array<{
        id: number
        title: string
        company: string
        description: string
        requiredSkills: string[]
        matchScore: number
      }>
    >('/jobs/recommendations'),
}

export const recruiterApi = {
  searchCandidates: (params?: { skills?: string; minAtsScore?: number }) =>
    api.get<
      Array<{
        resumeId: number
        userId: number
        email: string
        fileName: string
        extractedTextPreview: string
        lastAtsScore: number | null
        skills: string[]
        uploadedAt: string
      }>
    >('/recruiter/candidates', { params }),
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

  list: () =>
    api.get<Array<{ id: number; fileName: string; extractedText: string; uploadedAt: string }>>(
      '/resume/list'
    ),

  getById: (id: number) =>
    api.get<{ id: number; fileName: string; extractedText: string; uploadedAt: string }>(
      `/resume/${id}`
    ),

  // ✅ FIXED: Send data in request body instead of URL params
  analyze: (resumeId: number, jobDescription?: string) =>
    api.post<{
      atsScore: number
      matchedSkills: string[]
      missingSkills: string[]
      recommendations: string[]
      interviewQuestions: { technical: string[]; behavioral: string[] }
    }>('/resume/analyze', {
      resumeId,
      jobDescription
    }),

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