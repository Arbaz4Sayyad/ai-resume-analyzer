import { useState, useEffect, useRef } from 'react'
import { Send, Bot, User } from 'lucide-react'
import { resumeApi } from '../services/api'
import { Button } from '../components/Button'
import { Card, CardContent } from '../components/Card'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export function AIAssistantPage() {
  const [resumes, setResumes] = useState<{ id: number; fileName: string }[]>([])
  const [selectedResumeId, setSelectedResumeId] = useState<number | null>(null)
  const [jobDescription, setJobDescription] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    resumeApi.list()
      .then((r) => {
        setResumes(r.data)
        if (r.data.length && !selectedResumeId) setSelectedResumeId(r.data[0].id)
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    const text = input.trim()
    if (!text || !selectedResumeId || loading) return

    setInput('')
    setMessages((m) => [...m, { role: 'user', content: text }])
    setLoading(true)

    try {
      const { data } = await resumeApi.chat(selectedResumeId, text, jobDescription || undefined)
      setMessages((m) => [...m, { role: 'assistant', content: data.answer }])
    } catch {
      setMessages((m) => [
        ...m,
        { role: 'assistant', content: 'Sorry, I could not process your request. Please try again.' },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-[calc(100vh-12rem)] flex-col">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">AI Resume Assistant</h1>
        <p className="mt-1 text-slate-600">Chat with your resume and get career advice</p>
      </div>

      <div className="mb-4 flex flex-wrap gap-4">
        {resumes.length > 0 && (
          <div>
            <label className="mr-2 text-sm font-medium text-slate-700">Resume:</label>
            <select
              value={selectedResumeId ?? ''}
              onChange={(e) => setSelectedResumeId(parseInt(e.target.value, 10))}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
            >
              {resumes.map((r) => (
                <option key={r.id} value={r.id}>{r.fileName}</option>
              ))}
            </select>
          </div>
        )}
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Job description (optional context)"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </div>
      </div>

      <Card className="flex flex-1 flex-col overflow-hidden">
        <CardContent className="flex flex-1 flex-col overflow-hidden p-0">
          <div className="flex-1 overflow-y-auto p-6">
            {messages.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <Bot className="h-16 w-16 text-slate-300" />
                <p className="mt-4 font-medium text-slate-600">Ask anything about your resume</p>
                <p className="mt-1 text-sm text-slate-500">
                  Get help with missing skills, resume improvements, or interview prep
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-2">
                  {[
                    'What skills am I missing?',
                    'How can I improve my resume?',
                    'What should I highlight for interviews?',
                  ].map((q) => (
                    <button
                      key={q}
                      onClick={() => setInput(q)}
                      className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                  >
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                        msg.role === 'user' ? 'bg-indigo-100' : 'bg-slate-200'
                      }`}
                    >
                      {msg.role === 'user' ? (
                        <User className="h-4 w-4 text-indigo-600" />
                      ) : (
                        <Bot className="h-4 w-4 text-slate-600" />
                      )}
                    </div>
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        msg.role === 'user'
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 text-slate-800'
                      }`}
                    >
                      <p className="whitespace-pre-wrap text-sm">{msg.content}</p>
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-200">
                      <Bot className="h-4 w-4 text-slate-600" />
                    </div>
                    <div className="rounded-2xl bg-slate-100 px-4 py-3">
                      <div className="flex gap-1">
                        <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400" style={{ animationDelay: '0ms' }} />
                        <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400" style={{ animationDelay: '150ms' }} />
                        <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          <div className="border-t border-slate-200 p-4">
            <div className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                placeholder="Ask a question about your resume..."
                className="flex-1 rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                disabled={!selectedResumeId || loading}
              />
              <Button onClick={sendMessage} disabled={!input.trim() || !selectedResumeId || loading}>
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {resumes.length === 0 && (
        <p className="mt-4 text-center text-sm text-slate-500">Upload a resume to start chatting</p>
      )}
    </div>
  )
}
