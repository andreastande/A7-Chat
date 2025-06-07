import { AppSidebar } from "@/components/AppSidebar"
import ChatPanel from "@/components/ChatPanel"
import DarkModePanel from "@/components/DarkModePanel"

export default function Page() {
  return (
    <>
      <AppSidebar />
      <ChatPanel />
      <DarkModePanel />
      <main></main>
    </>
  )
}
