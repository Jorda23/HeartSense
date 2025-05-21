import { render, renderHook, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  SidebarProvider,
  Sidebar,
  SidebarTrigger,
  SidebarContent,
  useSidebar,
  SidebarInset,
} from '../Sidebar'
import { act } from 'react-dom/test-utils'
import { useIsMobile } from '@/hooks/useMobile'

jest.mock('@/hooks/useMobile', () => ({
  useIsMobile: jest.fn(),
}))

describe('Sidebar component', () => {
  test('renders the SidebarInset component', () => {
    render(<SidebarInset />)

    expect(screen.getByRole('main')).toBeInTheDocument()
  })
  it('renders the SidebarProvider with  onOpenChange', () => {
    render(
      <SidebarProvider onOpenChange={() => {}}>
        <Sidebar>
          <SidebarTrigger>Toggle Sidebar</SidebarTrigger>
          <SidebarContent>Sidebar Content</SidebarContent>
        </Sidebar>
      </SidebarProvider>
    )

    expect(screen.getByText('Toggle Sidebar')).toBeInTheDocument()
    expect(screen.getByText('Sidebar Content')).toBeInTheDocument()
  })

  it('renders the Sidebar with trigger and content', () => {
    render(
      <SidebarProvider>
        <Sidebar>
          <SidebarTrigger>Toggle Sidebar</SidebarTrigger>
          <SidebarContent>Sidebar Content</SidebarContent>
        </Sidebar>
      </SidebarProvider>
    )

    expect(screen.getByText('Toggle Sidebar')).toBeInTheDocument()
    expect(screen.getByText('Sidebar Content')).toBeInTheDocument()
  })

  it('renders the Sidebar variant floating', () => {
    render(
      <SidebarProvider>
        <Sidebar variant="floating" side="right">
          <SidebarTrigger>Toggle Sidebar</SidebarTrigger>
          <SidebarContent>Sidebar Content</SidebarContent>
        </Sidebar>
      </SidebarProvider>
    )

    expect(screen.getByText('Toggle Sidebar')).toBeInTheDocument()
    expect(screen.getByText('Sidebar Content')).toBeInTheDocument()
  })

  it('renders the Sidebar with collapsible is same none', () => {
    render(
      <SidebarProvider>
        <Sidebar collapsible="none">
          <SidebarTrigger>Toggle Sidebar</SidebarTrigger>
          <SidebarContent>Sidebar Content</SidebarContent>
        </Sidebar>
      </SidebarProvider>
    )

    expect(screen.getByText('Toggle Sidebar')).toBeInTheDocument()
    expect(screen.getByText('Sidebar Content')).toBeInTheDocument()
  })

  it('toggles open state on trigger click', async () => {
    render(
      <SidebarProvider>
        <Sidebar>
          <SidebarTrigger>Toggle Sidebar</SidebarTrigger>
          <SidebarContent>Sidebar Content</SidebarContent>
        </Sidebar>
      </SidebarProvider>
    )

    const trigger = screen.getByText('Toggle Sidebar')

    await userEvent.click(trigger)

    expect(screen.getByText('Sidebar Content')).toBeInTheDocument()
  })

  it('toggles using the keyboard shortcut (Cmd/Ctrl + B)', async () => {
    render(
      <SidebarProvider>
        <Sidebar>
          <SidebarTrigger>Toggle Sidebar</SidebarTrigger>
          <SidebarContent>Sidebar Content</SidebarContent>
        </Sidebar>
      </SidebarProvider>
    )

    act(() => {
      const event = new KeyboardEvent('keydown', {
        key: 'b',
        ctrlKey: true,
      })
      window.dispatchEvent(event)
    })

    expect(screen.getByText('Sidebar Content')).toBeInTheDocument()
  })

  it('throws an error when used outside of SidebarProvider', () => {
    expect(() => {
      renderHook(() => useSidebar())
    }).toThrowError('useSidebar must be used within a SidebarProvider.')
  })
})

describe('Sidebar on mobile', () => {
  beforeEach(() => {
    // Forzamos el valor mobile
    ;(useIsMobile as jest.Mock).mockReturnValue(true)
  })

  it('renders mobile sidebar using Sheet when isMobile is true', () => {
    render(
      <SidebarProvider>
        <Sidebar collapsible="none">
          <SidebarTrigger>Toggle Sidebar</SidebarTrigger>
          <SidebarContent>Sidebar Content</SidebarContent>
        </Sidebar>
      </SidebarProvider>
    )

    expect(screen.getByText('Toggle Sidebar')).toBeInTheDocument()
    expect(screen.getByText('Sidebar Content')).toBeInTheDocument()
  })
})
