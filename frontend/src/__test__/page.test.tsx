import '@testing-library/jest-dom'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Home from '../app/page'
import { fetchQuiz } from '@/lib/api'

// Mock the useRouter hook to prevent errors during testing
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(), 
    };
  },
}));

// Mock the API call so we don't actually hit the backend
jest.mock('@/lib/api', () => ({
  fetchQuiz: jest.fn(),
}));

// Mock the Zustand store to avoid persistence issues in tests
jest.mock('@/store/quizStore', () => ({
  useQuizStore: (selector: any) => {
    const state = {
      questions: [], 
      isFinished: false,
      email: '',
      setQuestions: jest.fn(),
      startQuiz: jest.fn(),
    };
    return selector(state);
  }
}));

describe('Home Page', () => {
  it('renders the heading', () => {
    render(<Home />)
    
    // Check if the main title exists
    const heading = screen.getByRole('heading', { 
      name: /QuizPulse/i 
    })
    
    expect(heading).toBeInTheDocument()
  })

  it('renders the email input field', () => {
    render(<Home />)
    
    const emailInput = screen.getByPlaceholderText(/intern@example.com/i)
    
    expect(emailInput).toBeInTheDocument()
  })

  it('displays specific error message from backend when API fails', async () => {
    // 1. Mock the API to throw a specific error (like 429 or 503)
    const errorMessage = "Service unavailable. Please try again after some time.";
    (fetchQuiz as jest.Mock).mockRejectedValue(new Error(errorMessage));

    render(<Home />);

    // 2. Fill out the form
    const emailInput = screen.getByPlaceholderText(/intern@example.com/i);
    fireEvent.change(emailInput, { target: { value: 'test@error.com' } });

    // 3. Click Start
    const startBtn = screen.getByRole('button', { name: /Start Quiz/i });
    fireEvent.click(startBtn);

    // 4. Verify the error appears on screen
    // We use waitFor because state updates are async
    await waitFor(() => {
      expect(
        screen.getByText(/Service unavailable\. Please try again after some time\./i)
      ).toBeInTheDocument();
    });
  });
})