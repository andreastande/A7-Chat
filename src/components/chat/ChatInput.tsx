"use client"

import { createChatPlaceholder } from "@/actions/chat"
import { useMessageStore } from "@/stores/messageStoreProvider"
import { IModel } from "@/types/model"
import { UseChatHelpers } from "@ai-sdk/react"
import { UIMessage } from "ai"
import { ArrowUp, ChevronDown, Paperclip, Square } from "lucide-react"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import TextareaAutosize from "react-textarea-autosize"
import ModelPicker from "./modelpicker/ModelPicker"

type ChatInputProps = {
  initialModel: IModel
  initialPinnedModels: IModel[]
  status?: UseChatHelpers<UIMessage>["status"]
  stop?: UseChatHelpers<UIMessage>["stop"]
  onSubmit?: (text: string, model: IModel) => void
}

export default function ChatInput({ initialModel, initialPinnedModels, status, stop, onSubmit }: ChatInputProps) {
  const router = useRouter()
  const pathname = usePathname()

  const draftMessage = useMessageStore((s) => s.draftMessage)
  const setDraftMessage = useMessageStore((s) => s.setDraftMessage)
  const clearDraftMessage = useMessageStore((s) => s.clearDraftMessage)
  const setPendingMessage = useMessageStore((s) => s.setPendingMessage)

  const [selectedModel, setSelectedModel] = useState<IModel>(initialModel)
  const [isMsgStreaming, setIsMsgStreaming] = useState(false)

  useEffect(() => {
    setIsMsgStreaming(status === "submitted" || status === "streaming")
  }, [status])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const msg = draftMessage.trim()
    if (!msg) return

    clearDraftMessage()
    onSubmit?.(msg, selectedModel)

    if (pathname === "/") {
      setIsMsgStreaming(true)
      setPendingMessage(msg)

      const chatId = crypto.randomUUID()
      await createChatPlaceholder(chatId, selectedModel.name) // Insert placeholder "New chat". Generating title takes a long time, can do this after navigation
      router.push(`/chat/${chatId}`)
    }
  }

  return (
    <div className="fixed bottom-0 pb-6 px-6 bg-background w-full max-w-3xl">
      <form
        onSubmit={handleSubmit}
        className="-translate-y-2 px-4 py-2 rounded-2xl shadow-xl bg-sky-50 dark:bg-secondary border border-sky-200 dark:border-sky-900"
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
          <ModelPicker
            initialPinnedModels={initialPinnedModels}
            selectedModel={selectedModel}
            setSelectedModel={(model: IModel) => setSelectedModel(model)}
          >
            <div className="relative size-4">
              <Image
                src={`/images/${selectedModel.provider.toLowerCase()}/logo_dark-blue.png`}
                alt="Provider logo"
                fill
              />
            </div>
            <span className="text-sm">{selectedModel.name}</span>
            <ChevronDown className="size-4" />
          </ModelPicker>

          <div className="flex items-center gap-2">
            <button type="button" className="cursor-pointer rounded-lg p-2.5 hover:bg-sky-150 dark:hover:bg-zinc-700">
              <Paperclip className="size-4" />
            </button>
            {isMsgStreaming ? (
              <button
                type="button"
                className="cursor-pointer bg-sky-500 dark:bg-sky-700 rounded-lg p-2 text-white"
                onClick={stop}
              >
                <Square className="size-5" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={!draftMessage.trim()}
                className="cursor-pointer bg-sky-500 dark:bg-sky-700 rounded-lg p-2 text-white disabled:bg-sky-150 dark:disabled:bg-[#043d5d] dark:disabled:text-gray-600 disabled:cursor-not-allowed"
              >
                <ArrowUp className="size-5" />
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  )
}
