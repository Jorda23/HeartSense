import { render, screen } from '@testing-library/react'
import { ImageEditor } from '../ImageEditor'

describe('ImageEditor Component', () => {
  const baseProps = {
    title: 'Sample Image',
    content: 'mockBase64String',
    isCurrentVersion: true,
    currentVersionIndex: 0,
    status: 'idle',
    isInline: false,
  }

  test('renders loading state when status is "streaming"', () => {
    render(<ImageEditor {...baseProps} status="streaming" />)

    expect(screen.getByText('Generating Image...')).toBeInTheDocument()
    expect(screen.queryByRole('img')).toBeNull()
  })

  test('renders image when status is not "streaming"', () => {
    render(<ImageEditor {...baseProps} status="idle" />)

    const imgElement = screen.getByRole('img', { name: /sample image/i })
    expect(imgElement).toBeInTheDocument()
    expect(imgElement).toHaveAttribute(
      'src',
      expect.stringContaining('data:image/png;base64,')
    )
  })
})
