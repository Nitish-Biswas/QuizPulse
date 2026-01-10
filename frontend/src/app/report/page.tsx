"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuizStore } from "@/store/quizStore";

export default function ReportPage() {
  const router = useRouter();
  const questions = useQuizStore((state) => state.questions);
  const userAnswers = useQuizStore((state) => state.userAnswers);
  const email = useQuizStore((state) => state.email);
  const resetQuiz = useQuizStore((state) => state.resetQuiz);

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

  const handleRestart = () => {
    resetQuiz();
    router.push("/");
  };

  if (questions.length === 0) return null;

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        {/* SCORE CARD */}
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center mb-8 border border-gray-100">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Quiz Results</h1>
          <p className="text-gray-500 mb-6">Candidate: {email}</p>
          
          <div className="inline-block p-6 rounded-full bg-blue-50 border-4 border-blue-100 mb-6">
            <span className="text-5xl font-black text-blue-600">{score}</span>
            <span className="text-xl text-gray-400 font-bold">/{questions.length}</span>
          </div>

          <p className="text-lg text-gray-700">
            {score > 10 ? "🎉 Excellent work!" : score > 5 ? "👍 Good effort!" : "📚 Keep practicing!"}
          </p>

          <button
            onClick={handleRestart}
            className="mt-6 px-8 py-3 bg-gray-900 text-white font-bold rounded-lg hover:bg-gray-800 transition shadow-lg"
          >
            Start New Quiz
          </button>
        </div>

        {/* DETAILED BREAKDOWN */}
        <h2 className="text-xl font-bold text-gray-700 mb-4 ml-2">Detailed Analysis</h2>
        
        <div className="space-y-4">
          {questions.map((q, index) => {
            const userAnswer = userAnswers[index];
            const isCorrect = userAnswer === q.correct_answer;
            const isSkipped = !userAnswer;

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
                    <h3 className="text-lg font-medium text-gray-800 mb-3">{q.question}</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      {/* User Answer */}
                      <div className={`p-3 rounded-lg border ${
                        isCorrect 
                          ? "bg-green-50 border-green-200" 
                          : "bg-red-50 border-red-200"
                      }`}>
                        <span className="block text-xs font-bold uppercase mb-1 opacity-70">
                          Your Answer
                        </span>
                        <span className={`font-semibold ${
                          isCorrect ? "text-green-800" : "text-red-800"
                        }`}>
                          {userAnswer || "(Skipped)"}
                        </span>
                      </div>

                      {/* Correct Answer (Only show if wrong) */}
                      {!isCorrect && (
                        <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                          <span className="block text-xs font-bold uppercase text-gray-500 mb-1">
                            Correct Answer
                          </span>
                          <span className="font-semibold text-gray-800">
                            {q.correct_answer}
                          </span>
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