import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '../DropdownMenu'

describe('DropdownMenu Component', () => {
  test('renders the DropdownMenu trigger', () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger data-testid="dropdown-trigger">
          Open Menu
        </DropdownMenuTrigger>
        <DropdownMenuContent data-testid="dropdown-content">
          <DropdownMenuItem data-testid="menu-item">Menu Item</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )

    expect(screen.getByTestId('dropdown-trigger')).toBeInTheDocument()
  })
})
