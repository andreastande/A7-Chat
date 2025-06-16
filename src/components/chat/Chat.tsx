"use client"

import { generateChatTitle } from "@/actions/chat"
import { storeAssistantMessage, storeUserMessage } from "@/actions/message"
import { useDynamicPadding } from "@/hooks/useDynamicPadding"
import { useChatStore } from "@/stores/chatStoreProvider"
import { useMessageStore } from "@/stores/messageStoreProvider"
import { IModel } from "@/types/model"
import { useChat } from "@ai-sdk/react"
import { UIMessage } from "ai"
import { AlertCircle, ChevronDown } from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"
import { Alert, AlertTitle } from "../ui/alert"
import ChatBubble from "./ChatBubble"
import ChatInput from "./ChatInput"

interface ChatProps {
  chatId: string
  initialMessages: UIMessage[]
  initialModel: IModel
  initialPinnedModels: IModel[]
}

export default function Chat({ chatId, initialMessages, initialModel, initialPinnedModels }: ChatProps) {
  const pendingMessage = useMessageStore((s) => s.pendingMessage)
  const clearPendingMessage = useMessageStore((s) => s.clearPendingMessage)
  const optimisticRenameChatTitle = useChatStore((s) => s.renameChatTitle)

  const isPendingMessageSent = useRef(false) // need a guard so useEffect is not ran twice in dev environment
  const containerRef = useRef<HTMLDivElement>(null)
  const lastUserMsgRef = useRef<HTMLDivElement>(null)
  const lastAssistantMsgRef = useRef<HTMLDivElement>(null)

  const [showScrollToBottom, setShowScrollToBottom] = useState(false)

  const { status, messages, sendMessage, stop, error } = useChat({
    messages: initialMessages,
    onFinish: async ({ message }) => {
      await storeAssistantMessage(chatId, message)
    },
  })

  const paddingBottom = useDynamicPadding(messages, status, lastUserMsgRef, lastAssistantMsgRef)

  const handleSubmit = useCallback(
    async (text: string, model: IModel) => {
      sendMessage(
        { text },
        {
          body: {
            model,
          },
        }
      )
      await storeUserMessage(chatId, text)
    },
    [chatId, sendMessage]
  )

  const scrollToBottom = (behavior: ScrollBehavior) => {
    containerRef.current?.scrollIntoView({ behavior, block: "end" })
  }

  useEffect(() => {
    // experimental_resume()
  }, [])

  useEffect(() => {
    const container = document.scrollingElement || document.documentElement

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container
      const distanceFromBottom = scrollHeight - scrollTop - clientHeight

      setShowScrollToBottom(distanceFromBottom > 70)
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const prev = sessionStorage.getItem("lastPath")

    if (prev !== `/chat/${chatId}`) {
      scrollToBottom("instant")
    }

    sessionStorage.setItem("lastPath", `/chat/${chatId}`)
  }, [chatId])

  useEffect(() => {
    if (status === "submitted") {
      lastUserMsgRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }, [status, paddingBottom])

  useEffect(() => {
    if (!pendingMessage || isPendingMessageSent.current) return
    isPendingMessageSent.current = true

    async function processPendingMessage() {
      await handleSubmit(pendingMessage!, initialModel)
      const updatedTitle = await generateChatTitle(chatId, pendingMessage!)
      optimisticRenameChatTitle(chatId, updatedTitle)
      clearPendingMessage()
    }

    processPendingMessage()
  }, [chatId, initialModel, pendingMessage, handleSubmit, optimisticRenameChatTitle, clearPendingMessage])

  const lastUserIdx = messages.map((m) => m.role).lastIndexOf("user")
  const lastAssistantIdx = messages.map((m) => m.role).lastIndexOf("assistant")

  const shouldAttachAssistantRef = lastAssistantIdx > lastUserIdx

  return (
    <>
      <div ref={containerRef} className="w-full max-w-3xl px-6 pt-14 space-y-14" style={{ paddingBottom }}>
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
            {error && i === messages.length - 1 && (
              <Alert variant="destructive" className="w-fit mt-14">
                <AlertCircle className="size-4" />
                <AlertTitle>{error.message}</AlertTitle>
              </Alert>
            )}
          </div>
        ))}
      </div>
      {showScrollToBottom && (
        <div className="fixed bottom-38 z-10">
          <button
            className="rounded-full p-1 bg-sky-200 dark:bg-sky-800 border border-sky-300 dark:border-sky-600 cursor-pointer"
            onClick={() => scrollToBottom("smooth")}
          >
            <ChevronDown className="size-4" />
          </button>
        </div>
      )}
      <ChatInput
        initialModel={initialModel}
        initialPinnedModels={initialPinnedModels}
        status={status}
        stop={stop}
        onSubmit={(text: string, model: IModel) => handleSubmit(text, model)}
      />
    </>
  )
}
