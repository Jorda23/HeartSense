import { render, screen } from '@testing-library/react'
import React from 'react'
import { Markdown, CodeBlock } from '../Markdown'

jest.mock('remark-gfm', () => jest.fn())

describe('Markdown Component', () => {
  it('renders Markdown content properly', () => {
    const markdownContent = '# Hello World'
    render(<Markdown>{markdownContent}</Markdown>)
    expect(screen.getByTestId('react-markdown')).toHaveTextContent(
      'Hello World'
    )
  })

  it('renders bold text properly', () => {
    const markdownContent = '**Bold Text**'
    render(<Markdown>{markdownContent}</Markdown>)
    expect(screen.getByTestId('react-markdown')).toHaveTextContent('Bold Text')
  })

  it('renders italic text properly', () => {
    const markdownContent = '*Italic Text*'
    render(<Markdown>{markdownContent}</Markdown>)
    expect(screen.getByTestId('react-markdown')).toHaveTextContent(
      'Italic Text'
    )
  })

  it('renders blockquotes correctly', () => {
    const markdownContent = '> This is a quote'
    render(<Markdown>{markdownContent}</Markdown>)
    expect(screen.getByTestId('react-markdown')).toHaveTextContent(
      'This is a quote'
    )
  })

  it('renders links correctly', () => {
    const markdownContent = '[Google](https://www.google.com)'
    render(<Markdown>{markdownContent}</Markdown>)
    expect(screen.getByTestId('react-markdown')).toHaveTextContent('Google')
  })

  it('renders lists properly', () => {
    const markdownContent = '- Item 1\n- Item 2\n- Item 3'
    render(<Markdown>{markdownContent}</Markdown>)
    expect(screen.getByTestId('react-markdown')).toHaveTextContent('Item 1')
    expect(screen.getByTestId('react-markdown')).toHaveTextContent('Item 2')
    expect(screen.getByTestId('react-markdown')).toHaveTextContent('Item 3')
  })

  it('renders code blocks correctly', () => {
    const markdownContent = '```js\nconsole.log("Hello World")\n```'
    render(<Markdown>{markdownContent}</Markdown>)
    expect(screen.getByTestId('react-markdown')).toHaveTextContent(
      'console.log("Hello World")'
    )
  })

  it('renders headings correctly', () => {
    const markdownContent = '# Heading 1\n## Heading 2\n### Heading 3'
    render(<Markdown>{markdownContent}</Markdown>)
    expect(screen.getByTestId('react-markdown')).toHaveTextContent('Heading 1')
    expect(screen.getByTestId('react-markdown')).toHaveTextContent('Heading 2')
    expect(screen.getByTestId('react-markdown')).toHaveTextContent('Heading 3')
  })
})

describe('CodeBlock Component', () => {
  it('renders inline code properly', () => {
    render(
      <CodeBlock inline={true} className="test-class" node={null}>
        Inline Code
      </CodeBlock>
    )
    expect(screen.getByText('Inline Code')).toBeInTheDocument()
  })

  it('renders code block properly', () => {
    render(
      <CodeBlock inline={false} className="test-class" node={null}>
        Code Block Content
      </CodeBlock>
    )
    expect(screen.getByText('Code Block Content')).toBeInTheDocument()
  })
})
