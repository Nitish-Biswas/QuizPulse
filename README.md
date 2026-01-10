# QuizPulse
### CausalFunnel Quiz Application — SDE Intern Assignment

## 📋 Project Overview

**QuizPulse** is a full-stack, time-bound quiz application built as part of the **CausalFunnel Software Engineer Intern assignment**.
The application evaluates not just frontend implementation, but also **backend design, API abstraction, state management, and clean architectural decision-making**.

Rather than directly consuming the OpenTDB API from the frontend, this project intentionally implements a **Backend-for-Frontend (BFF)** architecture. This design choice demonstrates how production-grade systems decouple UI concerns from third-party data sources to improve **data quality, security, testability, and long-term scalability**.

The application supports:
- 🔒 **Gated Access:** Email-based quiz entry.
- ⏱️ **Time Management:** 30-minute countdown with state persistence (survives refreshes).
- 🧭 **Navigation:** Overview panel tracking visited/attempted questions.
- 📊 **Analytics:** Detailed post-quiz report comparing user answers side-by-side.

---

## 🏗 Architecture & Design Decisions

The application follows a **Monorepo** structure:

### 1️⃣ Backend — FastAPI (Python)
- Acts as a **proxy and sanitization layer** for the OpenTDB API.
- Decodes HTML entities (e.g., `&quot;` → `"`) to ensure clean data transmission.
- Validates external data using **Pydantic schemas** before it reaches the client.
- **Why?** Direct frontend consumption of third-party APIs couples UI logic with unreliable external data formats. The BFF pattern ensures consistent response shapes and easier error handling.

### 2️⃣ Frontend — Next.js (TypeScript)
- Handles the quiz lifecycle, state management, and routing.
- **State Management:** Uses **Zustand** with `localStorage` persistence.
- **Why?** Next.js offers superior routing and structure compared to vanilla React. Zustand was chosen over Redux for its lightweight footprint and ease of implementing persistence without boilerplate.

### 3️⃣ Data Persistence strategy
- **Storage:** `localStorage` (Client-side).
- **Rationale:** The quiz is a single-session ephemeral experience. Implementing a full database (SQL/NoSQL) would violate the **YAGNI (You Aren’t Gonna Need It)** principle and increase deployment complexity without adding user value.

---

## 🛠 Tech Stack

| Layer | Technology | Usage |
|------|-----------|-----------|
| **Backend** | Python, FastAPI | API Proxy, Data Sanitization, Type Validation |
| **Frontend** | Next.js, TypeScript | UI Components, Routing, SSR |
| **State** | Zustand | Global State, Timer Persistence |
| **Styling** | Tailwind CSS | Responsive Design |
| **Testing** | Pytest, Jest | Unit & Integration Testing |
| **CI/CD** | GitHub Actions | Automated Testing Pipeline |

---

## 🚀 Getting Started

Follow these instructions to run the project locally.

### Prerequisites
* **Python 3.9+**
* **Node.js 18+**

### 1. Backend Setup
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

### 1. Frontend Setup
The backend runs on port `3000`.

```bash
cd frontend

# Install dependencies
npm install

# Run the development server
npm run dev
```

## 🔌 API Reference
The backend exposes a single optimized endpoint:

`GET /api/quiz`
- **Returns:** A JSON object containing 15 sanitized questions.
- **Structure:** `{ "questions": [ { "question": "...", "choices": [...], "correct_answer": "..." } ] }`

## 🧪 Testing Strategy

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

- **CI Pipeline:** Tests and linters run automatically via GitHub Actions

This ensures the application remains **regression-safe** as features evolve.

---

## 🚀 Getting Started

> *(Setup and installation instructions will be added in the next sprint.)*

---

## 💡 Key Engineering Principles Demonstrated

- Backend-for-Frontend (BFF) architecture
- Clean API contracts & schema validation
- Separation of concerns
- YAGNI-driven design decisions
- Type safety across the stack
- Production-style folder structure
- Automated testing & CI

---

## 👤 Author

**Nitish Biswas**  


