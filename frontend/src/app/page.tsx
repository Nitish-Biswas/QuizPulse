"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Client-side navigation after quiz initialization
import { fetchQuiz } from "@/lib/api";
import { useQuizStore } from "@/store/quizStore"; // Centralized quiz state management
import LoadingOverlay from "@/components/ui/LoadingOverlay"; 

/**
 * The Start Page Component.
 * * Responsibility:
 * 1. Capture user intent to start the quiz (email gating).
 * 2. Verify backend connectivity before launching the quiz flow.
 * 3. Initialize global quiz state and handle navigation.
 * 4. Handle loading and error states gracefully.
 */
export default function Home() {
  const router = useRouter();

  // ---- Local UI State ----
  const [email, setEmail] = useState("");      // Email used to bind quiz session
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  // ---- Zustand Actions ----
  const setQuestions = useQuizStore((state) => state.setQuestions);
  const startQuiz = useQuizStore((state) => state.startQuiz);

  // Check State
  const storedEmail = useQuizStore((state) => state.email);
  const isFinished = useQuizStore((state) => state.isFinished);
  const timeLeft = useQuizStore((state) => state.timeLeft);
  const questions = useQuizStore((state) => state.questions);

  // 1. MOUNT CHECK
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // SESSION RECOVERY CHECK
  // If user refreshes, this runs on mount. 
  useEffect(() => {
    if (!isMounted) return;

    // SCENARIO A: Quiz is Finished -> Go to Report
    if (storedEmail && isFinished && questions.length > 0) {
      router.replace("/report"); // Use replace to prevent back-button loops
      return;
    }

    // SCENARIO B: Quiz is In Progress -> Go to Quiz
    // (We check questions.length to ensure we actually have data to show)
    if (storedEmail && !isFinished && questions.length > 0) {
      router.replace("/quiz");
      return;
    }
  }, [isMounted, storedEmail, isFinished, questions.length, router]);

  /**
   * Handler for the "Start Quiz" form submission.
   * Flow:
   * 1. Validate email input
   * 2. Fetch sanitized quiz data from FastAPI backend
   * 3. Initialize global quiz store
   * 4. Redirect user to the quiz page
   */
  const handleStart = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic email validation to prevent empty or invalid submissions
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    setError(""); // Reset previous errors

    try {
      // 1. Fetch quiz data from Python BFF
      const data = await fetchQuiz();

      // 2. Initialize quiz state in Zustand
      setQuestions(data.questions);
      startQuiz(email);

      // 3. Navigate to quiz interface
      router.push("/quiz");

    } catch (err: any) {
      // User-friendly error message if backend is unavailable
      const message = err.message || "Failed to start quiz. Please check your connection and try again.";
      setError(message);
      setLoading(false); // Only stop loading on error (otherwise keep it for transition)
    } 
  };

  // Prevent flashing the form if we are about to redirect
  if (!isMounted) return null;
  if (storedEmail && questions.length > 0) {
    return <LoadingOverlay isVisible={true} message="Resuming Session..." />;
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      
      {/* Full Screen Loading Overlay */}
      <LoadingOverlay isVisible={loading} message="Initializing Environment..." />

      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            QuizPulse
          </h1>
        </div>

        {/* Start Quiz Form */}
        <form onSubmit={handleStart} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="intern@example.com"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-black"
            />
          </div>

          {/* Error Display */}
          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-200">
              ⚠️ {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            Start Quiz
          </button>
        </form>

        {/* Footer Disclaimer */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-400">
            You will have 30 minutes to answer 15 questions.
          </p>
        </div>
      </div>
    </main>
  );
}