from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

from services import fetch_quiz_data
from models import QuizResponse

load_dotenv()

app = FastAPI(
    title="QuizPuls API",
    description="Backend-for-Frontend to serve sanitized quiz data.",
    version="1.0.0"
)

# Read comma-separated origins from env
FRONTEND_ORIGINS = os.getenv("FRONTEND_ORIGINS", "")

# Convert to clean list
ALLOWED_ORIGINS = [
    origin.strip()
    for origin in FRONTEND_ORIGINS.split(",")
    if origin.strip()
]

print(f"Allowed origins for CORS: {ALLOWED_ORIGINS}")
# Enable CORS so our Next.js frontend (running on a different port) can call this
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS, # Allow our local frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def health_check():
    """Simple health check to verify backend is running."""
    return {"status": "ok", "message": "Backend is running"}

@app.get("/api/quiz", response_model=QuizResponse)
def get_quiz():
    """
    Fetches, cleans, and returns 15 quiz questions.
    """
    questions = fetch_quiz_data()
    return {"questions": questions}