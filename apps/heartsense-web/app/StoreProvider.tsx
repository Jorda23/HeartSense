'use client'

import React, { useRef } from 'react'
import { Provider } from 'react-redux'
import store from '../store'
import { makeStore, AppStore } from '../lib/redux/store'

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const storeRef = useRef<AppStore>(store)
  if (!storeRef.current) {
    storeRef.current = makeStore()
  }

  return <Provider store={storeRef.current}>{children}</Provider>
}
