import { renderHook } from '@testing-library/react'
import {
  useGroupedConversations,
  ConversationPreview,
} from '../useGroupedConversations'
import { Timestamp } from '@/protos/generated/google/protobuf/Timestamp'

const createMockTimestamp = (date: Date): Timestamp => ({
  seconds: Math.floor(date.getTime() / 1000),
  nanos: (date.getMilliseconds() % 1000) * 1_000_000,
})

describe('useGroupedConversations', () => {
  it('should group conversations by date category from paginated data', () => {
    const date = new Date()
    const timestamp = createMockTimestamp(date)

    const paginatedChatHistories = {
      pages: [
        {
          conversations: [
            {
              conversationId: '1',
              title: 'Hello World',
              createdAt: timestamp,
            },
            {
              conversationId: '2',
              title: 'Another Chat',
              createdAt: timestamp,
            },
          ],
        },
      ],
    }

    const { result } = renderHook(() =>
      useGroupedConversations(paginatedChatHistories, null)
    )

    const [grouped] = result.current
    const category = Object.keys(grouped)[0]

    expect(grouped[category]).toHaveLength(2)
    expect(grouped[category].map((c) => c.conversationId)).toEqual(['1', '2'])
  })

  it('should add new conversation to group if not already included', () => {
    const { result, rerender } = renderHook(
      ({ paginatedChatHistories, newConversation }) =>
        useGroupedConversations(paginatedChatHistories, newConversation),
      {
        initialProps: {
          paginatedChatHistories: { pages: [] },
          newConversation: null,
        },
      }
    )

    const newConv: ConversationPreview = {
      conversationId: 'new-id',
      title: 'New Chat',
      createdAt: new Date(),
    }

    rerender({
      paginatedChatHistories: { pages: [] },
      newConversation: newConv,
    })

    const [grouped] = result.current
    const categories = Object.keys(grouped)
    const allItems = categories.flatMap((key) => grouped[key])

    expect(allItems.length).toBe(1)
    expect(allItems[0].conversationId).toBe('new-id')
    expect(allItems[0].title).toBe('New Chat')
  })

  it('should not duplicate conversations with same id', () => {
    const now = new Date()
    const timestamp = createMockTimestamp(now)

    const paginatedChatHistories = {
      pages: [
        {
          conversations: [
            {
              conversationId: 'dup-id',
              title: 'Duplicate Chat',
              createdAt: timestamp,
            },
          ],
        },
      ],
    }

    const newConv: ConversationPreview = {
      conversationId: 'dup-id',
      title: 'Duplicate Chat',
      createdAt: now,
    }

    const { result, rerender } = renderHook(
      ({ paginatedChatHistories, newConversation }) =>
        useGroupedConversations(paginatedChatHistories, newConversation),
      {
        initialProps: {
          paginatedChatHistories,
          newConversation: null,
        },
      }
    )

    rerender({
      paginatedChatHistories,
      newConversation: newConv,
    })

    const [grouped] = result.current
    const conversations = Object.values(grouped).flat()
    expect(conversations.length).toBe(1)
    expect(conversations[0].conversationId).toBe('dup-id')
  })
})
