#!/bin/bash

# Test script for AI Resume Analyzer API
# Usage: ./test_api.sh [base_url]
# Example: ./test_api.sh http://localhost:8000

BASE_URL=${1:-http://localhost:8000}

echo "================================"
echo "AI Resume Analyzer API Tests"
echo "================================"
echo "Base URL: $BASE_URL"
echo ""

# Test 1: Health Check
echo "Test 1: Health Check"
echo "--------------------"
curl -s "$BASE_URL/health" | jq .
echo ""
echo ""

# Sample resume text
RESUME_TEXT="John Doe Software Engineer

EXPERIENCE:
- 5 years of Python development
- Expert in FastAPI, Django, Flask
- Experience with React, TypeScript
- AWS, Docker, Kubernetes
- PostgreSQL, MongoDB

SKILLS:
- Python, JavaScript, TypeScript
- FastAPI, Django, React
- Docker, Kubernetes
- AWS, GCP
- PostgreSQL, MongoDB, Redis"

JOB_DESCRIPTION="We are looking for a Senior Python Developer with:
- 5+ years of Python experience
- FastAPI or Django experience
- React frontend experience
- Cloud deployment experience (AWS/GCP)
- Database experience (PostgreSQL/MongoDB)"

# Convert text to JSON safe format
RESUME_JSON=$(jq -n --arg text "$RESUME_TEXT" '{resume_text: $text}')
ATS_JSON=$(jq -n --arg resume "$RESUME_TEXT" --arg job "$JOB_DESCRIPTION" '{resume_text: $resume, job_description: $job}')

# Test 2: Extract Skills
echo "Test 2: Extract Skills"
echo "----------------------"
curl -s -X POST "$BASE_URL/extractSkills" \
  -H "Content-Type: application/json" \
  -d "$RESUME_JSON" | jq .
echo ""
echo ""

# Test 3: ATS Score
echo "Test 3: ATS Score"
echo "-----------------"
curl -s -X POST "$BASE_URL/atsScore" \
  -H "Content-Type: application/json" \
  -d "$ATS_JSON" | jq .
echo ""
echo ""

# Test 4: Job Recommendations
echo "Test 4: Job Recommendations"
echo "---------------------------"
curl -s -X POST "$BASE_URL/job-recommendations" \
  -H "Content-Type: application/json" \
  -d "$RESUME_JSON" | jq .
echo ""
echo ""

echo "================================"
echo "Tests Completed"
echo "================================"