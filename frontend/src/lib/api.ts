import { QuizResponse } from "@/types/quiz";

// Configuration: URL for the Backend-for-Frontend (BFF).
// In a production environment, this should be an environment variable (NEXT_PUBLIC_API_URL).
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/quiz";

/**
 * Fetches the quiz configuration and questions from the Python Backend.
 * * Design Decision:
 * We fetch from our own Python proxy rather than OpenTDB directly.
 * This ensures the frontend receives sanitized, normalized data
 * and avoids exposing 3rd party API keys or quirks to the client.
 *
 * @returns {Promise<QuizResponse>} The structured quiz data.
 * @throws {Error} If the backend is unreachable or returns a non-200 status.
 */
export const fetchQuiz = async (): Promise<QuizResponse> => {
  try {
    const res = await fetch(API_URL);
    
    // 1. Handle Rate Limiting (429)
    if (res.status === 429) {
      throw new Error("Too many attempts. Please try again in 30 seconds.");
    }

    // 2. Handle Service Unavailable (503)
    if (res.status === 503) {
      throw new Error("Service unavailable. Please try again after some time.");
    }

    // 3. Handle Generic Errors
    if (!res.ok) {
      throw new Error(`Server Error (${res.status}). Please try again later.`);
    }

    const data: QuizResponse = await res.json();
    return data;
  } catch (error) {
    // Log error for debugging (in production, send to Sentry/Datadog)
    console.error("Failed to fetch quiz data:", error);
    throw error;
  }
};