from fastapi.testclient import TestClient
from unittest.mock import patch, Mock
import pytest
from main import app
from services import _QUIZ_CACHE

client = TestClient(app)

# Helper to clear cache before each test
# Prevents stale cache from affecting test outcomes
@pytest.fixture(autouse=True)
def clear_cache():
    _QUIZ_CACHE["data"] = None
    _QUIZ_CACHE["timestamp"] = 0


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


@patch("services.requests.get")
def test_opentdb_rate_limit(mock_get):
    """
    Simulate OpenTDB returning 429 (Rate Limit).
    Expectation: Backend should return a 429 error.
    """
    # Mock OpenTDB rate-limit response
    mock_response = Mock()
    mock_response.status_code = 429
    mock_get.return_value = mock_response

    response = client.get("/api/quiz")

    assert response.status_code == 429
    assert "busy" in response.json()["detail"].lower()


@patch("services.requests.get")
def test_opentdb_service_unavailable(mock_get):
    """
    Simulate OpenTDB failing completely (Connection Error).
    Expectation: Backend should raise 503.
    """
    # Simulate network failure
    mock_get.side_effect = Exception("Connection Refused")

    response = client.get("/api/quiz")

    assert response.status_code == 503
    assert "unavailable" in response.json()["detail"].lower()
