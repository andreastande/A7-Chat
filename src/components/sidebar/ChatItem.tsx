import { deleteChat as deleteChatFromDb } from "@/actions/chat"
import { useChatStore } from "@/stores/chatStoreProvider"
import { ChatWithCategory } from "@/types/chat"
import { MoreHorizontal, PencilLine, Trash2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { SidebarMenuAction, SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar"

export default function ChatItem({ chat, currentChatId }: { chat: ChatWithCategory; currentChatId?: string }) {
  const optimisticDeleteChat = useChatStore((s) => s.deleteChat)

  const [menuOpen, setMenuOpen] = useState(false)
  const isActive = currentChatId === chat.chatId

  const handleDeleteChat = async () => {
    await optimisticDeleteChat(chat.chatId)
    await deleteChatFromDb(chat.chatId)
  }

  return (
    <SidebarMenuItem data-open={menuOpen}>
      <SidebarMenuButton
        asChild
        isActive={isActive}
        className={`group-hover/menu-item:bg-sidebar-accent ${menuOpen && "bg-sidebar-accent"}`}
      >
        <Link href={`/chat/${chat.chatId}`}>{chat.title}</Link>
      </SidebarMenuButton>

      <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
        <DropdownMenuTrigger asChild className="cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-700">
          <SidebarMenuAction showOnHover>
            <MoreHorizontal />
          </SidebarMenuAction>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" align="start">
          <DropdownMenuItem className="cursor-pointer">
            <PencilLine className="text-black dark:text-white" />
            <span>Rename</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer" onClick={handleDeleteChat}>
            <Trash2 color="red" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  )
}
