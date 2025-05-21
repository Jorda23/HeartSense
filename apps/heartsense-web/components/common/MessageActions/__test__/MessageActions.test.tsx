import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { useCopyToClipboard } from 'usehooks-ts'
import { ToolInvocation } from 'ai'

import { MessageActions } from '../MessageActions'
import { toast } from 'sonner'

jest.mock('usehooks-ts', () => ({
  useCopyToClipboard: jest.fn(() => [null, jest.fn()]),
}))

jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
  },
}))

describe('MessageActions Component', () => {
  const mockCopyToClipboard = jest.fn()
  beforeEach(() => {
    ;(useCopyToClipboard as jest.Mock).mockReturnValue([
      null,
      mockCopyToClipboard,
    ])
  })

  const baseProps = {
    chatId: 'test-chat',
    message: {
      id: 'test-message-id',
      role: 'assistant' as 'assistant' | 'data' | 'system' | 'user',
      content: 'Test message content',
      toolInvocations: [] as ToolInvocation[],
    },
    vote: undefined as any,
    isLoading: false,
  }

  test('renders nothing when isLoading is true', () => {
    render(<MessageActions {...baseProps} isLoading={true} />)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  test('renders nothing when message role is "user"', () => {
    render(
      <MessageActions
        {...baseProps}
        message={{ ...baseProps.message, role: 'user' }}
      />
    )
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  test('renders nothing when message has toolInvocations', () => {
    render(
      <MessageActions
        {...baseProps}
        message={{
          ...baseProps.message,
          toolInvocations: [{ name: 'test-name' }],
        }}
      />
    )
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  test('copies message content to clipboard and shows success toast on button click', async () => {
    render(<MessageActions {...baseProps} />)

    const copyButton = screen.getByRole('button')

    expect(copyButton).toBeInTheDocument()

    fireEvent.click(copyButton)

    await waitFor(() => {
      expect(mockCopyToClipboard).toHaveBeenCalledWith('Test message content')
      expect(toast.success).toHaveBeenCalledWith('Copied to clipboard!')
    })
  })
})
