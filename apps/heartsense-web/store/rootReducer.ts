import { combineReducers } from '@reduxjs/toolkit'
import conversationSlice from './conversation/conversationSlice'

const rootReducer = combineReducers({
  conversation: conversationSlice,
})

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer
