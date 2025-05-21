'use client'

import React, { useState } from 'react'
import {
  Container,
  Typography,
  TextField,
  Box,
  Paper,
  Snackbar,
  Alert,
} from '@mui/material'
import { Footer } from '@/components/common/Footer/Footer'
import { Button } from '@/components/ui'

export default function ContactPage() {
  const [formValues, setFormValues] = useState({
    name: '',
    email: '',
    message: '',
  })

  const [formErrors, setFormErrors] = useState({
    name: '',
    email: '',
    message: '',
  })

  const [submitting, setSubmitting] = useState(false)
  const [successOpen, setSuccessOpen] = useState(false)

  const validateEmail = (email: string) => {
    return /^\S+@\S+\.\S+$/.test(email)
  }

  const validate = () => {
    let errors = { name: '', email: '', message: '' }
    let valid = true

    if (!formValues.name.trim()) {
      errors.name = 'Name is required'
      valid = false
    }
    if (!formValues.email.trim()) {
      errors.email = 'Email is required'
      valid = false
    } else if (!validateEmail(formValues.email)) {
      errors.email = 'Invalid email address'
      valid = false
    }
    if (!formValues.message.trim()) {
      errors.message = 'Message is required'
      valid = false
    }

    setFormErrors(errors)
    return valid
  }

  const handleChange =
    (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormValues((prev) => ({ ...prev, [field]: e.target.value }))
      setFormErrors((prev) => ({ ...prev, [field]: '' }))
    }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setSubmitting(false)
      setSuccessOpen(true)
      setFormValues({ name: '', email: '', message: '' })
    }, 1500)
  }

  return (
    <>
      <Container maxWidth="sm" sx={{ mt: 8, mb: 8 }}>
        <Paper sx={{ p: 4, boxShadow: 3 }}>
          <Typography variant="h3" gutterBottom>
            Contact Us
          </Typography>
          <Typography variant="body1" paragraph>
            Have questions? Reach out to us and we’ll get back to you as soon as
            possible.
          </Typography>

          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <TextField
              label="Name"
              variant="outlined"
              fullWidth
              margin="normal"
              required
              value={formValues.name}
              onChange={handleChange('name')}
              error={!!formErrors.name}
              helperText={formErrors.name}
              disabled={submitting}
              autoComplete="name"
            />
            <TextField
              label="Email"
              variant="outlined"
              type="email"
              fullWidth
              margin="normal"
              required
              value={formValues.email}
              onChange={handleChange('email')}
              error={!!formErrors.email}
              helperText={formErrors.email}
              disabled={submitting}
              autoComplete="email"
            />
            <TextField
              label="Message"
              variant="outlined"
              multiline
              rows={4}
              fullWidth
              margin="normal"
              required
              value={formValues.message}
              onChange={handleChange('message')}
              error={!!formErrors.message}
              helperText={formErrors.message}
              disabled={submitting}
              autoComplete="off"
            />

            <Button
              type="submit"
              sx={{ mt: 2 }}
              disabled={submitting}
              fullWidth
            >
              {submitting ? 'Sending...' : 'Send Message'}
            </Button>
          </Box>
        </Paper>
      </Container>

      <Footer />

      {/* Success Snackbar */}
      <Snackbar
        open={successOpen}
        autoHideDuration={4000}
        onClose={() => setSuccessOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSuccessOpen(false)}
          severity="success"
          sx={{ width: '100%' }}
        >
          Message sent successfully!
        </Alert>
      </Snackbar>
    </>
  )
}
