"use client"

import { useSearchStore } from "@/stores/searchStoreProvider"
import { Search } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { SidebarHeader } from "../ui/sidebar"

export default function AppSidebarHeader() {
  const pathname = usePathname()
  const searchTerm = useSearchStore((s) => s.searchTerm)
  const setSearchTerm = useSearchStore((s) => s.setSearchTerm)

  return (
    <SidebarHeader className="h-36 border-b px-5 pt-2 pb-0 items-center border-sky-200 dark:border-zinc-500">
      <Link href="/" className="w-full mt-15" onClick={(e) => pathname === "/" && e.preventDefault()}>
        <button
          className="font-semibold bg-sky-500 dark:bg-sky-700 border border-sky-400 dark:border-sky-600 rounded-md py-1 w-full cursor-pointer text-white"
          onClick={() => pathname !== "/" && setSearchTerm("")}
        >
          New Chat
        </button>
      </Link>
      <div className="flex items-center gap-2 mt-2 w-full">
        <Search className="size-4" />
        <input
          placeholder="Search your chats..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="text-sm w-full outline-none"
        />
      </div>
    </SidebarHeader>
  )
}
