import { useTheme } from 'next-themes'
import { render, screen } from '@testing-library/react'
import { SidebarProvider } from '@/components/ui/Sidebar'
import { SidebarUserNav } from '../SidebarUserNav'
import userEvent from '@testing-library/user-event'

jest.mock('next-themes', () => ({
  useTheme: jest.fn(),
}))

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}))

describe('SidebarUserNav Component', () => {
  const mockSetTheme = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useTheme as jest.Mock).mockReturnValue({
      theme: 'light',
      setTheme: mockSetTheme,
    })
  })

  const userMock = {
    id: '1',
    email: 'test@example.com',
  }

  const renderWithProvider = () =>
    render(
      <SidebarProvider>
        <SidebarUserNav user={userMock} />
      </SidebarProvider>
    )

  it('renders user email and avatar', () => {
    renderWithProvider()
    expect(screen.getByText(userMock.email)).toBeInTheDocument()
    expect(screen.getByAltText(userMock.email)).toBeInTheDocument()
  })

  it('calls setTheme on MUI menu item click', async () => {
    renderWithProvider()

    const triggerButton = screen.getByRole('button')
    await userEvent.click(triggerButton)

    const toggleItem = await screen.findByTestId('toggle-theme')
    await userEvent.click(toggleItem)

    expect(mockSetTheme).toHaveBeenCalledWith('dark')
  })

  it('toggles from dark to light mode', async () => {
    ;(useTheme as jest.Mock).mockReturnValue({
      theme: 'dark',
      setTheme: mockSetTheme,
    })

    render(
      <SidebarProvider>
        <SidebarUserNav user={userMock} />
      </SidebarProvider>
    )

    const triggerButton = screen.getByRole('button')
    await userEvent.click(triggerButton)

    const toggleItem = await screen.findByTestId('toggle-theme')
    await userEvent.click(toggleItem)

    expect(mockSetTheme).toHaveBeenCalledWith('light')
  })
})
