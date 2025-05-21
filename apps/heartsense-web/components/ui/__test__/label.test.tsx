import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Label } from '../Label'

describe('Label Component', () => {
  test('renders the Label component', () => {
    render(<Label data-testid="label">Test Label</Label>)
    expect(screen.getByTestId('label')).toBeInTheDocument()
    expect(screen.getByTestId('label')).toHaveTextContent('Test Label')
  })

  test('applies default class names', () => {
    render(<Label data-testid="label" />)
    expect(screen.getByTestId('label')).toHaveClass(
      'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
    )
  })

  test('allows custom class names', () => {
    render(<Label data-testid="label" className="custom-class" />)
    expect(screen.getByTestId('label')).toHaveClass('custom-class')
  })

  test('sets the htmlFor attribute correctly', () => {
    render(<Label data-testid="label" htmlFor="input-field" />)
    expect(screen.getByTestId('label')).toHaveAttribute('for', 'input-field')
  })

  test('forwards ref correctly', () => {
    const ref = React.createRef<HTMLLabelElement>()
    render(<Label ref={ref} data-testid="label" />)
    expect(ref.current).not.toBeNull()
  })
})
