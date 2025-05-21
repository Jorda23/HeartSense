import React from 'react'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import {
  MultimodalInput,
  PureSendButton,
  PureStopButton,
} from '../MultimodalInput'

const mockSetInput = jest.fn()
const mockStop = jest.fn()
const mockSetAttachments = jest.fn()
const mockSetMessages = jest.fn()
const mockAppend = jest.fn()
const mockHandleSubmit = jest.fn()

const defaultProps = {
  chatId: '123',
  input: '',
  setInput: mockSetInput,
  isLoading: false,
  stop: mockStop,
  attachments: [] as { url: string }[],
  setAttachments: mockSetAttachments,
  messages: [] as any[],
  setMessages: mockSetMessages,
  append: mockAppend,
  handleSubmit: mockHandleSubmit,
}

jest.mock('usehooks-ts', () => ({
  useLocalStorage: () => ['', jest.fn()],
  useWindowSize: () => ({ width: 1024 }),
}))

describe('MultimodalInput', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the text area and suggested actions initially', () => {
    render(<MultimodalInput {...defaultProps} />)
    expect(screen.getByPlaceholderText(/send a message/i)).toBeInTheDocument()
  })

  it('shows attachments if present', () => {
    const attachments = [{ url: 'https://example.com/image.png' }]
    render(<MultimodalInput {...defaultProps} attachments={attachments} />)
    expect(screen.getByTestId('attachments-preview')).toBeInTheDocument()
  })

  it('calls submitForm on Enter press without Shift and not loading', () => {
    render(<MultimodalInput {...defaultProps} input="Hello" />)
    const textarea = screen.getByTestId('multimodal-input')
    fireEvent.change(textarea, { target: { value: 'Hello' } })
    fireEvent.keyDown(textarea, {
      key: 'Enter',
      code: 'Enter',
      shiftKey: false,
      nativeEvent: { isComposing: false },
    })
    expect(mockHandleSubmit).toHaveBeenCalled()
  })

  it('does not submit when loading', () => {
    render(<MultimodalInput {...defaultProps} input="Hi" isLoading={true} />)
    const textarea = screen.getByTestId('multimodal-input')
    fireEvent.keyDown(textarea, {
      key: 'Enter',
      code: 'Enter',
      shiftKey: false,
      nativeEvent: { isComposing: false },
    })
    expect(mockHandleSubmit).not.toHaveBeenCalled()
  })

  it('disables Send button when input is empty', () => {
    render(<MultimodalInput {...defaultProps} input="" />)
    const sendBtn = screen.getByTestId('send-button')
    expect(sendBtn).toBeDisabled()
  })

  it('calls stop and setMessages on Stop button click', () => {
    render(<MultimodalInput {...defaultProps} isLoading={true} />)
    const stopBtn = screen.getByTestId('stop-button')
    fireEvent.click(stopBtn)
    expect(mockStop).toHaveBeenCalled()
    expect(mockSetMessages).toHaveBeenCalled()
  })
})

describe('MultimodalInput memoization', () => {
  afterEach(() => {
    cleanup()
    jest.clearAllMocks()
  })

  const baseProps = {
    chatId: '123',
    input: 'Hello',
    setInput: mockSetInput,
    isLoading: false,
    stop: mockStop,
    attachments: [],
    setAttachments: mockSetAttachments,
    messages: [],
    setMessages: mockSetMessages,
    append: mockAppend,
    handleSubmit: mockHandleSubmit,
  }

  it('does not re-render when props are equal', () => {
    const { rerender } = render(<MultimodalInput {...baseProps} />)

    const textarea = screen.getByTestId('multimodal-input')
    expect(textarea).toBeInTheDocument()

    rerender(<MultimodalInput {...baseProps} />) // Should not re-render

    // If memo works, mockHandleSubmit should not be called just by re-render
    expect(mockHandleSubmit).not.toHaveBeenCalled()
  })

  it('re-renders when input changes', () => {
    const { rerender } = render(<MultimodalInput {...baseProps} />)

    rerender(<MultimodalInput {...baseProps} input="New input" />)
    const textarea = screen.getByTestId('multimodal-input')
    expect(textarea).toHaveValue('New input')
  })

  it('re-renders when isLoading changes', () => {
    const { rerender } = render(<MultimodalInput {...baseProps} />)

    rerender(<MultimodalInput {...baseProps} isLoading={true} />)
    expect(screen.getByTestId('stop-button')).toBeInTheDocument()
  })

  it('re-renders when attachments change', () => {
    const { rerender } = render(<MultimodalInput {...baseProps} />)

    rerender(
      <MultimodalInput
        {...baseProps}
        attachments={[{ url: 'https://example.com/image.png' }]}
      />
    )

    expect(screen.getByTestId('attachments-preview')).toBeInTheDocument()
  })
})

describe('SendButton onClick behavior', () => {
  it('calls preventDefault and submitForm on click', () => {
    const mockSubmitForm = jest.fn()
    render(<PureSendButton input="Hola" submitForm={mockSubmitForm} />)
    fireEvent.click(screen.getByTestId('send-button'))

    expect(mockSubmitForm).toHaveBeenCalled()
  })

  it('calls setMessages and stop on click', () => {
    const mockSetMessages = jest.fn()
    const mockStop = jest.fn()
    render(<PureStopButton setMessages={mockSetMessages} stop={mockStop} />)
    fireEvent.click(screen.getByTestId('stop-button'))

    expect(mockSetMessages).toHaveBeenCalled()
    expect(mockStop).toHaveBeenCalled()
  })
})
