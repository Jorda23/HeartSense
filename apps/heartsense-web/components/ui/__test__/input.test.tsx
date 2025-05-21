import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Input } from '../Input'

describe('Input Component', () => {
  test('renders the Input component', () => {
    render(<Input data-testid="input" />)
    expect(screen.getByTestId('input')).toBeInTheDocument()
  })

  test('applies default class names', () => {
    render(<Input data-testid="input" />)
    expect(screen.getByTestId('input')).toHaveClass(
      'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm'
    )
  })

  test('allows custom class names', () => {
    render(<Input data-testid="input" className="custom-class" />)
    expect(screen.getByTestId('input')).toHaveClass('custom-class')
  })

  test('sets the type attribute correctly', () => {
    render(<Input data-testid="input" type="password" />)
    expect(screen.getByTestId('input')).toHaveAttribute('type', 'password')
  })

  test('allows additional attributes', () => {
    render(<Input data-testid="input" placeholder="Enter your text" />)
    expect(screen.getByTestId('input')).toHaveAttribute(
      'placeholder',
      'Enter your text'
    )
  })

  test('forwards ref correctly', () => {
    const ref = React.createRef<HTMLInputElement>()
    render(<Input ref={ref} data-testid="input" />)
    expect(ref.current).not.toBeNull()
  })
})
