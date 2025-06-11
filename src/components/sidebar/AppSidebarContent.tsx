"use client"

import { categorizeChats } from "@/lib/chatCategorizer"
import { useChatStore } from "@/stores/chatStoreProvider"
import { Chat } from "@/types/chat"
import { useEffect } from "react"
import { SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu } from "../ui/sidebar"
import ChatItem from "./ChatItem"

export default function AppSidebarContent({
  initialChats,
  currentChatId,
}: {
  initialChats: Chat[]
  currentChatId: string | undefined
}) {
  const setChats = useChatStore((s) => s.setChats)
  const chats = useChatStore((s) => s.chats)

  useEffect(() => {
    setChats(initialChats)
  }, [initialChats, setChats])

  const { chatsWithCategory, categories } = categorizeChats(chats)

  return (
    <SidebarContent>
      {categories.map((category) => (
        <SidebarGroup key={category}>
          <SidebarGroupLabel>{category}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {chatsWithCategory
                .filter((chat) => chat.category === category)
                .map((chat) => (
                  <ChatItem
                    key={`${chat.category}-${chat.title}-${chat.updatedAt}`}
                    chat={chat}
                    currentChatId={currentChatId}
                  />
                ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </SidebarContent>
  )
}
