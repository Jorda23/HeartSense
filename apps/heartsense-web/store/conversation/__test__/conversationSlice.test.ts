import reducer, { setConversation } from '../conversationSlice'

describe('setConversation reducer', () => {
  it('should set the conversationId and title', () => {
    interface ConversationState {
      conversationId: string | null
      title: string | null
    }

    const initialState: ConversationState = {
      conversationId: null,
      title: null,
    }
    const action = {
      type: setConversation.type,
      payload: {
        conversationId: '123',
        title: 'Test Conversation',
      },
    }
    const expectedState = {
      conversationId: '123',
      title: 'Test Conversation',
    }

    expect(reducer(initialState, action)).toStrictEqual(expectedState)
  })
})
