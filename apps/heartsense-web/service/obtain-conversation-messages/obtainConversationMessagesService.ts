import { ConversationMessagesResponse } from '@/protos/generated/ChatService/ConversationMessagesResponse'

export const obtainConversationMessagesService = async (
  conversationId: string
): Promise<ConversationMessagesResponse> => {
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

  const response = await fetch(
    `${BASE_URL}/api/chat/${conversationId}/messages`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )

  if (!response.ok) {
    throw new Error('Failed to fetch conversation messages')
  }

  const data: {
    messages: Array<{
      content: string
      isFromBot: boolean
      messageId: string
    }>
  } = await response.json()

  return {
    messages: data.messages.map((msg) => ({
      id: msg.messageId,
      content: msg.content,
      isFromBot: msg.isFromBot,
      messageId: msg.messageId,
    })),
    totalItems: data.messages.length,
    page: 1,
  }
}
