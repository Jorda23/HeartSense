import axios from 'axios'

export const updateConversationService = async (payload: {
  title: string
  userId: string
  conversationId: string
}) => {
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

  const response = await axios.put(`${BASE_URL}/api/chat/update-title`, {
    NewTitle: payload.title,
    UserId: payload.userId,
    ConversationId: payload.conversationId,
  })

  return response.data
}
