"use server"

import { db } from "@/db"
import { chat } from "@/db/schema"
import { verifySession } from "@/lib/dal"
import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"
import { and, eq } from "drizzle-orm"

export async function createChatPlaceholder(chatId: string) {
  const { userId } = await verifySession()

  try {
    await db.insert(chat).values({
      chatId,
      userId,
      title: "New chat",
    })
  } catch (error) {
    console.error(error) // TODO
  }
}

export async function generateChatTitle(chatId: string, initialMessage: string) {
  const { userId } = await verifySession()
  try {
    const { text: title } = await generateText({
      model: openai("gpt-4o-mini"),
      prompt: `Generate a concise, topic-focused title for a chat based on the following initial message:\n\n"${initialMessage}"\n\nKeep it to 2-5 words, no quotes.`,
    })

    await db
      .update(chat)
      .set({ title, updatedAt: chat.updatedAt })
      .where(and(eq(chat.chatId, chatId), eq(chat.userId, userId)))
  } catch (error) {
    console.error(error) // TODO
  }
}

export async function renameChatTitle(chatId: string, newTitle: string) {
  const { userId } = await verifySession()

  try {
    await db
      .update(chat)
      .set({ title: newTitle.trim(), updatedAt: chat.updatedAt })
      .where(and(eq(chat.chatId, chatId), eq(chat.userId, userId)))
  } catch (error) {
    console.error(error) // TODO
  }
}

export async function deleteChat(chatId: string) {
  const { userId } = await verifySession()

  try {
    await db.delete(chat).where(and(eq(chat.chatId, chatId), eq(chat.userId, userId)))
  } catch (error) {
    console.error(error) // TODO
  }
}
