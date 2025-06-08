import { create } from "zustand"
import { persist } from "zustand/middleware"

type MessageStore = {
  draftMessage: string
  pendingMessage: string | null
  setDraftMessage: (msg: string) => void
  clearDraftMessage: () => void
  setPendingMessage: (msg: string) => void
  clearPendingMessage: () => void
}

export const useMessageStore = create<MessageStore>()(
  persist(
    (set) => ({
      draftMessage: "",
      pendingMessage: null,
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
