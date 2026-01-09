# QuizPulse  
### CausalFunnel Quiz Application — SDE Intern Assignment

## 📋 Project Overview

**QuizPulse** is a full-stack, time-bound quiz application built as part of the **CausalFunnel Software Engineer Intern assignment**.  
The application evaluates not just frontend implementation, but also **backend design, API abstraction, state management, and clean architectural decision-making**.

Rather than directly consuming the OpenTDB API from the frontend, this project intentionally implements a **Backend-for-Frontend (BFF)** architecture. This design choice demonstrates how production-grade systems decouple UI concerns from third-party data sources to improve **data quality, security, testability, and long-term scalability**.

The application supports:
- A gated quiz start via email submission
- A 30-minute countdown timer with auto-submission
- Free navigation across 15 questions
- Question visit & attempt tracking
- A detailed post-quiz report comparing user answers with correct answers

The focus throughout the project is on **clarity, correctness, and maintainability**, not just feature completion.

---

## 🏗 Architecture & Design Decisions

The application follows a **Monorepo** structure with clear separation of concerns:

### 1️⃣ Backend — FastAPI (Python)
- Acts as a **proxy and sanitization layer** for the OpenTDB API
- Decodes HTML entities (e.g. `&quot;`, `&#039;`) returned by OpenTDB
- Validates and normalizes API responses using **Pydantic schemas**
- Exposes a clean, frontend-friendly JSON contract

**Why a backend layer?**  
Direct frontend consumption of third-party APIs couples UI logic with unreliable external data. The BFF pattern ensures:
- Consistent response shape
- Easier testing and mocking
- Freedom to swap data sources without frontend changes

---

### 2️⃣ Frontend — Next.js (TypeScript)
- Handles quiz flow, navigation, and session lifecycle
- Manages timer state and auto-submission logic
- Provides an overview panel indicating visited and attempted questions
- Renders a final report view with side-by-side answer comparison

**Why Next.js?**  
Next.js provides structured routing, predictable project organization, and strong TypeScript support — making it a better fit than unstructured SPA setups for scalable applications.

---

### 3️⃣ State & Data Persistence
- **Strategy:** `localStorage` (client-side only)
- Stores user answers, visited questions, and timer state

**Rationale:**  
The quiz is a single-session experience with no authentication or historical tracking requirements. Introducing a database would violate the **YAGNI (You Aren’t Gonna Need It)** principle and unnecessarily increase system complexity.

---

## 🛠 Tech Stack

| Layer | Technology | Reasoning |
|------|-----------|-----------|
| **Backend** | Python, FastAPI | High-performance async APIs, strong typing with Pydantic |
| **Frontend** | Next.js, TypeScript | Predictable routing, scalable UI architecture |
| **Styling** | Tailwind CSS | Rapid, consistent, responsive UI development |
| **Testing** | Pytest, Jest | Ensures correctness across backend & frontend |
| **CI/CD** | GitHub Actions | Automated linting & test execution on every push |

---

## 🧪 Testing Strategy

- **Backend:** Unit tests validate API contracts, schema parsing, and data sanitization
- **Frontend:** Component and logic tests ensure quiz flow correctness
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


