import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type ConversationState = {
  conversationId: string | null
  title: string | null
}

export const initialState: ConversationState = {
  conversationId: null,
  title: null,
}

const conversationSlice = createSlice({
  name: 'conversation',
  initialState,
  reducers: {
    setConversation: (
      state,
      action: PayloadAction<{ conversationId: string; title: string }>
    ) => {
      state.conversationId = action.payload.conversationId
      state.title = action.payload.title
    },
  },
})

export const { setConversation } = conversationSlice.actions
export default conversationSlice.reducer
