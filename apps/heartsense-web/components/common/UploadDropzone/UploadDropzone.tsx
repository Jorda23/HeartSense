'use client'

import { useRef, useState } from 'react'
import { Box, Button, Typography, Paper, CircularProgress } from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUpload } from '@fortawesome/free-solid-svg-icons'
import { toast } from 'react-hot-toast'
import { User } from 'next-auth'

export default function UploadDropzone({ id }: User) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [files, setFiles] = useState<File[]>([])
  const [dragging, setDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const droppedFile = e.dataTransfer.files[0]
    validateAndSetFile(droppedFile)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) validateAndSetFile(selectedFile)
  }

  const validateAndSetFile = (f: File) => {
    if (!f.name.endsWith('.xlsx')) {
      toast.error('Only .xlsx files are allowed')
      return
    }
    if (f.size > 2 * 1024 * 1024) {
      toast.error('File size exceeds 2MB limit')
      return
    }

    setFiles((prev) => [...prev, f])
    uploadFile(f)
  }

  const uploadFile = async (f: File) => {
    const formData = new FormData()
    formData.append('file', f)

    try {
      setIsUploading(true)
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/patients/upload?userId=${id}`,
        {
          method: 'POST',
          body: formData,
        }
      )
      if (!res.ok) throw new Error('Upload failed')
      const result = await res.json()
      toast.success(`Successfully imported ${result.imported} patients!`)
    } catch {
      toast.error('Upload failed')
    } finally {
      setIsUploading(false)
    }
  }

  console.log('dragging:', dragging)

  return (
    <Paper
      elevation={dragging ? 6 : 3}
      sx={{
        p: 4,
        textAlign: 'center',
        border: '2px dashed',
        borderRadius: '100%',
        borderColor: dragging ? 'success.main' : 'grey.300',
        bgcolor: dragging ? 'success.lighter' : 'background.paper',
        transition: 'all 0.3s ease',
        width: 400,
        height: 400,
        mx: 'auto',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      onDragOver={(e) => e.preventDefault()}
      onDragEnter={() => setDragging(true)}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
    >
      <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
        <Typography variant="h6" overflow="hidden">
          Subir archivo Excel
        </Typography>

        <Typography variant="body2" color="text.secondary">
          {'Arrastra y suelta el archivo Excel aquí'}
        </Typography>

        <Button
          size="small"
          variant="contained"
          color="success"
          startIcon={<FontAwesomeIcon icon={faUpload} />}
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
        >
          {isUploading ? 'Subiendo...' : 'Buscar archivo'}
        </Button>

        <input
          type="file"
          accept=".xlsx"
          onChange={handleChange}
          ref={inputRef}
          hidden
        />

        {isUploading && <CircularProgress size={24} sx={{ mt: 2 }} />}
      </Box>
    </Paper>
  )
}
