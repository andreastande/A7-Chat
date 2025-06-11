"use client"

import { createContext, useContext, useRef, type ReactNode } from "react"
import { useStore } from "zustand"
import { ChatStore, createChatStore, initChatStore } from "./chatStore"

export type ChatStoreAPI = ReturnType<typeof createChatStore>

const ChatStoreContext = createContext<ChatStoreAPI | null>(null)

export function ChatStoreProvider({ children }: { children: ReactNode }) {
  const storeRef = useRef<ChatStoreAPI | null>(null)

  if (storeRef.current === null) {
    storeRef.current = createChatStore(initChatStore())
  }

  return <ChatStoreContext.Provider value={storeRef.current}>{children}</ChatStoreContext.Provider>
}

export const useChatStore = <T,>(selector: (store: ChatStore) => T): T => {
  const chatStoreContext = useContext(ChatStoreContext)

  if (!chatStoreContext) {
    throw new Error(`useChatStore must be used within ChatStoreProvider`)
  }

  return useStore(chatStoreContext, selector)
}
