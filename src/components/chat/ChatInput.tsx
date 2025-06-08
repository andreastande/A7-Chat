"use client"

import { useMessageStore } from "@/stores/messageStoreProvider"
import { ArrowUp, ChevronDown, Paperclip } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import TextareaAutosize from "react-textarea-autosize"

type ChatInputProps = {
  onSubmit?: (text: string) => void
}

export default function ChatInput({ onSubmit }: ChatInputProps) {
  const router = useRouter()
  const pathname = usePathname()

  const draftMessage = useMessageStore((s) => s.draftMessage)
  const setDraftMessage = useMessageStore((s) => s.setDraftMessage)
  const clearDraftMessage = useMessageStore((s) => s.clearDraftMessage)
  const setPendingMessage = useMessageStore((s) => s.setPendingMessage)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const msg = draftMessage.trim()
    if (!msg) return

    clearDraftMessage()
    onSubmit?.(msg)

    if (pathname === "/") {
      setPendingMessage(msg)
      const newChatId = crypto.randomUUID()
      router.push(`/chat/${newChatId}`)
    }
  }

  return (
    <div className="fixed bottom-0 pb-6 bg-white w-full max-w-[calc(var(--container-3xl)-48px)]">
      <form
        onSubmit={handleSubmit}
        className="-translate-y-2 px-4 py-2 rounded-2xl shadow-xl bg-sky-50 border border-sky-200"
      >
        <TextareaAutosize
          autoFocus
          value={draftMessage}
          onChange={(e) => setDraftMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              if (draftMessage.trim()) {
                handleSubmit(e)
              }
            }
          }}
          minRows={2}
          maxRows={10}
          placeholder="Type your message here…"
          className="w-full resize-none whitespace-break-spaces focus:outline-none"
        />
        <div className="mt-2 flex items-center justify-between">
          <button
            type="button"
            className="flex items-center cursor-pointer gap-2 rounded-lg p-2 hover:bg-sky-150 -translate-x-1.5"
          >
            <span className="text-sm">4.1 Nano</span>
            <ChevronDown className="size-4" />
          </button>
          <div className="flex items-center gap-2">
            <button type="button" className="cursor-pointer rounded-lg p-2.5 hover:bg-sky-150">
              <Paperclip className="size-4" />
            </button>
            <button
              type="submit"
              disabled={!draftMessage.trim()}
              className="cursor-pointer bg-sky-400 rounded-lg p-2 text-white disabled:bg-sky-150 disabled:cursor-not-allowed"
            >
              <ArrowUp className="size-5" />
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
