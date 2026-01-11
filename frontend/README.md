# QuizPulse Frontend

This directory contains the client-side application for QuizPulse, built with **Next.js 16** (App Router) and **TypeScript**. It handles the quiz interface, state management, and results visualization.

## Tech Stack

*   **Framework:** Next.js 16 (React 19)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS
*   **State Management:** Zustand (with persistence)
*   **Animations:** Framer Motion
*   **Testing:** Jest, React Testing Library

## Directory Structure

```
frontend/
├── src/
│   ├── app/          # Next.js App Router pages and layouts
│   ├── components/   # Reusable UI components
│   ├── store/        # Zustand state management stores
│   ├── types/        # TypeScript type definitions
│   └── lib/          # Utility functions and constants
├── public/           # Static assets
├── jest.config.js    # Jest configuration
└── package.json      # Dependencies and scripts
```

## Setup & Installation

### 1. Prerequisites
Ensure you have **Node.js 18+** installed.

### 2. Environment Variables
Create a `.env.local` file in this directory:

```ini
# frontend/.env.local

NEXT_PUBLIC_API_URL=http://localhost:8000/api/quiz
```

### 3. Installation

```bash
npm install
```

## Running the Application

### Development
Start the development server:

```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

### Production Build
Build and start the production version:

```bash
npm run build
npm start
```

## Testing

Run unit and integration tests:

```bash
npm test
```

To run tests in watch mode:

```bash
npm run test:watch
```

## Key Features

*   **Zustand Store:** Manages quiz state (current question, answers, timer) and persists it to `localStorage` to prevent data loss on refresh.
*   **BFF Integration:** Consumes sanitised data from the FastAPI backend.
*   **Responsive Design:** Fully responsive layout built with Tailwind CSS.
