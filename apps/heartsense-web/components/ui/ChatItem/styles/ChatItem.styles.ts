import { styled } from '@mui/material/styles'
import { Box } from '@mui/material'

export const StyledContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isActive',
})<{ isActive: boolean }>(({ isActive }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginTop: 8,
  marginBottom: 8,
  paddingLeft: 8,
  paddingRight: 8,
  paddingTop: 4,
  paddingBottom: 4,
  borderRadius: 8,
  position: 'relative',
  cursor: 'pointer',
  backgroundColor: isActive ? '#c3d2d6' : undefined,
  fontWeight: isActive ? 500 : undefined,
  transition: 'background-color 0.2s ease-in-out',
  '&:hover': {
    backgroundColor: !isActive ? '#e2e8f0' : undefined,
  },
  '&:hover .edit-btn': {
    opacity: 1,
  },
}))
