"use server"

import { db } from "@/db"
import { chat, message } from "@/db/schema"
import { encrypt, encryptUIMessage } from "@/lib/crypto"
import { verifySession } from "@/lib/dal"
import { openai } from "@ai-sdk/openai"
import { generateId, generateText, UIMessage } from "ai"
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
    console.log(error) // TODO
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
    console.log(error) // TODO
  }
}

export async function createChat(chatId: string, text: string) {
  const { userId } = await verifySession()

  try {
    const { text: title } = await generateText({
      model: openai("gpt-4o-mini"),
      prompt: `Generate a concise, topic-focused title for a chat based on the following initial message:\n\n"${text}"\n\nThe title should be short, engaging, and limited to 2-5 words. Do not place quotation marks around the title.`,
    })

    await db.insert(chat).values({
      chatId,
      userId,
      title,
    })
  } catch (error) {
    console.log(error) // TODO
  }
}
