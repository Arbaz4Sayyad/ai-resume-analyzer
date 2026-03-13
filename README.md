<!-- # AI Resume Analyzer – GenAI Career Platform

A production-ready GenAI career platform that analyzes resumes using AI, compares them with job descriptions, calculates ATS compatibility scores, generates interview questions, and provides job recommendations.

## Features

- **Resume Upload & Parsing**: PDF and DOCX support (Apache PDFBox, Apache POI)
- **Resume vs Job Match**: ATS score, matching/missing skills, experience gaps, suggestions
- **AI Resume Improver**: Rewrite bullet points, optimize for ATS, add impact metrics
- **AI Interview Questions**: Technical, HR, and system design questions (10–15)
- **Mock Interview**: Simulate interviewer, evaluate answers, improvement areas
- **Job Recommendations**: Match resume skills to recommended roles
- **Recruiter Dashboard**: Search candidates, filter by skills and ATS score
- **Swagger API Docs**: `/swagger-ui.html`

## Architecture

- **Backend**: Spring Boot 3 (Java 17) - REST API, JWT auth, RBAC
- **AI Service**: FastAPI (Python 3.11) - OpenAI-powered analysis
- **Frontend**: React + Vite + TailwindCSS
- **Database**: PostgreSQL (Flyway migrations)

## Quick Start

### Prerequisites

- Java 17+
- Python 3.11+
- Node.js 18+
- PostgreSQL 14+
- Docker & Docker Compose (optional)

### Local Development

```bash
# Clone and setup
git clone <repo-url>
cd ai-resume-analyzer
./scripts/setup.sh

# Start with Docker
cd docker
docker-compose up -d

# Or run services individually - see docs/setup.md
```

### Environment Variables

Copy `docker/.env.example` to `docker/.env` and set:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Secret for JWT token signing (base64 256-bit) |
| `OPENAI_API_KEY` | OpenAI API key (required for AI features) |
| `AI_SERVICE_URL` | AI service base URL |

### Recruiter Role

To promote a user to recruiter: `UPDATE users SET role='RECRUITER' WHERE email='user@example.com';`

## Deployment

- **Frontend**: Vercel
- **Backend**: Render
- **AI Service**: Railway
- **Database**: Supabase PostgreSQL

See [docs/deployment.md](docs/deployment.md) for detailed instructions.

## Documentation

- [Architecture](docs/architecture.md)
- [API Documentation](docs/api-docs.md)
- [Deployment Guide](docs/deployment.md)

## License -->

<!-- MIT -->



# AI Resume Analyzer - Full Stack Application

## Overview
This repository contains the complete AI Resume Analyzer application:

- **Frontend**: React + Vite + TailwindCSS
- **Backend**: Spring Boot (Java) with JWT auth and OAuth login
- **AI Service**: FastAPI (Python) using Google Gemini
- **Database**: PostgreSQL
- **Deployment**: Docker + Docker Compose

The app allows users to upload resumes, analyze them against job descriptions, get ATS scores and suggestions, and prepare for interviews. OAuth login and password reset flows are production-ready, and AI analysis degrades gracefully when the Gemini API key is not configured.

## Features

- ✅ Email + password authentication (JWT)
- ✅ OAuth login with **Google**, **GitHub**, and **Facebook**
- ✅ Forgot password and secure reset flow via email
- ✅ Resume upload, parsing, and storage
- ✅ ATS score, skills match, recommendations
- ✅ AI resume improvement and interview preparation (when Gemini key is configured)
- ✅ Global error handling with structured JSON responses
- ✅ Dockerized deployment (frontend + backend + AI service + Postgres)

## Project Structure

- `frontend/` – React + Vite SPA (served by Nginx in production)
- `backend/` – Spring Boot REST API (auth, resumes, jobs, recruiter features)
- `ai-service/` – FastAPI service wrapping Google Gemini
- `docker/` – `docker-compose.yml` and `.env.example` for local/deployment

---

## Environment Configuration

Copy the example env file and fill in values:

```bash
cd docker
cp .env.example .env
```

The most important variables are:

```env
DATABASE_URL=jdbc:postgresql://postgres:5432/airesumeanalyzer
DB_USERNAME=postgres
DB_PASSWORD=postgres

JWT_SECRET=your_jwt_secret_here

GEMINI_API_KEY=your_gemini_api_key_here
# GEMINI_MODEL=gemini-2.5-flash  # optional override

GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
FACEBOOK_CLIENT_ID=...
FACEBOOK_CLIENT_SECRET=...

FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:8080

EMAIL_HOST=smtp.yourprovider.com
EMAIL_PORT=587
EMAIL_USER=your_smtp_username
EMAIL_PASSWORD=your_smtp_password
```

- **JWT_SECRET** must be a base64-encoded 256‑bit key (generate via `openssl rand -base64 32`).
- If you leave **GEMINI_API_KEY** empty, the app will run in **demo mode**: the dashboard shows a banner and AI analysis calls return
  `{"success": false, "message": "AI analysis temporarily disabled"}` without crashing the server.

---

## Running Locally with Docker

From the `docker/` directory:

```bash
cd docker
cp .env.example .env  # edit values
docker-compose up --build
```

Services:

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8080` (proxied to `/api` from the frontend)
- AI Service: `http://localhost:8000`
- PostgreSQL: `localhost:5432`

You should be able to:

- Register + login with email/password
- See OAuth buttons on the login/register pages
- Trigger forgot-password and complete reset via emailed link (when SMTP is configured)
- Use dashboard, upload, and navigation even when AI analysis is disabled

---

## OAuth Setup (Google, GitHub, Facebook)

1. **Create OAuth apps** with each provider:
   - Google Cloud Console (OAuth 2.0 Client ID)
   - GitHub Developer Settings → OAuth Apps
   - Facebook for Developers → App → Facebook Login

2. Configure redirect URIs to point to the backend:

   ```text
   {BACKEND_URL}/login/oauth2/code/google
   {BACKEND_URL}/login/oauth2/code/github
   {BACKEND_URL}/login/oauth2/code/facebook
   ```

3. Put the client IDs and secrets into `docker/.env`:

   ```env
   GOOGLE_CLIENT_ID=...
   GOOGLE_CLIENT_SECRET=...
   GITHUB_CLIENT_ID=...
   GITHUB_CLIENT_SECRET=...
   FACEBOOK_CLIENT_ID=...
   FACEBOOK_CLIENT_SECRET=...
   ```

The frontend uses `/api/auth/oauth/{provider}` to start the flow. Spring Security handles the provider redirect, creates or updates the user, issues a JWT, and redirects back to:

```text
{FRONTEND_URL}/login?oauthToken=...&email=...&userId=...&role=...
```

The React login page consumes these query parameters, stores the token, and navigates to the dashboard.

---

## Forgot Password / Password Reset

### Flow

1. User clicks **“Forgot password?”** on the login page.
2. A modal opens to enter email → frontend calls `POST /api/auth/forgot-password`.
3. Backend generates a secure token, stores it in `password_reset_tokens`, and sends an email containing:

   ```text
   {FRONTEND_URL}/reset-password?token=...
   ```

4. The React **Reset Password** page reads the token, validates password input, and calls
   `POST /api/auth/reset-password`.
5. Token is marked as used and expires after 1 hour; password is updated.

### SMTP Configuration

Forgot-password emails are sent using Spring Boot Mail and the `EMAIL_*` variables from `.env`. If SMTP is misconfigured or unavailable, the backend **logs the failure but still returns a generic success message** so that the API never leaks whether an email exists.

---

## AI Service (FastAPI + Gemini)

The `ai-service` is a standalone FastAPI app that wraps the Google Gemini API. All Gemini calls go through `app/services/gemini.py` and `ask_gemini()`.

### Local Development

```bash
cd ai-service
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
cp .env.example .env  # set GEMINI_API_KEY
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

Key behaviors:

- Missing/invalid `GEMINI_API_KEY` raises a controlled error that is converted into:

  ```json
  { "success": false, "message": "AI analysis temporarily disabled" }
  ```

- Global exception handlers ensure the service never exposes raw 500s; instead it returns structured JSON with `"success": false` and a safe `"message"`.

---

## Frontend Notes

- Login and register pages include:
  - Google / GitHub / Facebook OAuth buttons
  - Email + password form
  - Forgot password link (modal)
  - Loading and error states
- A banner at the top of the dashboard clearly states when the app is in demo mode and AI analysis is disabled.
- When the backend/AI service responds with `"success": false` and `"message": "AI analysis temporarily disabled"`, the analysis dashboard shows:

  > “AI analysis is disabled in this demo build.”

---

## Deployment

You can deploy the stack to any Docker‑capable platform:

- Build images using the provided Dockerfiles (`frontend/Dockerfile`, `backend/Dockerfile`, `ai-service/Dockerfile`).
- Use `docker/docker-compose.yml` as a starting point, or translate it into your target platform’s service definitions (Kubernetes, ECS, etc.).
- Ensure environment variables from `docker/.env` are provided securely (secrets manager, env vars, etc.).

Once deployed, the project must satisfy:

- `docker-compose up` (or equivalent) brings up all services
- Login/register and OAuth flows work
- Forgot password and password reset flows work (with SMTP configured)
- No raw 500 errors from backend/AI service
- AI API failure is handled gracefully with clear messages
- The demo banner is visible in the dashboard when AI is disabled

---

<!-- Original FastAPI-only README retained below for reference -->

"# AI Resume Analyzer - FastAPI Service

## Overview
This is the AI-powered backend service for the Resume Analyzer application. It uses Google's Gemini API to provide intelligent resume analysis, ATS scoring, and interview preparation features.

## Features
- ✅ Resume skill extraction
- ✅ ATS score calculation
- ✅ Interview question generation
- ✅ Resume vs Job Description comparison
- ✅ Resume improvement suggestions
- ✅ Mock interview evaluation
- ✅ Job recommendations
- ✅ Interactive resume chat

## Fixed Issues
This version resolves the following issues from the original implementation:

### 1. **Gemini API 404 Error** ✅ FIXED
- **Problem**: `404 models/gemini-1.5-flash is not found for API version v1beta`
- **Solution**: 
  - Updated to latest `google-generativeai` library (>=0.8.0)
  - Proper model initialization with correct configuration
  - Added safety settings and generation config

### 2. **500 Internal Server Errors** ✅ FIXED
- **Problem**: Unhandled exceptions causing server crashes
- **Solution**:
  - Comprehensive error handling in all functions
  - Proper response validation
  - Graceful degradation with error status in responses

### 3. **Response Parsing Issues** ✅ FIXED
- **Problem**: Failed to extract text from Gemini responses
- **Solution**:
  - Robust `extract_text_from_response()` function
  - Handles blocked content, safety filters
  - Multiple fallback mechanisms

### 4. **No Retry Logic** ✅ FIXED
- **Problem**: Transient failures caused immediate errors
- **Solution**:
  - Added `tenacity` library for automatic retries
  - Exponential backoff for rate limits
  - Configurable retry attempts

### 5. **Poor Error Messages** ✅ FIXED
- **Problem**: Generic error messages didn't help debugging
- **Solution**:
  - Specific error messages for different failure types
  - Detailed logging at all levels
  - User-friendly error responses

## Setup Instructions

### Prerequisites
- Python 3.10+
- Docker and Docker Compose (for containerized deployment)
- Google Gemini API key

### Getting Your Gemini API Key
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click \"Create API Key\"
4. Copy your API key

### Local Development Setup

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd ai-service
```

2. **Create virtual environment**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY
```

5. **Run the service**
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

6. **Access the API**
- API: http://localhost:8000
- Interactive docs: http://localhost:8000/docs
- Health check: http://localhost:8000/health

### Docker Deployment

1. **Build the Docker image**
```bash
docker build -t ai-resume-analyzer .
```

2. **Run the container**
```bash
docker run -d \
  -p 8000:8000 \
  -e GEMINI_API_KEY=your_api_key_here \
  --name ai-resume-service \
  ai-resume-analyzer
```

3. **Using Docker Compose**
```bash
# Create docker-compose.yml (see example below)
docker-compose up -d
```

### Docker Compose Example
```yaml
version: '3.8'

services:
  ai-service:
    build: .
    ports:
      - \"8000:8000\"
    environment:
      - GEMINI_API_KEY=${GEMINI_API_KEY}
    restart: unless-stopped
    healthcheck:
      test: [\"CMD\", \"curl\", \"-f\", \"http://localhost:8000/health\"]
      interval: 30s
      timeout: 10s
      retries: 3
```

## API Endpoints

### Core Endpoints

#### 1. Extract Skills
```bash
POST /extractSkills
Content-Type: application/json

{
  \"resume_text\": \"Your resume text here...\"
}
```

#### 2. ATS Score
```bash
POST /atsScore
Content-Type: application/json

{
  \"resume_text\": \"Your resume text here...\",
  \"job_description\": \"Job description here...\"
}
```

#### 3. Analyze Resume
```bash
POST /analyze-resume
Content-Type: application/json

{
  \"resume_text\": \"Your resume text here...\",
  \"job_description\": \"Job description here...\"
}
```

#### 4. Generate Interview Questions
```bash
POST /generateQuestions
Content-Type: application/json

{
  \"resume_text\": \"Your resume text here...\",
  \"job_description\": \"Job description here...\"
}
```

#### 5. Job Recommendations
```bash
POST /job-recommendations
Content-Type: application/json

{
  \"resume_text\": \"Your resume text here...\"
}
```

#### 6. Resume Chat
```bash
POST /resumeChat
Content-Type: application/json

{
  \"resume_text\": \"Your resume text here...\",
  \"job_description\": \"Job description here...\",
  \"question\": \"Your question here...\"
}
```

### All Available Endpoints
- `POST /extractSkills` - Extract skills from resume
- `POST /atsScore` - Calculate ATS score
- `POST /generateQuestions` - Generate interview questions
- `POST /compareJobDescription` - Compare resume with JD
- `POST /resumeSuggestions` - Get improvement suggestions
- `POST /analyze-resume` - Comprehensive analysis
- `POST /improve-resume` - Improve resume content
- `POST /generate-questions` - Generate questions (resume only)
- `POST /mock-interview` - Mock interview evaluation
- `POST /job-recommendations` - Job role suggestions
- `POST /resumeChat` - Interactive chat
- `GET /health` - Health check

## Configuration

### Environment Variables
| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| GEMINI_API_KEY | Google Gemini API key | Yes | - |

### Model Configuration (in ai_service.py)
```python
MODEL_NAME = "gemini-1.5-flash\"  # Fast and efficient

generation_config = {
    "temperature\": 0.7,      # Creativity level
    "top_p\": 0.95,           # Nucleus sampling
    "top_k\": 40,             # Top-k sampling
    "max_output_tokens\": 8192,  # Max response length
}
```

## Troubleshooting

### Issue: 404 Model Not Found
**Solution**: Ensure you're using the latest `google-generativeai` library
```bash
pip install --upgrade google-generativeai
```

### Issue: 401 Authentication Failed
**Solution**: Check your API key
```bash
# Verify API key is set
echo $GEMINI_API_KEY

# Test API key validity
curl -H \"Content-Type: application/json\" \
  -d '{\"contents\":[{\"parts\":[{\"text\":\"test\"}]}]}' \
  \"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=YOUR_API_KEY\"
```

### Issue: 429 Rate Limit Exceeded
**Solution**: The service has built-in retry logic. If issue persists:
- Wait a few minutes before retrying
- Consider upgrading your Gemini API quota
- Implement request queuing in your application

### Issue: Docker Container Won't Start
**Solution**: Check logs
```bash
docker logs ai-resume-service

# Common fixes:
# 1. Ensure API key is passed correctly
docker run -e GEMINI_API_KEY=your_key ...

# 2. Check port availability
lsof -i :8000

# 3. Rebuild with no cache
docker build --no-cache -t ai-resume-analyzer .
```

## Testing

### Manual Testing with curl
```bash
# Health check
curl http://localhost:8000/health

# Extract skills
curl -X POST http://localhost:8000/extractSkills \
  -H \"Content-Type: application/json\" \
  -d '{
    \"resume_text\": \"Python developer with 5 years experience in FastAPI, Django, React, and AWS...\"
  }'

# ATS Score
curl -X POST http://localhost:8000/atsScore \
  -H \"Content-Type: application/json\" \
  -d '{
    \"resume_text\": \"Your resume here...\",
    \"job_description\": \"Looking for a Python developer with FastAPI experience...\"
  }'
```

### Using Swagger UI
1. Navigate to http://localhost:8000/docs
2. Try out any endpoint interactively
3. View request/response schemas

## Performance

- **Average Response Time**: 2-5 seconds (depending on prompt complexity)
- **Max Concurrent Requests**: Limited by Gemini API quota
- **Retry Attempts**: 3 (with exponential backoff)
- **Max Tokens per Response**: 8192

## Dependencies

```
fastapi==0.109.0          # Web framework
uvicorn==0.27.0           # ASGI server
google-generativeai>=0.8.0 # Gemini API client
python-multipart==0.0.6   # File upload support
pydantic==2.6.0           # Data validation
httpx==0.26.0             # HTTP client
python-dotenv==1.0.1      # Environment variables
tenacity==8.2.3           # Retry logic
```

## Integration with Spring Boot Backend

Your Spring Boot backend should call these endpoints:

```java
// Example: Call AI service from Spring Boot
RestTemplate restTemplate = new RestTemplate();
String aiServiceUrl = \"http://localhost:8000/atsScore\";

Map<String, String> request = new HashMap<>();
request.put(\"resume_text\", resumeText);
request.put(\"job_description\", jobDescription);

ResponseEntity<Map> response = restTemplate.postForEntity(
    aiServiceUrl, 
    request, 
    Map.class
);
```

## Security Considerations

1. **API Key Protection**: Never commit `.env` file with real API keys
2. **Input Validation**: All inputs are validated using Pydantic
3. **Rate Limiting**: Consider adding rate limiting middleware for production
4. **CORS**: Currently allows all origins (`*`) - restrict in production
5. **Logging**: Sensitive data is not logged

## Production Deployment

### Recommended Setup
1. Use environment variables for all secrets
2. Deploy behind a reverse proxy (nginx)
3. Enable HTTPS/TLS
4. Set up monitoring and alerting
5. Configure proper CORS policies
6. Implement rate limiting
7. Use a process manager (systemd, supervisor)

### Example nginx Configuration
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## License
[Your License Here]

## Support
For issues or questions:
- Open an issue on GitHub
- Contact: your-email@example.com

## Changelog

### Version 1.0.0 (Fixed)
- ✅ Fixed Gemini API 404 error
- ✅ Updated to latest google-generativeai library
- ✅ Added comprehensive error handling
- ✅ Implemented retry logic with tenacity
- ✅ Improved response parsing
- ✅ Added detailed logging
- ✅ Enhanced all API endpoints with proper error responses
- ✅ Added safety settings for Gemini API
- ✅ Implemented robust text extraction from responses
- ✅ Added health check endpoint
- ✅ Improved Docker configuration
"