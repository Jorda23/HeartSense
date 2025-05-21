import React, { createRef } from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Textarea } from '../Textarea'

describe('Textarea Component', () => {
  test('renders the Textarea component', () => {
    render(<Textarea data-testid="textarea" />)
    expect(screen.getByTestId('textarea')).toBeInTheDocument()
  })

  test('applies default class names', () => {
    render(<Textarea data-testid="textarea" />)
    expect(screen.getByTestId('textarea')).toHaveClass(
      'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm'
    )
  })

  test('allows custom class names', () => {
    render(<Textarea data-testid="textarea" className="custom-class" />)
    expect(screen.getByTestId('textarea')).toHaveClass('custom-class')
  })

  test('applies additional attributes', () => {
    render(<Textarea data-testid="textarea" placeholder="Type here..." />)
    expect(screen.getByTestId('textarea')).toHaveAttribute(
      'placeholder',
      'Type here...'
    )
  })

  test('forwards ref correctly', () => {
    const ref = createRef<HTMLTextAreaElement>()
    render(<Textarea ref={ref} data-testid="textarea" />)
    expect(ref.current).not.toBeNull()
  })
})
