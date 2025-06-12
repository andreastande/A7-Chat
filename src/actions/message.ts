"use server"

import { db } from "@/db"
import { chat, message } from "@/db/schema"
import { encrypt, encryptUIMessage } from "@/lib/crypto"
import { verifySession } from "@/lib/dal"
import { generateId, UIMessage } from "ai"
import { and, eq } from "drizzle-orm"

export async function storeUserMessage(chatId: string, text: string) {
  const { userId } = await verifySession()

  try {
    await db.transaction(async (tx) => {
      await tx.insert(message).values({
        chatId,
        uiMessage: {
          id: generateId(),
          role: "user",
          parts: [{ type: "text", text: encrypt(text) }],
        },
      })

      await tx
        .update(chat)
        .set({ updatedAt: new Date() })
        .where(and(eq(chat.chatId, chatId), eq(chat.userId, userId)))
    })
  } catch (error) {
    console.error(error) // TODO
  }
}

export async function storeAssistantMessage(chatId: string, uiMessage: UIMessage) {
  const { userId } = await verifySession()

  try {
    await db.transaction(async (tx) => {
      await tx.insert(message).values({
        chatId,
        uiMessage: encryptUIMessage(uiMessage),
      })

      await tx
        .update(chat)
        .set({ updatedAt: new Date() })
        .where(and(eq(chat.chatId, chatId), eq(chat.userId, userId)))
    })
  } catch (error) {
    console.error(error) // TODO
  }
}
