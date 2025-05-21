import { render, screen, fireEvent } from '@testing-library/react'
import { TooltipProvider } from '@radix-ui/react-tooltip'

import { SidebarToggle } from '../SidebarToggle'
import { useSidebar } from '../../../ui'

jest.mock('../../../ui', () => ({
  ...jest.requireActual('../../../ui'),
  useSidebar: jest.fn(),
}))

describe('SidebarToggle Component', () => {
  const mockToggleSidebar = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useSidebar as jest.Mock).mockReturnValue({
      toggleSidebar: mockToggleSidebar,
    })
  })

  const renderWithProvider = () =>
    render(
      <TooltipProvider>
        <SidebarToggle />
      </TooltipProvider>
    )

  it('renders SidebarToggle button correctly', () => {
    renderWithProvider()
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('calls toggleSidebar when button is clicked', () => {
    renderWithProvider()
    const button = screen.getByRole('button')
    fireEvent.click(button)
    expect(mockToggleSidebar).toHaveBeenCalledTimes(1)
  })
})
