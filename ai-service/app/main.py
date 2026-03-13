# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware

# from app.routes.api import router as api_router

# app = FastAPI(
#     title="AI Resume Analyzer - AI Service",
#     description="OpenAI-powered resume analysis, ATS scoring, and interview question generation",
#     version="1.0.0",
# )

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# app.include_router(api_router)


# @app.get("/health")
# async def health():
#     return {"status": "healthy"}



from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import logging

from dotenv import load_dotenv
load_dotenv()

from app.routes.api import router as api_router

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)

logger = logging.getLogger(__name__)

app = FastAPI(
    title="AI Resume Analyzer - AI Service",
    description="Gemini-powered resume analysis, ATS scoring, and interview question generation",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)


@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "service": "ai-resume-analyzer"
    }


@app.get("/")
async def root():
    return {
        "message": "AI Resume Analyzer API",
        "version": "1.0.0",
        "docs": "/docs"
    }


@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    """
    Return structured JSON for HTTP errors.
    """
    logger.error(f"HTTPException: {exc.detail}")
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "message": exc.detail or "Something went wrong",
        },
    )


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    """
    Catch-all handler to avoid raw 500 responses.
    """
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "message": "Something went wrong",
        },
    )