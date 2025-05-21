'use client'

import React from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'next/navigation'
import { useMutation, useQuery } from '@tanstack/react-query'
import type { User } from 'next-auth'

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
} from '@/components/ui/Sidebar'
import { ChatItem } from '@/components/ui'
import { generateUUID } from '@/lib/utils'
import { updateConversationService } from '@/service/update-chat/updateConversationService'
import { RootState } from '../../../store'
import { useGroupedConversations } from '../../../hooks'
import { getConversationHistoryByUserId } from '@/service/obtain-conversation-history/getConversationHistoryByUserId'

const DEFAULT_CATEGORIES = [
  'Today',
  'Yesterday',
  'Last Week',
  'Last Month',
  'Older',
]

export function SidebarHistory({ user }: { user: User | undefined }) {
  const { id } = useParams()
  const newConversation = useSelector((state: RootState) => state.conversation)

  const { data, isLoading } = useQuery({
    queryKey: ['conversation-history'],
    queryFn: () => getConversationHistoryByUserId(user.id),
  })

  console.log('data', data)

  const [groupedConversations, setGroupedConversations] =
    useGroupedConversations(data, newConversation)

  const hasEmptyChatHistory = Object.values(groupedConversations).every(
    (group) => group.length === 0
  )

  const updateConversationMutation = useMutation({
    mutationFn: updateConversationService,
  })

  const handleUpdateTitle = (conversationId: string, newTitle: string) => {
    const trimmed = newTitle.trim()

    setGroupedConversations((prev) => {
      const updated = { ...prev }
      for (const group in updated) {
        updated[group] = updated[group].map((conv) => {
          if (conv.conversationId === conversationId) {
            return { ...conv, title: trimmed }
          }
          return conv
        })
      }
      return updated
    })

    updateConversationMutation.mutate({
      conversationId,
      title: trimmed,
      userId: user.id,
    })
  }

  if (isLoading) {
    return (
      <SidebarGroup>
        <div className="px-2 py-1 text-xs text-sidebar-foreground/50">
          Today
        </div>
        <SidebarGroupContent>
          <div className="flex flex-col">
            {[44, 32, 28, 64, 52].map((item) => (
              <div
                key={item}
                className="rounded-md h-8 flex gap-2 px-2 items-center"
              >
                <div
                  className="h-4 rounded-md flex-1 max-w-[--skeleton-width] bg-sidebar-accent-foreground/10"
                  style={
                    {
                      '--skeleton-width': `${item}%`,
                    } as React.CSSProperties
                  }
                />
              </div>
            ))}
          </div>
        </SidebarGroupContent>
      </SidebarGroup>
    )
  }

  if (hasEmptyChatHistory) {
    return (
      <SidebarGroup>
        <SidebarGroupContent>
          <div className="px-2 text-zinc-500 w-full flex justify-center items-center text-sm gap-2">
            Your conversations will appear here once you start chatting!
          </div>
        </SidebarGroupContent>
      </SidebarGroup>
    )
  }

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          <div className="flex flex-col gap-6">
            {DEFAULT_CATEGORIES.map(
              (group) =>
                groupedConversations[group]?.length > 0 && (
                  <div key={group} className="mb-4">
                    <div className="px-2 py-1 text-xs text-sidebar-foreground/50">
                      {group}
                    </div>
                    {groupedConversations[group].map((c, index) => (
                      <ChatItem
                        key={c.conversationId}
                        index={index}
                        id={`heartsense-web-${c.conversationId}`}
                        conversationId={c.conversationId}
                        isActive={c.conversationId === id}
                        title={c.title}
                        onSave={(newTitle) =>
                          handleUpdateTitle(c.conversationId, newTitle)
                        }
                      />
                    ))}
                  </div>
                )
            )}
          </div>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
