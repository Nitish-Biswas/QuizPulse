# QuizPulse Backend

This directory contains the backend services for QuizPulse, built with **FastAPI**. It acts as a Backend-for-Frontend (BFF), proxying requests to the OpenTDB API, sanitizing data, and ensuring type safety before delivering content to the client.

## Tech Stack

*   **Framework:** FastAPI
*   **Language:** Python 3.11
*   **Server:** Uvicorn
*   **Validation:** Pydantic
*   **Testing:** Pytest

## Directory Structure

```
backend/
├── main.py           # Application entry point and route definitions
├── models.py         # Pydantic data models for request/response validation
├── services.py       # Core business logic (fetching and cleaning data)
├── test_main.py      # Unit and integration tests
├── requirements.txt  # Python dependencies
└── .env              # Environment variables
```

## Setup & Installation

### 1. Prerequisites
Ensure you have **Python 3.11** installed.

### 2. Environment Variables
Create a `.env` file in this directory based on the example below:

```ini
# backend/.env

OPENTDB_URL=https://opentdb.com/api.php?amount=15
FRONTEND_ORIGINS=http://localhost:3000
```

### 3. Installation

```bash
# Create a virtual environment
python3.11 -m venv venv

# Activate the virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
# .\venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

## Running the Server

Start the development server with live reload:

```bash
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`.
You can access the automatic interactive API documentation at `http://localhost:8000/docs`.

## API Endpoints

### `GET /health`
**Description:** Simple health check to verify the backend is running.
**Response:**
```json
{
  "status": "ok",
  "message": "Backend is running"
}
```

### `GET /api/quiz`
**Description:** Fetches 15 quiz questions from OpenTDB, sanitizes HTML entities, and formats them for the frontend.
**Response:** `QuizResponse` model containing a list of questions.

## Testing

Run the test suite using `pytest`:

```bash
pytest
```
