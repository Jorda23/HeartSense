'use client'

import React from 'react'
import { Container, Typography, Box } from '@mui/material'
import { Footer } from '@/components/common/Footer/Footer'

export default function AboutPage() {
  return (
    <>
      <Container maxWidth="md" sx={{ mt: 8, mb: 8 }}>
        <Typography variant="h3" gutterBottom fontWeight="bold" color="primary">
          About Heartsense
        </Typography>

        <Typography variant="body1" paragraph>
          Heartsense is your trusted personal medical assistant, dedicated to
          providing personalized healthcare guidance and support wherever you
          are. Our mission is to empower you with the tools and information
          needed to manage your health confidently and effectively.
        </Typography>

        <Typography variant="body1" paragraph>
          Combining cutting-edge technology with compassionate care, Heartsense
          connects you with vital medical resources, helps you track symptoms,
          manage medications, and access professional advice, all tailored to
          your unique needs.
        </Typography>

        <Typography variant="body1" paragraph>
          We believe that proactive health management leads to better outcomes,
          and with Heartsense, you have a reliable partner committed to your
          well-being every step of the way.
        </Typography>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" fontWeight="medium" color="text.secondary">
            Join thousands of users who trust Heartsense to stay informed,
            empowered, and healthy.
          </Typography>
        </Box>
      </Container>

      <Footer />
    </>
  )
}
