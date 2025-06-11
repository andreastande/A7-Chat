"use client"

import { useChatStore } from "@/stores/chatStoreProvider"
import { Chat } from "@/types/chat"
import Link from "next/link"
import { useEffect } from "react"
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar"

export default function AppSidebarContent({ initialChats }: { initialChats: Chat[] }) {
  const setChats = useChatStore((s) => s.setChats)
  const chats = useChatStore((s) => s.chats)

  useEffect(() => {
    setChats(initialChats)
  }, [initialChats, setChats])

  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            {chats.map((chat) => (
              <SidebarMenuItem key={chat.chatId}>
                <SidebarMenuButton asChild>
                  <Link href={`/chat/${chat.chatId}`}>{chat.title}</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  )
}
