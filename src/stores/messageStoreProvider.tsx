"use client"

import { createMessageStore, type MessageStore } from "@/stores/messageStore"
import { createContext, useContext, useRef, type ReactNode } from "react"
import { useStore } from "zustand"

export type MessageStoreApi = ReturnType<typeof createMessageStore>

const MessageStoreContext = createContext<MessageStoreApi | null>(null)

export function MessageStoreProvider({ children }: { children: ReactNode }) {
  const storeRef = useRef<MessageStoreApi | null>(null)

  if (!storeRef.current) {
    storeRef.current = createMessageStore()
  }

  return <MessageStoreContext.Provider value={storeRef.current}>{children}</MessageStoreContext.Provider>
}

export function useMessageStore<T>(selector: (state: MessageStore) => T): T {
  const store = useContext(MessageStoreContext)

  if (!store) {
    throw new Error("useMessageStore must be used within MessageStoreProvider")
  }

  return useStore(store, selector)
}
