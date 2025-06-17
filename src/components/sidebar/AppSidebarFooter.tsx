"use client"

import { CircleUser } from "lucide-react"
import Image from "next/image"
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "../ui/dialog"
import { SidebarFooter } from "../ui/sidebar"

interface AppSidebarFooterProps {
  user: {
    id: string
    name: string
    email: string
    image: string | null
  }
}

export default function AppSidebarFooter({ user }: AppSidebarFooterProps) {
  return (
    <SidebarFooter className="h-20 border-t border-sky-200 dark:border-zinc-500 px-5">
      <Dialog>
        <DialogTrigger>
          <div className="flex items-center gap-4 p-3 cursor-pointer hover:bg-sky-100 dark:hover:bg-sidebar-accent rounded-md">
            {user.image ? (
              <div className="relative size-8">
                <Image src={user.image} alt="Avatar" fill className="rounded-full ring ring-sky-400" />
              </div>
            ) : (
              <CircleUser className="size-8 text-sky-600" />
            )}
            <span className="font-medium">{user.name}</span>
          </div>
        </DialogTrigger>
        <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
          <DialogTitle>Account settings</DialogTitle>
          <DialogDescription>
            This was heavily downprioritized, so nothing to find here... but enjoy free inference costs! :D (be nice
            pls)
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </SidebarFooter>
  )
}
