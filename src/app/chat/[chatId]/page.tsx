import { AppSidebar } from "@/components/AppSidebar"
import Chat from "@/components/chat/Chat"
import ChatLayout from "@/components/ChatLayout"
import { db } from "@/db"
import { message } from "@/db/schema"
import { UIMessage } from "ai"
import { eq } from "drizzle-orm"

export default async function Page({ params }: { params: Promise<{ chatId: string }> }) {
  const { chatId } = await params

  const initialMessages = await db
    .select({
      id: message.messageId,
      role: message.role,
      parts: message.messageParts,
      // modelId: message.modelId,
    })
    .from(message)
    .where(eq(message.chatId, chatId))
    .orderBy(message.createdAt)

  return (
    <>
      <AppSidebar />
      <ChatLayout>
        <main className="w-full flex justify-center">
          <Chat chatId={chatId} initialMessages={initialMessages as UIMessage[]} />
        </main>
      </ChatLayout>
    </>
  )
}
