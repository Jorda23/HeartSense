import { render, screen, fireEvent } from '@testing-library/react'
import { unparse } from 'papaparse'
import {
  areEqualSheetEditor,
  handleCellClick,
  SpreadsheetEditor,
} from '../SheetEditor'
import { useTheme } from 'next-themes'

jest.mock('next-themes', () => ({
  useTheme: jest.fn(() => ({ theme: 'light' })),
}))

describe('SpreadsheetEditor Component', () => {
  const mockSaveContent = jest.fn()

  const mockCsvContent = unparse([
    ['Name', 'Age', 'Country'],
    ['Alice', '30', 'USA'],
    ['Bob', '25', 'Canada'],
  ])

  it('renders without crashing', () => {
    render(
      <SpreadsheetEditor
        content={mockCsvContent}
        saveContent={mockSaveContent}
      />
    )
    expect(screen.getByRole('grid')).toBeInTheDocument()
  })

  it('allows editing a cell and triggers saveContent', () => {
    render(
      <SpreadsheetEditor
        content={mockCsvContent}
        saveContent={mockSaveContent}
      />
    )

    const cell = screen.getByText('Alice')
    fireEvent.doubleClick(cell)

    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'Charlie' },
    })
    fireEvent.blur(screen.getByRole('textbox'))

    expect(mockSaveContent).toHaveBeenCalled()
  })

  it('applies "rdg-dark" class when theme is dark', () => {
    ;(useTheme as jest.Mock).mockReturnValue({ theme: 'dark' })

    render(
      <SpreadsheetEditor
        content={mockCsvContent}
        saveContent={mockSaveContent}
      />
    )

    const grid = screen.getByRole('grid')
    expect(grid).toHaveClass('rdg-dark')
  })
  it('renders empty grid when content is empty', () => {
    render(<SpreadsheetEditor content={''} saveContent={mockSaveContent} />)

    const grid = screen.getByRole('grid')

    expect(grid).toBeInTheDocument()

    const emptyCells = screen.getAllByText((content) => content === '')
    expect(emptyCells.length).toBeGreaterThan(0)
  })
})

describe('areEqualSheetEditor (React.memo comparator)', () => {
  it('returns true when content and saveContent are the same', () => {
    const mockFn = jest.fn()
    const prevProps = {
      content: 'Name,Age\nAlice,30',
      saveContent: mockFn,
    }
    const nextProps = {
      content: 'Name,Age\nAlice,30',
      saveContent: mockFn,
    }

    expect(areEqualSheetEditor(prevProps, nextProps)).toBe(true)
  })

  it('returns false when content changes', () => {
    const mockFn = jest.fn()
    const prevProps = {
      content: 'Name,Age\nAlice,30',
      saveContent: mockFn,
    }
    const nextProps = {
      content: 'Name,Age\nAlice,31',
      saveContent: mockFn,
    }

    expect(areEqualSheetEditor(prevProps, nextProps)).toBe(false)
  })

  it('returns false when saveContent reference changes', () => {
    const prevProps = {
      content: 'Name,Age\nAlice,30',
      saveContent: () => {},
    }
    const nextProps = {
      content: 'Name,Age\nAlice,30',
      saveContent: () => {},
    }

    expect(areEqualSheetEditor(prevProps, nextProps)).toBe(false)
  })
})

describe('handleCellClick logic', () => {
  it('calls selectCell(true) when column is not rowNumber', () => {
    const mockSelectCell = jest.fn()

    handleCellClick({
      column: { key: '1' },
      selectCell: mockSelectCell,
    })

    expect(mockSelectCell).toHaveBeenCalledWith(true)
  })

  it('does NOT call selectCell when column is rowNumber', () => {
    const mockSelectCell = jest.fn()

    handleCellClick({
      column: { key: 'rowNumber' },
      selectCell: mockSelectCell,
    })

    expect(mockSelectCell).not.toHaveBeenCalled()
  })
})
