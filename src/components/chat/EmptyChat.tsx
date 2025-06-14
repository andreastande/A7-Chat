import { db } from "@/db"
import { pinnedModels } from "@/db/schema"
import { models } from "@/lib/constants"
import { verifySession } from "@/lib/dal"
import { eq } from "drizzle-orm"
import { cookies } from "next/headers"
import ChatInput from "./ChatInput"

export default async function EmptyChat() {
  const { userId } = await verifySession()
  const cookieStore = await cookies()

  const selectedModelCookie = cookieStore.get("selectedModel")
  const selectedModel = selectedModelCookie?.value ?? "2.5 Flash"

  const initialModel = models.find((model) => model.name === selectedModel)!

  const pinnedModelsRow = await db
    .select({
      models: pinnedModels.models,
    })
    .from(pinnedModels)
    .where(eq(pinnedModels.userId, userId))

  const pinnedModelNames = (pinnedModelsRow[0]?.models ?? []) as string[]
  const initialPinnedModels = pinnedModelNames
    .map((name) => models.find((model) => model.name === name))
    .filter((m): m is (typeof models)[number] => Boolean(m)) // just to be safe, in case names are changed in the future

  return <ChatInput initialModel={initialModel} initialPinnedModels={initialPinnedModels} />
}
