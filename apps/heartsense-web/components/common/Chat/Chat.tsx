'use client'

import { useState, useCallback, useRef } from 'react'
import type { Attachment, Message } from 'ai'
import { toast } from 'sonner'
import { useMutation } from '@tanstack/react-query'
import { ChatHeader } from '@/components/common/ChatHeader'
import { openAIChatService } from '@/service/chat_bot/openAIChatService'
import { generateUUID } from '@/lib/utils'
import { useDispatch } from 'react-redux'
import { setConversation } from '@/store/conversation/conversationSlice'

import { MultimodalInput } from '../MultimodalInput'
import { Messages } from '../Messages'

interface ChatProps {
  id?: string
  initialMessages: Message[]
  selectedChatModel: string
  isReadonly: boolean
  user?: {
    id: string
    email: string
  }
}

export function Chat({
  id,
  initialMessages,
  selectedChatModel,
  isReadonly,
  user,
}: Readonly<ChatProps>) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState('')
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [conversationId, setConversationId] = useState(id)
  const [isTyping, setIsTyping] = useState(false)
  const abortControllerRef = useRef<AbortController | null>(null)
  const dispatch = useDispatch()

  const { mutate: sendMessage, isPending } = useMutation({
    mutationFn: (payload: {
      userId: string
      userMessage: string
      conversationId: string
    }) => {
      abortControllerRef.current = new AbortController()
      return openAIChatService(payload, abortControllerRef.current.signal)
    },
    onSuccess: (responses) => {
      const fullText = responses.aiResponse
      const aiMessageId = generateUUID()
      let i = 0

      setIsTyping(true)

      setConversationId(responses.conversationId)

      dispatch(
        setConversation({
          conversationId: responses.conversationId,
          title: 'New Conversation',
        })
      )

      window.history.replaceState({}, '', `/chat/${responses.conversationId}`)

      setMessages((prev) => [
        ...prev,
        {
          id: aiMessageId,
          role: 'assistant',
          content: '',
        },
      ])

      const interval = setInterval(() => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === aiMessageId
              ? { ...msg, content: fullText.slice(0, i) }
              : msg
          )
        )
        i++
        if (i > fullText.length) {
          clearInterval(interval)
          setIsTyping(false)
        }
      }, 5)
    },
    onError: (err) => {
      setIsTyping(false)
      if ((err as any).name === 'CanceledError') {
        toast.warning('AI request was cancelled.')
      } else {
        toast.error('An error occurred while sending the message.')
      }
    },
  })

  const stop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
  }

  const sendUserMessage = useCallback(
    async (content: string) => {
      const trimmed = content.trim()
      if (!trimmed) {
        return
      }

      const userMessage: Message = {
        id: generateUUID(),
        role: 'user',
        content: trimmed,
      }

      setMessages((prev) => [...prev, userMessage])

      try {
        const payload = {
          userMessage: trimmed,
          userId: user?.id || '',
          conversationId: conversationId,
        }

        sendMessage(payload)
      } catch (error) {
        toast.error('Failed to start a new conversation.')
      }
    },
    [conversationId, sendMessage, dispatch]
  )

  const handleSubmit = useCallback(() => {
    sendUserMessage(input)
    setInput('')
  }, [input, sendUserMessage])

  const isLoading = isPending || isTyping

  return (
    <div className="flex flex-col min-w-0 h-dvh bg-background">
      <ChatHeader selectedModelId={selectedChatModel} isReadonly={isReadonly} />

      <Messages
        chatId={id}
        isLoading={isLoading}
        messages={messages}
        setMessages={setMessages}
        isReadonly={isReadonly}
        votes={[]}
      />

      <form
        className="flex mx-auto px-4 bg-background pb-4 md:pb-6 gap-2 w-full md:max-w-3xl"
        onSubmit={(e) => {
          e.preventDefault()
          handleSubmit()
        }}
      >
        {!isReadonly && (
          <MultimodalInput
            chatId={id}
            input={input}
            setInput={setInput}
            handleSubmit={handleSubmit}
            isLoading={isLoading}
            attachments={attachments}
            setAttachments={setAttachments}
            messages={messages}
            setMessages={setMessages}
            stop={stop}
            append={async (msg: Message) => {
              sendUserMessage(msg.content)
              return Promise.resolve(msg.id)
            }}
          />
        )}
      </form>
    </div>
  )
}
