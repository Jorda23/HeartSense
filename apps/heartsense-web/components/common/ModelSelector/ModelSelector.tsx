'use client'

import {
  Menu,
  MenuItem,
  ListItemText,
  ListItemIcon,
  Typography,
} from '@mui/material'
import { useMemo, useState, useOptimistic, startTransition } from 'react'
import { saveChatModelAsCookie } from '@/app/(chat)/actions'
import { chatModels } from '@/lib/ai/models'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui'
import { CheckCircleFillIcon, ChevronDownIcon } from '../../../public/Icons'

export function ModelSelector({
  selectedModelId,
  className,
}: {
  selectedModelId: string
} & React.ComponentProps<typeof Button>) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const [optimisticModelId, setOptimisticModelId] =
    useOptimistic(selectedModelId)

  const selectedChatModel = useMemo(
    () => chatModels.find((chatModel) => chatModel.id === optimisticModelId),
    [optimisticModelId]
  )

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <>
      <Button
        onClick={handleOpen}
        variant="outline"
        className={cn('md:px-2 md:h-[34px] w-fit', className)}
      >
        {selectedChatModel?.name}
        <ChevronDownIcon />
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        {chatModels.map((chatModel) => {
          const isActive = chatModel.id === optimisticModelId

          return (
            <MenuItem
              key={chatModel.id}
              selected={isActive}
              onClick={() => {
                handleClose()
                startTransition(() => {
                  setOptimisticModelId(chatModel.id)
                  saveChatModelAsCookie(chatModel.id)
                })
              }}
              sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}
            >
              <ListItemText
                primary={chatModel.name}
                secondary={
                  <Typography variant="caption" color="text.secondary">
                    {chatModel.description}
                  </Typography>
                }
              />
              {isActive && (
                <ListItemIcon sx={{ minWidth: 'auto' }}>
                  <CheckCircleFillIcon />
                </ListItemIcon>
              )}
            </MenuItem>
          )
        })}
      </Menu>
    </>
  )
}
