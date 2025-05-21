import axios from 'axios'

export const openAIChatService = async (
  payload: {
    userId: string
    userMessage: string
    conversationId: string
  },
  signal: AbortSignal
): Promise<{
  aiResponse: string
  conversationId: string
}> => {
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

  const response = await axios.post<{
    aiResponse: string
    conversationId: string
  }>(
    `${BASE_URL}/api/chat`,
    {
      userId: payload.userId,
      userMessage: payload.userMessage,
      conversationId: payload.conversationId,
    },
    {
      signal,
    }
  )

  return {
    aiResponse: response.data.aiResponse,
    conversationId: response.data.conversationId,
  }
}
