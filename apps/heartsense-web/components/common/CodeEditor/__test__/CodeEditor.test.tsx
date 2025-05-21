import React from 'react'
import { render, screen } from '@testing-library/react'
import { areEqual, CodeEditor } from '../CodeEditor'

describe('CodeEditor Component', () => {
  let onSaveContentMock: jest.Mock

  beforeEach(() => {
    onSaveContentMock = jest.fn()
  })

  test('renders the component without crashing', () => {
    render(
      <CodeEditor
        content="print('Hello, World!')"
        onSaveContent={onSaveContentMock}
        status="idle"
      />
    )
    const editorContainer = screen.getByTestId('code-editor')
    expect(editorContainer).toBeInTheDocument()
  })
})

describe('CodeEditor Component - Memoization Logic', () => {
  it('should return false if status is "streaming" in both prevProps and nextProps', () => {
    expect(
      areEqual(
        { content: 'a', status: 'streaming', onSaveContent: jest.fn() },
        { content: 'a', status: 'streaming', onSaveContent: jest.fn() }
      )
    ).toBe(false)
  })

  it('should return false if content has changed', () => {
    expect(
      areEqual(
        { content: 'a', status: 'idle', onSaveContent: jest.fn() },
        { content: 'b', status: 'idle', onSaveContent: jest.fn() }
      )
    ).toBe(false)
  })

  it('should return true if content and status are unchanged', () => {
    expect(
      areEqual(
        { content: 'a', status: 'idle', onSaveContent: jest.fn() },
        { content: 'a', status: 'idle', onSaveContent: jest.fn() }
      )
    ).toBe(true)
  })
})
