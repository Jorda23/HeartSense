import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from '../Card'

describe('Card Components', () => {
  test('renders the Card component', () => {
    render(<Card data-testid="card">Card Content</Card>)
    expect(screen.getByTestId('card')).toBeInTheDocument()
    expect(screen.getByTestId('card')).toHaveTextContent('Card Content')
  })

  test('Card applies default class names', () => {
    render(<Card data-testid="card" />)
    expect(screen.getByTestId('card')).toHaveClass(
      'rounded-lg border bg-card text-card-foreground shadow-sm'
    )
  })

  test('renders the CardHeader component', () => {
    render(<CardHeader data-testid="card-header">Header</CardHeader>)
    expect(screen.getByTestId('card-header')).toBeInTheDocument()
    expect(screen.getByTestId('card-header')).toHaveTextContent('Header')
  })

  test('CardHeader applies default class names', () => {
    render(<CardHeader data-testid="card-header" />)
    expect(screen.getByTestId('card-header')).toHaveClass(
      'flex flex-col space-y-1.5 p-6'
    )
  })

  test('renders the CardTitle component', () => {
    render(<CardTitle data-testid="card-title">Title</CardTitle>)
    expect(screen.getByTestId('card-title')).toBeInTheDocument()
    expect(screen.getByTestId('card-title')).toHaveTextContent('Title')
  })

  test('CardTitle applies default class names', () => {
    render(<CardTitle data-testid="card-title" />)
    expect(screen.getByTestId('card-title')).toHaveClass(
      'text-2xl font-semibold leading-none tracking-tight'
    )
  })

  test('renders the CardDescription component', () => {
    render(
      <CardDescription data-testid="card-description">
        Description
      </CardDescription>
    )
    expect(screen.getByTestId('card-description')).toBeInTheDocument()
    expect(screen.getByTestId('card-description')).toHaveTextContent(
      'Description'
    )
  })

  test('CardDescription applies default class names', () => {
    render(<CardDescription data-testid="card-description" />)
    expect(screen.getByTestId('card-description')).toHaveClass(
      'text-sm text-muted-foreground'
    )
  })

  test('renders the CardContent component', () => {
    render(<CardContent data-testid="card-content">Content</CardContent>)
    expect(screen.getByTestId('card-content')).toBeInTheDocument()
    expect(screen.getByTestId('card-content')).toHaveTextContent('Content')
  })

  test('CardContent applies default class names', () => {
    render(<CardContent data-testid="card-content" />)
    expect(screen.getByTestId('card-content')).toHaveClass('p-6 pt-0')
  })

  test('renders the CardFooter component', () => {
    render(<CardFooter data-testid="card-footer">Footer</CardFooter>)
    expect(screen.getByTestId('card-footer')).toBeInTheDocument()
    expect(screen.getByTestId('card-footer')).toHaveTextContent('Footer')
  })

  test('CardFooter applies default class names', () => {
    render(<CardFooter data-testid="card-footer" />)
    expect(screen.getByTestId('card-footer')).toHaveClass(
      'flex items-center p-6 pt-0'
    )
  })

  test('allows custom class names', () => {
    render(<Card data-testid="card" className="custom-class" />)
    expect(screen.getByTestId('card')).toHaveClass('custom-class')
  })

  test('spreads additional props', () => {
    render(<Card data-testid="card" role="region" />)
    expect(screen.getByTestId('card')).toHaveAttribute('role', 'region')
  })
})
