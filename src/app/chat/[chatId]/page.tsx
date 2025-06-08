import { AppSidebar } from "@/components/AppSidebar"
import Chat from "@/components/chat/Chat"
import ChatLayout from "@/components/ChatLayout"

export default async function Page({ params }: { params: Promise<{ chatId: string }> }) {
  const { chatId } = await params

  return (
    <>
      <AppSidebar />
      <ChatLayout>
        <main className="w-full flex justify-center">
          <Chat chatId={chatId} />
        </main>
      </ChatLayout>
    </>
  )
}
