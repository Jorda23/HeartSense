import { getBaseUrl } from '../getBaseUrl'

describe('getBaseUrl', () => {
  const originalWindow = global.window

  afterEach(() => {
    global.window = originalWindow
  })

  it('returns window.location.origin when running in the browser', () => {
    const mockOrigin = 'http://localhost'
    global.window = { location: { origin: mockOrigin } }

    expect(getBaseUrl()).toBe(mockOrigin)
  })

  it('returns localhost when running on the server', () => {
    delete global.window

    expect(getBaseUrl()).toBe('http://localhost:3000')
  })
})
