import { Sidebar, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar"
import AppSidebarContent from "./AppSidebarContent"

export function AppSidebar({ chatId }: { chatId?: string }) {
  return (
    <Sidebar>
      <SidebarHeader className="h-30 border-b border-sky-200" />
      <AppSidebarContent currentChatId={chatId} />
      <SidebarFooter className="h-30 border-t border-sky-200" />
      <SidebarRail />
    </Sidebar>
  )
}
