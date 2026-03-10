#!/bin/bash
set -e

echo "🚀 AI Resume Analyzer - Setup Script"

# Check prerequisites
command -v java >/dev/null 2>&1 || { echo "Java 17+ required"; exit 1; }
command -v python3 >/dev/null 2>&1 || { echo "Python 3.11+ required"; exit 1; }
command -v node >/dev/null 2>&1 || { echo "Node.js 18+ required"; exit 1; }

# Backend
echo "📦 Building Backend..."
cd backend
mvn clean install -DskipTests
cd ..

# AI Service
echo "🐍 Setting up AI Service..."
cd ai-service
python3 -m venv venv
source venv/bin/activate 2>/dev/null || . venv/Scripts/activate 2>/dev/null
pip install -r requirements.txt
cd ..

# Frontend
echo "⚛️ Setting up Frontend..."
cd frontend
npm install
cd ..

echo "✅ Setup complete! Configure .env files and run services."
echo "  Backend:   cd backend && mvn spring-boot:run"
echo "  AI:        cd ai-service && uvicorn app.main:app --reload"
echo "  Frontend:  cd frontend && npm run dev"
