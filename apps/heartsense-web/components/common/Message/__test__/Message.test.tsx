import { render, screen } from '@testing-library/react'
import { Message } from 'ai'

import { PreviewMessage, ThinkingMessage } from '../Message'

jest.mock('usehooks-ts', () => ({
  useCopyToClipboard: jest.fn(() => [null, jest.fn()]),
}))

jest.mock('../../MessageEditor', () => ({
  MessageEditor: jest.fn(() => (
    <div data-testid="message-editor">Message Editor</div>
  )),
}))

jest.mock('../../Weather', () => ({
  Weather: jest.fn(() => <div data-testid="weather-component">Weather</div>),
}))

jest.mock('../../PreviewAttachment', () => ({
  PreviewAttachment: jest.fn(({ attachment }) => (
    <div data-testid="preview-attachment">{`Attachment: ${attachment.url}`}</div>
  )),
}))

describe('PreviewMessage Memoization', () => {
  const baseProps = {
    chatId: 'test-chat',
    message: {
      id: '1',
      role: 'assistant',
      content: 'Test message content',
      experimental_attachments: [],
      toolInvocations: [],
    } as Message,
    vote: undefined as any,
    isLoading: false,
    setMessages: jest.fn(),
    reload: jest.fn(),
    isReadonly: false,
    index: 0,
  }

  test('re-renders when isLoading changes', () => {
    const { rerender } = render(<PreviewMessage {...baseProps} />)
    rerender(<PreviewMessage {...baseProps} isLoading={true} />)
    expect(screen.getByTestId(`message-assistant-0`)).toBeInTheDocument()
  })

  test('re-renders when message content changes', () => {
    const { rerender } = render(<PreviewMessage {...baseProps} />)
    rerender(
      <PreviewMessage
        {...baseProps}
        message={{ ...baseProps.message, content: 'New content' }}
      />
    )
    expect(screen.getByText('New content')).toBeInTheDocument()
  })

  test('re-renders when message reasoning changes', () => {
    const { rerender } = render(<PreviewMessage {...baseProps} />)
    rerender(
      <PreviewMessage
        {...baseProps}
        message={{ ...baseProps.message, reasoning: 'New reasoning' }}
      />
    )
    expect(screen.getByText('New reasoning')).toBeInTheDocument()
  })

  test('re-renders when vote changes', () => {
    const { rerender } = render(<PreviewMessage {...baseProps} />)
    rerender(
      <PreviewMessage
        {...baseProps}
        vote={{ chatId: 'test-chat', messageId: '1', isUpvoted: true }}
      />
    )
    expect(screen.getByTestId(`message-assistant-0`)).toBeInTheDocument()
  })
})

describe('PreviewMessage - Tool Invocation Rendering', () => {
  const baseProps = {
    chatId: 'test-chat',
    message: {
      id: '1',
      role: 'assistant',
      content: 'Test message content',
      toolInvocations: [],
    } as Message,
    vote: undefined as any,
    isLoading: false,
    setMessages: jest.fn(),
    reload: jest.fn(),
    isReadonly: false,
    index: 0,
  }

  test('renders nothing if toolName is unknown', () => {
    render(
      <PreviewMessage
        {...baseProps}
        message={{
          ...baseProps.message,
          toolInvocations: [
            {
              toolName: 'unknownTool',
              toolCallId: 'unknown-1',
              args: {},
              result: {},
              state: 'result',
            },
          ],
        }}
      />
    )

    expect(screen.queryByTestId(/document-toolcall/i)).not.toBeInTheDocument()
    expect(screen.queryByTestId('document-preview')).not.toBeInTheDocument()
    expect(screen.queryByTestId('weather-component')).not.toBeInTheDocument()
  })
})

describe('PreviewMessage - Attachment Rendering', () => {
  const baseProps = {
    chatId: 'test-chat',
    message: {
      id: '1',
      role: 'assistant',
      content: 'Test message content',
      experimental_attachments: [{ url: 'https://example.com/file1.png' }],
      toolInvocations: [],
    } as Message,
    vote: undefined as any,
    isLoading: false,
    setMessages: jest.fn(),
    reload: jest.fn(),
    isReadonly: false,
    index: 0,
  }

  test('renders PreviewAttachment when attachments exist', () => {
    render(<PreviewMessage {...baseProps} />)

    expect(screen.getByTestId('preview-attachment')).toBeInTheDocument()
    expect(
      screen.getByText('Attachment: https://example.com/file1.png')
    ).toBeInTheDocument()
  })

  test('does not render PreviewAttachment when there are no attachments', () => {
    render(
      <PreviewMessage
        {...baseProps}
        message={{ ...baseProps.message, experimental_attachments: [] }}
      />
    )

    expect(screen.queryByTestId('preview-attachment')).not.toBeInTheDocument()
  })
})

describe('ThinkingMessage', () => {
  test('renders ThinkingMessage component', () => {
    render(<ThinkingMessage />)

    expect(screen.getByText('Thinking...')).toBeInTheDocument()
  })
})
