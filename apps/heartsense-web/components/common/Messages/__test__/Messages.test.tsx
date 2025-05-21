import { render, screen } from '@testing-library/react'
import { Vote } from '@/lib/db/schema'
import { Message } from 'ai'

import { Messages } from '../Messages'

jest.mock('../../Message', () => ({
  PreviewMessage: jest.fn(() => (
    <div data-testid="preview-message">Message</div>
  )),
  ThinkingMessage: jest.fn(() => (
    <div data-testid="thinking-message">Thinking...</div>
  )),
}))

jest.mock('../../Overview', () => ({
  Overview: jest.fn(() => <div data-testid="overview">Overview</div>),
}))

jest.mock('@/hooks/useScrollToBottom', () => ({
  useScrollToBottom: jest.fn(() => [jest.fn(), jest.fn()]),
}))

describe('Messages Component Memoization', () => {
  const mockMessages: Message[] = [
    { id: '1', role: 'user', content: 'Hello!' },
    { id: '2', role: 'assistant', content: 'Hi! How can I help you?' },
  ]

  const mockVotes: Vote[] = [
    { messageId: '2', isUpvoted: true, chatId: 'chat-1' },
  ]

  const mockSetMessages = jest.fn()
  const mockReload = jest.fn()

  it('re-renders when isLoading changes', () => {
    const userLastMessage = [
      ...mockMessages,
      { id: '3', role: 'user' as 'user', content: 'Loading...' },
    ]

    const { rerender } = render(
      <Messages
        chatId="chat-1"
        isLoading={false}
        votes={mockVotes}
        messages={mockMessages}
        setMessages={mockSetMessages}
        reload={mockReload}
        isReadonly={false}
      />
    )

    rerender(
      <Messages
        chatId="chat-1"
        isLoading={true}
        votes={mockVotes}
        messages={userLastMessage}
        setMessages={mockSetMessages}
        reload={mockReload}
        isReadonly={false}
      />
    )

    expect(screen.getByTestId('thinking-message')).toBeInTheDocument()
  })

  it('does not re-render if isLoading remains true', () => {
    const { rerender } = render(
      <Messages
        chatId="chat-1"
        isLoading={true}
        votes={mockVotes}
        messages={mockMessages}
        setMessages={mockSetMessages}
        reload={mockReload}
        isReadonly={false}
      />
    )

    const firstRender = screen.getAllByTestId('preview-message').length

    rerender(
      <Messages
        chatId="chat-1"
        isLoading={true}
        votes={mockVotes}
        messages={mockMessages}
        setMessages={mockSetMessages}
        reload={mockReload}
        isReadonly={false}
      />
    )

    const secondRender = screen.getAllByTestId('preview-message').length
    expect(secondRender).toBe(firstRender)
  })

  it('re-renders when messages length changes', () => {
    const { rerender } = render(
      <Messages
        chatId="chat-1"
        isLoading={false}
        votes={mockVotes}
        messages={mockMessages}
        setMessages={mockSetMessages}
        reload={mockReload}
        isReadonly={false}
      />
    )

    rerender(
      <Messages
        chatId="chat-1"
        isLoading={false}
        votes={mockVotes}
        messages={[
          ...mockMessages,
          { id: '3', role: 'user', content: 'New message' },
        ]}
        setMessages={mockSetMessages}
        reload={mockReload}
        isReadonly={false}
      />
    )

    expect(screen.getAllByTestId('preview-message')).toHaveLength(
      mockMessages.length + 1
    )
  })

  it('re-renders when message content changes', () => {
    const { rerender } = render(
      <Messages
        chatId="chat-1"
        isLoading={false}
        votes={mockVotes}
        messages={mockMessages}
        setMessages={mockSetMessages}
        reload={mockReload}
        isReadonly={false}
      />
    )

    rerender(
      <Messages
        chatId="chat-1"
        isLoading={false}
        votes={mockVotes}
        messages={[
          { id: '1', role: 'user', content: 'Hello!!!' },
          { id: '2', role: 'assistant', content: 'Hi! How can I help you?' },
        ]}
        setMessages={mockSetMessages}
        reload={mockReload}
        isReadonly={false}
      />
    )

    expect(screen.getAllByTestId('preview-message')).toHaveLength(
      mockMessages.length
    )
  })

  it('re-renders when votes change', () => {
    const { rerender } = render(
      <Messages
        chatId="chat-1"
        isLoading={false}
        votes={mockVotes}
        messages={mockMessages}
        setMessages={mockSetMessages}
        reload={mockReload}
        isReadonly={false}
      />
    )

    rerender(
      <Messages
        chatId="chat-1"
        isLoading={false}
        votes={[{ messageId: '2', isUpvoted: false, chatId: 'chat-1' }]}
        messages={mockMessages}
        setMessages={mockSetMessages}
        reload={mockReload}
        isReadonly={false}
      />
    )

    expect(screen.getAllByTestId('preview-message')).toHaveLength(
      mockMessages.length
    )
  })

  it('renders Overview when messages is empty', () => {
    render(
      <Messages
        chatId="chat-1"
        isLoading={false}
        votes={[]}
        messages={[]}
        setMessages={mockSetMessages}
        reload={mockReload}
        isReadonly={false}
      />
    )

    expect(screen.getByTestId('overview')).toBeInTheDocument()
  })
  it('renders messages correctly when votes is undefined', () => {
    render(
      <Messages
        chatId="chat-1"
        isLoading={false}
        votes={undefined}
        messages={mockMessages}
        setMessages={mockSetMessages}
        reload={mockReload}
        isReadonly={false}
      />
    )

    const previews = screen.getAllByTestId('preview-message')
    expect(previews).toHaveLength(mockMessages.length)
  })
  it('re-renders when votes prop changes', () => {
    const { rerender } = render(
      <Messages
        chatId="chat-1"
        isLoading={false}
        votes={[{ messageId: '2', isUpvoted: true, chatId: 'chat-1' }]}
        messages={mockMessages}
        setMessages={mockSetMessages}
        reload={mockReload}
        isReadonly={false}
      />
    )

    rerender(
      <Messages
        chatId="chat-1"
        isLoading={false}
        votes={[{ messageId: '2', isUpvoted: false, chatId: 'chat-1' }]}
        messages={mockMessages}
        setMessages={mockSetMessages}
        reload={mockReload}
        isReadonly={false}
      />
    )

    expect(screen.getAllByTestId('preview-message')).toHaveLength(
      mockMessages.length
    )
  })
})
