'use client'

import { ChatRequestOptions, Message } from 'ai'
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'

import { Button, Textarea } from '@/components/ui'

export type MessageEditorProps = Readonly<{
  message: Message
  setMode: Dispatch<SetStateAction<'view' | 'edit'>>
  setMessages: (
    messages: Message[] | ((messages: Message[]) => Message[])
  ) => void
  reload: (
    chatRequestOptions?: ChatRequestOptions
  ) => Promise<string | null | undefined>
}>

export function MessageEditor({
  message,
  setMode,
  setMessages,
  reload,
}: MessageEditorProps) {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const [draftContent, setDraftContent] = useState<string>(message.content)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (textareaRef.current) {
      adjustHeight()
    }
  }, [])

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${
        textareaRef.current.scrollHeight + 2
      }px`
    }
  }

  const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDraftContent(event.target.value)
    adjustHeight()
  }

  return (
    <div className="flex flex-col gap-2 w-full">
      <Textarea
        id="heartsense-web-message-editor-textarea"
        data-testid="message-editor"
        ref={textareaRef}
        className="bg-transparent outline-none resize-none !text-base rounded-xl w-full"
        value={draftContent}
        onChange={handleInput}
      />

      <div className="flex flex-row gap-2 justify-end">
        <Button
          variant="outline"
          className="h-fit py-2 px-3"
          onClick={() => {
            setMode('view')
          }}
        >
          Cancel
        </Button>
        <Button
          id="heartsense-web-message-editor-send-button"
          data-testid="message-editor-send-button"
          variant="default"
          className="h-fit py-2 px-3"
          disabled={isSubmitting}
          onClick={async () => {
            setIsSubmitting(true)

            setMessages((messages) => {
              const index = messages.findIndex((m) => m.id === message.id)

              if (index !== -1) {
                const updatedMessage = {
                  ...message,
                  content: draftContent,
                }

                return [...messages.slice(0, index), updatedMessage]
              }

              return messages
            })

            setMode('view')
            reload()
          }}
        >
          {isSubmitting ? 'Sending...' : 'Send'}
        </Button>
      </div>
    </div>
  )
}
