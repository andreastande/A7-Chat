"use client"

import { storeAssistantMessage, storeUserMessage } from "@/actions/message"
import { useMessageStore } from "@/stores/messageStoreProvider"
import { useChat } from "@ai-sdk/react"
import { UIMessage } from "ai"
import { useCallback, useEffect, useRef } from "react"
import ChatBubble from "./ChatBubble"
import ChatInput from "./ChatInput"

export default function Chat({ chatId, initialMessages }: { chatId: string; initialMessages: UIMessage[] }) {
  const pendingMessage = useMessageStore((s) => s.pendingMessage)
  const clearPendingMessage = useMessageStore((s) => s.clearPendingMessage)

  const isPendingMessageSent = useRef(false) // need a guard so useEffect is not ran twice in dev environment

  const { messages, sendMessage } = useChat({
    messages: initialMessages,
    onFinish: async ({ message }) => {
      await storeAssistantMessage(chatId, message) // try-catch?
    },
  })

  const handleSubmit = useCallback(
    async (text: string) => {
      sendMessage({ text })
      await storeUserMessage(chatId, text) // try-catch?
    },
    [chatId, sendMessage]
  )

  useEffect(() => {
    if (!pendingMessage || isPendingMessageSent.current) return
    isPendingMessageSent.current = true

    handleSubmit(pendingMessage)
    clearPendingMessage()
  }, [pendingMessage, handleSubmit, clearPendingMessage])

  return (
    <>
      <div className="w-full max-w-3xl px-6 pt-14 space-y-14">
        {messages.map((message) => (
          <ChatBubble key={message.id} message={message} />
        ))}
      </div>
      <ChatInput onSubmit={(text: string) => handleSubmit(text)} />
    </>
  )
}
