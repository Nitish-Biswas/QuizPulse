// Quiz state managed via Zustand to avoid prop drilling
// and keep quiz logic independent of UI components

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { QuizQuestion } from '@/types/quiz';

/**
 * Global quiz state interface
 * Centralizes all quiz-related data and actions
 */
interface QuizState {
  questions: QuizQuestion[];                // List of quiz questions
  userAnswers: Record<number, string>;      // Map: questionIndex -> selected answer
  currentQuestionIndex: number;             // Currently active question
  timeLeft: number;                         // Remaining time in seconds
  isFinished: boolean;                      // Quiz completion flag
  email: string;                            // User email (quiz identifier)

  // --- Navigation & Review State ---
  markedQuestions: number[];                // Questions marked for review
  visitedQuestions: number[];               // Questions that have been visited

  // ---- Actions ----
  setQuestions: (questions: QuizQuestion[]) => void;
  startQuiz: (email: string) => void;
  answerQuestion: (questionIndex: number, answer: string) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  jumpToQuestion: (index: number) => void;
  tickTimer: () => void;
  submitQuiz: () => void;
  resetQuiz: () => void;

  // ---- Review Actions ----
  toggleMarkForReview: (index: number) => void;
  markAsVisited: (index: number) => void;
}

/**
 * Zustand store with persistence
 * State is stored in localStorage to survive refreshes
 */
export const useQuizStore = create<QuizState>()(
  persist(
    (set, get) => ({
      // ---- Initial State ----
      questions: [],
      userAnswers: {},
      currentQuestionIndex: 0,
      timeLeft: 30 * 60, // 30-minute quiz duration
      isFinished: false,
      email: "",

      // ---- Review State ----
      markedQuestions: [],
      visitedQuestions: [0],

      /**
       * Populate quiz questions after fetching from backend
       */
      setQuestions: (questions) => set({ questions }),

      /**
       * Initialize quiz session
       * Resets state while binding quiz to a user email
       */
      startQuiz: (email) => {
        // Calculate absolute end time to survive refresh
        const targetEndTime = Date.now() + 30 * 60 * 1000;

        set({
          email,
          isFinished: false,
          currentQuestionIndex: 0,
          userAnswers: {},
          markedQuestions: [],
          visitedQuestions: [0],
          endTime: targetEndTime,
          timeLeft: 30 * 60
        });
      },

      /**
       * Record or update an answer for a specific question
       */
      answerQuestion: (idx, answer) =>
        set((state) => ({
          userAnswers: {
            ...state.userAnswers,
            [idx]: answer
          }
        })),

      /**
       * Navigate to the next question (bounded)
       */
      nextQuestion: () =>
        set((state) => ({
          currentQuestionIndex: Math.min(
            state.currentQuestionIndex + 1,
            state.questions.length - 1
          )
        })),

      /**
       * Navigate to the previous question (bounded)
       */
      prevQuestion: () =>
        set((state) => ({
          currentQuestionIndex: Math.max(
            state.currentQuestionIndex - 1,
            0
          )
        })),

      /**
       * Jump directly to a specific question
       * Used by question overview panel
       */
      jumpToQuestion: (index) => {
        // Mark question as visited when jumping
        get().markAsVisited(index);
        set({ currentQuestionIndex: index });
      },

      /**
       * Decrement quiz timer every second
       * Automatically finishes quiz when time expires
       */
      tickTimer: () => {
        const { timeLeft, isFinished } = get();

        // Prevent timer updates after quiz completion
        if (isFinished) return;

        if (timeLeft <= 1) {
          set({ isFinished: true, timeLeft: 0 });
        } else {
          set({ timeLeft: timeLeft - 1 });
        }
      },

      /**
       * Manually submit quiz before timer expires
       */
      submitQuiz: () => set({ isFinished: true }),

      /**
       * Toggle mark/unmark a question for review
       */
      toggleMarkForReview: (index) =>
        set((state) => {
          const isMarked = state.markedQuestions.includes(index);
          return {
            markedQuestions: isMarked
              ? state.markedQuestions.filter((i) => i !== index)
              : [...state.markedQuestions, index]
          };
        }),

      /**
       * Mark a question as visited (idempotent)
       */
      markAsVisited: (index) =>
        set((state) => {
          if (state.visitedQuestions.includes(index)) return {};
          return { visitedQuestions: [...state.visitedQuestions, index] };
        }),

      /**
       * Fully reset quiz state
       * Useful for restarting or leaving the session
       */
      resetQuiz: () =>
        set({
          questions: [],
          userAnswers: {},
          currentQuestionIndex: 0,
          timeLeft: 30 * 60,
          isFinished: false,
          email: "",
          markedQuestions: [],
          visitedQuestions: [0]
        })
    }),
    {
      name: 'quiz-storage' // Key used for localStorage persistence
    }
  )
);
