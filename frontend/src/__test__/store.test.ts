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
    // 1. Start the quiz (This initializes visitedQuestions with [0])
    act(() => {
      useQuizStore.getState().startQuiz("test@example.com");
    });

    // CHECK: Question 1 (index 0) should be visited by default
    // FIX: Added the missing closing parenthesis and semicolon below
    expect(useQuizStore.getState().visitedQuestions).toContain(0);

    // 2. Visit Question 2 (index 1)
    act(() => {
      useQuizStore.getState().markAsVisited(1);
    });
    
    // CHECK: Should now have [0, 1]
    expect(useQuizStore.getState().visitedQuestions).toEqual(expect.arrayContaining([0, 1]));
    expect(useQuizStore.getState().visitedQuestions).toHaveLength(2);

    // Visit Question 2 AGAIN (Should not add duplicate)
    act(() => {
      useQuizStore.getState().markAsVisited(1);
    });
    
    // CHECK: Length should remain 2
    expect(useQuizStore.getState().visitedQuestions).toHaveLength(2);
  });

  it('should record user answers', () => {
    act(() => {
      useQuizStore.getState().answerQuestion(0, 'Paris');
    });
    
    expect(useQuizStore.getState().userAnswers[0]).toBe('Paris');
  });
});