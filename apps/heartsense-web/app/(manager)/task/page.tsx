'use client'

import React, { useState, useRef, useCallback } from 'react'
import {
  Container,
  Box,
  Paper,
  Typography,
  IconButton,
  TextareaAutosize,
  Tooltip,
  Grid,
  Modal,
  Backdrop,
  Fade,
  AppBar,
  Toolbar,
  InputBase,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import StarIcon from '@mui/icons-material/Star'
import CheckIcon from '@mui/icons-material/Check'
import AddIcon from '@mui/icons-material/Add'
import SearchIcon from '@mui/icons-material/Search'

import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

interface Note {
  id: number
  content: string
  favorite: boolean
}

const ItemTypes = {
  NOTE: 'note',
}

interface DraggableNoteProps {
  note: Note
  index: number
  moveNote: (dragIndex: number, hoverIndex: number) => void
  openEdit: (note: Note) => void
  toggleFavorite: (id: number) => void
  deleteNote: (id: number) => void
}

const DraggableNote: React.FC<DraggableNoteProps> = ({
  note,
  index,
  moveNote,
  openEdit,
  toggleFavorite,
  deleteNote,
}) => {
  const ref = useRef<HTMLDivElement>(null)

  const [, drop] = useDrop({
    accept: ItemTypes.NOTE,
    hover(item: { index: number }, monitor) {
      if (!ref.current) return
      const dragIndex = item.index
      const hoverIndex = index
      if (dragIndex === hoverIndex) return

      const hoverBoundingRect = ref.current.getBoundingClientRect()
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
      const clientOffset = monitor.getClientOffset()
      if (!clientOffset) return
      const hoverClientY = clientOffset.y - hoverBoundingRect.top

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return

      moveNote(dragIndex, hoverIndex)
      item.index = hoverIndex
    },
  })

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.NOTE,
    item: { id: note.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  drag(drop(ref))

  return (
    <Grid
      item
      xs={12}
      sm={6}
      md={4}
      lg={3}
      ref={ref}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <Paper
        elevation={6}
        onClick={() => openEdit(note)}
        sx={{
          bgcolor: '#fef68a',
          p: 3,
          borderRadius: 3,
          boxShadow: note.favorite
            ? '0 0 12px 4px #ffeb3b'
            : '0 4px 12px rgba(0,0,0,0.12)',
          cursor: 'pointer',
          whiteSpace: 'pre-wrap',
          fontFamily: '"Comic Sans MS", cursive, sans-serif',
          fontSize: '1.1rem',
          height: 180,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          userSelect: 'none',
        }}
      >
        <Typography
          variant="body1"
          sx={{ whiteSpace: 'pre-wrap', flexGrow: 1 }}
        >
          {note.content}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Tooltip title={note.favorite ? 'Unfavorite' : 'Favorite'}>
            <IconButton
              onClick={(e) => {
                e.stopPropagation()
                toggleFavorite(note.id)
              }}
              size="small"
              color={note.favorite ? 'warning' : 'default'}
            >
              <StarIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              onClick={(e) => {
                e.stopPropagation()
                deleteNote(note.id)
              }}
              size="small"
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Paper>
    </Grid>
  )
}

export default function StickyNoteGrid() {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: 1,
      content: `- Great, Useful, Fun\n- Innovative\n- 5 ⭐`,
      favorite: false,
    },
    {
      id: 2,
      content: 'This is another note\nAdd more info here...',
      favorite: true,
    },
  ])

  const [editNote, setEditNote] = useState<Note | null>(null)
  const [editContent, setEditContent] = useState('')

  const [newNoteContent, setNewNoteContent] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const openEdit = (note: Note) => {
    setEditNote(note)
    setEditContent(note.content)
  }

  const closeEdit = () => {
    setEditNote(null)
    setEditContent('')
  }

  const saveEdit = () => {
    if (!editNote) return
    setNotes((prev) =>
      prev.map((note) =>
        note.id === editNote.id ? { ...note, content: editContent } : note
      )
    )
    closeEdit()
  }

  const deleteNote = (id: number) => {
    setNotes((prev) => prev.filter((note) => note.id !== id))
    if (editNote?.id === id) closeEdit()
  }

  const toggleFavorite = (id: number) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === id ? { ...note, favorite: !note.favorite } : note
      )
    )
  }

  const addNewNote = () => {
    const newNote = {
      id: Date.now(),
      content: 'New note...',
      favorite: false,
    }
    setNotes((prev) => [newNote, ...prev])
    openEdit(newNote)
  }

  const addNoteFromInput = () => {
    const trimmed = newNoteContent.trim()
    if (!trimmed) return
    const newNote = {
      id: Date.now(),
      content: trimmed,
      favorite: false,
    }
    setNotes((prev) => [newNote, ...prev])
    setNewNoteContent('')
    inputRef.current?.blur()
  }

  const handleNewNoteKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addNoteFromInput()
    }
  }

  const moveNote = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      setNotes((prevNotes) => {
        const updatedNotes = [...prevNotes]
        const [removed] = updatedNotes.splice(dragIndex, 1)
        updatedNotes.splice(hoverIndex, 0, removed)
        return updatedNotes
      })
    },
    [setNotes]
  )

  return (
    <DndProvider backend={HTML5Backend}>
      {/* Navbar */}
      <AppBar position="sticky" color="primary">
        <Toolbar sx={{ gap: 2 }}>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Medical Report Notes
          </Typography>
          <Box
            sx={{
              bgcolor: 'rgba(255,255,255,0.15)',
              borderRadius: 1,
              px: 2,
              display: 'flex',
              alignItems: 'center',
              flexGrow: 2,
              maxWidth: 400,
            }}
          >
            <SearchIcon sx={{ mr: 1 }} />
            <InputBase
              placeholder="Add new note..."
              inputProps={{ 'aria-label': 'add new note' }}
              fullWidth
              value={newNoteContent}
              onChange={(e) => setNewNoteContent(e.target.value)}
              onKeyDown={handleNewNoteKeyDown}
              inputRef={inputRef}
              sx={{ color: 'inherit' }}
            />
          </Box>
          <Tooltip title="Add blank note">
            <IconButton
              color="inherit"
              onClick={addNewNote}
              aria-label="add blank note"
            >
              <AddIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      {/* Notes Container */}
      <Container
        maxWidth="lg"
        sx={{
          pt: 4,
          pb: 8,
          height: '85vh',
          overflowY: 'auto',
          bgcolor: '#fafafa',
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Grid container spacing={3}>
          {notes.map((note, index) => (
            <DraggableNote
              key={note.id}
              note={note}
              index={index}
              moveNote={moveNote}
              openEdit={openEdit}
              toggleFavorite={toggleFavorite}
              deleteNote={deleteNote}
            />
          ))}
        </Grid>
      </Container>

      {/* Edit modal */}
      <Modal
        open={!!editNote}
        onClose={closeEdit}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 300,
        }}
      >
        <Fade in={!!editNote}>
          <Box
            sx={{
              position: 'absolute' as const,
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              bgcolor: '#fef68a',
              borderRadius: 3,
              boxShadow: 24,
              p: 4,
              width: { xs: '90%', sm: 500 },
              maxHeight: '80vh',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <TextareaAutosize
              autoFocus
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              style={{
                width: '100%',
                height: '60vh',
                fontSize: '1.2rem',
                fontFamily: '"Comic Sans MS", cursive, sans-serif',
                padding: 16,
                borderRadius: 8,
                border: 'none',
                resize: 'none',
                backgroundColor: '#fef68a',
                boxSizing: 'border-box',
                outline: 'none',
              }}
            />
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Tooltip title="Save">
                <IconButton onClick={saveEdit} color="primary" size="large">
                  <CheckIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </DndProvider>
  )
}
