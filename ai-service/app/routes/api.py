from fastapi import APIRouter, HTTPException
from app.models.schemas import (
    ExtractSkillsRequest,
    AtsScoreRequest,
    GenerateQuestionsRequest,
    CompareJobDescriptionRequest,
    ResumeSuggestionsRequest,
    ResumeChatRequest,
)
from app.services.openai_service import (
    extract_skills,
    get_ats_score,
    generate_questions,
    compare_job_description,
    get_resume_suggestions,
    resume_chat,
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


@router.post("/resumeChat")
async def resume_chat_endpoint(request: ResumeChatRequest):
    try:
        return resume_chat(request.resume_text, request.job_description, request.question)
    except ValueError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat failed: {str(e)}")
