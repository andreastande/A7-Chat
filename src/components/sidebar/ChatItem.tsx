import { deleteChat as deleteChatFromDb } from "@/actions/chat"
import { useChatStore } from "@/stores/chatStoreProvider"
import { ChatWithCategory } from "@/types/chat"
import { MoreHorizontal, PencilLine, Trash2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { SidebarMenuAction, SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar"
import ConfirmDeleteChatDialog from "./ConfirmDeleteChatDialog"

export default function ChatItem({ chat, currentChatId }: { chat: ChatWithCategory; currentChatId?: string }) {
  const router = useRouter()
  const optimisticDeleteChat = useChatStore((s) => s.deleteChat)

  const [menuOpen, setMenuOpen] = useState(false)
  const isActive = currentChatId === chat.chatId

  const handleDeleteChat = () => {
    optimisticDeleteChat(chat.chatId)
    toast.promise(deleteChatFromDb(chat.chatId), {
      loading: "Deleting chat…",
      success: `Chat "${chat.title}" deleted!`,
      error: "Couldn't delete chat.",
    })
    if (isActive) {
      router.push("/")
    }
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

          <ConfirmDeleteChatDialog
            chatTitle={chat.title}
            onDelete={handleDeleteChat}
            onClose={() => setMenuOpen(false)}
          >
            <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="cursor-pointer">
              <Trash2 color="red" /> Delete
            </DropdownMenuItem>
          </ConfirmDeleteChatDialog>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  )
}
