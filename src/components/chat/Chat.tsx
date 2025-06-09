"use client"

import { storeMessage } from "@/actions/actions"
import { useMessageStore } from "@/stores/messageStoreProvider"
import { useChat } from "@ai-sdk/react"
import { useCallback, useEffect, useRef } from "react"
import ChatBubble from "./ChatBubble"
import ChatInput from "./ChatInput"

export default function Chat({ chatId }: { chatId: string }) {
  const pendingMessage = useMessageStore((s) => s.pendingMessage)
  const clearPendingMessage = useMessageStore((s) => s.clearPendingMessage)

  const isPendingMessageSent = useRef(false) // need a guard so useEffect is not ran twice in dev environment

  const { messages, sendMessage } = useChat()

  const handleSubmit = useCallback(
    async ({ text, isFirstMessage = false }: { text: string; isFirstMessage?: boolean }) => {
      sendMessage({ text }, { body: { chatId } })
      await storeMessage(chatId, text, isFirstMessage)
    },
    [chatId, sendMessage]
  )

  useEffect(() => {
    if (!pendingMessage || isPendingMessageSent.current) return
    isPendingMessageSent.current = true

    handleSubmit({ text: pendingMessage, isFirstMessage: true })
    clearPendingMessage()
  }, [pendingMessage, handleSubmit, clearPendingMessage])

  return (
    <>
      <div className="w-full max-w-3xl px-6 pt-14 space-y-14">
        {messages.map((message) => (
          <ChatBubble key={message.id} message={message} />
        ))}
      </div>
      <ChatInput onSubmit={(text: string) => handleSubmit({ text })} />
    </>
  )
}
