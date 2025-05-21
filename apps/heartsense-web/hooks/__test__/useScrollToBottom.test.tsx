import { useEffect } from 'react'
import { render, screen, act } from '@testing-library/react'
import { useScrollToBottom } from '../useScrollToBottom'

window.HTMLElement.prototype.scrollIntoView = jest.fn()

const TestComponent = () => {
  const [containerRef, endRef] = useScrollToBottom<HTMLDivElement>()

  useEffect(() => {
    setTimeout(() => {
      const container = containerRef.current
      if (container) {
        const newElement = document.createElement('div')
        newElement.textContent = 'New Element'
        container.appendChild(newElement)
      }
    }, 500)
  }, [])

  return (
    <div
      ref={containerRef}
      data-testid="container"
      style={{ height: '200px', overflowY: 'auto' }}
    >
      <div>Initial Content</div>
      <div ref={endRef} data-testid="end" />
    </div>
  )
}

describe('useScrollToBottom', () => {
  it('should scroll to bottom when content updates', async () => {
    render(<TestComponent />)

    const endElement = await screen.findByTestId('end')
    expect(endElement).toBeInTheDocument()

    const scrollSpy = jest.spyOn(endElement, 'scrollIntoView')

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000))
    })

    expect(scrollSpy).toHaveBeenCalledWith({
      behavior: 'instant',
      block: 'end',
    })
  })
})
