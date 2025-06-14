import { Sidebar, SidebarFooter, SidebarRail } from "@/components/ui/sidebar"
import { db } from "@/db"
import { chat } from "@/db/schema"
import { verifySession } from "@/lib/dal"
import { Chat } from "@/types/chat"
import { desc, eq } from "drizzle-orm"
import AppSidebarContent from "./AppSidebarContent"
import AppSidebarHeader from "./AppSidebarHeader"

export async function AppSidebar({ chatId }: { chatId?: string }) {
  const { userId } = await verifySession()

  const initialChats: Chat[] = await db
    .select({
      chatId: chat.chatId,
      title: chat.title,
      updatedAt: chat.updatedAt,
      usesDefaultTitle: chat.usesDefaultTitle,
    })
    .from(chat)
    .where(eq(chat.userId, userId))
    .orderBy(desc(chat.updatedAt))

  return (
    <Sidebar>
      <AppSidebarHeader />
      <AppSidebarContent currentChatId={chatId} initialChats={initialChats} />
      <SidebarFooter className="h-30 border-t border-sky-200 dark:border-zinc-500" />
      <SidebarRail />
    </Sidebar>
  )
}
