from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_health_check():
    """Ensure the API is up and running."""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok", "message": "Backend is running"}

def test_get_quiz_structure():
    """
    Ensure the quiz endpoint returns the correct data structure
    and successfully sanitizes data.
    """
    response = client.get("/api/quiz")
    
    # 1. Check HTTP Status
    assert response.status_code == 200
    
    # 2. Check Data Structure
    data = response.json()
    assert "questions" in data
    assert len(data["questions"]) == 15
    
    # 3. Check Data Quality (Spot check the first question)
    first_q = data["questions"][0]
    assert "question" in first_q
    assert "correct_answer" in first_q
    assert "choices" in first_q
    
    # 4. Logic Check: Ensure choices include the correct answer
    assert first_q["correct_answer"] in first_q["choices"]
    assert len(first_q["choices"]) > 1 # Should have multiple options