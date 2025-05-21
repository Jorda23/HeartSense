import { memo } from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { useRouter } from 'next/navigation'

import { ChatHeader } from '../ChatHeader'
import { useWindowSize } from 'usehooks-ts'

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

jest.mock('@/components/ui', () => ({
  useSidebar: jest.fn(() => ({ open: false })),
  Tooltip: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  TooltipTrigger: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  TooltipContent: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  Button: ({
    onClick,
    children,
  }: {
    onClick?: () => void
    children: React.ReactNode
  }) => <button onClick={onClick}>{children}</button>,
}))

jest.mock('@/components/common', () => ({
  ModelSelector: jest.fn(() => (
    <div data-testid="model-selector">Model Selector</div>
  )),
  SidebarToggle: jest.fn(() => (
    <div data-testid="sidebar-toggle">Sidebar Toggle</div>
  )),
}))

jest.mock('@/public/Icons', () => ({
  PlusIcon: () => <svg data-testid="plus-icon" />,
}))

const MemoizedChatHeader = memo(ChatHeader)

describe('ChatHeader Component', () => {
  const mockRouter = { push: jest.fn(), refresh: jest.fn() }
  ;(useRouter as jest.Mock).mockReturnValue(mockRouter)

  it('renders without crashing', () => {
    render(<ChatHeader selectedModelId="gpt-3.5" isReadonly={false} />)
  })

  it('renders the "New Chat" button and tooltip', () => {
    render(<ChatHeader selectedModelId="gpt-3.5" isReadonly={false} />)

    expect(screen.getByTestId('plus-icon')).toBeInTheDocument()
    expect(screen.getAllByText('New Chat').length).toBeGreaterThan(0)
  })

  it('navigates to the homepage when "New Chat" is clicked', () => {
    render(<ChatHeader selectedModelId="gpt-3.5" isReadonly={false} />)

    const newChatButton = screen.getByRole('button', { name: /New Chat/i })
    fireEvent.click(newChatButton)

    expect(mockRouter.push).toHaveBeenCalledWith('/')
    expect(mockRouter.refresh).toHaveBeenCalled()
  })

  it('renders ModelSelector when isReadonly is false', () => {
    render(<ChatHeader selectedModelId="gpt-3.5" isReadonly={false} />)

    expect(screen.getByTestId('model-selector')).toBeInTheDocument()
  })

  it('does not render ModelSelector when isReadonly is true', () => {
    render(<ChatHeader selectedModelId="gpt-3.5" isReadonly={true} />)

    expect(screen.queryByTestId('model-selector')).not.toBeInTheDocument()
  })
})

describe('ChatHeader Component - Memoization', () => {
  const renderSpy = jest.fn()

  function Wrapper({ selectedModelId }: { selectedModelId: string }) {
    renderSpy()
    return (
      <MemoizedChatHeader
        selectedModelId={selectedModelId}
        isReadonly={false}
      />
    )
  }

  beforeEach(() => {
    renderSpy.mockClear()
  })
  it('re-renders when selectedModelId changes', () => {
    const { rerender } = render(<Wrapper selectedModelId="gpt-3.5" />)

    rerender(<Wrapper selectedModelId="gpt-4" />)

    expect(renderSpy).toHaveBeenCalledTimes(2)
  })
})

describe('ChatHeader Component - Responsive Behavior', () => {
  const mockRouter = { push: jest.fn(), refresh: jest.fn() }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue(mockRouter)
  })

  it('shows "New Chat" button when windowWidth < 768', () => {
    ;(useWindowSize as jest.Mock).mockReturnValue({ width: 500, height: 800 })

    render(<ChatHeader selectedModelId="gpt-3.5" isReadonly={false} />)

    expect(screen.getByTestId('plus-icon')).toBeInTheDocument()
  })

  it('does not show "New Chat" button when windowWidth >= 768 and sidebar is open', () => {
    ;(useWindowSize as jest.Mock).mockReturnValue({ width: 1024, height: 800 })
    const useSidebar = require('@/components/ui').useSidebar
    useSidebar.mockReturnValue({ open: true })

    render(<ChatHeader selectedModelId="gpt-3.5" isReadonly={false} />)

    expect(screen.queryByTestId('plus-icon')).not.toBeInTheDocument()
  })
})
