import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload, FileText } from 'lucide-react'
import { resumeApi } from '../services/api'
import { Button } from '../components/Button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card'
import { cn } from '../utils/cn'

export function UploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
    const f = e.dataTransfer.files[0]
    if (f && (f.name.endsWith('.pdf') || f.name.endsWith('.docx'))) {
      setFile(f)
      setError('')
    } else {
      setError('Please upload a PDF or DOCX file')
    }
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f && (f.name.endsWith('.pdf') || f.name.endsWith('.docx'))) {
      setFile(f)
      setError('')
    } else if (f) {
      setError('Please upload a PDF or DOCX file')
    }
  }

  const handleUpload = async () => {
    if (!file) return
    setUploading(true)
    setError('')
    try {
      const { data } = await resumeApi.upload(file)
      navigate('/app/analysis', { state: { resumeId: data.id } })
    } catch (err: unknown) {
      setError((err as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Upload Resume</h1>
        <p className="mt-1 text-slate-600">Upload your resume in PDF or DOCX format for analysis</p>
      </div>
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Drop your resume here</CardTitle>
          <p className="text-sm text-slate-500">Supports PDF and DOCX, max 10MB</p>
        </CardHeader>
        <CardContent>
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={cn(
              'flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 transition-colors',
              dragActive ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300 bg-slate-50',
              file && 'border-green-300 bg-green-50'
            )}
          >
            <input
              type="file"
              accept=".pdf,.docx"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
            />
            {file ? (
              <div className="flex items-center gap-3">
                <FileText className="h-12 w-12 text-green-600" />
                <div>
                  <p className="font-medium text-slate-900">{file.name}</p>
                  <p className="text-sm text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
              </div>
            ) : (
              <>
                <Upload className="h-12 w-12 text-slate-400" />
                <p className="mt-2 text-sm font-medium text-slate-600">
                  Drag and drop or click to browse
                </p>
                <label htmlFor="file-upload" className="mt-4">
                  <span className="inline-flex h-10 cursor-pointer items-center justify-center rounded-lg border border-slate-300 bg-transparent px-4 text-sm font-medium hover:bg-slate-50">
                    Choose file
                  </span>
                </label>
              </>
            )}
          </div>
          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
          <Button
            className="mt-6 w-full"
            onClick={handleUpload}
            disabled={!file || uploading}
          >
            {uploading ? 'Uploading...' : 'Upload & Analyze'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
