import { act } from '@testing-library/react';
import { useQuizStore } from '@/store/quizStore';

// Mock localStorage so tests don't fail in Node environment
const localStorageMock = (function () {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value.toString(); },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('Quiz Store Logic', () => {
  // Reset store before every test
  beforeEach(() => {
    act(() => {
      useQuizStore.getState().resetQuiz();
    });
  });

  it('should toggle "Mark for Review" correctly', () => {
    // 1. Initial State: Empty
    expect(useQuizStore.getState().markedQuestions).toEqual([]);

    // 2. Mark Question 0
    act(() => {
      useQuizStore.getState().toggleMarkForReview(0);
    });
    expect(useQuizStore.getState().markedQuestions).toContain(0);

    // 3. Unmark Question 0
    act(() => {
      useQuizStore.getState().toggleMarkForReview(0);
    });
    expect(useQuizStore.getState().markedQuestions).not.toContain(0);
  });

  it('should track "Visited" questions but not duplicate them', () => {
    // Visit Question 1
    act(() => {
      useQuizStore.getState().markAsVisited(1);
    });
    expect(useQuizStore.getState().visitedQuestions).toEqual([1]);

    // Visit Question 1 AGAIN (Should not add duplicate)
    act(() => {
      useQuizStore.getState().markAsVisited(1);
    });
    expect(useQuizStore.getState().visitedQuestions).toHaveLength(1);
  });

  it('should record user answers', () => {
    act(() => {
      useQuizStore.getState().answerQuestion(0, 'Paris');
    });
    
    expect(useQuizStore.getState().userAnswers[0]).toBe('Paris');
  });
});