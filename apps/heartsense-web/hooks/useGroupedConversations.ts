import React from 'react'
import { Timestamp } from '@/protos/generated/google/protobuf/Timestamp'
import { convertTimestampToDate, getDateCategory } from '../helpers'

export type ConversationPreview = {
  conversationId: string
  title: string
  createdAt?: Date
}

type GroupedConversations = Record<string, ConversationPreview[]>

export function useGroupedConversations(
  paginatedChatHistories: any,
  newConversation: ConversationPreview | null
): [
  GroupedConversations,
  React.Dispatch<React.SetStateAction<GroupedConversations>>
] {
  const [grouped, setGrouped] = React.useState<GroupedConversations>({})

  React.useEffect(() => {
    const conversations: ConversationPreview[] =
      paginatedChatHistories?.conversations?.map((item: any) => ({
        conversationId: item.conversationId,
        title: item.title,
        createdAt: new Date(item.createdAt),
      })) ?? []

    setGrouped((prev) => {
      const updated = { ...prev }

      for (const item of conversations) {
        const category = getDateCategory(item.createdAt)

        if (!updated[category]) {
          updated[category] = []
        }

        const exists = updated[category].some(
          (conv) => conv.conversationId === item.conversationId
        )

        if (!exists) {
          updated[category].push(item)
        }
      }

      return updated
    })
  }, [paginatedChatHistories])

  React.useEffect(() => {
    if (!newConversation?.conversationId) {
      return
    }

    setGrouped((prev) => {
      const alreadyExists = Object.values(prev).some((group) =>
        group.some(
          (conv) => conv.conversationId === newConversation.conversationId
        )
      )

      if (alreadyExists) {
        return prev
      }

      const updated = { ...prev }

      const date = new Date()
      const category = getDateCategory(date)

      if (!updated[category]) {
        updated[category] = []
      }

      updated[category].unshift({
        conversationId: newConversation.conversationId,
        title: newConversation.title,
        createdAt: date,
      })

      return updated
    })
  }, [newConversation])

  return [grouped, setGrouped]
}
