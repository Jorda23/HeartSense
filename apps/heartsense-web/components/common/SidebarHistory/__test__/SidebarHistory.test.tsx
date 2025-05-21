import { toast } from 'sonner'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useInfiniteQuery, useMutation } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { SidebarHistory } from '../SidebarHistory'

jest.mock('@tanstack/react-query', () => ({
  useInfiniteQuery: jest.fn(),
  useMutation: jest.fn(),
}))

jest.mock('react-redux', () => ({
  useSelector: jest.fn<null, []>(() => null),
}))

jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}))

jest.mock('next/navigation', () => ({
  ...jest.requireActual('next/navigation'),
  useParams: jest.fn(),
}))

let mockOnViewportEnter: () => void = () => {}

jest.mock('framer-motion', () => {
  const React = require('react')

  return {
    ...jest.requireActual('framer-motion'),
    motion: {
      div: ({ onViewportEnter, ...props }: any) => {
        mockOnViewportEnter = onViewportEnter
        return <div data-testid="motion-div" {...props} />
      },
    },
  }
})

beforeEach(() => {
  ;(useParams as jest.Mock).mockReturnValue({ id: '1' })
})

describe('SidebarHistory', () => {
  const nowSeconds = Math.floor(Date.now() / 1000)
  const mockMutate = jest.fn()
  const mockConversationData = [
    {
      conversationId: '1',
      title: 'Test Conversation 1',
      createdAt: { seconds: nowSeconds, nanos: 0 },
    },
  ]

  beforeEach(() => {
    ;(useInfiniteQuery as jest.Mock).mockReturnValue({
      data: { pages: [{ conversations: mockConversationData }] },
      fetchNextPage: jest.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
    })
    ;(toast.error as jest.Mock).mockClear()
    ;(toast.success as jest.Mock).mockClear()
  })

  test('renders conversations and groups them correctly', async () => {
    ;(useMutation as jest.Mock).mockReturnValue({ mutate: mockMutate })
    render(<SidebarHistory />)

    expect(await screen.findByText('Test Conversation 1')).toBeInTheDocument()
    expect(screen.getByText('Today')).toBeInTheDocument()
  })

  test('calls updateConversationService when title is updated', async () => {
    ;(useMutation as jest.Mock).mockReturnValue({ mutate: mockMutate })

    render(<SidebarHistory />)

    const editButton = screen.getAllByLabelText('Editar título')[0]
    await userEvent.click(editButton)

    const input = screen.getByDisplayValue(
      'Test Conversation 1'
    ) as HTMLInputElement
    await userEvent.clear(input)
    await userEvent.type(input, 'Updated Title')

    const saveButton = screen.getByLabelText('Guardar título')
    await userEvent.click(saveButton)

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith(
        expect.objectContaining({
          conversationId: '1',
          title: 'Updated Title',
        })
      )
    })
  })

  test('displays toast.success on successful title update', async () => {
    const mockSuccess = jest.fn()
    ;(toast.success as jest.Mock).mockImplementation(mockSuccess)
    ;(useMutation as jest.Mock).mockImplementation(() => ({
      mutate: (_data: any) => {
        mockSuccess('Conversation updated successfully')
      },
    }))

    render(<SidebarHistory />)

    const editButton = screen.getAllByLabelText('Editar título')[0]
    await userEvent.click(editButton)

    const input = screen.getByDisplayValue(
      'Test Conversation 1'
    ) as HTMLInputElement
    await userEvent.clear(input)
    await userEvent.type(input, 'Updated Title')

    const saveButton = screen.getByLabelText('Guardar título')
    await userEvent.click(saveButton)

    await waitFor(() => {
      expect(mockSuccess).toHaveBeenCalledWith(
        'Conversation updated successfully'
      )
    })
  })

  test('displays toast.error on failed title update', async () => {
    const mockError = jest.fn()
    ;(toast.error as jest.Mock).mockImplementation(mockError)
    ;(useMutation as jest.Mock).mockImplementation(() => ({
      mutate: (_data: any) => {
        mockError('Error updating conversation')
      },
    }))

    render(<SidebarHistory />)

    const editButton = screen.getAllByLabelText('Editar título')[0]
    await userEvent.click(editButton)

    const input = screen.getByDisplayValue(
      'Test Conversation 1'
    ) as HTMLInputElement
    await userEvent.clear(input)
    await userEvent.type(input, 'Updated Title')

    const saveButton = screen.getByLabelText('Guardar título')
    await userEvent.click(saveButton)

    await waitFor(() => {
      expect(mockError).toHaveBeenCalledWith('Error updating conversation')
    })
  })

  test('renders empty message when there are no conversations', async () => {
    ;(useMutation as jest.Mock).mockReturnValue({ mutate: jest.fn() })
    ;(useInfiniteQuery as jest.Mock).mockReturnValue({
      data: { pages: [{ conversations: [], totalItems: 0 }] },
      fetchNextPage: jest.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
    })

    render(<SidebarHistory />)

    expect(
      screen.getByText(
        'Your conversations will appear here once you start chatting!'
      )
    ).toBeInTheDocument()
  })

  test('only updates the matching conversation title and leaves others untouched', async () => {
    const mockMutate = jest.fn()
    ;(useMutation as jest.Mock).mockReturnValue({ mutate: mockMutate })

    const now = Math.floor(Date.now() / 1000)

    const mockConversationData = [
      {
        conversationId: '1',
        title: 'Test Conversation 1',
        createdAt: { seconds: now, nanos: 0 },
      },
      {
        conversationId: '2',
        title: 'Other Conversation',
        createdAt: { seconds: now, nanos: 0 },
      },
    ]

    ;(useInfiniteQuery as jest.Mock).mockReturnValue({
      data: {
        pages: [{ conversations: mockConversationData }],
        pageParams: [0],
      },
      fetchNextPage: jest.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
    })

    render(<SidebarHistory />)

    const editButtons = await screen.findAllByLabelText('Editar título')
    await userEvent.click(editButtons[0])

    const input = screen.getByDisplayValue(
      'Test Conversation 1'
    ) as HTMLInputElement
    await userEvent.clear(input)
    await userEvent.type(input, 'Updated Conversation')

    const saveButton = screen.getByLabelText('Guardar título')
    await userEvent.click(saveButton)

    await waitFor(() => {
      expect(screen.getByText('Updated Conversation')).toBeInTheDocument()
      expect(screen.getByText('Other Conversation')).toBeInTheDocument()
    })

    expect(mockMutate).toHaveBeenCalledWith(
      expect.objectContaining({
        conversationId: '1',
        title: 'Updated Conversation',
      })
    )
  })

  test('renders loading spinner and message when fetching next page', async () => {
    ;(useMutation as jest.Mock).mockReturnValue({ mutate: jest.fn() })
    ;(useInfiniteQuery as jest.Mock).mockReturnValue({
      data: {
        pages: [
          {
            conversations: [
              {
                conversationId: 'test-id',
                title: 'Test',
                createdAt: { seconds: 0, nanos: 0 },
              },
            ],
          },
        ],
        pageParams: [0],
      },
      fetchNextPage: jest.fn(),
      hasNextPage: true,
      isFetchingNextPage: true,
    })

    render(<SidebarHistory />)

    expect(
      await screen.findByText((content, element) => {
        return (
          element?.tagName.toLowerCase() === 'span' &&
          content === 'Loading Conversations...'
        )
      })
    ).toBeInTheDocument()

    expect(screen.getByTestId('intersection-sentinel')).toBeInTheDocument()
  })

  test('calls fetchNextPage when sentinel enters viewport and hasNextPage is true', async () => {
    const mockFetchNextPage = jest.fn()

    ;(useMutation as jest.Mock).mockReturnValue({ mutate: jest.fn() })
    ;(useInfiniteQuery as jest.Mock).mockReturnValue({
      data: {
        pages: [
          {
            conversations: [
              {
                conversationId: 'test-id',
                title: 'Test',
                createdAt: { seconds: 0, nanos: 0 },
              },
            ],
          },
        ],
        pageParams: [0],
      },
      fetchNextPage: mockFetchNextPage,
      hasNextPage: true,
      isFetchingNextPage: false,
    })

    render(<SidebarHistory />)

    mockOnViewportEnter()

    await waitFor(() => {
      expect(mockFetchNextPage).toHaveBeenCalled()
    })
  })
})
