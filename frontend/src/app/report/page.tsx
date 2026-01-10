"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuizStore } from "@/store/quizStore";
import { fetchQuiz } from "@/lib/api";
import LoadingOverlay from "@/components/ui/LoadingOverlay";

export default function ReportPage() {
  const router = useRouter();

  // Track which async action is currently running
  // null = idle | "restart" = restarting quiz | "logout" = logging out
  const [loadingAction, setLoadingAction] =
    useState<"restart" | "logout" | null>(null);

  const questions = useQuizStore((state) => state.questions);
  const userAnswers = useQuizStore((state) => state.userAnswers);
  const email = useQuizStore((state) => state.email);
  const resetQuiz = useQuizStore((state) => state.resetQuiz);

  // Needed for restart flow
  const setQuestions = useQuizStore((state) => state.setQuestions);
  const startQuiz = useQuizStore((state) => state.startQuiz);

  // Security: If no data, kick them back to start
  useEffect(() => {
    if (questions.length === 0) {
      router.push("/");
    }
  }, [questions, router]);

  // Calculate Score
  const score = questions.reduce((acc, question, index) => {
    return acc + (userAnswers[index] === question.correct_answer ? 1 : 0);
  }, 0);

  /**
   * NEW ACTION: Restart Quiz
   * - Fetch fresh questions
   * - Reset quiz state but keep same user
   * - Redirect back to quiz page
   */
  const handleRestart = async () => {
    setLoadingAction("restart");

    try {
      const data = await fetchQuiz();
      setQuestions(data.questions);
      startQuiz(email); // resets timer, answers, flags
      router.push("/quiz");
    } catch (err) {
      alert("Failed to load new quiz. Please check connection.");
      setLoadingAction(null);
    }
  };

  /**
   * NEW ACTION: Logout
   * - Clear all quiz state
   * - Remove persisted storage
   * - Redirect to home
   */
  const handleLogout = () => {
    setLoadingAction("logout");

    setTimeout(() => {
      resetQuiz();
      localStorage.removeItem("quiz-storage");
      router.push("/");
    }, 800);
  };

  if (questions.length === 0) return null;

  // Overlay messaging based on active action
  const overlayMessage =
    loadingAction === "restart"
      ? "Preparing New Quiz..."
      : "Securely Logging Out...";

  const overlaySubMessage =
    loadingAction === "restart"
      ? "Fetching fresh questions for you..."
      : "Erasing session data...";

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      
      {/* Fullscreen loading overlay */}
      <LoadingOverlay
        isVisible={!!loadingAction}
        message={overlayMessage}
        subMessage={overlaySubMessage}
      />

      <div className="max-w-4xl mx-auto">
        {/* SCORE CARD */}
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center mb-8 border border-gray-100">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Quiz Results</h1>
          <p className="text-gray-500 mb-6">Candidate: {email}</p>

          <div className="inline-block p-6 rounded-full bg-blue-50 border-4 border-blue-100 mb-6">
            <span className="text-5xl font-black text-blue-600">{score}</span>
            <span className="text-xl text-gray-400 font-bold">
              /{questions.length}
            </span>
          </div>

          <p className="text-lg text-gray-700 mb-8">
            {score > 10
              ? "🎉 Excellent work!"
              : score > 5
              ? "👍 Good effort!"
              : "📚 Keep practicing!"}
          </p>

          {/* Dual-action */}
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={handleRestart}
              disabled={!!loadingAction}
              className="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              Start New Quiz
            </button>

            <button
              onClick={handleLogout}
              disabled={!!loadingAction}
              className="px-8 py-3 bg-white text-red-600 border-2 border-red-100 font-bold rounded-lg hover:bg-red-50 transition disabled:opacity-50"
            >
              Logout
            </button>
          </div>
        </div>

        {/* DETAILED BREAKDOWN */}
        <h2 className="text-xl font-bold text-gray-700 mb-4 ml-2">Detailed Analysis</h2>

        <div className="space-y-4">
          {questions.map((q, index) => {
            const userAnswer = userAnswers[index];
            const isCorrect = userAnswer === q.correct_answer;

            return (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex gap-4">
                  {/* Question Number Badge */}
                  <div className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm ${
                    isCorrect ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}>
                    {index + 1}
                  </div>

                  <div className="flex-grow">
                    <h3
                      className="text-lg font-medium text-gray-800 mb-4"
                      dangerouslySetInnerHTML={{ __html: q.question }}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      {/* User Answer */}
                      <div className={`p-4 rounded-lg border-l-4 ${
                          isCorrect
                            ? "bg-green-50 border-green-500 border-y border-r border-y-green-100 border-r-green-100" 
                            : "bg-red-50 border-red-500 border-y border-r border-y-red-100 border-r-red-100"
                      }`}>
                        <span className="block text-xs font-bold uppercase text-gray-500 mb-1">
                          Your Answer
                        </span>
                        <span className="text-lg font-bold text-gray-900">
                          {userAnswer || "(Skipped)"}
                        </span>
                      </div>

                      {/* Correct Answer (Only show if wrong) */}
                      {!isCorrect && (
                        <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                          <span className="block text-xs font-bold uppercase text-gray-500 mb-1">
                            Correct Answer
                          </span>
                          <span
                            className="font-semibold text-gray-800"
                            dangerouslySetInnerHTML={{
                              __html: q.correct_answer,
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
