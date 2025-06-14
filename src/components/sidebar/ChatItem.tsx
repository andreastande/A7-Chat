import { deleteChat as deleteChatFromDb, renameChatTitle as renameChatTitleInDb } from "@/actions/chat"
import { useChatStore } from "@/stores/chatStoreProvider"
import { useSearchStore } from "@/stores/searchStoreProvider"
import { ChatWithCategory } from "@/types/chat"
import { MoreHorizontal, PencilLine, Trash2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { SidebarMenuAction, SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar"
import ConfirmDeleteChatDialog from "./ConfirmDeleteChatDialog"

export default function ChatItem({ chat, currentChatId }: { chat: ChatWithCategory; currentChatId?: string }) {
  const router = useRouter()
  const setSearchTerm = useSearchStore((s) => s.setSearchTerm)
  const optimisticDeleteChat = useChatStore((s) => s.deleteChat)
  const optimisticRenameChatTitle = useChatStore((s) => s.renameChatTitle)

  const formRef = useRef<HTMLFormElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const [menuOpen, setMenuOpen] = useState(false)
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [newTitle, setNewTitle] = useState(chat.title)
  const isActive = currentChatId === chat.chatId

  useEffect(() => {
    if (!isEditingTitle) return

    function handleClickOutside(e: MouseEvent) {
      if (formRef.current && !formRef.current.contains(e.target as Node)) {
        setNewTitle(chat.title)
        setIsEditingTitle(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isEditingTitle, chat.title])

  const handleDeleteChat = () => {
    optimisticDeleteChat(chat.chatId)
    toast.promise(deleteChatFromDb(chat.chatId), {
      loading: "Deleting chat…",
      success: `Chat "${chat.title}" deleted!`,
      error: "Couldn't delete chat.",
      finally: () => {
        if (isActive) {
          router.push("/")
        }
      },
    })
  }

  const submitRename = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsEditingTitle(false)
    if (newTitle.trim() && chat.title !== newTitle.trim()) {
      optimisticRenameChatTitle(chat.chatId, newTitle.trim())
      toast.promise(renameChatTitleInDb(chat.chatId, newTitle.trim()), {
        loading: "Renaming chat…",
        success: `Chat "${chat.title}" renamed to ${newTitle}!`,
        error: "Couldn't rename chat.",
      })
    } else {
      setNewTitle(chat.title)
    }
  }

  const startEditing = () => {
    setIsEditingTitle(true)
    // wait a tick then focus & select
    setTimeout(() => {
      inputRef.current?.focus()
      inputRef.current?.select()
    }, 50)
  }

  return (
    <SidebarMenuItem data-open={menuOpen}>
      <SidebarMenuButton
        asChild
        isActive={isActive}
        className={`group-hover/menu-item:bg-sidebar-accent ${(menuOpen || isEditingTitle) && "bg-sidebar-accent"}`}
      >
        {isEditingTitle ? (
          <div className="w-full">
            <form ref={formRef} onSubmit={submitRename}>
              <input
                ref={inputRef}
                autoFocus
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    setNewTitle(chat.title)
                    setIsEditingTitle(false)
                  }
                }}
                className="outline-none w-full"
              />
            </form>
          </div>
        ) : (
          <Link
            href={`/chat/${chat.chatId}`}
            className="w-full"
            onClick={(e) => {
              if (isActive) {
                e.preventDefault()
              } else {
                setSearchTerm("") // Clear search on navigation
              }
            }}
            onDoubleClick={() => isActive && startEditing()}
          >
            <span title={chat.title} className="w-full truncate whitespace-nowrap">
              {chat.title}
            </span>
          </Link>
        )}
      </SidebarMenuButton>

      <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
        <DropdownMenuTrigger asChild className="cursor-pointer hover:bg-sky-200 dark:hover:bg-zinc-700">
          <SidebarMenuAction showOnHover>
            <MoreHorizontal />
          </SidebarMenuAction>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" align="start" onCloseAutoFocus={(e) => e.preventDefault()}>
          <DropdownMenuItem className="cursor-pointer" onSelect={startEditing}>
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
