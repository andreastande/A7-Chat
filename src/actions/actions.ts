"use server"

import { db } from "@/db"
import { chat, message } from "@/db/schema"
import { getUserId } from "@/lib/auth-helpers"
import { encrypt, encryptUIMessage } from "@/lib/crypto"
import { generateId, UIMessage } from "ai"

export async function storeUserMessage(chatId: string, text: string, isFirstMessage: boolean) {
  const userId = await getUserId()

  if (isFirstMessage) {
    await db.insert(chat).values({
      chatId,
      userId,
    })
  }

  await db.insert(message).values({
    chatId,
    uiMessage: {
      id: generateId(),
      role: "user",
      parts: [{ type: "text", text: encrypt(text) }],
    },
  })
}

export async function storeAssistantMessage(chatId: string, uiMessage: UIMessage) {
  await getUserId()

  await db.insert(message).values({
    chatId,
    uiMessage: encryptUIMessage(uiMessage),
  })
}
