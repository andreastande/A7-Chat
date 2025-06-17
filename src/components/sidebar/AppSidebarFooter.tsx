"use client"

import { authClient } from "@/lib/auth-client"
import { cn } from "@/lib/utils"
import { CircleUser } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog"
import { Button, buttonVariants } from "../ui/button"
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
  const router = useRouter()

  const handleDeleteAccount = async () => {
    await authClient.deleteUser()
    router.push("/login")
  }

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
            pls, <strong className="underline">$5</strong> budget per provider)
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="mt-8">
                  Delete Account
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your account and remove your data from
                    our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className={cn(buttonVariants({ variant: "destructive" }), "cursor-pointer")}
                    onClick={handleDeleteAccount}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </SidebarFooter>
  )
}
