'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Button,
  Stack,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

export default function Navbar() {
  const router = useRouter()

  return (
    <AppBar position="sticky" color="primary" elevation={4}>
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: { xs: 2, sm: 4 },
          py: 1,
        }}
      >
        {/* Logo y nombre */}
        <Box
          sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
          onClick={() => router.push('/')}
        >
          <Box
            component="img"
            src="/images/logo-white.png"
            alt="Heartsense Logo"
            sx={{ height: 40, width: 40, mr: 1 }}
          />
          <Typography variant="h6" noWrap color="inherit" fontWeight={600}>
            Heartsense
          </Typography>
        </Box>

        {/* Links de navegación */}
        <Stack direction="row" spacing={2} alignItems="center">
          <Button
            color="inherit"
            onClick={() => router.push('/contact')}
            sx={{ textTransform: 'none' }}
          >
            Contact
          </Button>
          <Button
            color="inherit"
            onClick={() => router.push('/about')}
            sx={{ textTransform: 'none' }}
          >
            About
          </Button>

          {/* Botón Close */}
          <IconButton
            edge="end"
            color="inherit"
            aria-label="close"
            onClick={() => router.push('/')}
          >
            <CloseIcon />
          </IconButton>
        </Stack>
      </Toolbar>
    </AppBar>
  )
}
