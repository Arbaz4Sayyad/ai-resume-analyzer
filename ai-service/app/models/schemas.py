from pydantic import BaseModel


class ExtractSkillsRequest(BaseModel):
    resume_text: str


class AtsScoreRequest(BaseModel):
    resume_text: str
    job_description: str = ""


class GenerateQuestionsRequest(BaseModel):
    resume_text: str
    job_description: str = ""


class CompareJobDescriptionRequest(BaseModel):
    resume_text: str
    job_description: str


class ResumeSuggestionsRequest(BaseModel):
    resume_text: str
    job_description: str = ""


class ResumeChatRequest(BaseModel):
    resume_text: str
    job_description: str = ""
    question: str
