"use server"

import { db } from "@/db"
import { chat } from "@/db/schema"
import { verifySession } from "@/lib/dal"
import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"
import { and, eq } from "drizzle-orm"

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

export async function deleteChat(chatId: string) {
  const { userId } = await verifySession()

  try {
    await db.delete(chat).where(and(eq(chat.chatId, chatId), eq(chat.userId, userId)))
  } catch (error) {
    console.log(error) // TODO
  }
}
