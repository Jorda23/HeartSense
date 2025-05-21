import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MessageReasoning } from '../MessageReasoning'

describe('MessageReasoning Component', () => {
  const baseProps = {
    isLoading: false,
    reasoning: 'This is a sample reasoning text.',
  }

  test('renders reasoning text correctly', () => {
    render(<MessageReasoning {...baseProps} />)

    expect(screen.getByText('Reasoned for a few seconds')).toBeInTheDocument()
    expect(
      screen.getByText('This is a sample reasoning text.')
    ).toBeInTheDocument()
  })

  test('displays loading state when isLoading is true', () => {
    render(<MessageReasoning {...baseProps} isLoading={true} />)

    expect(screen.getByText('Reasoning')).toBeInTheDocument()
    expect(screen.getByTestId('loader-icon')).toBeInTheDocument()
    expect(
      screen.queryByText('Reasoned for a few seconds')
    ).not.toBeInTheDocument()
  })

  test('toggles expansion state when clicking the button', async () => {
    render(<MessageReasoning {...baseProps} />)

    expect(
      screen.getByText('This is a sample reasoning text.')
    ).toBeInTheDocument()

    const toggleButton = screen.getByRole('button')
    fireEvent.click(toggleButton)

    await waitFor(() => {
      expect(
        screen.queryByText('This is a sample reasoning text.')
      ).not.toBeInTheDocument()
    })

    fireEvent.click(toggleButton)

    expect(
      await screen.findByText('This is a sample reasoning text.')
    ).toBeInTheDocument()
  })
})
