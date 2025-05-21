import * as React from 'react'
import { render, screen } from '@/test-utils'

import { Button } from '../Button'

const renderButton = (props = {}) =>
  render(<Button {...props}>Click me</Button>)

describe('button Component', () => {
  it('renders correctly with default props', () => {
    renderButton()
    const button = screen.getByRole('button', { name: /click me/i })
    expect(button).toBeInTheDocument()
  })
})
