"use client";

import { useQuizStore } from "@/store/quizStore";

/**
 * QuizNavigation
 * Provides a visual overview of all quiz questions and
 * enables direct navigation between them.
 *
 * Visual States:
 * - Current   → Actively viewed question
 * - Answered  → Question has a selected answer
 * - Unvisited → Question not yet interacted with
 */
export default function QuizNavigation() {
  // ---- Global Quiz State ----
  const questions = useQuizStore((state) => state.questions);
  const currentIndex = useQuizStore((state) => state.currentQuestionIndex);
  const userAnswers = useQuizStore((state) => state.userAnswers);
  const jumpToQuestion = useQuizStore((state) => state.jumpToQuestion);

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
      
      {/* Section title */}
      <h3 className="text-gray-500 text-sm font-bold uppercase mb-3">
        Question Overview
      </h3>

      {/* Grid of question indicators */}
      <div className="grid grid-cols-5 gap-2">
        {questions.map((_, index) => {
          // Derive visual state for each question
          const isCurrent = currentIndex === index;
          const isAnswered = userAnswers[index] !== undefined;

          /**
           * Dynamic styling logic:
           * - Blue: current question
           * - Green: answered question
           * - Gray: unvisited question
           */
          let baseClass =
            "h-10 w-10 rounded-lg text-sm font-bold transition-all border-2 ";

          if (isCurrent) {
            baseClass +=
              "border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-200";
          } else if (isAnswered) {
            baseClass +=
              "border-green-500 bg-green-50 text-green-700";
          } else {
            baseClass +=
              "border-gray-200 text-gray-400 hover:border-gray-400";
          }

          return (
            <button
              key={index}
              onClick={() => jumpToQuestion(index)}
              className={baseClass}
              title={`Question ${index + 1}`}
            >
              {index + 1}
            </button>
          );
        })}
      </div>

      {/* Legend explaining color semantics */}
      <div className="mt-4 flex flex-col gap-2 text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-50 border border-blue-600 rounded" />
          Current
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-50 border border-green-500 rounded" />
          Answered
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 border border-gray-200 rounded" />
          Unvisited
        </div>
      </div>
    </div>
  );
}
