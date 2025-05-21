import React from 'react'
import { Message } from 'ai'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MessageEditor } from '../MessageEditor'

describe('MessageEditor Component', () => {
  const mockMessage: Message = {
    id: '1',
    content: 'Hello, world!',
    role: 'user',
  }
  const mockSetMode = jest.fn()
  const mockSetMessages = jest.fn()
  const mockReload = jest.fn().mockResolvedValue(null)

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders the component without crashing', () => {
    render(
      <MessageEditor
        message={mockMessage}
        setMode={mockSetMode}
        setMessages={mockSetMessages}
        reload={mockReload}
      />
    )

    const textarea = screen.getByTestId('message-editor')
    expect(textarea).toBeInTheDocument()
    expect(textarea).toHaveValue(mockMessage.content)
  })

  test('updates textarea value when typing', async () => {
    render(
      <MessageEditor
        message={mockMessage}
        setMode={mockSetMode}
        setMessages={mockSetMessages}
        reload={mockReload}
      />
    )

    const textarea = screen.getByTestId('message-editor')
    await userEvent.clear(textarea)
    await userEvent.type(textarea, 'New message content')

    expect(textarea).toHaveValue('New message content')
  })

  test('clicking Cancel resets to view mode', () => {
    render(
      <MessageEditor
        message={mockMessage}
        setMode={mockSetMode}
        setMessages={mockSetMessages}
        reload={mockReload}
      />
    )

    const cancelButton = screen.getByText('Cancel')
    fireEvent.click(cancelButton)

    expect(mockSetMode).toHaveBeenCalledWith('view')
  })

  test('clicking Send updates messages and calls reload', async () => {
    render(
      <MessageEditor
        message={mockMessage}
        setMode={mockSetMode}
        setMessages={mockSetMessages}
        reload={mockReload}
      />
    )

    const textarea = screen.getByTestId('message-editor')
    await userEvent.clear(textarea)
    await userEvent.type(textarea, 'Updated message')

    const sendButton = screen.getByTestId('message-editor-send-button')
    fireEvent.click(sendButton)

    expect(mockSetMessages).toHaveBeenCalled()
    expect(mockSetMode).toHaveBeenCalledWith('view')
    expect(mockReload).toHaveBeenCalled()
  })

  test('updates message content using setMessages', async () => {
    render(
      <MessageEditor
        message={mockMessage}
        setMode={mockSetMode}
        setMessages={mockSetMessages}
        reload={mockReload}
      />
    )

    const textarea = screen.getByTestId('message-editor')
    await userEvent.clear(textarea)
    await userEvent.type(textarea, 'Updated message')

    const sendButton = screen.getByTestId('message-editor-send-button')
    fireEvent.click(sendButton)

    expect(mockSetMessages).toHaveBeenCalledTimes(1)

    const mockMessages = [{ id: '1', content: 'Hello, world!', role: 'user' }]
    const updateFunction = mockSetMessages.mock.calls[0][0]
    const updatedMessages = updateFunction(mockMessages)

    expect(updatedMessages).toEqual([
      {
        id: '1',
        content: 'Updated message',
        role: 'user',
      },
    ])
  })

  test('returns original messages array if message does not exist', async () => {
    render(
      <MessageEditor
        message={{ ...mockMessage, id: '2' }}
        setMode={mockSetMode}
        setMessages={mockSetMessages}
        reload={mockReload}
      />
    )

    const sendButton = screen.getByTestId('message-editor-send-button')
    fireEvent.click(sendButton)

    expect(mockSetMessages).toHaveBeenCalledTimes(1)

    const mockMessages = [{ id: '1', content: 'Hello, world!', role: 'user' }]
    const updateFunction = mockSetMessages.mock.calls[0][0]
    const updatedMessages = updateFunction(mockMessages)

    expect(updatedMessages).toEqual(mockMessages)
  })
})
