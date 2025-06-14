import { models } from "@/lib/constants"
import { cookies } from "next/headers"
import ChatInput from "./ChatInput"

export default async function EmptyChat() {
  const cookieStore = await cookies()

  const selectedModelCookie = cookieStore.get("selectedModel")
  const selectedModel = selectedModelCookie?.value ?? "2.5 Flash"

  const initialModel = models.find((model) => model.name === selectedModel)!

  return <ChatInput initialModel={initialModel} />
}
