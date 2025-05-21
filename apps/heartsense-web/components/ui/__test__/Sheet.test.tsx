import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetClose,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '../Sheet'

describe('Sheet Component', () => {
  test('renders the Sheet component', () => {
    render(
      <Sheet>
        <SheetTrigger data-testid="sheet-trigger">Open Sheet</SheetTrigger>
        <SheetContent data-testid="sheet-content">
          <SheetHeader>
            <SheetTitle data-testid="sheet-title">Sheet Title</SheetTitle>
            <SheetDescription data-testid="sheet-description">
              Sheet Description
            </SheetDescription>
          </SheetHeader>
          <SheetClose data-testid="sheet-close">Close</SheetClose>
        </SheetContent>
      </Sheet>
    )

    expect(screen.getByTestId('sheet-trigger')).toBeInTheDocument()
  })

  test('opens the sheet when clicking the trigger', async () => {
    render(
      <Sheet>
        <SheetTrigger data-testid="sheet-trigger">Open Sheet</SheetTrigger>
        <SheetContent data-testid="sheet-content">
          <SheetHeader>
            <SheetTitle>Sheet Title</SheetTitle>
            <SheetDescription>Sheet Description</SheetDescription>
          </SheetHeader>
          <SheetClose data-testid="sheet-close">Close</SheetClose>
        </SheetContent>
      </Sheet>
    )

    await userEvent.click(screen.getByTestId('sheet-trigger'))

    expect(screen.getByTestId('sheet-content')).toBeInTheDocument()
    expect(screen.getByText('Sheet Title')).toBeInTheDocument()
    expect(screen.getByText('Sheet Description')).toBeInTheDocument()
  })

  test('closes the sheet when clicking the close button', async () => {
    render(
      <Sheet>
        <SheetTrigger data-testid="sheet-trigger">Open Sheet</SheetTrigger>
        <SheetContent data-testid="sheet-content">
          <SheetHeader>
            <SheetTitle>Sheet Title</SheetTitle>
            <SheetDescription>Sheet Description</SheetDescription>
          </SheetHeader>
          <SheetClose data-testid="sheet-close">Close</SheetClose>
        </SheetContent>
      </Sheet>
    )

    await userEvent.click(screen.getByTestId('sheet-trigger'))
    expect(screen.getByTestId('sheet-content')).toBeInTheDocument()

    await userEvent.click(screen.getByTestId('sheet-close'))
    expect(screen.queryByTestId('sheet-content')).not.toBeInTheDocument()
  })
})
