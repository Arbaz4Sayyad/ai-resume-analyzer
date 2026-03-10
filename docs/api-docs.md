# API Documentation

Base URL: `http://localhost:8080/api` (or your deployed backend URL)

## Authentication

All `/api/resume/*` endpoints require a valid JWT in the `Authorization` header:

```
Authorization: Bearer <token>
```

---

## Auth Endpoints

### POST /api/auth/register

Register a new user.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "email": "user@example.com",
  "userId": 1
}
```

### POST /api/auth/login

Authenticate and receive a JWT.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:** Same as register.

---

## Resume Endpoints

### POST /api/resume/upload

Upload a resume file (PDF or DOCX).

**Request:** `multipart/form-data` with `file` field.

**Response:**
```json
{
  "id": 1,
  "fileName": "resume.pdf",
  "extractedText": "...",
  "uploadedAt": "2024-01-15T12:00:00Z"
}
```

### GET /api/resume/list

List all resumes for the authenticated user.

**Response:**
```json
[
  {
    "id": 1,
    "fileName": "resume.pdf",
    "extractedText": "...",
    "uploadedAt": "2024-01-15T12:00:00Z"
  }
]
```

### POST /api/resume/analyze

Run full analysis (ATS score, skills, questions).

**Query params:** `resumeId` (required), `jobDescription` (optional)

**Response:**
```json
{
  "atsScore": 78,
  "matchedSkills": ["Java", "Spring Boot", "PostgreSQL"],
  "missingSkills": ["Kubernetes", "AWS"],
  "recommendations": ["Add Kubernetes experience", "..."],
  "interviewQuestions": {
    "technical": ["...", "..."],
    "behavioral": ["...", "..."]
  }
}
```

### POST /api/resume/compare

Compare resume with a job description.

**Request:**
```json
{
  "resumeId": 1,
  "jobDescription": "We need a senior Java developer..."
}
```

**Response:**
```json
{
  "matchedSkills": ["Java", "Spring Boot"],
  "missingSkills": ["Kubernetes"],
  "skillMatchPercentage": 75.5,
  "atsScore": 72,
  "recommendations": ["..."]
}
```

### GET /api/resume/questions

Get interview questions for a resume.

**Query params:** `resumeId` (required), `jobDescription` (optional)

**Response:**
```json
{
  "technical": ["Question 1", "...", "Question 10"],
  "behavioral": ["Question 1", "...", "Question 5"]
}
```

---

## AI Service Endpoints (Internal)

Called by the backend. Base URL: `http://localhost:8000` (or `AI_SERVICE_URL`).

### POST /extractSkills

**Request:** `{ "resume_text": "..." }`

**Response:** JSON with `programming_languages`, `frameworks`, `tools`, `databases`, `technical_skills`.

### POST /atsScore

**Request:** `{ "resume_text": "...", "job_description": "..." }`

**Response:** `ats_score`, `matched_skills`, `missing_skills`, `recommendations`.

### POST /generateQuestions

**Request:** `{ "resume_text": "...", "job_description": "..." }`

**Response:** `{ "technical": [...], "behavioral": [...] }`.

### POST /compareJobDescription

**Request:** `{ "resume_text": "...", "job_description": "..." }`

**Response:** `matched_skills`, `missing_skills`, `skill_match_percentage`, `ats_score`, `recommendations`.
