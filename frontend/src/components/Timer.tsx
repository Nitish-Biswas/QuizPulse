"use client";

import { useEffect } from "react";
import { useQuizStore } from "@/store/quizStore";

/**
 * Timer
 * Displays and controls the global quiz countdown.
 *
 * Responsibilities:
 * 1. Drive the quiz timer via a 1-second interval.
 * 2. Stop ticking automatically when the quiz finishes.
 * 3. Provide clear visual urgency feedback to the user.
 */
export default function Timer() {
  // ---- Global Quiz State ----
  // Select only required slices to prevent unnecessary re-renders
  const timeLeft = useQuizStore((state) => state.timeLeft);
  const tickTimer = useQuizStore((state) => state.tickTimer);
  const isFinished = useQuizStore((state) => state.isFinished);

  /**
   * Timer lifecycle management
   * - Starts ticking when the quiz is active
   * - Automatically stops when the quiz is finished
   * - Cleans up interval on unmount
   */
  useEffect(() => {
    // If quiz is completed, do not start a new interval
    if (isFinished) return;

    // Create 1-second ticking interval
    const timerId = setInterval(() => {
      tickTimer();
    }, 1000);

    // Cleanup: always clear intervals to avoid memory leaks
    return () => clearInterval(timerId);
  }, [tickTimer, isFinished]);

  /**
   * Helper utility to format seconds as MM:SS
   */
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Trigger visual urgency state when under 1 minute
  const isUrgent = timeLeft < 60;

  return (
    <div className={`
      /* Layout & Spacing */
      flex items-center gap-2 px-3 py-2 rounded-lg border shadow-sm
      /* Typography (Responsive) */
      font-mono font-bold whitespace-nowrap 
      text-sm md:text-xl 
      /* Dynamic Colors */
      ${isUrgent 
        ? "bg-red-100 text-red-600 border-red-300 animate-pulse" 
        : "bg-blue-50 text-blue-700 border-blue-200"
      }
    `}>
      {/* Icon hidden on very small screens to save space, visible on slightly larger */}
      <span className="hidden xs:inline">⏳</span> 
      <span>
        <span className="hidden sm:inline">Time Left: </span>
        {formatTime(timeLeft)}
      </span>
    </div>
  );
}
