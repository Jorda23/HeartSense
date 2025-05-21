import React from 'react'
import { render, screen } from '@testing-library/react'
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from '../Tooltip'

describe('Tooltip Component', () => {
  test('renders the tooltip trigger', () => {
    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger data-testid="tooltip-trigger">
            Hover me
          </TooltipTrigger>
          <TooltipContent data-testid="tooltip-content">
            Tooltip content
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )

    expect(screen.getByTestId('tooltip-trigger')).toBeInTheDocument()

    expect(screen.queryByTestId('tooltip-content')).not.toBeInTheDocument()
  })
})
