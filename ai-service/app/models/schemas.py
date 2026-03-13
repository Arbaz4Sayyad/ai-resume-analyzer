# from pydantic import BaseModel


# class ExtractSkillsRequest(BaseModel):
#     resume_text: str


# class AtsScoreRequest(BaseModel):
#     resume_text: str
#     job_description: str = ""


# class GenerateQuestionsRequest(BaseModel):
#     resume_text: str
#     job_description: str = ""


# class CompareJobDescriptionRequest(BaseModel):
#     resume_text: str
#     job_description: str


# class ResumeSuggestionsRequest(BaseModel):
#     resume_text: str
#     job_description: str = ""


# class ResumeChatRequest(BaseModel):
#     resume_text: str
#     job_description: str = ""
#     question: str


# class AnalyzeResumeRequest(BaseModel):
#     resume_text: str
#     job_description: str = ""


# class ImproveResumeRequest(BaseModel):
#     resume_text: str


# class InterviewQuestionsOnlyRequest(BaseModel):
#     resume_text: str


# class MockInterviewRequest(BaseModel):
#     resume_text: str
#     job_description: str = ""


# class JobRecommendationsRequest(BaseModel):
#     resume_text: str



from pydantic import BaseModel, Field
from typing import Optional


class ExtractSkillsRequest(BaseModel):
    resume_text: str = Field(..., min_length=10, description="Resume text content")


class AtsScoreRequest(BaseModel):
    resume_text: str = Field(..., min_length=10, description="Resume text content")
    job_description: str = Field(default="", description="Job description text")


class GenerateQuestionsRequest(BaseModel):
    resume_text: str = Field(..., min_length=10, description="Resume text content")
    job_description: str = Field(default="", description="Job description text")


class CompareJobDescriptionRequest(BaseModel):
    resume_text: str = Field(..., min_length=10, description="Resume text content")
    job_description: str = Field(..., min_length=10, description="Job description text")


class ResumeSuggestionsRequest(BaseModel):
    resume_text: str = Field(..., min_length=10, description="Resume text content")
    job_description: str = Field(default="", description="Job description text")


class ResumeChatRequest(BaseModel):
    resume_text: str = Field(..., min_length=10, description="Resume text content")
    job_description: str = Field(default="", description="Job description text")
    question: str = Field(..., min_length=3, description="User question")


class AnalyzeResumeRequest(BaseModel):
    resume_text: str = Field(..., min_length=10, description="Resume text content")
    job_description: str = Field(default="", description="Job description text")


class ImproveResumeRequest(BaseModel):
    resume_text: str = Field(..., min_length=10, description="Resume text content")


class InterviewQuestionsOnlyRequest(BaseModel):
    resume_text: str = Field(..., min_length=10, description="Resume text content")


class MockInterviewRequest(BaseModel):
    resume_text: str = Field(..., min_length=10, description="Resume text content")
    job_description: str = Field(default="", description="Job description text")


class JobRecommendationsRequest(BaseModel):
    resume_text: str = Field(..., min_length=10, description="Resume text content")