'use client'

import React, { memo, useRef } from 'react'

type EditorProps = {
  content: string
  onSaveContent?: (updatedContent: string, debounce: boolean) => void
  status: 'streaming' | 'idle'
}

function PureCodeEditor({ content, onSaveContent, status }: EditorProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <div
      data-testid="code-editor"
      className="relative not-prose w-full pb-[calc(80dvh)] text-sm"
      ref={containerRef}
    />
  )
}

export function areEqual(prevProps: EditorProps, nextProps: EditorProps) {
  if (prevProps.status === 'streaming' && nextProps.status === 'streaming')
    return false
  if (prevProps.content !== nextProps.content) return false

  return true
}

export const CodeEditor = memo(PureCodeEditor, areEqual)
