import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { ChatItem } from '../ChatItem'

describe('ChatItem', () => {
  const mockOnSave = jest.fn()

  const defaultProps = {
    id: '123',
    title: 'Título original',
    onSave: mockOnSave,
    editable: true,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders title', () => {
    render(<ChatItem {...defaultProps} />)
    expect(screen.getByText('Título original')).toBeInTheDocument()
  })

  it('enters edit mode when clicking edit icon', () => {
    render(<ChatItem {...defaultProps} />)
    const editButton = screen.getByRole('button', { name: /editar título/i })
    fireEvent.click(editButton)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('saves new title on Enter key press', () => {
    render(<ChatItem {...defaultProps} />)
    fireEvent.click(screen.getByRole('button', { name: /editar título/i }))
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'Nuevo título' } })
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' })
    expect(mockOnSave).toHaveBeenCalledWith('Nuevo título')
  })

  it('saves new title when clicking save button', () => {
    render(<ChatItem {...defaultProps} />)
    fireEvent.click(screen.getByRole('button', { name: /editar título/i }))
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'Título guardado' } })
    const saveButton = screen.getByRole('button', { name: /guardar título/i })
    fireEvent.click(saveButton)
    expect(mockOnSave).toHaveBeenCalledWith('Título guardado')
  })

  it('does not save if title is empty or whitespace only', () => {
    render(<ChatItem {...defaultProps} />)
    fireEvent.click(screen.getByRole('button', { name: /editar título/i }))
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: '     ' } })
    const saveButton = screen.getByRole('button', { name: /guardar título/i })
    fireEvent.click(saveButton)
    expect(mockOnSave).not.toHaveBeenCalled()
  })

  it('displays active style when isActive is true', () => {
    const { container } = render(<ChatItem {...defaultProps} isActive />)
    expect(container.firstChild).toHaveStyle('background-color: #c3d2d6')
  })
})

describe('ChatItem - click outside triggers resetEdit', () => {
  const defaultProps = {
    id: '123',
    title: 'Título original',
    onSave: jest.fn(),
    editable: true,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('resets title and exits edit mode on outside click', () => {
    render(
      <div>
        <div data-testid="outside">Outside</div>
        <ChatItem {...defaultProps} />
      </div>
    )

    // Entra en modo edición
    const editButton = screen.getByRole('button', { name: /editar título/i })
    fireEvent.click(editButton)

    const input = screen.getByRole('textbox')
    expect(input).toBeInTheDocument()

    // Cambia el texto
    fireEvent.change(input, { target: { value: 'Nuevo título' } })

    // Clic fuera del componente
    const outside = screen.getByTestId('outside')
    fireEvent.mouseDown(outside)

    // Debe salir del modo edición (no debe haber input)
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()

    // El texto original debe estar visible
    expect(screen.getByText('Título original')).toBeInTheDocument()
  })
})
