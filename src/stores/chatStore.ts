import { Chat } from "@/types/chat"
import { createStore } from "zustand"

export type ChatState = {
  chats: Chat[]
}

export type ChatActions = {
  setChats: (chats: Chat[]) => void
  deleteChat: (chatId: string) => void
  addChat: (chatId: string, title: string) => void
  renameChat: (chatId: string, title: string) => void
}

export type ChatStore = ChatState & ChatActions

export const initChatStore = (): ChatState => {
  return { chats: [] }
}

const defaultInitState: ChatState = {
  chats: [],
}

export const createChatStore = (initState: ChatState = defaultInitState) => {
  return createStore<ChatStore>()((set, get) => ({
    ...initState,
    setChats: (chats) => set({ chats }),
    deleteChat: (chatId) =>
      set({
        chats: get().chats.filter((c) => c.chatId !== chatId),
      }),
    addChat: (chatId, title) =>
      set({
        chats: [{ chatId, title, updatedAt: new Date() }, ...get().chats],
      }),
    renameChat: (chatId, title) =>
      set({
        chats: get().chats.map((c) => (c.chatId === chatId ? { ...c, title, updatedAt: new Date() } : c)),
      }),
  }))
}
