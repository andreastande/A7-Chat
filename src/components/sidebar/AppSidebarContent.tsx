"use client"

import { categorizeChats } from "@/lib/chatCategorizer"
import { useChatStore } from "@/stores/chatStoreProvider"
import { useSearchStore } from "@/stores/searchStoreProvider"
import { Chat } from "@/types/chat"
import { useEffect } from "react"
import { SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu } from "../ui/sidebar"
import ChatItem from "./ChatItem"

export default function AppSidebarContent({
  currentChatId,
  initialChats,
}: {
  currentChatId: string | undefined
  initialChats: Chat[]
}) {
  const setChats = useChatStore((s) => s.setChats)
  const chats = useChatStore((s) => s.chats)
  const searchTerm = useSearchStore((s) => s.searchTerm)

  useEffect(() => {
    setChats(initialChats ?? [])
  }, [initialChats, setChats])

  const effectiveChats = chats.length > 0 ? chats : initialChats

  const filteredChats = effectiveChats
    .filter((chat) => chat.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((chat) => !chat.usesDefaultTitle)

  const { chatsWithCategory, categories } = categorizeChats(filteredChats)

  return (
    <SidebarContent>
      {categories.map((category) => (
        <SidebarGroup key={category} className="px-5">
          <SidebarGroupLabel className="px-0 text-sky-600">{category}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {chatsWithCategory
                .filter((chat) => chat.category === category)
                .filter((chat) => chat.title.toLowerCase().includes(searchTerm.toLowerCase()))
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
