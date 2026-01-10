"use client";

import { useQuizStore } from "@/store/quizStore";
import { motion, AnimatePresence } from "framer-motion"; // Animation support

/**
 * QuestionCard
 * Renders the currently active question, answer options,
 * and navigation controls for the quiz flow.
 */
export default function QuestionCard() {
  // ---- Global Quiz State ----
  const questions = useQuizStore((state) => state.questions);
  const index = useQuizStore((state) => state.currentQuestionIndex);
  const answerQuestion = useQuizStore((state) => state.answerQuestion);
  const userAnswers = useQuizStore((state) => state.userAnswers);
  const nextQuestion = useQuizStore((state) => state.nextQuestion);
  const prevQuestion = useQuizStore((state) => state.prevQuestion);

  // ---- Review State ----
  const toggleMark = useQuizStore((state) => state.toggleMarkForReview); // NEW
  const markedQuestions = useQuizStore((state) => state.markedQuestions); // NEW
  const isMarked = markedQuestions.includes(index); // NEW

  // Derive current question and selected answer
  const question = questions[index];
  const selectedAnswer = userAnswers[index];

  // Guard against undefined state during initial load or redirects
  if (!question) return <div>Loading Question...</div>;

  return (
    <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 max-w-2xl w-full overflow-hidden">
      
      {/* RESPONSIVE HEADER: Flex-wrap allows items to stack if needed, but justify-between keeps them apart */}
      <div className="flex flex-wrap justify-between items-center mb-6 gap-3">
        <span className="text-xs md:text-sm font-bold text-gray-400 uppercase tracking-wide">
          Question {index + 1} of {questions.length}
        </span>
        
        {/* Mark / Unmark question for review */}
        <button 
          onClick={() => toggleMark(index)}
          className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold transition-colors ${
            isMarked 
              ? "bg-yellow-100 text-yellow-700 border border-yellow-200" 
              : "bg-gray-50 text-gray-500 border border-gray-200 hover:bg-gray-100"
          }`}
        >
          <span>{isMarked ? "★" : "☆"}</span>
          <span className="whitespace-nowrap">
            {isMarked ? "Marked" : "Mark for Review"}
          </span>
        </button>
      </div>


        {/* Animated question transition */}
        <AnimatePresence mode="wait">
          <motion.div
            key={index} // Key change triggers enter/exit animation
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -50, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <h2
              className="text-xl font-bold text-gray-800 mt-2 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: question.question }}
            />
          </motion.div>
        </AnimatePresence>
      

      {/* Answer choices */}
      <div className="flex flex-col gap-3">
        {question.choices.map((choice) => (
          <motion.button
            key={choice} // Stable key for animation consistency
            whileHover={{ scale: 1.02 }} // Subtle hover feedback
            whileTap={{ scale: 0.98 }}   // Press interaction feedback
            onClick={() => answerQuestion(index, choice)}
            className={`w-full text-left p-4 rounded-xl border-2 transition-colors ${
              // Visually highlight selected answer for clarity and feedback
              selectedAnswer === choice
                ? "border-blue-600 bg-blue-50 text-blue-800 font-semibold shadow-inner"
                : "border-gray-200 hover:border-blue-300 hover:bg-gray-50 text-gray-700"
            }`}
          >
            {choice}
          </motion.button>
        ))}
      </div>

      {/* Navigation controls */}
      <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
        
        {/* Disable previous navigation on the first question */}
        <button
          onClick={prevQuestion}
          disabled={index === 0}
          className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:hover:bg-transparent font-medium"
        >
          ← Previous
        </button>

        {/* Final question changes CTA to overview/finish */}
        <button
          onClick={nextQuestion}
          className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 font-medium shadow-lg hover:shadow-xl transition"
        >
          {index === questions.length - 1
            ? "Finish Overview"
            : "Next Question →"}
        </button>
      </div>
    </div>
  );
}
