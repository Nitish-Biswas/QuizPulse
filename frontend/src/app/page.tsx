"use client";

import { useState } from "react";
import { fetchQuiz } from "@/lib/api";
import { QuizQuestion } from "@/types/quiz";

/**
 * The Start Page Component.
 * * Responsibility:
 * 1. Capture user intent to start the quiz.
 * 2. Verify backend connectivity before launching the main app.
 * 3. Handle loading and error states gracefully.
 */
export default function Home() {
  // State for UI Feedback
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [error, setError] = useState("");

  /**
   * Handler for the "Start Quiz" button.
   * Initiates the API handshake with the FastAPI backend.
   */
  const handleStartQuiz = async () => {
    setLoading(true);
    setError(""); // Reset previous errors
    
    try {
      // Fetch data from our Python Proxy
      const data = await fetchQuiz();
      setQuestions(data.questions);
    } catch (err) {
      // User-friendly error message if Backend is down
      setError("Unable to connect to the server. Please ensure the Python backend is running on port 8000.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-50 text-black">
      <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm flex flex-col gap-6">
        
        <h1 className="text-4xl font-bold text-blue-600">CausalFunnel Quiz</h1>
        
        {/* CONDITIONAL RENDERING: Show Start Button or Success State */}
        {questions.length === 0 ? (
          <div className="flex flex-col items-center gap-4">
            <p className="text-gray-600">
              Technical Check: Click below to fetch sanitized data from FastAPI.
            </p>
            
            <button
              onClick={handleStartQuiz}
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition shadow-md"
            >
              {loading ? "Establishing Connection..." : "Start Quiz & Verify System"}
            </button>
            
            {/* Error Display */}
            {error && (
              <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                ⚠️ {error}
              </div>
            )}
          </div>
        ) : (
          <div className="w-full bg-white p-6 rounded-xl shadow-lg border border-green-200 animate-fade-in">
            <h2 className="text-2xl font-bold text-green-600 mb-4 flex items-center gap-2">
              <span>✅</span> System Connected
            </h2>
            <p className="mb-4 text-gray-700">
              Successfully retrieved <strong>{questions.length}</strong> questions from the Python Backend.
            </p>
            
            {/* Data Verification Block: Shows the first question to prove data integrity */}
            <div className="p-4 bg-gray-100 rounded-lg border border-gray-300">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Data Inspection (Question 1)</p>
              <p className="font-bold text-lg mb-2">{questions[0].question}</p>
              <div className="grid grid-cols-2 gap-2">
                {questions[0].choices.map((choice, i) => (
                  <div key={i} className="bg-white p-2 rounded border text-sm text-gray-600">
                    {choice}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}