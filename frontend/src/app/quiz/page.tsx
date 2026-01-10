"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuizStore } from "@/store/quizStore";
import Timer from "@/components/Timer";
import QuestionCard from "@/components/QuestionCard";
import QuizNavigation from "@/components/QuizNavigation";
import LoadingOverlay from "@/components/ui/LoadingOverlay";

/**
 * QuizPage
 * Main quiz execution screen.
 *
 * Responsibilities:
 * 1. Guard access to the quiz (prevent direct URL access or refresh).
 * 2. Coordinate quiz lifecycle (active → completed).
 * 3. Compose core quiz UI components (Timer, Questions, Navigation).
 */
export default function QuizPage() {
  const router = useRouter();

  // Local UI State
  // Used only to provide submit feedback and prevent double submission
  const [loading, setLoading] = useState(false);

  // ---- Global Quiz State ----
  const questions = useQuizStore((state) => state.questions);
  const isFinished = useQuizStore((state) => state.isFinished);
  const submitQuiz = useQuizStore((state) => state.submitQuiz);
  const email = useQuizStore((state) => state.email);

  /**
   * Security Guard:
   * If the user refreshes the page or manually navigates to /quiz
   * without initializing state, redirect back to the start page.
   */
  useEffect(() => {
    if (questions.length === 0 || !email) {
      router.push("/");
    }
  }, [questions, email, router]);

  /**
   * Completion Handler:
   * Automatically route to the report page when the quiz
   * is submitted or the timer expires.
   */
  useEffect(() => {
    if (isFinished) {
      router.push("/report");
    }
  }, [isFinished, router]);

  /**
   * Handle manual quiz submission.
   * Sets a temporary loading state to:
   * - Prevent multiple clicks
   * - Give immediate visual feedback
   */
  const handleSubmit = () => {
    setLoading(true);
    submitQuiz();
  };

  // Prevent UI flash while redirecting unauthorized access
  if (questions.length === 0) return null;

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8">

        {/* Full Screen Loading Overlay */}
        <LoadingOverlay isVisible={loading} message="Submiting..." />
        
      
      {/* HEADER: Assessment Title, Countdown Timer & Manual Submit */}
      <header className="max-w-6xl mx-auto flex justify-between items-center mb-8 sticky top-0 bg-gray-50/90 backdrop-blur pt-4 pb-2 z-10">
        <h1 className="text-xl font-bold hidden md:block text-gray-800">
          QuizPulse
        </h1>

        {/* Global quiz timer */}
        <Timer />

        {/* 
          Manual submission button.
          Disabled once clicked to avoid double submission.
        */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-bold transition shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
        >
            Submit Quiz
        </button>
      </header>

      {/* MAIN GRID LAYOUT */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT: Active Question Area (8 columns) */}
        <div className="lg:col-span-8 flex justify-center">
          <QuestionCard />
        </div>

        {/* RIGHT: Question Navigation & Candidate Info (4 columns) */}
        <div className="lg:col-span-4">
          <div className="sticky top-24">
            {/* Question overview & quick navigation */}
            <QuizNavigation />

            {/* Candidate identity display */}
            <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100 text-sm text-blue-800">
              <p className="font-bold mb-1">📝 Candidate:</p>
              <p className="truncate">{email}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
