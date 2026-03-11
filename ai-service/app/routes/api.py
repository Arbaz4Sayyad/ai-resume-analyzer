from fastapi import APIRouter, HTTPException
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
# from app.services.openai_service import (
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

router = APIRouter()


@router.post("/extractSkills")
async def extract_skills_endpoint(request: ExtractSkillsRequest):
    try:
        return extract_skills(request.resume_text)
    except ValueError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Skill extraction failed: {str(e)}")


@router.post("/atsScore")
async def ats_score_endpoint(request: AtsScoreRequest):
    try:
        return get_ats_score(request.resume_text, request.job_description)
    except ValueError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"ATS scoring failed: {str(e)}")


@router.post("/generateQuestions")
async def generate_questions_endpoint(request: GenerateQuestionsRequest):
    try:
        return generate_questions(request.resume_text, request.job_description)
    except ValueError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Question generation failed: {str(e)}")


@router.post("/compareJobDescription")
async def compare_job_description_endpoint(request: CompareJobDescriptionRequest):
    try:
        return compare_job_description(request.resume_text, request.job_description)
    except ValueError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Comparison failed: {str(e)}")


@router.post("/resumeSuggestions")
async def resume_suggestions_endpoint(request: ResumeSuggestionsRequest):
    try:
        return get_resume_suggestions(request.resume_text, request.job_description)
    except ValueError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Suggestions failed: {str(e)}")


@router.post("/analyze-resume")
async def analyze_resume_endpoint(request: AnalyzeResumeRequest):
    try:
        return analyze_resume_match(request.resume_text, request.job_description)
    except ValueError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")


@router.post("/improve-resume")
async def improve_resume_endpoint(request: ImproveResumeRequest):
    try:
        return improve_resume(request.resume_text)
    except ValueError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Improve failed: {str(e)}")


@router.post("/generate-questions")
async def generate_questions_only_endpoint(request: InterviewQuestionsOnlyRequest):
    try:
        return generate_interview_questions(request.resume_text)
    except ValueError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Question generation failed: {str(e)}")


@router.post("/mock-interview")
async def mock_interview_endpoint(request: MockInterviewRequest):
    try:
        return mock_interview_evaluate(request.resume_text, request.job_description)
    except ValueError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Mock interview failed: {str(e)}")


@router.post("/job-recommendations")
async def job_recommendations_endpoint(request: JobRecommendationsRequest):
    try:
        return get_job_recommendations(request.resume_text)
    except ValueError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Job recommendations failed: {str(e)}")


@router.post("/resumeChat")
async def resume_chat_endpoint(request: ResumeChatRequest):
    try:
        return resume_chat(request.resume_text, request.job_description, request.question)
    except ValueError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat failed: {str(e)}")
