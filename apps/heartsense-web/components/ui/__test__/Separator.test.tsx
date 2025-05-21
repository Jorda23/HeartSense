import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Separator } from '../Separator'

describe('Separator Component', () => {
  test('renders the Separator component', () => {
    render(<Separator data-testid="separator" />)
    expect(screen.getByTestId('separator')).toBeInTheDocument()
  })

  test('applies default class names for horizontal orientation', () => {
    render(<Separator data-testid="separator" />)
    expect(screen.getByTestId('separator')).toHaveClass(
      'shrink-0 bg-border h-[1px] w-full'
    )
  })

  test('applies default class names for vertical orientation', () => {
    render(<Separator data-testid="separator" orientation="vertical" />)
    expect(screen.getByTestId('separator')).toHaveClass(
      'shrink-0 bg-border h-full w-[1px]'
    )
  })

  test('allows custom class names', () => {
    render(<Separator data-testid="separator" className="custom-class" />)
    expect(screen.getByTestId('separator')).toHaveClass('custom-class')
  })

  test('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>()
    render(<Separator ref={ref} data-testid="separator" />)
    expect(ref.current).not.toBeNull()
  })
})
