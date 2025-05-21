'use client'

import { Attachment, ChatRequestOptions, CreateMessage, Message } from 'ai'
import cx from 'classnames'
import React, {
  useRef,
  useEffect,
  useCallback,
  Dispatch,
  SetStateAction,
  memo,
} from 'react'
import { toast } from 'sonner'
import { useLocalStorage, useWindowSize } from 'usehooks-ts'
import equal from 'fast-deep-equal'

import { sanitizeUIMessages } from '@/lib/utils'
import { Button, Textarea } from '@/components/ui'
import { ArrowUpIcon, StopIcon } from '@/public/Icons'

import { PreviewAttachment } from '../PreviewAttachment'
import { SuggestedActions } from '../SuggestedActions'

function PureMultimodalInput({
  chatId,
  input,
  setInput,
  isLoading,
  stop,
  attachments,
  setAttachments,
  messages,
  setMessages,
  append,
  handleSubmit,
}: {
  chatId: string
  input: string
  setInput: (value: string) => void
  isLoading: boolean
  stop?: () => void
  attachments: Array<Attachment>
  setAttachments: Dispatch<SetStateAction<Array<Attachment>>>
  messages: Array<Message>
  setMessages: Dispatch<SetStateAction<Array<Message>>>
  append: (
    message: Message | CreateMessage,
    chatRequestOptions?: ChatRequestOptions
  ) => Promise<string | null | undefined>
  handleSubmit: (
    event?: {
      preventDefault?: () => void
    },
    chatRequestOptions?: ChatRequestOptions
  ) => void
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { width } = useWindowSize()

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

  const resetHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = '98px'
    }
  }

  const [localStorageInput, setLocalStorageInput] = useLocalStorage('input', '')

  useEffect(() => {
    if (textareaRef.current) {
      const domValue = textareaRef.current.value
      // Prefer DOM value over localStorage to handle hydration
      const finalValue = domValue || localStorageInput || ''
      setInput(finalValue)
      adjustHeight()
    }
    // Only run once after hydration
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setLocalStorageInput(input)
  }, [input, setLocalStorageInput])

  const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value)
    adjustHeight()
  }

  const submitForm = useCallback(() => {
    handleSubmit(undefined, {
      experimental_attachments: attachments,
    })

    setAttachments([])
    setLocalStorageInput('')
    resetHeight()

    if (width && width > 768) {
      textareaRef.current?.focus()
    }
  }, [
    attachments,
    handleSubmit,
    setAttachments,
    setLocalStorageInput,
    width,
    chatId,
  ])

  const handleCreateAndSubmit = async () => {
    if (isLoading) {
      toast.error('Please wait for the model to finish its response!')
    } else {
      submitForm()
    }
  }

  return (
    <div className="relative w-full flex flex-col gap-4">
      {messages.length === 0 && attachments.length === 0 && (
        <SuggestedActions append={append} chatId={chatId} />
      )}

      {attachments.length > 0 && (
        <div
          id="heartsense-web-attachments-preview"
          data-testid="attachments-preview"
          className="flex flex-row gap-2 overflow-x-scroll items-end"
        >
          {attachments.map((attachment) => (
            <PreviewAttachment key={attachment.url} attachment={attachment} />
          ))}
        </div>
      )}

      <Textarea
        id="heartsense-web-input-question"
        data-testid="multimodal-input"
        ref={textareaRef}
        placeholder="Send a message..."
        value={input}
        onChange={handleInput}
        className={cx(
          'min-h-[24px] max-h-[calc(75dvh)]  resize-none rounded-2xl !text-base pb-10'
        )}
        rows={2}
        autoFocus
        onKeyDown={async (event) => {
          if (
            event.key === 'Enter' &&
            !event.shiftKey &&
            !event.nativeEvent.isComposing
          ) {
            event.preventDefault()

            handleCreateAndSubmit()
          }
        }}
      />

      <div className="absolute bottom-0 right-0 p-2 w-fit flex flex-row justify-end">
        {isLoading ? (
          <StopButton stop={stop} setMessages={setMessages} />
        ) : (
          <SendButton input={input} submitForm={handleCreateAndSubmit} />
        )}
      </div>
    </div>
  )
}

export const MultimodalInput = memo(
  PureMultimodalInput,
  (prevProps, nextProps) => {
    if (prevProps.input !== nextProps.input) return false
    if (prevProps.isLoading !== nextProps.isLoading) return false
    if (!equal(prevProps.attachments, nextProps.attachments)) return false

    return true
  }
)

export function PureStopButton({
  stop,
  setMessages,
}: {
  readonly stop: () => void
  readonly setMessages: Dispatch<SetStateAction<Array<Message>>>
}) {
  return (
    <Button
      id="heartsense-web-stop-button-question"
      data-testid="stop-button"
      className="rounded-full p-1.5 h-fit border dark:border-zinc-600"
      onClick={(event) => {
        event.preventDefault()
        stop()
        setMessages((messages) => sanitizeUIMessages(messages))
      }}
    >
      <StopIcon size={14} />
    </Button>
  )
}

const StopButton = memo(PureStopButton)

export function PureSendButton({
  submitForm,
  input,
}: {
  readonly submitForm: () => void
  readonly input: string
}) {
  return (
    <Button
      id="heartsense-web-send-button-question"
      data-testid="send-button"
      className="rounded-full p-1.5 h-fit border dark:border-zinc-600"
      onClick={(event) => {
        event.preventDefault()
        submitForm()
      }}
      disabled={input.length === 0}
    >
      <ArrowUpIcon size={14} />
    </Button>
  )
}

const SendButton = memo(PureSendButton, (prevProps, nextProps) => {
  if (prevProps.input !== nextProps.input) return false
  return true
})
