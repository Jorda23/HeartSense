export async function getConversationHistoryByUserId(userId: string) {
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

  const response = await fetch(`${BASE_URL}/api/chat/history/${userId}`)
  if (!response.ok) {
    throw new Error('Failed to fetch conversation history')
  }
  return response.json()
}
