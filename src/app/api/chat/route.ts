import { db } from "@/db"
import { message } from "@/db/schema"
import { openai } from "@ai-sdk/openai"
import { convertToModelMessages, generateId, streamText, UIMessage } from "ai"

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request) {
  const { messages, chatId }: { messages: UIMessage[]; chatId: string } = await req.json()

  const result = streamText({
    model: openai("gpt-4.1-nano"),
    messages: convertToModelMessages(messages),
    onFinish: async (result) => {
      // save assistant message to db
      await db.insert(message).values({
        messageId: generateId(),
        chatId,
        role: "assistant",
        content: result.text,
        modelId: "gpt-4.1-nano",
      })
    },
  })

  return result.toUIMessageStreamResponse()
}
