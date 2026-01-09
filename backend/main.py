from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from services import fetch_quiz_data
from models import QuizResponse

app = FastAPI(
    title="CausalFunnel Quiz API",
    description="Backend-for-Frontend to serve sanitized quiz data.",
    version="1.0.0"
)

# Enable CORS so our Next.js frontend (running on a different port) can call this
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], # Allow our local frontend
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