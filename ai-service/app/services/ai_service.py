# import os
# import google.generativeai as genai

# # Load API key
# GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# if not GEMINI_API_KEY:
#     raise ValueError("GEMINI_API_KEY environment variable not set")

# # Configure Gemini
# genai.configure(api_key=GEMINI_API_KEY)

# # model = genai.GenerativeModel("gemini-1.5-pro-latest")

# # model = genai.GenerativeModel("gemini-1.5-flash-latest")

# model = genai.GenerativeModel("gemini-1.5-flash")


# def ask_gemini(prompt: str):
#     try:
#         response = model.generate_content(prompt)

#         if not response:
#             return "No response from Gemini"

#         if hasattr(response, "text") and response.text:
#             return response.text

#         return str(response)

#     except Exception as e:
#         print("GEMINI ERROR:", str(e))  # IMPORTANT
#         raise ValueError(f"Gemini API error: {str(e)}")

# # ---------------------------
# # Extract Skills
# # ---------------------------
# def extract_skills(resume_text: str):

#     prompt = f"""
# Extract all technical and soft skills from the following resume.

# Return JSON format:

# {{
#  "skills": []
# }}

# Resume:
# {resume_text}
# """

#     result = ask_gemini(prompt)

#     return {"skills_analysis": result}


# # ---------------------------
# # ATS Score
# # ---------------------------
# def get_ats_score(resume_text: str, job_description: str):

#     prompt = f"""
# You are an ATS system.

# Compare the resume with the job description.

# Return JSON:

# {{
#  "ats_score": number,
#  "matching_skills": [],
#  "missing_skills": []
# }}

# Resume:
# {resume_text}

# Job Description:
# {job_description}
# """

#     result = ask_gemini(prompt)

#     return {"ats_analysis": result}


# # ---------------------------
# # Interview Questions
# # ---------------------------
# def generate_questions(resume_text: str, job_description: str):

#     prompt = f"""
# Generate 10 interview questions based on the resume and job description.

# Include:
# - Technical questions
# - Behavioral questions

# Resume:
# {resume_text}

# Job Description:
# {job_description}
# """

#     result = ask_gemini(prompt)

#     return {"questions": result}


# # ---------------------------
# # Compare JD
# # ---------------------------
# def compare_job_description(resume_text: str, job_description: str):

#     prompt = f"""
# Compare the resume with the job description.

# Return:
# - Matching skills
# - Missing skills
# - Suggestions

# Resume:
# {resume_text}

# Job Description:
# {job_description}
# """

#     result = ask_gemini(prompt)

#     return {"comparison": result}


# # ---------------------------
# # Resume Suggestions
# # ---------------------------
# def get_resume_suggestions(resume_text: str, job_description: str):

#     prompt = f"""
# Provide suggestions to improve the resume based on the job description.

# Resume:
# {resume_text}

# Job Description:
# {job_description}
# """

#     result = ask_gemini(prompt)

#     return {"suggestions": result}


# # ---------------------------
# # Resume Analysis
# # ---------------------------
# def analyze_resume_match(resume_text: str, job_description: str):

#     prompt = f"""
# You are an ATS system.

# Analyze the resume against the job description.

# Return:
# - ATS Score (0-100)
# - Matching Skills
# - Missing Skills
# - Suggestions

# Resume:
# {resume_text}

# Job Description:
# {job_description}
# """

#     result = ask_gemini(prompt)

#     return {"analysis": result}


# # ---------------------------
# # Improve Resume
# # ---------------------------
# def improve_resume(resume_text: str):

#     prompt = f"""
# Improve the following resume to make it ATS friendly.

# Rewrite bullet points and improve clarity.

# Resume:
# {resume_text}
# """

#     result = ask_gemini(prompt)

#     return {"improved_resume": result}


# # ---------------------------
# # Resume Interview Questions
# # ---------------------------
# def generate_interview_questions(resume_text: str):

#     prompt = f"""
# Generate 10 interview questions based on this resume.

# Include technical and behavioral questions.

# Resume:
# {resume_text}
# """

#     result = ask_gemini(prompt)

#     return {"questions": result}


# # ---------------------------
# # Mock Interview
# # ---------------------------
# def mock_interview_evaluate(resume_text: str, job_description: str):

#     prompt = f"""
# Act as a mock interviewer.

# Evaluate the candidate based on the resume and job description.

# Provide:
# - strengths
# - weaknesses
# - improvement suggestions

# Resume:
# {resume_text}

# Job Description:
# {job_description}
# """

#     result = ask_gemini(prompt)

#     return {"mock_interview_feedback": result}


# # ---------------------------
# # Job Recommendations
# # ---------------------------
# def get_job_recommendations(resume_text: str):

#     prompt = f"""
# Suggest suitable job roles based on the resume.

# Resume:
# {resume_text}

# Return top 5 roles with short explanation.
# """

#     result = ask_gemini(prompt)

#     return {"jobs": result}


# # ---------------------------
# # Resume Chat
# # ---------------------------
# def resume_chat(resume_text: str, job_description: str, question: str):

#     prompt = f"""
# You are a career assistant.

# Resume:
# {resume_text}

# Job Description:
# {job_description}

# User Question:
# {question}

# Provide helpful answer.
# """

#     result = ask_gemini(prompt)

#     return {"answer": result}




import logging
from typing import Dict, Any
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type

# Import Gemini helper (centralized in gemini.py)
from app.services.gemini import ask_gemini

logger = logging.getLogger(__name__)


@retry(
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=1, min=2, max=10),
    retry=retry_if_exception_type((ConnectionError, TimeoutError)),
    reraise=True,
)
def call_gemini(prompt: str) -> str:
    """Wrapper for Gemini calls with retry."""
    try:
        logger.info(f"Sending prompt to Gemini (length: {len(prompt)} chars)")
        response = ask_gemini(prompt)
        logger.info("Received response from Gemini")
        return response
    except Exception as e:
        logger.error(f"Gemini error: {str(e)}")
        raise


def extract_skills(resume_text: str) -> Dict[str, Any]:
    try:
        prompt = f"""
Extract all technical and soft skills from the following resume.

Return ONLY a JSON object like this:

{{
  "skills": ["skill1", "skill2", "skill3"]
}}

Resume:
{resume_text}
"""

        result = call_gemini(prompt)

        return {
            "skills_analysis": result,
            "status": "success"
        }

    except Exception as e:
        logger.error(f"extract_skills error: {str(e)}")
        msg = str(e)
        if "Invalid or missing Gemini API key" in msg or "GEMINI_API_KEY is required" in msg:
            return {
                "success": False,
                "message": "AI analysis temporarily disabled",
                "status": "error",
                "error": msg,
            }
        return {
            "skills_analysis": f"Error analyzing skills: {msg}",
            "status": "error",
            "error": msg,
        }


def get_ats_score(resume_text: str, job_description: str) -> Dict[str, Any]:
    try:
        prompt = f"""
You are an ATS (Applicant Tracking System).

Compare the resume with the job description.

Return ONLY JSON:

{{
  "ats_score": 85,
  "matching_skills": ["skill1"],
  "missing_skills": ["skill2"],
  "recommendations": ["tip1"]
}}

Resume:
{resume_text}

Job Description:
{job_description if job_description else "General resume analysis"}
"""

        result = call_gemini(prompt)

        return {
            "ats_analysis": result,
            "status": "success"
        }

    except Exception as e:
        logger.error(f"get_ats_score error: {str(e)}")
        msg = str(e)
        if "Invalid or missing Gemini API key" in msg or "GEMINI_API_KEY is required" in msg:
            return {
                "success": False,
                "message": "AI analysis temporarily disabled",
                "status": "error",
                "error": msg,
            }
        return {
            "ats_analysis": f"Error calculating ATS score: {msg}",
            "status": "error",
            "error": msg,
        }


def generate_questions(resume_text: str, job_description: str) -> Dict[str, Any]:
    try:
        prompt = f"""
Generate 10 interview questions based on the resume and job description.

Resume:
{resume_text}

Job Description:
{job_description if job_description else "General interview questions"}
"""

        result = call_gemini(prompt)

        return {
            "questions": result,
            "status": "success"
        }

    except Exception as e:
        logger.error(f"generate_questions error: {str(e)}")
        msg = str(e)
        if "Invalid or missing Gemini API key" in msg or "GEMINI_API_KEY is required" in msg:
            return {
                "success": False,
                "message": "AI analysis temporarily disabled",
                "status": "error",
                "error": msg,
            }
        return {
            "questions": f"Error generating questions: {msg}",
            "status": "error",
            "error": msg,
        }


def compare_job_description(resume_text: str, job_description: str) -> Dict[str, Any]:
    try:
        prompt = f"""
Compare the resume with the job description and provide a detailed analysis.

Resume:
{resume_text}

Job Description:
{job_description}
"""

        result = call_gemini(prompt)

        return {
            "comparison": result,
            "status": "success"
        }

    except Exception as e:
        logger.error(f"compare_job_description error: {str(e)}")
        msg = str(e)
        if "Invalid or missing Gemini API key" in msg or "GEMINI_API_KEY is required" in msg:
            return {
                "success": False,
                "message": "AI analysis temporarily disabled",
                "status": "error",
                "error": msg,
            }
        return {
            "comparison": f"Error comparing: {msg}",
            "status": "error",
            "error": msg,
        }


def get_resume_suggestions(resume_text: str, job_description: str) -> Dict[str, Any]:
    try:
        prompt = f"""
Provide suggestions to improve the resume.

Resume:
{resume_text}

Job Description:
{job_description if job_description else "General improvement"}
"""

        result = call_gemini(prompt)

        return {
            "suggestions": result,
            "status": "success"
        }

    except Exception as e:
        logger.error(f"get_resume_suggestions error: {str(e)}")
        msg = str(e)
        if "Invalid or missing Gemini API key" in msg or "GEMINI_API_KEY is required" in msg:
            return {
                "success": False,
                "message": "AI analysis temporarily disabled",
                "status": "error",
                "error": msg,
            }
        return {
            "suggestions": f"Error generating suggestions: {msg}",
            "status": "error",
            "error": msg,
        }


def analyze_resume_match(resume_text: str, job_description: str) -> Dict[str, Any]:
    try:
        prompt = f"""
Analyze the resume against the job description and provide insights.

Resume:
{resume_text}

Job Description:
{job_description if job_description else "General analysis"}
"""

        result = call_gemini(prompt)

        return {
            "analysis": result,
            "status": "success"
        }

    except Exception as e:
        logger.error(f"analyze_resume_match error: {str(e)}")
        msg = str(e)
        if "Invalid or missing Gemini API key" in msg or "GEMINI_API_KEY is required" in msg:
            return {
                "success": False,
                "message": "AI analysis temporarily disabled",
                "status": "error",
                "error": msg,
            }
        return {
            "analysis": f"Error analyzing resume: {msg}",
            "status": "error",
            "error": msg,
        }


def improve_resume(resume_text: str) -> Dict[str, Any]:
    try:
        prompt = f"""
Improve the following resume to make it more ATS friendly.

Resume:
{resume_text}
"""

        result = call_gemini(prompt)

        return {
            "improved_resume": result,
            "status": "success"
        }

    except Exception as e:
        logger.error(f"improve_resume error: {str(e)}")
        msg = str(e)
        if "Invalid or missing Gemini API key" in msg or "GEMINI_API_KEY is required" in msg:
            return {
                "success": False,
                "message": "AI analysis temporarily disabled",
                "status": "error",
                "error": msg,
            }
        return {
            "improved_resume": f"Error improving resume: {msg}",
            "status": "error",
            "error": msg,
        }


def generate_interview_questions(resume_text: str) -> Dict[str, Any]:
    try:
        prompt = f"""
Generate interview questions based on the following resume.

Resume:
{resume_text}
"""

        result = call_gemini(prompt)

        return {
            "questions": result,
            "status": "success"
        }

    except Exception as e:
        logger.error(f"generate_interview_questions error: {str(e)}")
        msg = str(e)
        if "Invalid or missing Gemini API key" in msg or "GEMINI_API_KEY is required" in msg:
            return {
                "success": False,
                "message": "AI analysis temporarily disabled",
                "status": "error",
                "error": msg,
            }
        return {
            "questions": f"Error generating interview questions: {msg}",
            "status": "error",
            "error": msg,
        }


def mock_interview_evaluate(resume_text: str, job_description: str) -> Dict[str, Any]:
    try:
        prompt = f"""
Conduct a mock interview evaluation.

Resume:
{resume_text}

Job Description:
{job_description if job_description else "General interview"}
"""

        result = call_gemini(prompt)

        return {
            "mock_interview_feedback": result,
            "status": "success"
        }

    except Exception as e:
        logger.error(f"mock_interview_evaluate error: {str(e)}")
        msg = str(e)
        if "Invalid or missing Gemini API key" in msg or "GEMINI_API_KEY is required" in msg:
            return {
                "success": False,
                "message": "AI analysis temporarily disabled",
                "status": "error",
                "error": msg,
            }
        return {
            "mock_interview_feedback": f"Error conducting mock interview: {msg}",
            "status": "error",
            "error": msg,
        }


def get_job_recommendations(resume_text: str) -> Dict[str, Any]:
    try:
        prompt = f"""
Suggest job roles suitable for the following resume.

Resume:
{resume_text}
"""

        result = call_gemini(prompt)

        return {
            "jobs": result,
            "status": "success"
        }

    except Exception as e:
        logger.error(f"get_job_recommendations error: {str(e)}")
        msg = str(e)
        if "Invalid or missing Gemini API key" in msg or "GEMINI_API_KEY is required" in msg:
            return {
                "success": False,
                "message": "AI analysis temporarily disabled",
                "status": "error",
                "error": msg,
            }
        return {
            "jobs": f"Error getting job recommendations: {msg}",
            "status": "error",
            "error": msg,
        }


def resume_chat(resume_text: str, job_description: str, question: str) -> Dict[str, Any]:
    try:
        prompt = f"""
Resume:
{resume_text}

Job Description:
{job_description if job_description else "Not provided"}

Question:
{question}
"""

        result = call_gemini(prompt)

        return {
            "answer": result,
            "status": "success"
        }

    except Exception as e:
        logger.error(f"resume_chat error: {str(e)}")
        msg = str(e)
        if "Invalid or missing Gemini API key" in msg or "GEMINI_API_KEY is required" in msg:
            return {
                "success": False,
                "message": "AI analysis temporarily disabled",
                "status": "error",
                "error": msg,
            }
        return {
            "answer": f"Error processing chat: {msg}",
            "status": "error",
            "error": msg,
        }