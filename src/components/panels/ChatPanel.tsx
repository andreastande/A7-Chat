"use client"

import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar"
import { Plus } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "../ui/button"

export default function ChatPanel() {
  const pathname = usePathname()
  const router = useRouter()

  const { open } = useSidebar()

  return (
    <div
      className={`
        fixed left-4 top-4 z-20 p-1 border flex space-x-1
        ${!open ? "bg-sky-100 rounded-lg border-sky-200" : "border-transparent"}
      `}
    >
      <SidebarTrigger className="cursor-pointer hover:bg-sky-200" />
      {!open &&
        (pathname !== "/" ? (
          <Button
            variant="ghost"
            size="icon"
            className="cursor-pointer hover:bg-sky-200"
            onClick={() => router.push("/")}
          >
            <Plus className="cursor-pointer size-5" />
          </Button>
        ) : (
          <div className="p-2">
            <Plus className="size-5" color="#b0b7c3" />
          </div>
        ))}
    </div>
  )
}
