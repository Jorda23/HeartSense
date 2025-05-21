import '@testing-library/jest-dom/extend-expect'
import 'jest-localstorage-mock'
import 'jest-fetch-mock'

jest.mock('remark-gfm', () => jest.fn())

jest.mock('usehooks-ts', () => ({
  useWindowSize: jest.fn(() => ({ width: 1024, height: 768 })),
}))

jest.mock('@codemirror/view', () => require('../__mocks__/codemirror'))
jest.mock('@codemirror/state', () => require('../__mocks__/codemirror'))
jest.mock('@codemirror/lang-python', () => require('../__mocks__/codemirror'))
jest.mock('@codemirror/theme-one-dark', () =>
  require('../__mocks__/codemirror')
)
jest.mock('@codemirror/basic-setup', () => require('../__mocks__/codemirror'))
jest.mock('sonner', () => ({
  toast: {
    error: jest.fn(),
    warning: jest.fn(),
  },
}))
jest.mock('react-markdown', () => {
  return function MockReactMarkdown({ children }: { children: string }) {
    return (
      <div data-testid="react-markdown">
        {children.replace(
          /\[([^\]]+)\]\(([^)]+)\)/g,
          (_, text, url) => `<a href="${url}">${text}</a>`
        )}
      </div>
    )
  }
})

let observerCallback: (entries: any[]) => void

beforeAll(() => {
  global.IntersectionObserver = class {
    constructor(cb: typeof observerCallback) {
      observerCallback = cb
    }
    observe = jest.fn()
    disconnect = jest.fn()
    unobserve = jest.fn()
  } as any
})

beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  })
})
