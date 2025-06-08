import { persist } from "zustand/middleware"
import { createStore } from "zustand/vanilla"

export type MessageState = {
  draftMessage: string
  pendingMessage: string | null
}

export type MessageActions = {
  setDraftMessage: (msg: string) => void
  clearDraftMessage: () => void
  setPendingMessage: (msg: string) => void
  clearPendingMessage: () => void
}

export type MessageStore = MessageState & MessageActions

const defaultInitState: MessageState = {
  draftMessage: "",
  pendingMessage: null,
}

export const createMessageStore = (initState: MessageState = defaultInitState) => {
  return createStore<MessageStore>()(
    persist(
      (set) => ({
        ...initState,
        setDraftMessage: (msg) => set({ draftMessage: msg }),
        clearDraftMessage: () => set({ draftMessage: "" }),
        setPendingMessage: (msg) => set({ pendingMessage: msg }),
        clearPendingMessage: () => set({ pendingMessage: null }),
      }),
      {
        name: "draft-message",
        partialize: (state) => ({ draftMessage: state.draftMessage }),
      }
    )
  )
}
