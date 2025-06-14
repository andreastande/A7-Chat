import { IModel } from "@/types/model"
import { anthropic } from "@ai-sdk/anthropic"
import { google } from "@ai-sdk/google"
import { openai } from "@ai-sdk/openai"
import { xai } from "@ai-sdk/xai"
import { convertToModelMessages, streamText, UIMessage } from "ai"

type ProviderName = keyof typeof providerRegistry

const providerRegistry = {
  OpenAI: openai,
  Google: google,
  Anthropic: anthropic,
  xAI: xai,
} as const

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request) {
  const { messages, model }: { messages: UIMessage[]; model: IModel } = await req.json()

  const providerFn = providerRegistry[model.provider as ProviderName]
  const selectedModel = providerFn(model.APIName)

  const result = streamText({
    model: selectedModel,
    messages: convertToModelMessages(messages),
    system: `
      You are an AI assistant powered by ${model.APIName}. You are here to help and 
      engange in conversation.
      
      If you are generating responses with math, you should use Latex, wrapped in $$.
      If you are generating code, you should make it Prettier formatted and print width should be 80 characters.
      If the user asks which model you are, respond with ${model.APIName}.

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
