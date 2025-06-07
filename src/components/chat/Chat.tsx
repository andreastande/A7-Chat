"use client"

import { useChat } from "@ai-sdk/react"
import ChatBubble from "./ChatBubble"
import ChatInput from "./ChatInput"

export default function Chat() {
  const { messages, sendMessage } = useChat()

  return (
    <div className="w-full max-w-3xl px-6 pt-14 space-y-14">
      {messages.map((message) => (
        <ChatBubble key={message.id} message={message} />
      ))}
      <ChatInput onSubmit={(text: string) => sendMessage({ text })} />
    </div>
  )
}
