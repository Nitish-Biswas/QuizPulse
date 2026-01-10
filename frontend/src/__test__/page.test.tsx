import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Home from '../app/page'

// Mock the useRouter hook to prevent errors during testing
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
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
})