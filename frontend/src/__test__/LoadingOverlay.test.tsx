import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import LoadingOverlay from '../components/ui/LoadingOverlay'

/**
 * Tests for the LoadingOverlay UI component.
 * Focuses on visibility control and message rendering.
 */
describe('LoadingOverlay Component', () => {

  it('does not render anything when visibility is turned off', () => {
    // Render overlay in hidden state
    render(<LoadingOverlay isVisible={false} />)

    // Spinner/text should not exist in the DOM
    const spinner = screen.queryByText(/loading/i)
    expect(spinner).not.toBeInTheDocument()
  })

  it('renders the default loading message when visible', () => {
    // Render overlay with default props
    render(<LoadingOverlay isVisible={true} />)

    // Default fallback message should be shown
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('renders custom message and sub-message when provided', () => {
    // Render overlay with custom messaging
    render(
      <LoadingOverlay 
        isVisible={true} 
        message="System Update" 
        subMessage="Do not close window" 
      />
    )

    // Both primary and secondary messages should be visible
    expect(screen.getByText('System Update')).toBeInTheDocument()
    expect(screen.getByText('Do not close window')).toBeInTheDocument()
  })
})
