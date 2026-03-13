"""
Centralized Gemini API integration.
All Gemini API calls must go through ask_gemini() in this module.
"""
import logging
import os
from typing import Optional

import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

# Model: gemini-1.5-flash was retired; use gemini-2.0-flash (GA) or gemini-2.5-flash
MODEL_NAME = os.getenv("GEMINI_MODEL", "gemini-2.0-flash")

# Lazy-initialized model (set on first use)
_model: Optional[genai.GenerativeModel] = None


def _get_model() -> genai.GenerativeModel:
    """Get or create the Gemini model. Validates API key on first use."""
    global _model
    if _model is not None:
        return _model

    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        logger.error("GEMINI_API_KEY environment variable is not set")
        raise ValueError(
            "GEMINI_API_KEY is required. Set it in .env or as an environment variable."
        )

    genai.configure(api_key=api_key)
    _model = genai.GenerativeModel(MODEL_NAME)
    logger.info(f"Gemini model initialized: {MODEL_NAME}")
    return _model


def ask_gemini(prompt: str) -> str:
    """
    Send a prompt to Gemini and return the response text.
    Raises appropriate exceptions for API errors.
    """
    try:
        model = _get_model()
        response = model.generate_content(prompt)

        if hasattr(response, "text") and response.text:
            return response.text

        if response.candidates:
            return response.candidates[0].content.parts[0].text

        return "No response from Gemini"

    except ValueError as e:
        err_str = str(e).lower()
        if "api_key" in err_str or "invalid" in err_str:
            logger.error(f"Gemini API key error: {e}")
            raise ValueError(f"Invalid or missing Gemini API key: {e}") from e
        if "404" in err_str or "not found" in err_str:
            logger.error(f"Gemini model not found: {e}")
            raise ValueError(
                f"Gemini model '{MODEL_NAME}' not found. "
                "Try setting GEMINI_MODEL=gemini-2.0-flash or gemini-2.5-flash."
            ) from e
        raise
    except Exception as e:
        err_str = str(e).lower()
        if "resource exhausted" in err_str or "429" in err_str:
            logger.error(f"Gemini rate limit: {e}")
            raise ValueError("Gemini API rate limit exceeded. Please try again later.") from e
        if "503" in err_str or "unavailable" in err_str:
            logger.error(f"Gemini service unavailable: {e}")
            raise ValueError("Gemini API is temporarily unavailable. Please try again.") from e
        logger.error(f"Gemini error: {e}")
        raise ValueError(f"Gemini API error: {e}") from e
