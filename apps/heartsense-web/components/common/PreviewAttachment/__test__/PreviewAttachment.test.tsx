import { render, screen } from '@testing-library/react'
import { PreviewAttachment } from '../PreviewAttachment'
import '@testing-library/jest-dom'

jest.mock('../../../../public/Icons', () => ({
  LoaderIcon: jest.fn(() => <svg data-testid="loader-icon" />),
}))

describe('PreviewAttachment Component', () => {
  const mockAttachment = {
    name: 'example.jpg',
    url: 'https://example.com/example.jpg',
    contentType: 'image/jpeg',
  }

  it('renders a file preview when content type is not an image', () => {
    render(
      <PreviewAttachment
        attachment={{ ...mockAttachment, contentType: 'application/pdf' }}
      />
    )

    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })

  it('shows a loader icon when uploading', () => {
    render(<PreviewAttachment attachment={mockAttachment} isUploading />)
    expect(screen.getByTestId('input-attachment-loader')).toBeInTheDocument()
  })

  it('displays the attachment name', () => {
    render(<PreviewAttachment attachment={mockAttachment} />)
    expect(screen.getByText('example.jpg')).toBeInTheDocument()
  })
})
