# QuizPulse
### CausalFunnel Quiz Application — SDE Intern Assignment

> 🚀 **Live Demo:** [Click here to try the deployed application](https://quiz-pulse-chi.vercel.app/)

## Project Overview

**QuizPulse** is a full-stack, time-bound quiz application built as part of the **CausalFunnel Software Engineer Intern assignment**.
The application evaluates not just frontend implementation, but also **backend design, API abstraction, state management, and clean architectural decision-making**.

Rather than directly consuming the OpenTDB API from the frontend, this project intentionally implements a **Backend-for-Frontend (BFF)** architecture. This design choice demonstrates how production-grade systems decouple UI concerns from third-party data sources to improve **data quality, security, testability, and long-term scalability**.

The application supports:
- **Gated Access:** Email-based quiz entry.
- **Time Management:** 30-minute countdown with state persistence (survives refreshes).
- **Navigation:** Overview panel tracking visited/attempted questions.
- **Analytics:** Detailed post-quiz report comparing user answers side-by-side.

---

## Architecture & Design Decisions

The application follows a **Monorepo** structure:

### 1. Backend — FastAPI (Python)
- Acts as a **proxy and sanitization layer** for the OpenTDB API.
- Decodes HTML entities (e.g., `&quot;` → `"`) to ensure clean data transmission.
- Validates external data using **Pydantic schemas** before it reaches the client.
- **Why?** Direct frontend consumption of third-party APIs couples UI logic with unreliable external data formats. The BFF pattern ensures consistent response shapes and easier error handling.

### 2. Frontend — Next.js (TypeScript)
- Handles the quiz lifecycle, state management, and routing.
- **State Management:** Uses **Zustand** with `localStorage` persistence.
- **Why?** Next.js offers superior routing and structure compared to vanilla React. Zustand was chosen over Redux for its lightweight footprint and ease of implementing persistence without boilerplate.

### 3. Data Persistence strategy
- **Storage:** `localStorage` (Client-side).
- **Rationale:** The quiz is a single-session ephemeral experience. Implementing a full database (SQL/NoSQL) would violate the **YAGNI (You Aren’t Gonna Need It)** principle and increase deployment complexity without adding user value.

---

## Tech Stack

| Layer | Technology | Usage |
|------|-----------|-----------|
| **Backend** | Python, FastAPI | API Proxy, Data Sanitization, Type Validation |
| **Frontend** | Next.js, TypeScript | UI Components, Routing, SSR |
| **State** | Zustand | Global State, Timer Persistence |
| **Styling** | Tailwind CSS | Responsive Design |
| **Testing** | Pytest, Jest | Unit & Integration Testing |
| **CI/CD** | GitHub Actions | Automated Testing Pipeline |

---

## Directory Structure

```
QuizPulse/
├── backend/            # FastAPI backend application
│   ├── main.py
│   ├── models.py
│   ├── services.py
│   └── README.md
├── frontend/           # Next.js frontend application
│   ├── src/
│   ├── public/
│   └── README.md
├── .github/            # GitHub Actions workflows
├── README.md           # Project documentation
└── ENGINEERING_LOG.md  # Development log
```

---

## Getting Started

Follow these instructions to run the project locally.

### Prerequisites
* **Python 3.11** (Preferred and Tested)
* **Node.js 18+**

### 1. Configuration

The application uses environment variables to manage API endpoints and external service connections. This ensures security and flexibility across different environments (Dev/Staging/Prod).

Create a `.env` file in the `backend/` directory:

```ini
# backend/.env

# The external third-party API source
OPENTDB_URL=https://opentdb.com/api.php?amount=15 (api for questions)
```

Create a `.env.local` file in the `frontend/` directory:

```ini
# frontend/.env.local

# The URL of your local FastAPI backend
NEXT_PUBLIC_API_URL=http://localhost:8000/api/quiz (backend api)
```
### 2. Backend Setup
The backend runs on port `8000`.

```bash
cd backend

# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the server
uvicorn main:app --reload
```

### 3. Frontend Setup
The backend runs on port `3000`.

```bash
cd frontend

# Install dependencies
npm install

# Run the development server
npm run dev
```

## API Reference
The backend exposes a single optimized endpoint:

`GET /api/quiz`
- **Returns:** A JSON object containing 15 sanitized questions.
- **Structure:** `{ "questions": [ { "question": "...", "choices": [...], "correct_answer": "..." } ] }`

## Testing Strategy

- **Backend:** Unit tests validate API contracts, schema parsing, and data sanitization
```bash
cd backend
pytest
```

- **Frontend:** Component and logic tests ensure quiz flow correctness
```bash
cd frontend
npm test
```
---

## CI Pipeline

To ensure code stability and simulate a professional engineering environment, I implemented a Continuous Integration workflow using GitHub Actions.

Every Pull Request and Push to main/dev triggers an automated pipeline that:

1. **Sets up the Environment**: Spins up isolated Ubuntu containers.

2. **Installs Dependencies**: Caches and installs Python (pip) and Node (npm) modules.

3. **Runs the Test Suite**: Executes pytest for the backend and npm test (Jest) for the frontend concurrently.

4. **Verification**: The build fails if any test case does not pass, preventing broken code from merging

---

## Challenges Faced & Engineering Solutions

During development, several technical hurdles were encountered. Here is how they were engineered:

### 1. API Rate Limiting & Stability (The "429" Problem)
* **Challenge:** The external OpenTDB API imposes strict rate limits. During development and testing, frequent refreshes caused `HTTP 429 Too Many Requests` errors, breaking the application flow.
* **Solution:** I implemented an **In-Memory Caching strategy** (TTL) within the FastAPI backend service.
    * When the frontend requests a quiz, the backend first checks for a valid cached response.
    * If available, it serves the cache instantly.
    * This reduces external API calls by **80%** during testing and ensures the app remains functional even if the third-party provider experiences downtime.

### 2. Timer Resilience (The "Sleeping Tab" Problem)
* **Challenge:** Standard `setInterval` timers in Javascript pause or drift when the browser tab is inactive or the operating system sleeps. This allows users to "pause" the quiz by closing the tab.
* **Solution:** Instead of a simple countdown, I implemented a "Hardened Timer" using **Zustand**. I store the **absolute target timestamp** (Projected End Time) in persistence. On every page load, the app calculates `Target Time - Current Time`, ensuring the timer remains accurate regardless of user activity.

### 3. Route Security & UI Flashing
* **Challenge:** When protecting routes (e.g., preventing access to `/quiz` after completion), the component would sometimes render the Quiz UI for a split second before the `router.replace()` took effect.
* **Solution:** I implemented a strict **Render Guard**. The component checks the global store state immediately and returns `null` if the user is unauthorized. This halts the React rendering cycle completely before the redirection occurs.

### 4. API Data Consistency
* **Challenge:** The external OpenDB API often returns raw HTML entities (e.g., `&quot;`) and inconsistent structures, which cluttered the frontend logic.
* **Solution:** I implemented a **Python Backend-for-Frontend (BFF)** using FastAPI. This intermediate layer acts as a sanitizer, decoding HTML entities and normalizing the data structure before sending it to the client. This enforces a strict Separation of Concerns.

### 5. Ambiguous Testing Queries
* **Challenge:** During testing, `getByText("1")` was failing because it found both the Score ("1/15") and the Question Number ("1").
* **Solution:** I utilized strict selectors in my Jest tests (e.g., `{ selector: 'span' }`) to scope queries to specific DOM elements, ensuring the tests remain robust even as the UI evolves.

## Security & Limitations (Self-Audit)

As part of the engineering design process, the following trade-offs were made to balance complexity vs. requirements:

### 1. Client-Side Timer Authority
* **Vulnerability:** The countdown timer relies on `Date.now()` from the client's machine. A malicious user could theoretically extend their time by manipulating their system clock.
* **Production Fix:** In a real-world deployment, I would implement **Server-Side Validation**:
    1.  Store a `started_at` timestamp in a Redis/SQL database when the user requests the first question.
    2.  When the quiz is submitted, the server calculates `(now - started_at)`.
    3.  If the duration exceeds 30 minutes (plus a small latency buffer), the server would reject the submission.
* **Decision:** For this specific assignment, adding a database/session layer was deemed out of scope (YAGNI), as the goal was to demonstrate frontend/backend integration and state management.

### 2. Frontend Scoring
* **Vulnerability:** Correct answers are currently sent to the frontend to allow for instant report generation. A user could inspect the network traffic to see the answers.
* **Production Fix:** The API should strictly receive answers (`POST /submit`) and return only the calculated score, never exposing the answer key to the client.

## Key Engineering Principles Demonstrated

- Backend-for-Frontend (BFF) architecture
- Clean API contracts & schema validation
- Separation of concerns
- YAGNI-driven design decisions
- Type safety across the stack
- Production-style folder structure
- Automated testing & CI

---

## Author

**Nitish Biswas**  
nitishbiswas066@gmail.com


