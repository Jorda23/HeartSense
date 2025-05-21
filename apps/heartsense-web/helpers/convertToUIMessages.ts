import { Message } from 'ai'
import { ConversationMessage } from '@/protos/generated/ChatService/ConversationMessage'

export function convertToUIMessages(
  rawMessages: ConversationMessage[]
): Message[] {
  return rawMessages
    ? rawMessages?.map((msg) => ({
        id: msg.messageId,
        content: msg.content,
        role: msg.isFromBot ? 'assistant' : 'user',
        parts: [
          {
            type: 'text',
            text: msg.content,
          },
        ],
      }))
    : []
}
