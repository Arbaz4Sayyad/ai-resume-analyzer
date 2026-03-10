# Architecture

## Overview

AI Resume Analyzer follows a **clean microservice architecture** with three main services:

1. **Backend** (Spring Boot) – REST API, auth, persistence
2. **AI Service** (FastAPI) – OpenAI-powered analysis
3. **Frontend** (React) – SaaS dashboard UI

## System Diagram

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Browser   │────▶│   Frontend  │────▶│   Backend   │
│   (React)   │◀────│  (Vite/     │◀────│ (Spring     │
└─────────────┘     │   Nginx)    │     │  Boot)      │
                    └─────────────┘     └──────┬──────┘
                                               │
                         ┌─────────────────────┼─────────────────────┐
                         │                     │                     │
                         ▼                     ▼                     ▼
                  ┌─────────────┐       ┌─────────────┐       ┌─────────────┐
                  │  PostgreSQL │       │ AI Service  │       │   OpenAI    │
                  │  Database   │       │ (FastAPI)   │──────▶│    API      │
                  └─────────────┘       └─────────────┘       └─────────────┘
```

## Service Responsibilities

### Backend (Java/Spring Boot)

- **Authentication**: JWT-based auth, registration, login
- **Resume storage**: Multipart upload, PDF/DOCX text extraction
- **Data persistence**: Users, resumes, analysis results
- **Orchestration**: Calls AI service for analysis, stores results
- **REST API**: `/api/auth/*`, `/api/resume/*`

### AI Service (Python/FastAPI)

- **Skill extraction**: Parse resume text → structured skills JSON
- **ATS scoring**: Compare resume vs job description, return 0–100 score
- **Job matching**: matched_skills, missing_skills, skill_match_percentage
- **Interview questions**: 10 technical + 5 behavioral
- **OpenAI integration**: GPT-4o-mini for all AI tasks

### Frontend (React/Vite)

- **Landing page**: Hero, features, CTA
- **Auth**: Login, register
- **Dashboard**: Sidebar navigation
- **Upload**: Drag-and-drop resume (PDF/DOCX)
- **Analysis**: ATS score, charts, skills, recommendations
- **Interview questions**: Technical/behavioral with copy-to-clipboard

## Data Flow

1. **Upload**: User uploads file → Backend extracts text → Saves resume
2. **Analyze**: User triggers analysis → Backend calls AI service → Stores result → Returns to UI
3. **Compare**: User pastes job description → Backend calls AI service → Returns match data
4. **Questions**: Backend calls AI service → Returns technical + behavioral questions

## Database Schema

- **users**: id, email, password, created_at
- **resumes**: id, user_id, file_name, extracted_text, uploaded_at
- **analysis_results**: id, resume_id, ats_score, matched_skills, missing_skills, interview_questions, created_at

## Security

- JWT for stateless auth
- Passwords hashed with BCrypt
- CORS configured for frontend origin
- File upload size limit: 10MB

## Scalability

- Stateless backend and AI service (horizontal scaling)
- PostgreSQL for persistence
- Docker Compose for local orchestration
- Each service can be deployed independently (Vercel, Render, Railway)
