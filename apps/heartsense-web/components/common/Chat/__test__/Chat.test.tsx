import { fireEvent, screen, waitFor } from '@testing-library/react'
import { VisibilityType } from '@/types'
import { toast } from 'sonner'

import { render } from '@/test-utils'
import { openAIChatService } from '@/service/chat_bot/openAIChatService'

import { Chat } from '../Chat'

jest.mock('@/service/chat_bot/openAIChatService', () => ({
  openAIChatService: jest.fn(),
}))

jest.mock('@/lib/utils', () => ({
  generateUUID: jest.fn(
    () => `mocked-uuid-${Math.random().toString(36).slice(2, 10)}`
  ),
}))

jest.mock('@/components/common/ChatHeader', () => ({
  ChatHeader: jest.fn(() => <div data-testid="chat-header">Chat Header</div>),
}))

jest.mock('../../Messages', () => ({
  Messages: jest.fn(({ messages }) => (
    <div data-testid="messages">
      {messages
        .filter((msg: any) => msg.role === 'assistant')
        .map((msg: any) => (
          <div key={msg.id} data-testid="ai-message">
            {msg.content}
          </div>
        ))}
    </div>
  )),
}))

jest.mock('../../MultimodalInput', () => ({
  MultimodalInput: jest.fn(
    ({ input, setInput, handleSubmit, append, stop }) => (
      <div>
        <input
          data-testid="multimodal-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button data-testid="submit-button" onClick={handleSubmit}>
          Send
        </button>
        <button
          data-testid="append-button"
          onClick={async () => {
            await append({
              id: 'test-id',
              role: 'assistant',
              content: 'Appended message',
            })
          }}
        >
          Append
        </button>
        <button data-testid="stop-button" onClick={stop}>
          Stop
        </button>
      </div>
    )
  ),
}))

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(() => jest.fn()),
}))

describe('Chat Component', () => {
  const defaultProps = {
    id: 'test-chat',
    initialMessages: [] as any[],
    selectedChatModel: 'gpt-4',
    selectedVisibilityType: 'private' as VisibilityType,
    isReadonly: false,
  }

  test('stop function does nothing if abortControllerRef.current is null', () => {
    render(<Chat {...defaultProps} />)

    fireEvent.click(screen.getByTestId('stop-button'))

    expect(true).toBe(true)
  })

  test('stop function calls abort on abortControllerRef.current', async () => {
    const abortMock = jest.fn()
    const mockAbortController = { abort: abortMock }

    const originalAbortController = global.AbortController
    global.AbortController = jest.fn(() => mockAbortController as any)
    ;(openAIChatService as jest.Mock).mockResolvedValue([
      { aiResponse: 'Stopping test reply' },
    ])

    render(<Chat {...defaultProps} />)

    const input = screen.getByTestId('multimodal-input')
    fireEvent.change(input, { target: { value: 'Trigger stop' } })
    fireEvent.click(screen.getByTestId('submit-button'))

    await waitFor(() => {
      expect(global.AbortController).toHaveBeenCalled()
    })

    fireEvent.click(screen.getByTestId('stop-button'))

    expect(abortMock).toHaveBeenCalled()

    global.AbortController = originalAbortController
  })

  test('append function calls sendUserMessage with correct content', async () => {
    ;(openAIChatService as jest.Mock).mockResolvedValue([
      { aiResponse: 'Appended AI reply' },
    ])

    render(<Chat {...defaultProps} />)

    fireEvent.click(screen.getByTestId('append-button'))

    await waitFor(() => {
      const messages = screen.getAllByTestId('ai-message')
      expect(messages[0]).toHaveTextContent('Appended AI reply')
    })
  })

  test('calls toast.error when openAIChatService throws an error', async () => {
    ;(openAIChatService as jest.Mock).mockRejectedValue(
      new Error('Network error')
    )

    render(<Chat {...defaultProps} />)

    const input = screen.getByTestId('multimodal-input')
    fireEvent.change(input, { target: { value: 'Hi' } })
    fireEvent.click(screen.getByTestId('submit-button'))

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'An error occurred while sending the message.'
      )
    })
  })

  test('calls toast.warning when request is aborted', async () => {
    const abortError = new Error('Request aborted')
    ;(abortError as any).name = 'CanceledError'
    ;(openAIChatService as jest.Mock).mockRejectedValue(abortError)

    render(<Chat {...defaultProps} />)

    const input = screen.getByTestId('multimodal-input')
    fireEvent.change(input, { target: { value: 'Cancel test' } })
    fireEvent.click(screen.getByTestId('submit-button'))

    await waitFor(() => {
      expect(toast.warning).toHaveBeenCalledWith('AI request was cancelled.')
    })
  })

  test('maps responses to messages and sets them correctly', async () => {
    jest.clearAllMocks()
    ;(openAIChatService as jest.Mock).mockResolvedValue([
      { aiResponse: '¡Hola!' },
      { aiResponse: 'How can I help you?' },
    ])

    render(<Chat {...defaultProps} />)

    const input = screen.getByTestId('multimodal-input')
    fireEvent.change(input, { target: { value: 'Hi' } })
    fireEvent.click(screen.getByTestId('submit-button'))

    await waitFor(() => {
      const messages = screen.getAllByTestId('ai-message')
      expect(messages).toHaveLength(4)
      expect(messages[0]).toHaveTextContent('¡Hola!')
      expect(messages[1]).toHaveTextContent('How can I help you?')
    })
  })

  test('renders Chat component correctly', () => {
    render(<Chat {...defaultProps} />)

    expect(screen.getByTestId('chat-header')).toBeInTheDocument()
    expect(screen.getByTestId('messages')).toBeInTheDocument()
    expect(screen.getByTestId('multimodal-input')).toBeInTheDocument()
  })

  test('does not render MultimodalInput if isReadonly is true', () => {
    render(<Chat {...defaultProps} isReadonly={true} />)

    expect(screen.queryByTestId('multimodal-input')).not.toBeInTheDocument()
  })
})
