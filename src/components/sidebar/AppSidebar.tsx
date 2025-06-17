import { Sidebar, SidebarRail } from "@/components/ui/sidebar"
import { db } from "@/db"
import { chat, user } from "@/db/schema"
import { verifySession } from "@/lib/dal"
import { Chat } from "@/types/chat"
import { desc, eq } from "drizzle-orm"
import AppSidebarContent from "./AppSidebarContent"
import AppSidebarFooter from "./AppSidebarFooter"
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

  const userRow = await db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
    })
    .from(user)
    .where(eq(user.id, userId))

  return (
    <Sidebar>
      <AppSidebarHeader />
      <AppSidebarContent currentChatId={chatId} initialChats={initialChats} />
      <AppSidebarFooter user={userRow[0]} />
      <SidebarRail />
    </Sidebar>
  )
}
