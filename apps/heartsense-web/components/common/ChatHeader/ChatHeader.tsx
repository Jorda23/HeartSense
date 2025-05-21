'use client'

import { useRouter } from 'next/navigation'
import { useWindowSize } from 'usehooks-ts'
import { memo } from 'react'

import {
  useSidebar,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  Button,
} from '@/components/ui'

import { ModelSelector, SidebarToggle } from '@/components/common'
import { PlusIcon } from '@/public/Icons'

function PureChatHeader({
  selectedModelId,
  isReadonly,
}: Readonly<{
  selectedModelId: string
  isReadonly: boolean
}>) {
  const router = useRouter()
  const { open } = useSidebar()

  const { width: windowWidth } = useWindowSize()

  return (
    <header
      id="heartsense-web-header"
      className="flex sticky top-0 bg-background py-1.5 items-center px-2 md:px-2 gap-2"
    >
      <SidebarToggle />

      {(!open || windowWidth < 768) && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              id="heartsense-web-new-chat"
              variant="outline"
              className="order-2 md:order-1 md:px-2 px-2 md:h-fit ml-auto md:ml-0"
              onClick={() => {
                router.push('/')
                router.refresh()
              }}
            >
              <PlusIcon />
              <span className="md:sr-only">New Chat</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent id="heartsense-web-new-chat-tooltip">
            New Chat
          </TooltipContent>
        </Tooltip>
      )}
    </header>
  )
}

export const ChatHeader = memo(
  PureChatHeader,
  (prevProps, nextProps) =>
    prevProps.selectedModelId === nextProps.selectedModelId
)
