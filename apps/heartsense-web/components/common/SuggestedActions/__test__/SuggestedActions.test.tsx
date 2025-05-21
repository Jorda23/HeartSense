import { render, screen, fireEvent } from '@testing-library/react'
import { SuggestedActions } from '../SuggestedActions'

describe('SuggestedActions Component', () => {
  const mockAppend = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders suggested actions correctly', () => {
    render(<SuggestedActions chatId="123" append={mockAppend} />)

    expect(screen.getByText('What are the advantages')).toBeInTheDocument()
    expect(screen.getByText('Write code to')).toBeInTheDocument()
    expect(screen.getByText('Help me write an essay')).toBeInTheDocument()
    expect(screen.getByText('What is the weather')).toBeInTheDocument()
  })

  it('calls append function when a button is clicked', () => {
    render(<SuggestedActions chatId="123" append={mockAppend} />)

    const firstButton = screen.getByText('What are the advantages')

    fireEvent.click(firstButton)

    expect(mockAppend).toHaveBeenCalledTimes(1)
    expect(mockAppend).toHaveBeenCalledWith({
      role: 'user',
      content: 'What are the advantages of using Next.js?',
    })
  })

  it('updates URL when a button is clicked', () => {
    const replaceStateSpy = jest.spyOn(window.history, 'replaceState')

    render(<SuggestedActions chatId="123" append={mockAppend} />)

    const firstButton = screen.getByText('What are the advantages')

    fireEvent.click(firstButton)

    expect(replaceStateSpy).toHaveBeenCalledWith({}, '', '/chat/123')
  })

  it('does not re-render when props change due to custom memo comparison', () => {
    const firstAppend = jest.fn()
    const secondAppend = jest.fn()

    const { rerender } = render(
      <SuggestedActions chatId="123" append={firstAppend} />
    )

    const button = screen.getByText('What are the advantages')
    fireEvent.click(button)
    expect(firstAppend).toHaveBeenCalled()

    rerender(<SuggestedActions chatId="123" append={secondAppend} />)

    fireEvent.click(button)

    expect(secondAppend).not.toHaveBeenCalled()
    expect(firstAppend).toHaveBeenCalledTimes(2)
  })
})
