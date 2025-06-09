"use server"

import { db } from "@/db"
import { chat, message } from "@/db/schema"
import { getUserId } from "@/lib/auth-helpers"
import { generateId } from "ai"

export async function storeMessage(chatId: string, text: string, isFirstMessage: boolean) {
  const userId = await getUserId()

  if (isFirstMessage) {
    await db.insert(chat).values({
      chatId,
      userId,
    })
  }

  await db.insert(message).values({
    messageId: generateId(),
    chatId,
    role: "user",
    content: text,
    modelId: "gpt-4.1-nano",
  })
}
