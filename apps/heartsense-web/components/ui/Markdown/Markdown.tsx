import React, { memo } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

import { MarkdownComponents } from '../../../styles/theme'

const remarkPlugins = [remarkGfm]

const NonMemoizedMarkdown = ({ children }: { children: string }) => (
  <ReactMarkdown remarkPlugins={remarkPlugins} components={MarkdownComponents}>
    {children}
  </ReactMarkdown>
)

export const Markdown = memo(
  NonMemoizedMarkdown,
  (prevProps, nextProps) => prevProps.children === nextProps.children
)
