"""
Re-exports from gemini.py for backwards compatibility.
All Gemini API logic is centralized in gemini.py.
"""
from app.services.gemini import ask_gemini

__all__ = ["ask_gemini"]
