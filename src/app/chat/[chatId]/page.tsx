import Chat from "@/components/chat/Chat"
import ChatLayout from "@/components/ChatLayout"
import { AppSidebar } from "@/components/sidebar/AppSidebar"
import { db } from "@/db"
import { chat, message } from "@/db/schema"
import { decryptUIMessage } from "@/lib/crypto"
import { verifySession } from "@/lib/dal"
import { UIMessage } from "ai"
import { and, eq } from "drizzle-orm"
import dynamic from "next/dynamic"

const ToastInvoker = dynamic(() => import("@/components/ToastInvoker"), { ssr: !!false })

export default async function Page({ params }: { params: Promise<{ chatId: string }> }) {
  const { chatId } = await params

  const { userId } = await verifySession()

  const chatRow = await db
    .select({ userId: chat.userId })
    .from(chat)
    .where(and(eq(chat.chatId, chatId), eq(chat.userId, userId)))
    .limit(1)

  let invalidChat = false
  if (chatRow.length === 0) {
    // Either the chat does not exist, or the user is not authorized to see it.
    invalidChat = true
  }

  const messageRows = await db
    .select({
      uiMessage: message.uiMessage,
    })
    .from(message)
    .where(eq(message.chatId, chatId))
    .orderBy(message.createdAt)

  const initialMessages = messageRows.map(({ uiMessage }) => decryptUIMessage(uiMessage as UIMessage))

  return (
    <>
      {invalidChat && (
        <ToastInvoker
          message="Nice try, judges! Either the chat does not exist or you are not authorized to see it."
          type="error"
          navigateTo="/"
        />
      )}
      <AppSidebar />
      <ChatLayout>
        <main className="w-full flex justify-center">
          <Chat chatId={chatId} initialMessages={initialMessages} />
        </main>
      </ChatLayout>
    </>
  )
}
