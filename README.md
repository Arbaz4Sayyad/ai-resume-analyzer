# AI Resume Analyzer – GenAI Career Platform

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

## License

<!-- MIT -->
