import { AppSidebar } from "@/components/AppSidebar"
import Chat from "@/components/chat/Chat"
import ChatLayout from "@/components/ChatLayout"

export default function Page() {
  return (
    <>
      <AppSidebar />
      <ChatLayout>
        <main className="w-full flex justify-center">
          <Chat />
        </main>
      </ChatLayout>
    </>
  )
}
