import { openai } from "@ai-sdk/openai"
import { convertToModelMessages, streamText, UIMessage } from "ai"

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request) {
  const { messages, model }: { messages: UIMessage[]; model: string } = await req.json()

  const result = streamText({
    model: openai(model),
    messages: convertToModelMessages(messages),
    system: `
      You are an AI assistant powered by ${model}. You are here to help and 
      engange in conversation.
      
      If you are generating responses with math, you should use Latex, wrapped in $$.
      If you are generating code, you should make it Prettier formatted and print width should be 80 characters.
      If the user asks which model you are, respond with ${model}.

      Always strive to be helpful, respectful, and engaging in your interactions.
    `,
  })

  return result.toUIMessageStreamResponse({
    messageMetadata: ({ part }) => {
      if (part.type === "finish") {
        return {
          model,
        }
      }
    },
  })
}
