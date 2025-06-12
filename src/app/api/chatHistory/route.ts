import { db } from "@/db"
import { chat } from "@/db/schema"
import { verifySession } from "@/lib/dal"
import { Chat } from "@/types/chat"
import { desc, eq } from "drizzle-orm"
import { NextResponse } from "next/server"

// TODO: Double-check things are correct
export async function GET() {
  const { userId } = await verifySession()

  const initialChats: Chat[] = await db
    .select({
      chatId: chat.chatId,
      title: chat.title,
      updatedAt: chat.updatedAt,
    })
    .from(chat)
    .where(eq(chat.userId, userId))
    .orderBy(desc(chat.updatedAt))

  return NextResponse.json(initialChats)
}
