"use client"

import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar"

export default function ChatPanel() {
  const { open } = useSidebar()
  return (
    <div
      className={`fixed left-4 top-4 z-20 p-1 border ${
        !open ? "bg-sky-100 rounded-lg border-sky-200" : "border-transparent"
      } `}
    >
      <SidebarTrigger className="cursor-pointer hover:bg-sky-200" />
    </div>
  )
}
