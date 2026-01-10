import '@testing-library/jest-dom'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ReportPage from '../app/report/page'
import { fetchQuiz } from '@/lib/api'

// --- MOCKS ---

// 1. Mock Next.js Router
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

// 2. Mock API
jest.mock('@/lib/api', () => ({
  fetchQuiz: jest.fn(),
}));

// 3. Mock Zustand Store
const mockResetQuiz = jest.fn();
const mockStartQuiz = jest.fn();
const mockSetQuestions = jest.fn();

jest.mock('@/store/quizStore', () => ({
  useQuizStore: (selector: any) => {
    const state = {
      // Mock Data to make the page render
      questions: [
        { question: "Q1", correct_answer: "A", choices: ["A", "B"] }
      ],
      userAnswers: { 0: "A" }, // Correct answer
      email: "test@example.com",
      
      // Mock Actions
      resetQuiz: mockResetQuiz,
      startQuiz: mockStartQuiz,
      setQuestions: mockSetQuestions,
    };
    return selector(state);
  }
}));

describe('Report Page Logic', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the score correctly', () => {
    render(<ReportPage />);

    // Use getAllByText to find ALL occurrences of "1"
    const ones = screen.getAllByText('1');

    // We expect at least one of them to be in the document (the score)
    expect(ones.length).toBeGreaterThanOrEqual(1);

    // We check that "/1" exists, which is unique to the score card
    expect(screen.getByText('/1')).toBeInTheDocument();

    // Check if the text "Quiz Results" is there to confirm page load
    expect(screen.getByText(/Quiz Results/i)).toBeInTheDocument();

  });

  it('triggers Restart flow correctly', async () => {
    // Setup API mock return
    (fetchQuiz as jest.Mock).mockResolvedValue({ questions: [] });

    render(<ReportPage />);
    
    const restartBtn = screen.getByText(/Start New Quiz/i);
    fireEvent.click(restartBtn);

    // Verify loading state appears
    expect(screen.getByText(/Preparing New Quiz/i)).toBeInTheDocument();

    await waitFor(() => {
      // Verify API was called
      expect(fetchQuiz).toHaveBeenCalled();
      // Verify Store was updated
      expect(mockSetQuestions).toHaveBeenCalled();
      expect(mockStartQuiz).toHaveBeenCalledWith("test@example.com");
      // Verify Redirection
      expect(mockPush).toHaveBeenCalledWith("/quiz");
    });
  });

  it('triggers Logout flow correctly', async () => {
    jest.useFakeTimers(); // Control time for setTimeout
    
    render(<ReportPage />);
    
    const logoutBtn = screen.getByText(/Logout/i);
    fireEvent.click(logoutBtn);

    // Verify loading text
    expect(screen.getByText(/Logging Out/i)).toBeInTheDocument();

    // Fast-forward timer
    jest.runAllTimers();

    await waitFor(() => {
      expect(mockResetQuiz).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith("/");
    });
    
    jest.useRealTimers();
  });
});