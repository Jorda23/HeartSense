import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Overview } from '../Overview'

jest.mock('framer-motion', () => {
  const actual = jest.requireActual('framer-motion')
  return {
    ...actual,
    motion: {
      div: ({ children }: { children: React.ReactNode }) => (
        <div>{children}</div>
      ),
    },
  }
})

describe('Overview Component', () => {
  it('renders the greeting texts', () => {
    render(<Overview />)

    expect(screen.getByText('¡Hola!')).toBeInTheDocument()
    expect(screen.getByText('¿Cómo puedo ayudarte hoy?')).toBeInTheDocument()
  })
})
