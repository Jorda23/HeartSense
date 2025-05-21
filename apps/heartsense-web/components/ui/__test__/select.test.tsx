import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '../Select'

describe('Select Component', () => {
  test('renders the Select component', () => {
    render(
      <Select>
        <SelectTrigger data-testid="select-trigger">
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent data-testid="select-content">
          <SelectItem value="option1" data-testid="select-item-1">
            Option 1
          </SelectItem>
          <SelectItem value="option2" data-testid="select-item-2">
            Option 2
          </SelectItem>
        </SelectContent>
      </Select>
    )

    expect(screen.getByTestId('select-trigger')).toBeInTheDocument()
    expect(screen.getByText('Select an option')).toBeInTheDocument()
  })
})
