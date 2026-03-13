# from fastapi import APIRouter, HTTPException
# from app.models.schemas import (
#     ExtractSkillsRequest,
#     AtsScoreRequest,
#     GenerateQuestionsRequest,
#     CompareJobDescriptionRequest,
#     ResumeSuggestionsRequest,
#     ResumeChatRequest,
#     AnalyzeResumeRequest,
#     ImproveResumeRequest,
#     InterviewQuestionsOnlyRequest,
#     MockInterviewRequest,
#     JobRecommendationsRequest,
# )
# # from app.services.openai_service import (
# #     extract_skills,
# #     get_ats_score,
# #     generate_questions,
# #     compare_job_description,
# #     get_resume_suggestions,
# #     resume_chat,
# #     analyze_resume_match,
# #     improve_resume,
# #     generate_interview_questions,
# #     mock_interview_evaluate,
# #     get_job_recommendations,
# # )

# from app.services.ai_service import (
#     extract_skills,
#     get_ats_score,
#     generate_questions,
#     compare_job_description,
#     get_resume_suggestions,
#     resume_chat,
#     analyze_resume_match,
#     improve_resume,
#     generate_interview_questions,
#     mock_interview_evaluate,
#     get_job_recommendations,
# )

# router = APIRouter()


# @router.post("/extractSkills")
# async def extract_skills_endpoint(request: ExtractSkillsRequest):
#     try:
#         return extract_skills(request.resume_text)
#     except ValueError as e:
#         raise HTTPException(status_code=500, detail=str(e))
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Skill extraction failed: {str(e)}")


# @router.post("/atsScore")
# async def ats_score_endpoint(request: AtsScoreRequest):
#     try:
#         return get_ats_score(request.resume_text, request.job_description)
#     except ValueError as e:
#         raise HTTPException(status_code=500, detail=str(e))
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"ATS scoring failed: {str(e)}")


# @router.post("/generateQuestions")
# async def generate_questions_endpoint(request: GenerateQuestionsRequest):
#     try:
#         return generate_questions(request.resume_text, request.job_description)
#     except ValueError as e:
#         raise HTTPException(status_code=500, detail=str(e))
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Question generation failed: {str(e)}")


# @router.post("/compareJobDescription")
# async def compare_job_description_endpoint(request: CompareJobDescriptionRequest):
#     try:
#         return compare_job_description(request.resume_text, request.job_description)
#     except ValueError as e:
#         raise HTTPException(status_code=500, detail=str(e))
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Comparison failed: {str(e)}")


# @router.post("/resumeSuggestions")
# async def resume_suggestions_endpoint(request: ResumeSuggestionsRequest):
#     try:
#         return get_resume_suggestions(request.resume_text, request.job_description)
#     except ValueError as e:
#         raise HTTPException(status_code=500, detail=str(e))
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Suggestions failed: {str(e)}")


# @router.post("/analyze-resume")
# async def analyze_resume_endpoint(request: AnalyzeResumeRequest):
#     try:
#         return analyze_resume_match(request.resume_text, request.job_description)
#     except ValueError as e:
#         raise HTTPException(status_code=500, detail=str(e))
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")


# @router.post("/improve-resume")
# async def improve_resume_endpoint(request: ImproveResumeRequest):
#     try:
#         return improve_resume(request.resume_text)
#     except ValueError as e:
#         raise HTTPException(status_code=500, detail=str(e))
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Improve failed: {str(e)}")


# @router.post("/generate-questions")
# async def generate_questions_only_endpoint(request: InterviewQuestionsOnlyRequest):
#     try:
#         return generate_interview_questions(request.resume_text)
#     except ValueError as e:
#         raise HTTPException(status_code=500, detail=str(e))
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Question generation failed: {str(e)}")


# @router.post("/mock-interview")
# async def mock_interview_endpoint(request: MockInterviewRequest):
#     try:
#         return mock_interview_evaluate(request.resume_text, request.job_description)
#     except ValueError as e:
#         raise HTTPException(status_code=500, detail=str(e))
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Mock interview failed: {str(e)}")


# @router.post("/job-recommendations")
# async def job_recommendations_endpoint(request: JobRecommendationsRequest):
#     try:
#         return get_job_recommendations(request.resume_text)
#     except ValueError as e:
#         raise HTTPException(status_code=500, detail=str(e))
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Job recommendations failed: {str(e)}")


# @router.post("/resumeChat")
# async def resume_chat_endpoint(request: ResumeChatRequest):
#     try:
#         return resume_chat(request.resume_text, request.job_description, request.question)
#     except ValueError as e:
#         raise HTTPException(status_code=500, detail=str(e))
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Chat failed: {str(e)}")



from fastapi import APIRouter, HTTPException
import logging
from app.models.schemas import (
    ExtractSkillsRequest,
    AtsScoreRequest,
    GenerateQuestionsRequest,
    CompareJobDescriptionRequest,
    ResumeSuggestionsRequest,
    ResumeChatRequest,
    AnalyzeResumeRequest,
    ImproveResumeRequest,
    InterviewQuestionsOnlyRequest,
    MockInterviewRequest,
    JobRecommendationsRequest,
)

from app.services.ai_service import (
    extract_skills,
    get_ats_score,
    generate_questions,
    compare_job_description,
    get_resume_suggestions,
    resume_chat,
    analyze_resume_match,
    improve_resume,
    generate_interview_questions,
    mock_interview_evaluate,
    get_job_recommendations,
)

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/extractSkills")
async def extract_skills_endpoint(request: ExtractSkillsRequest):
    """Extract skills from resume text."""
    try:
        logger.info("Processing extractSkills request")
        result = extract_skills(request.resume_text)

        if result.get("status") == "error":
            err_msg = result.get("error", "Unknown error")
            raise HTTPException(status_code=503, detail=err_msg)

        return result

    except HTTPException:
        raise
    except ValueError as e:
        logger.error(f"ValueError in extractSkills: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Unexpected error in extractSkills: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Skill extraction failed: {str(e)}")


@router.post("/atsScore")
async def ats_score_endpoint(request: AtsScoreRequest):
    """Calculate ATS score for resume against job description."""
    try:
        logger.info("Processing atsScore request")
        result = get_ats_score(request.resume_text, request.job_description)

        if result.get("status") == "error":
            err_msg = result.get("error", "Unknown error")
            raise HTTPException(status_code=503, detail=err_msg)

        return result

    except HTTPException:
        raise
    except ValueError as e:
        logger.error(f"ValueError in atsScore: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Unexpected error in atsScore: {str(e)}")
        raise HTTPException(status_code=500, detail=f"ATS scoring failed: {str(e)}")


@router.post("/generateQuestions")
async def generate_questions_endpoint(request: GenerateQuestionsRequest):
    """Generate interview questions based on resume and job description."""
    try:
        logger.info("Processing generateQuestions request")
        result = generate_questions(request.resume_text, request.job_description)

        if result.get("status") == "error":
            err_msg = result.get("error", "Unknown error")
            raise HTTPException(status_code=503, detail=err_msg)

        return result

    except HTTPException:
        raise
    except ValueError as e:
        logger.error(f"ValueError in generateQuestions: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Unexpected error in generateQuestions: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Question generation failed: {str(e)}")


@router.post("/compareJobDescription")
async def compare_job_description_endpoint(request: CompareJobDescriptionRequest):
    """Compare resume with job description."""
    try:
        logger.info("Processing compareJobDescription request")
        result = compare_job_description(request.resume_text, request.job_description)

        if result.get("status") == "error":
            err_msg = result.get("error", "Unknown error")
            raise HTTPException(status_code=503, detail=err_msg)

        return result

    except HTTPException:
        raise
    except ValueError as e:
        logger.error(f"ValueError in compareJobDescription: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Unexpected error in compareJobDescription: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Comparison failed: {str(e)}")


@router.post("/resumeSuggestions")
async def resume_suggestions_endpoint(request: ResumeSuggestionsRequest):
    """Get suggestions to improve resume."""
    try:
        logger.info("Processing resumeSuggestions request")
        result = get_resume_suggestions(request.resume_text, request.job_description)

        if result.get("status") == "error":
            err_msg = result.get("error", "Unknown error")
            raise HTTPException(status_code=503, detail=err_msg)

        return result

    except HTTPException:
        raise
    except ValueError as e:
        logger.error(f"ValueError in resumeSuggestions: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Unexpected error in resumeSuggestions: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Suggestions failed: {str(e)}")


@router.post("/analyze-resume")
async def analyze_resume_endpoint(request: AnalyzeResumeRequest):
    """Comprehensive resume analysis."""
    try:
        logger.info("Processing analyze-resume request")
        result = analyze_resume_match(request.resume_text, request.job_description)

        if result.get("status") == "error":
            err_msg = result.get("error", "Unknown error")
            raise HTTPException(status_code=503, detail=err_msg)

        return result

    except HTTPException:
        raise
    except ValueError as e:
        logger.error(f"ValueError in analyze-resume: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Unexpected error in analyze-resume: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")


@router.post("/improve-resume")
async def improve_resume_endpoint(request: ImproveResumeRequest):
    """Improve resume to make it ATS-friendly."""
    try:
        logger.info("Processing improve-resume request")
        result = improve_resume(request.resume_text)

        if result.get("status") == "error":
            err_msg = result.get("error", "Unknown error")
            raise HTTPException(status_code=503, detail=err_msg)

        return result

    except HTTPException:
        raise
    except ValueError as e:
        logger.error(f"ValueError in improve-resume: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Unexpected error in improve-resume: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Improve failed: {str(e)}")


@router.post("/generate-questions")
async def generate_questions_only_endpoint(request: InterviewQuestionsOnlyRequest):
    """Generate interview questions based on resume only."""
    try:
        logger.info("Processing generate-questions request")
        result = generate_interview_questions(request.resume_text)

        if result.get("status") == "error":
            err_msg = result.get("error", "Unknown error")
            raise HTTPException(status_code=503, detail=err_msg)

        return result

    except HTTPException:
        raise
    except ValueError as e:
        logger.error(f"ValueError in generate-questions: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Unexpected error in generate-questions: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Question generation failed: {str(e)}")


@router.post("/mock-interview")
async def mock_interview_endpoint(request: MockInterviewRequest):
    """Conduct mock interview evaluation."""
    try:
        logger.info("Processing mock-interview request")
        result = mock_interview_evaluate(request.resume_text, request.job_description)

        if result.get("status") == "error":
            err_msg = result.get("error", "Unknown error")
            raise HTTPException(status_code=503, detail=err_msg)

        return result

    except HTTPException:
        raise
    except ValueError as e:
        logger.error(f"ValueError in mock-interview: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Unexpected error in mock-interview: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Mock interview failed: {str(e)}")


@router.post("/job-recommendations")
async def job_recommendations_endpoint(request: JobRecommendationsRequest):
    """Get job recommendations based on resume."""
    try:
        logger.info("Processing job-recommendations request")
        result = get_job_recommendations(request.resume_text)

        if result.get("status") == "error":
            err_msg = result.get("error", "Unknown error")
            raise HTTPException(status_code=503, detail=err_msg)

        return result

    except HTTPException:
        raise
    except ValueError as e:
        logger.error(f"ValueError in job-recommendations: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Unexpected error in job-recommendations: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Job recommendations failed: {str(e)}")


@router.post("/resumeChat")
async def resume_chat_endpoint(request: ResumeChatRequest):
    """Interactive chat about resume and career advice."""
    try:
        logger.info("Processing resumeChat request")
        result = resume_chat(request.resume_text, request.job_description, request.question)

        if result.get("status") == "error":
            err_msg = result.get("error", "Unknown error")
            raise HTTPException(status_code=503, detail=err_msg)

        return result

    except HTTPException:
        raise
    except ValueError as e:
        logger.error(f"ValueError in resumeChat: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Unexpected error in resumeChat: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Chat failed: {str(e)}")