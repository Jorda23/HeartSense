import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { render, RenderOptions, RenderResult } from '@testing-library/react'
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles'
import { theme } from './styles'

const queryClient = new QueryClient()

export const AllTheProviders = ({
  children,
}: {
  children: React.ReactNode
}) => (
  <QueryClientProvider client={queryClient}>
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </StyledEngineProvider>
  </QueryClientProvider>
)

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'queries'>
): RenderResult => render(ui, { wrapper: AllTheProviders, ...options })

export * from '@testing-library/react'

export { customRender as render, AllTheProviders as wrapper }
