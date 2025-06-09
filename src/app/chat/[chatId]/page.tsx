import { AppSidebar } from "@/components/AppSidebar"
import Chat from "@/components/chat/Chat"
import ChatLayout from "@/components/ChatLayout"
import { db } from "@/db"
import { message } from "@/db/schema"
import { UIMessage } from "ai"
import { eq } from "drizzle-orm"

export default async function Page({ params }: { params: Promise<{ chatId: string }> }) {
  const { chatId } = await params

  const messageRows = await db
    .select({
      uiMessage: message.uiMessage,
    })
    .from(message)
    .where(eq(message.chatId, chatId))
    .orderBy(message.createdAt)

  const initialMessages = messageRows.map((msg) => msg.uiMessage as UIMessage)

  return (
    <>
      <AppSidebar />
      <ChatLayout>
        <main className="w-full flex justify-center">
          <Chat chatId={chatId} initialMessages={initialMessages} />
        </main>
      </ChatLayout>
    </>
  )
}
