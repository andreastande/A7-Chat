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

  const pinnedModelsRows = await db
    .select({
      modelId: pinnedModels.modelId,
      position: pinnedModels.position,
    })
    .from(pinnedModels)
    .where(eq(pinnedModels.userId, userId))
    .orderBy(pinnedModels.position)

  const initialPinnedModels = models.filter((model) =>
    pinnedModelsRows.some((pinnedModel) => pinnedModel.modelId === model.name)
  )

  return <ChatInput initialModel={initialModel} initialPinnedModels={initialPinnedModels} />
}
