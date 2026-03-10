import json
import os
from openai import OpenAI


def get_client() -> OpenAI:
    api_key = os.getenv("OPENAI_API_KEY", "")
    if not api_key:
        raise ValueError("OPENAI_API_KEY environment variable is not set")
    return OpenAI(api_key=api_key)


def extract_skills(resume_text: str) -> dict:
    client = get_client()
    
    prompt = """Extract technical skills from the following resume. Return a JSON object with these exact keys:
- programming_languages: list of programming languages (e.g., Python, Java, JavaScript)
- frameworks: list of frameworks (e.g., React, Spring Boot, Django)
- tools: list of tools (e.g., Git, Docker, AWS)
- databases: list of databases (e.g., PostgreSQL, MongoDB)
- technical_skills: list of other technical skills

Resume:
"""
    prompt += resume_text[:8000]  # Limit token usage
    
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3
    )
    
    content = response.choices[0].message.content
    # Extract JSON from response (handle markdown code blocks)
    if "```json" in content:
        content = content.split("```json")[1].split("```")[0].strip()
    elif "```" in content:
        content = content.split("```")[1].split("```")[0].strip()
    
    return json.loads(content)


def get_ats_score(resume_text: str, job_description: str) -> dict:
    client = get_client()
    
    prompt = f"""Analyze this resume against the job description and provide:
1. ats_score: integer 0-100 (ATS compatibility score)
2. matched_skills: list of skills from resume that match job requirements
3. missing_skills: list of skills in job description not found in resume
4. recommendations: list of 3-5 specific improvements to increase ATS score

Return valid JSON only.

Job Description:
{job_description[:3000] if job_description else "General technical role"}

Resume:
{resume_text[:6000]}
"""
    
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3
    )
    
    content = response.choices[0].message.content
    if "```json" in content:
        content = content.split("```json")[1].split("```")[0].strip()
    elif "```" in content:
        content = content.split("```")[1].split("```")[0].strip()
    
    return json.loads(content)


def generate_questions(resume_text: str, job_description: str) -> dict:
    client = get_client()
    
    prompt = f"""Generate interview questions based on the resume and job description.
Return a JSON object with exactly:
- technical: list of 10 technical interview questions
- behavioral: list of 5 behavioral interview questions

Job Description:
{job_description[:2000] if job_description else "General technical role"}

Resume:
{resume_text[:5000]}
"""
    
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.5
    )
    
    content = response.choices[0].message.content
    if "```json" in content:
        content = content.split("```json")[1].split("```")[0].strip()
    elif "```" in content:
        content = content.split("```")[1].split("```")[0].strip()
    
    return json.loads(content)


def compare_job_description(resume_text: str, job_description: str) -> dict:
    client = get_client()
    
    prompt = f"""Compare the resume skills against the job description. Return JSON with:
- matched_skills: list of skills from resume that match job requirements
- missing_skills: list of required skills not in resume
- skill_match_percentage: float 0-100
- ats_score: integer 0-100
- recommendations: list of 3-5 improvement suggestions

Job Description:
{job_description[:3000]}

Resume:
{resume_text[:6000]}
"""
    
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3
    )
    
    content = response.choices[0].message.content
    if "```json" in content:
        content = content.split("```json")[1].split("```")[0].strip()
    elif "```" in content:
        content = content.split("```")[1].split("```")[0].strip()
    
    return json.loads(content)


def get_resume_suggestions(resume_text: str, job_description: str) -> dict:
    client = get_client()
    
    prompt = f"""Analyze this resume and provide improvement suggestions. Return a JSON object with:
- resume_score: integer 0-100 (overall resume quality score)
- missing_keywords: list of important keywords to add
- improvement_suggestions: list of 3-5 specific improvement suggestions
- optimized_summary: a 1-2 sentence optimized professional summary

Job Description (for context):
{job_description[:2000] if job_description else "General technical role"}

Resume:
{resume_text[:6000]}
"""
    
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3
    )
    
    content = response.choices[0].message.content
    if "```json" in content:
        content = content.split("```json")[1].split("```")[0].strip()
    elif "```" in content:
        content = content.split("```")[1].split("```")[0].strip()
    
    return json.loads(content)


def resume_chat(resume_text: str, job_description: str, question: str) -> dict:
    client = get_client()
    
    system_prompt = """You are an AI career assistant that helps users improve their resumes and prepare for interviews. 
Provide helpful, specific answers about: missing skills, resume improvement suggestions, interview preparation advice.
Be concise and actionable."""
    
    context = f"""Resume (excerpt):
{resume_text[:4000]}

Job Description (if provided):
{job_description[:1500] if job_description else "Not provided"}
"""
    
    user_message = f"{context}\n\nUser question: {question}"
    
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_message}
        ],
        temperature=0.5
    )
    
    answer = response.choices[0].message.content
    return {"answer": answer}
