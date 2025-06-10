import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { db } from "@/db"
import { chat } from "@/db/schema"
import { getUserId } from "@/lib/auth-helpers"
import { desc, eq } from "drizzle-orm"
import Link from "next/link"

export async function AppSidebar() {
  const userId = await getUserId()

  const chats = await db
    .select({
      chatId: chat.chatId,
      title: chat.title,
      updatedAt: chat.updatedAt,
    })
    .from(chat)
    .where(eq(chat.userId, userId))
    .orderBy(desc(chat.updatedAt))

  return (
    <Sidebar>
      <SidebarHeader className="h-30" />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {chats.map((chat) => (
                <SidebarMenuItem key={chat.chatId}>
                  <SidebarMenuButton asChild>
                    <Link href={`/chat/${chat.chatId}`}>{chat.title}</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="h-30" />
    </Sidebar>
  )
}
