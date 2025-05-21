'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Link,
  AppBar,
  Toolbar,
  Button,
} from '@mui/material'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import Navbar from '@/components/common/Navbar/Navbar'
import { Footer } from '@/components/common/Footer/Footer'

export default function MainMenu() {
  const router = useRouter()

  const options = [
    {
      label: 'Chatbot',
      description: 'Open chatbot interface',
      path: '/',
      color: '#4caf50',
    },
    {
      label: 'Manager Task',
      description: 'Manage your tasks',
      path: '/task',
      color: '#2196f3',
    },
  ]

  const publicity = [
    {
      name: 'Hospital A',
      link: 'https://images.unsplash.com/photo-1512678080530-7760d81faba6?q=80&w=2074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
      name: 'Health Clinic B',
      link: 'https://images.unsplash.com/photo-1512677859289-868722942457?q=80&w=2074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
      name: 'Medical Supplies Co.',
      link: 'https://images.unsplash.com/photo-1563932127565-699eeea1e17a?q=80&w=1982&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
      name: 'Pharmacy C',
      link: 'https://images.unsplash.com/photo-1576085898477-1af31ada606a?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
  ]

  return (
    <>
      {/* Navbar */}
      <Navbar />

      {/* Background image wrapper */}
      <Box
        sx={{
          backgroundImage:
            'url(https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          py: 10,
        }}
      >
        <Container
          maxWidth="md"
          sx={{
            backgroundColor: 'rgba(255,255,255,0.9)',
            borderRadius: 3,
            py: 6,
            boxShadow: 3,
          }}
        >
          <Typography variant="h4" align="center" gutterBottom>
            Select an Option
          </Typography>

          <Grid container spacing={4} justifyContent="center">
            {options.map(({ label, description, path, color }) => (
              <Grid item xs={12} sm={6} md={4} key={label}>
                <Paper
                  onClick={() => router.push(path)}
                  elevation={8}
                  sx={{
                    cursor: 'pointer',
                    p: 4,
                    borderRadius: 4,
                    bgcolor: color,
                    color: '#fff',
                    textAlign: 'center',
                    height: 180,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    '&:hover': {
                      boxShadow: '0 0 20px rgba(0,0,0,0.3)',
                      transform: 'scale(1.05)',
                      transition: 'all 0.3s ease',
                    },
                  }}
                >
                  <Typography variant="h5" fontWeight="bold" gutterBottom>
                    {label}
                  </Typography>
                  <Typography variant="body1">{description}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Medical Info Section */}
      <Container maxWidth="lg" sx={{ mt: 8, mb: 8 }}>
        <Grid container spacing={6} alignItems="center">
          {/* Imagen izquierda + texto derecha */}
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Medical Assistant at work"
              sx={{ width: '100%', borderRadius: 3, boxShadow: 3 }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h4" gutterBottom>
              What is a Medical Assistant?
            </Typography>
            <Typography variant="body1" paragraph>
              A medical assistant is a vital member of the healthcare team,
              providing both clinical and administrative support to physicians
              and medical staff. They help streamline operations and enhance
              patient care in various medical settings.
            </Typography>
            <Typography variant="body1" paragraph>
              Their responsibilities often include taking vital signs, preparing
              patients for exams, assisting with procedures, managing medical
              records, and coordinating appointments.
            </Typography>
          </Grid>

          {/* Texto izquierda + imagen derecha */}
          <Grid item xs={12} md={6}>
            <Typography variant="h4" gutterBottom>
              Benefits of Having a Medical Assistant
            </Typography>
            <Typography variant="body1" paragraph>
              Medical assistants improve clinic efficiency, reduce waiting
              times, and allow doctors to focus more on diagnosis and treatment.
              Their presence enhances patient experience by providing
              personalized attention and ensuring smooth workflow.
            </Typography>
            <Typography variant="body1" paragraph>
              Employing trained medical assistants leads to higher patient
              satisfaction, better record management, and overall improved
              healthcare delivery.
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src="https://images.unsplash.com/photo-1581056771392-8a90ddb76831?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Medical Assistant smiling"
              sx={{ width: '100%', borderRadius: 3, boxShadow: 3 }}
            />
          </Grid>
        </Grid>
      </Container>

      {/* Swiper Publicity Section */}
      <Container maxWidth="lg" sx={{ mt: 6, mb: 4 }}>
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={20}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          breakpoints={{
            600: {
              slidesPerView: 2,
            },
            900: {
              slidesPerView: 3,
            },
          }}
          style={{ padding: '1rem 0' }}
        >
          {publicity.map(({ name, link }) => (
            <SwiperSlide key={name}>
              <Box
                component="a"
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  display: 'block',
                  borderRadius: 3,
                  overflow: 'hidden',
                  boxShadow: 3,
                  position: 'relative',
                  cursor: 'pointer',
                  height: 240,
                  '&:hover img': {
                    transform: 'scale(1.05)',
                    transition: 'transform 0.3s ease',
                  },
                }}
                title={name}
              >
                <Box
                  component="img"
                  src={link}
                  alt={name}
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.3s ease',
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    width: '100%',
                    bgcolor: 'rgba(0,0,0,0.5)',
                    color: 'white',
                    textAlign: 'center',
                    py: 0.5,
                    fontWeight: 'bold',
                    fontSize: '0.9rem',
                    userSelect: 'none',
                  }}
                >
                  {name}
                </Box>
              </Box>
            </SwiperSlide>
          ))}
        </Swiper>
      </Container>

      {/* Footer */}
      <Footer />
    </>
  )
}
