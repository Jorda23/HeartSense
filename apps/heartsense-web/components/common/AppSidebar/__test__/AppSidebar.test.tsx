import { screen, fireEvent } from '@testing-library/react'
import { AppSidebar } from '@/components/common/AppSidebar'
import { SidebarProvider, useSidebar } from '@/components/ui/Sidebar'
import type { User } from 'next-auth'
import { useRouter } from 'next/navigation'
import { render } from '@/test-utils'

jest.mock('react-redux', () => ({
  useSelector: jest.fn(() => {
    const state: { conversationId: string | null; title: string | null } = {
      conversationId: null,
      title: null,
    }
    return state
  }),
}))

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    refresh: jest.fn(),
  })),
  useParams: jest.fn(() => ({ id: 'test-id' })),
  usePathname: jest.fn(() => '/some-path'),
}))

jest.mock('@/components/ui/Sidebar', () => ({
  ...jest.requireActual('@/components/ui/Sidebar'),
  useSidebar: jest.fn(),
}))

const mockUser: User = {
  id: '1',
  name: 'Test User',
  email: 'test@example.com',
  image: '',
}

describe('AppSidebar component', () => {
  let routerMock: ReturnType<typeof useRouter>
  let setOpenMobileMock: jest.Mock

  beforeEach(() => {
    routerMock = useRouter()
    setOpenMobileMock = jest.fn()
    ;(useSidebar as jest.Mock).mockReturnValue({
      setOpenMobile: setOpenMobileMock,
    })
  })

  it('renders sidebar with user and triggers new chat button', () => {
    render(
      <SidebarProvider>
        <AppSidebar user={mockUser} />
      </SidebarProvider>
    )

    expect(screen.getByText('HEARTSENSE')).toBeInTheDocument()
  })

  it('calls setOpenMobile and router.push when clicking new chat button', () => {
    render(
      <SidebarProvider>
        <AppSidebar user={mockUser} />
      </SidebarProvider>
    )

    const newChatButton = screen.getByRole('button', { name: /new chat/i })
    fireEvent.click(newChatButton)

    expect(setOpenMobileMock).toHaveBeenCalledWith(false)
  })

  it('calls setOpenMobile when clicking the HEARTSENSE link', () => {
    render(
      <SidebarProvider>
        <AppSidebar user={mockUser} />
      </SidebarProvider>
    )

    const logoLink = screen.getByText('HEARTSENSE')
    fireEvent.click(logoLink)

    expect(setOpenMobileMock).toHaveBeenCalledWith(false)
  })
})
