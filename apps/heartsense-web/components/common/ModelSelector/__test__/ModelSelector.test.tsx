import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { chatModels } from '@/lib/ai/models'

import { ModelSelector } from '../ModelSelector'
import * as actions from '@/app/(chat)/actions'

jest.mock('@/app/(chat)/actions', () => ({
  saveChatModelAsCookie: jest.fn(),
}))

jest.mock('../../../../public/Icons', () => ({
  ChevronDownIcon: () => <span data-testid="chevron-icon" />,
  CheckCircleFillIcon: () => <span data-testid="check-icon" />,
}))

jest
  .spyOn(actions, 'saveChatModelAsCookie')
  .mockImplementation(() => Promise.resolve())

describe('ModelSelector', () => {
  const selectedModelId = chatModels[0].id

  test('renders the selected model name and opens menu on click', async () => {
    render(<ModelSelector selectedModelId={selectedModelId} />)

    expect(screen.getByText(chatModels[0].name)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button'))

    await waitFor(() => {
      expect(screen.getByText(chatModels[1].description)).toBeInTheDocument()
    })

    chatModels.forEach((model) => {
      expect(screen.getAllByText(model.name).length).toBeGreaterThan(0)
    })
  })

  test('selects a different model and calls saveChatModelAsCookie', async () => {
    render(<ModelSelector selectedModelId={selectedModelId} />)

    fireEvent.click(screen.getByRole('button'))

    const secondModel = chatModels[1]
    const secondModelItem = screen.getByText(secondModel.name)

    fireEvent.click(secondModelItem)

    await waitFor(() => {
      expect(actions.saveChatModelAsCookie).toHaveBeenCalledWith(secondModel.id)
    })
  })

  test('displays check icon for selected model', async () => {
    render(<ModelSelector selectedModelId={selectedModelId} />)

    fireEvent.click(screen.getByRole('button'))

    await waitFor(() => {
      expect(screen.getByTestId('check-icon')).toBeInTheDocument()
    })
  })
})
