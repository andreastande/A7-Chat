"use server"

import { db } from "@/db"
import { stream } from "@/db/schema"
import { verifySession } from "@/lib/dal"
import { and, eq } from "drizzle-orm"

export async function loadStreams(chatId: string) {
  const { userId } = await verifySession()

  try {
    const streamIds = await db
      .select({
        streamId: stream.streamId,
      })
      .from(stream)
      .where(and(eq(stream.chatId, chatId), eq(stream.userId, userId)))

    return streamIds
  } catch (error) {
    console.error(error)
  }
}

export async function appendStreamId({ chatId, streamId }: { chatId: string; streamId: string }) {
  const { userId } = await verifySession()

  try {
    await db.insert(stream).values({
      streamId,
      chatId,
      userId,
    })
  } catch (error) {
    console.error(error)
  }
}
