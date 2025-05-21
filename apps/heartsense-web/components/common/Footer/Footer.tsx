'use client'

import React from 'react'
import {
  Box,
  Typography,
  Link,
  Stack,
  IconButton,
  Divider,
} from '@mui/material'
import FacebookIcon from '@mui/icons-material/Facebook'
import TwitterIcon from '@mui/icons-material/Twitter'
import InstagramIcon from '@mui/icons-material/Instagram'
import LinkedInIcon from '@mui/icons-material/LinkedIn'

export const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        mt: 8,
        py: 6,
        bgcolor: 'background.paper',
        borderTop: (theme) => `1px solid ${theme.palette.divider}`,
      }}
    >
      <Stack
        maxWidth="lg"
        mx="auto"
        px={2}
        spacing={3}
        direction={{ xs: 'column', md: 'row' }}
        justifyContent="space-between"
        alignItems="center"
      >
        {/* Derechos y créditos */}
        <Typography
          variant="body2"
          color="text.secondary"
          textAlign={{ xs: 'center', md: 'left' }}
        >
          © {new Date().getFullYear()} Heartsense. All rights reserved.
        </Typography>

        {/* Redes sociales */}
        <Stack direction="row" spacing={1} justifyContent="center">
          <IconButton
            component={Link}
            href="https://facebook.com/yourpage"
            target="_blank"
            aria-label="Facebook"
            size="large"
            color="inherit"
          >
            <FacebookIcon />
          </IconButton>
          <IconButton
            component={Link}
            href="https://twitter.com/yourprofile"
            target="_blank"
            aria-label="Twitter"
            size="large"
            color="inherit"
          >
            <TwitterIcon />
          </IconButton>
          <IconButton
            component={Link}
            href="https://instagram.com/yourprofile"
            target="_blank"
            aria-label="Instagram"
            size="large"
            color="inherit"
          >
            <InstagramIcon />
          </IconButton>
          <IconButton
            component={Link}
            href="https://linkedin.com/company/yourcompany"
            target="_blank"
            aria-label="LinkedIn"
            size="large"
            color="inherit"
          >
            <LinkedInIcon />
          </IconButton>
        </Stack>

        {/* Desarrolladores */}
        <Typography
          variant="body2"
          color="text.secondary"
          textAlign={{ xs: 'center', md: 'right' }}
        >
          Developed by{' '}
          <Link
            href="https://yourwebsite.com"
            target="_blank"
            rel="noopener noreferrer"
            underline="hover"
            color="inherit"
            sx={{ fontWeight: 'medium' }}
          >
            Jordan, Samuel and Sergio
          </Link>
        </Typography>
      </Stack>
    </Box>
  )
}
