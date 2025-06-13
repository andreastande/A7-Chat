import { Sidebar, SidebarFooter, SidebarRail } from "@/components/ui/sidebar"
import AppSidebarContent from "./AppSidebarContent"
import AppSidebarHeader from "./AppSidebarHeader"

export function AppSidebar({ chatId }: { chatId?: string }) {
  return (
    <Sidebar>
      <AppSidebarHeader />
      <AppSidebarContent currentChatId={chatId} />
      <SidebarFooter className="h-30 border-t border-sky-200" />
      <SidebarRail />
    </Sidebar>
  )
}
