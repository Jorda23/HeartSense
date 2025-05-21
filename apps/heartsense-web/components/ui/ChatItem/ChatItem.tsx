'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Typography, TextField, IconButton, Tooltip } from '@mui/material'
import SaveIcon from '@mui/icons-material/Save'
import EditIcon from '@mui/icons-material/Edit'
import Link from 'next/link'
import { StyledContainer } from './styles/ChatItem.styles'

interface ChatItemProps {
  id: string
  index?: number
  conversationId?: string
  title: string
  onSave: (newTitle: string) => void
  editable?: boolean
  isActive?: boolean
}

export const ChatItem: React.FC<ChatItemProps> = ({
  id,
  index,
  conversationId,
  title,
  onSave,
  editable = true,
  isActive = false,
}) => {
  const [editing, setEditing] = useState(false)
  const [editedTitle, setEditedTitle] = useState(title)
  const ref = useRef<HTMLDivElement>(null)

  const resetEdit = useCallback(() => {
    setEditing(false)
    setEditedTitle(title)
  }, [title])

  const handleSave = useCallback(() => {
    const trimmed = editedTitle.trim()
    if (trimmed) {
      onSave(trimmed)
      setEditing(false)
    }
  }, [editedTitle, onSave])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        resetEdit()
      }
    }

    if (editing) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [editing, resetEdit])

  return (
    <StyledContainer ref={ref} isActive={isActive}>
      {editing ? (
        <>
          <TextField
            id={`heartsense-web-edit-conversation-${index}`}
            size="small"
            variant="outlined"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            fullWidth
            autoFocus
          />
          <Tooltip title="Guardar título">
            <IconButton
              id={`heartsense-web-save-conversation-${index}`}
              onClick={handleSave}
              color="primary"
              size="small"
              sx={{ ml: 1 }}
            >
              <SaveIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </>
      ) : (
        <>
          <Link href={`/chat/${conversationId}`} passHref legacyBehavior>
            <Typography
              component="a"
              noWrap
              sx={{ textDecoration: 'none', color: 'inherit', flexGrow: 1 }}
            >
              {title}
            </Typography>
          </Link>

          {editable && (
            <Tooltip title="Editar título">
              <IconButton
                id={`heartsense-web-active-edit-conversation-${index}`}
                className="edit-btn"
                onClick={() => setEditing(true)}
                color="default"
                size="small"
                sx={{
                  ml: 1,
                  opacity: 0,
                  transition: 'opacity 0.2s ease-in-out',
                }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </>
      )}
    </StyledContainer>
  )
}

export default ChatItem
