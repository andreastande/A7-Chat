import Chat from "@/components/chat/Chat"
import ChatLayout from "@/components/ChatLayout"
import { AppSidebar } from "@/components/sidebar/AppSidebar"
import { db } from "@/db"
import { chat, message, pinnedModels } from "@/db/schema"
import { models } from "@/lib/constants"
import { decryptUIMessage } from "@/lib/crypto"
import { verifySession } from "@/lib/dal"
import { UIMessage } from "ai"
import { and, eq } from "drizzle-orm"
import { Metadata } from "next"
import dynamic from "next/dynamic"

const ToastInvoker = dynamic(() => import("@/components/ToastInvoker"), { ssr: !!false })

type Params = {
  params: Promise<{ chatId: string }>
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { chatId } = await params
  const { userId } = await verifySession()

  const chatRow = await db
    .select({ title: chat.title })
    .from(chat)
    .where(and(eq(chat.chatId, chatId), eq(chat.userId, userId)))
    .limit(1)

  const pageTitle = chatRow.length > 0 ? chatRow[0].title : "Chat"

  return {
    title: pageTitle + " - A7 Chat",
    description: `Conversation: ${pageTitle}`,
    openGraph: {
      title: pageTitle + " - A7 Chat",
      description: `Chat session titled “${pageTitle}”`,
    },
  }
}

export default async function Page({ params }: Params) {
  const { chatId } = await params

  const { userId } = await verifySession()

  const chatRow = await db
    .select({ userId: chat.userId, model: chat.model })
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

  const initialModel = models.find((model) => model.name === (chatRow[0]?.model ?? "2.5 Flash"))!

  const pinnedModelsRow = await db
    .select({
      models: pinnedModels.models,
    })
    .from(pinnedModels)
    .where(eq(pinnedModels.userId, userId))

  const pinnedModelNames = (pinnedModelsRow[0]?.models ?? ["2.5 Flash", "4o", "3.7 Sonnet"]) as string[]
  const initialPinnedModels = pinnedModelNames
    .map((name) => models.find((model) => model.name === name))
    .filter((m): m is (typeof models)[number] => Boolean(m)) // just to be safe, in case names are changed in the future

  return (
    <>
      {invalidChat && (
        <ToastInvoker
          message="Nice try, judges! Either the chat does not exist or you are not authorized to see it."
          type="error"
          navigateTo="/"
        />
      )}
      <AppSidebar chatId={chatId} />
      <ChatLayout>
        <main className="w-full flex justify-center">
          <Chat
            chatId={chatId}
            initialMessages={initialMessages}
            initialModel={initialModel}
            initialPinnedModels={initialPinnedModels}
          />
        </main>
      </ChatLayout>
    </>
  )
}
