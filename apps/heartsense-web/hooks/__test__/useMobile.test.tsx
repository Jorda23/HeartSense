import { act, renderHook } from '@testing-library/react'
import { useIsMobile } from '../useMobile'

describe('useIsMobile', () => {
  let originalMatchMedia: typeof window.matchMedia
  let originalInnerWidth: number

  beforeAll(() => {
    originalMatchMedia = window.matchMedia
    originalInnerWidth = window.innerWidth
  })

  afterAll(() => {
    window.matchMedia = originalMatchMedia
    window.innerWidth = originalInnerWidth
  })
  test('returns true when screen width is below the mobile breakpoint', () => {
    window.innerWidth = 600
    window.matchMedia = jest.fn().mockImplementation((query) => ({
      matches: true,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    }))

    const { result } = renderHook(() => useIsMobile())
    expect(result.current).toBe(true)
  })

  test('returns false when screen width is above the mobile breakpoint', () => {
    window.innerWidth = 1024
    window.matchMedia = jest.fn().mockImplementation((query) => ({
      matches: false,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    }))

    const { result } = renderHook(() => useIsMobile())
    expect(result.current).toBe(false)
  })
  test('updates isMobile when window resizes', () => {
    let matchMediaListener: ((e: MediaQueryListEvent) => void) | null = null

    const mockMatchMedia = jest.fn().mockImplementation(() => ({
      matches: window.innerWidth < 768,
      addEventListener: (event: string, listener: EventListener) => {
        if (event === 'change') matchMediaListener = listener
      },
      removeEventListener: jest.fn(),
    }))

    window.matchMedia = mockMatchMedia

    const { result } = renderHook(() => useIsMobile())

    act(() => {
      window.innerWidth = 600
      matchMediaListener?.({ matches: true } as MediaQueryListEvent)
    })

    expect(result.current).toBe(true)

    act(() => {
      window.innerWidth = 1024
      matchMediaListener?.({ matches: false } as MediaQueryListEvent)
    })

    expect(result.current).toBe(false)
  })
})
