import EmptyChat from "@/components/chat/EmptyChat"
import ChatLayout from "@/components/ChatLayout"
import { AppSidebar } from "@/components/sidebar/AppSidebar"

export default function Page() {
  return (
    <>
      <AppSidebar />
      <ChatLayout>
        <main className="w-full flex justify-center">
          <EmptyChat />
        </main>
      </ChatLayout>
    </>
  )
}
