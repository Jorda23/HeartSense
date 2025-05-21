import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Skeleton } from '../Skeleton'

describe('Skeleton Component', () => {
  test('renders the Skeleton component', () => {
    render(<Skeleton data-testid="skeleton" />)
    expect(screen.getByTestId('skeleton')).toBeInTheDocument()
  })

  test('applies default class names', () => {
    render(<Skeleton data-testid="skeleton" />)
    const skeleton = screen.getByTestId('skeleton')

    expect(skeleton).toHaveClass('animate-pulse')
    expect(skeleton).toHaveClass('rounded-md')
    expect(skeleton).toHaveClass('bg-muted')
  })

  test('applies additional class names', () => {
    render(<Skeleton data-testid="skeleton" className="custom-class" />)
    expect(screen.getByTestId('skeleton')).toHaveClass('custom-class')
  })

  test('spreads additional props', () => {
    render(<Skeleton data-testid="skeleton" role="presentation" />)
    expect(screen.getByTestId('skeleton')).toHaveAttribute(
      'role',
      'presentation'
    )
  })
})
