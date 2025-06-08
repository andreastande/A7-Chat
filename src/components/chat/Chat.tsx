"use client"

import { useMessageStore } from "@/stores/messageStore"
import { useChat } from "@ai-sdk/react"
import { useEffect, useRef } from "react"
import ChatBubble from "./ChatBubble"
import ChatInput from "./ChatInput"

export default function Chat({ chatId }: { chatId: string }) {
  const pendingMessage = useMessageStore((s) => s.pendingMessage)
  const clearPendingMessage = useMessageStore((s) => s.clearPendingMessage)

  const { messages, sendMessage: sendChatMessage } = useChat()

  const isFirstMessageSent = useRef(false) // need a guard so useEffect is not ran twice in dev environment

  useEffect(() => {
    if (!pendingMessage || isFirstMessageSent.current) return
    isFirstMessageSent.current = true

    sendChatMessage({ text: pendingMessage })
    clearPendingMessage()
  }, [pendingMessage, sendChatMessage, clearPendingMessage])

  console.log(chatId)

  return (
    <div className="w-full max-w-3xl px-6 pt-14 space-y-14">
      {messages.map((message) => (
        <ChatBubble key={message.id} message={message} />
      ))}
      <ChatInput onSubmit={(text: string) => sendChatMessage({ text })} />
    </div>
  )
}
