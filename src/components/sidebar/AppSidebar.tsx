import { Sidebar, SidebarFooter, SidebarHeader } from "@/components/ui/sidebar"
import { db } from "@/db"
import { chat } from "@/db/schema"
import { verifySession } from "@/lib/dal"
import { Chat } from "@/types/chat"
import { desc, eq } from "drizzle-orm"
import AppSidebarContent from "./AppSidebarContent"

export async function AppSidebar() {
  const { userId } = await verifySession()

  const initialChats = await db
    .select({
      chatId: chat.chatId,
      title: chat.title,
      updatedAt: chat.updatedAt,
    })
    .from(chat)
    .where(eq(chat.userId, userId))
    .orderBy(desc(chat.updatedAt))

  // pass chats to Client component and do optimistic updates

  return (
    <Sidebar>
      <SidebarHeader className="h-30" />
      <AppSidebarContent initialChats={initialChats as Chat[]} />
      <SidebarFooter className="h-30" />
    </Sidebar>
  )
}
