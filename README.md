# AI Resume Analyzer

A production-ready SaaS application that analyzes resumes using AI, compares them with job descriptions, calculates ATS compatibility scores, and generates personalized interview questions.

## Architecture

- **Backend**: Spring Boot (Java 17) - REST API, authentication, data persistence
- **AI Service**: FastAPI (Python 3.11) - OpenAI-powered resume analysis
- **Frontend**: React + Vite + TailwindCSS + shadcn/ui
- **Database**: PostgreSQL

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

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Secret for JWT token signing |
| `OPENAI_API_KEY` | OpenAI API key |
| `AI_SERVICE_URL` | AI service base URL |

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

MIT
