import os
import google.generativeai as genai

# Load API key
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY environment variable not set")

# Configure Gemini
genai.configure(api_key=GEMINI_API_KEY)

# model = genai.GenerativeModel("gemini-1.5-pro-latest")

# model = genai.GenerativeModel("gemini-1.5-flash-latest")

model = genai.GenerativeModel("gemini-1.5-flash")


def ask_gemini(prompt: str):
    try:
        response = model.generate_content(prompt)

        if not response:
            return "No response from Gemini"

        if hasattr(response, "text") and response.text:
            return response.text

        return str(response)

    except Exception as e:
        print("GEMINI ERROR:", str(e))  # IMPORTANT
        raise ValueError(f"Gemini API error: {str(e)}")

# ---------------------------
# Extract Skills
# ---------------------------
def extract_skills(resume_text: str):

    prompt = f"""
Extract all technical and soft skills from the following resume.

Return JSON format:

{{
 "skills": []
}}

Resume:
{resume_text}
"""

    result = ask_gemini(prompt)

    return {"skills_analysis": result}


# ---------------------------
# ATS Score
# ---------------------------
def get_ats_score(resume_text: str, job_description: str):

    prompt = f"""
You are an ATS system.

Compare the resume with the job description.

Return JSON:

{{
 "ats_score": number,
 "matching_skills": [],
 "missing_skills": []
}}

Resume:
{resume_text}

Job Description:
{job_description}
"""

    result = ask_gemini(prompt)

    return {"ats_analysis": result}


# ---------------------------
# Interview Questions
# ---------------------------
def generate_questions(resume_text: str, job_description: str):

    prompt = f"""
Generate 10 interview questions based on the resume and job description.

Include:
- Technical questions
- Behavioral questions

Resume:
{resume_text}

Job Description:
{job_description}
"""

    result = ask_gemini(prompt)

    return {"questions": result}


# ---------------------------
# Compare JD
# ---------------------------
def compare_job_description(resume_text: str, job_description: str):

    prompt = f"""
Compare the resume with the job description.

Return:
- Matching skills
- Missing skills
- Suggestions

Resume:
{resume_text}

Job Description:
{job_description}
"""

    result = ask_gemini(prompt)

    return {"comparison": result}


# ---------------------------
# Resume Suggestions
# ---------------------------
def get_resume_suggestions(resume_text: str, job_description: str):

    prompt = f"""
Provide suggestions to improve the resume based on the job description.

Resume:
{resume_text}

Job Description:
{job_description}
"""

    result = ask_gemini(prompt)

    return {"suggestions": result}


# ---------------------------
# Resume Analysis
# ---------------------------
def analyze_resume_match(resume_text: str, job_description: str):

    prompt = f"""
You are an ATS system.

Analyze the resume against the job description.

Return:
- ATS Score (0-100)
- Matching Skills
- Missing Skills
- Suggestions

Resume:
{resume_text}

Job Description:
{job_description}
"""

    result = ask_gemini(prompt)

    return {"analysis": result}


# ---------------------------
# Improve Resume
# ---------------------------
def improve_resume(resume_text: str):

    prompt = f"""
Improve the following resume to make it ATS friendly.

Rewrite bullet points and improve clarity.

Resume:
{resume_text}
"""

    result = ask_gemini(prompt)

    return {"improved_resume": result}


# ---------------------------
# Resume Interview Questions
# ---------------------------
def generate_interview_questions(resume_text: str):

    prompt = f"""
Generate 10 interview questions based on this resume.

Include technical and behavioral questions.

Resume:
{resume_text}
"""

    result = ask_gemini(prompt)

    return {"questions": result}


# ---------------------------
# Mock Interview
# ---------------------------
def mock_interview_evaluate(resume_text: str, job_description: str):

    prompt = f"""
Act as a mock interviewer.

Evaluate the candidate based on the resume and job description.

Provide:
- strengths
- weaknesses
- improvement suggestions

Resume:
{resume_text}

Job Description:
{job_description}
"""

    result = ask_gemini(prompt)

    return {"mock_interview_feedback": result}


# ---------------------------
# Job Recommendations
# ---------------------------
def get_job_recommendations(resume_text: str):

    prompt = f"""
Suggest suitable job roles based on the resume.

Resume:
{resume_text}

Return top 5 roles with short explanation.
"""

    result = ask_gemini(prompt)

    return {"jobs": result}


# ---------------------------
# Resume Chat
# ---------------------------
def resume_chat(resume_text: str, job_description: str, question: str):

    prompt = f"""
You are a career assistant.

Resume:
{resume_text}

Job Description:
{job_description}

User Question:
{question}

Provide helpful answer.
"""

    result = ask_gemini(prompt)

    return {"answer": result}