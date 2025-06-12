"use client"

import { generateChatTitle } from "@/actions/chat"
import { storeAssistantMessage, storeUserMessage } from "@/actions/message"
import { useDynamicPadding } from "@/hooks/useDynamicPadding"
import { useGetChatHistoryQuery } from "@/hooks/useGetChatHistoryQuery"
import { useMessageStore } from "@/stores/messageStoreProvider"
import { useChat } from "@ai-sdk/react"
import { UIMessage } from "ai"
import { useCallback, useEffect, useRef } from "react"
import ChatBubble from "./ChatBubble"
import ChatInput from "./ChatInput"

export default function Chat({ chatId, initialMessages }: { chatId: string; initialMessages: UIMessage[] }) {
  const pendingMessage = useMessageStore((s) => s.pendingMessage)
  const clearPendingMessage = useMessageStore((s) => s.clearPendingMessage)

  const { refetch: refetchChatHistory } = useGetChatHistoryQuery()

  const isPendingMessageSent = useRef(false) // need a guard so useEffect is not ran twice in dev environment
  const lastUserMsgRef = useRef<HTMLDivElement>(null)
  const lastAssistantMsgRef = useRef<HTMLDivElement>(null)

  const { status, messages, sendMessage } = useChat({
    messages: initialMessages,
    onFinish: async ({ message }) => {
      await storeAssistantMessage(chatId, message)
    },
  })

  const paddingBottom = useDynamicPadding(messages, status, lastUserMsgRef, lastAssistantMsgRef)

  const handleSubmit = useCallback(
    async (text: string) => {
      sendMessage({ text })
      await storeUserMessage(chatId, text)
    },
    [chatId, sendMessage]
  )

  useEffect(() => {
    if (status === "submitted") {
      lastUserMsgRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }, [status, paddingBottom])

  useEffect(() => {
    if (!pendingMessage || isPendingMessageSent.current) return
    isPendingMessageSent.current = true

    async function processPendingMessage() {
      await handleSubmit(pendingMessage!)
      await generateChatTitle(chatId, pendingMessage!)
      refetchChatHistory()
      clearPendingMessage()
    }

    processPendingMessage()
  }, [chatId, pendingMessage, handleSubmit, refetchChatHistory, clearPendingMessage])

  const lastUserIdx = messages.map((m) => m.role).lastIndexOf("user")
  const lastAssistantIdx = messages.map((m) => m.role).lastIndexOf("assistant")

  const shouldAttachAssistantRef = lastAssistantIdx > lastUserIdx

  return (
    <>
      <div className="w-full max-w-3xl px-6 pt-14 space-y-14" style={{ paddingBottom }}>
        {messages.map((msg, i) => (
          <div
            key={msg.id}
            ref={
              i === lastUserIdx
                ? lastUserMsgRef
                : shouldAttachAssistantRef && i === lastAssistantIdx
                  ? lastAssistantMsgRef
                  : undefined
            }
            className="scroll-mt-14"
          >
            <ChatBubble message={msg} />
          </div>
        ))}
      </div>

      <ChatInput onSubmit={(text: string) => handleSubmit(text)} />
    </>
  )
}
