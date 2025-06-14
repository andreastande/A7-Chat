"use server"

import { db } from "@/db"
import { pinnedModels } from "@/db/schema"
import { verifySession } from "@/lib/dal"
import { IModel } from "@/types/model"
import { eq } from "drizzle-orm"

export async function updatePinnedModels(models: IModel[]) {
  const { userId } = await verifySession()

  const modelNames = models.map((model) => model.name)

  try {
    const existing = await db.select().from(pinnedModels).where(eq(pinnedModels.userId, userId))

    if (existing.length > 0) {
      // Row exists — update
      await db.update(pinnedModels).set({ models: modelNames }).where(eq(pinnedModels.userId, userId))
    } else {
      // No row — insert
      await db.insert(pinnedModels).values({
        userId,
        models: modelNames,
      })
    }
  } catch (error) {
    console.log(error) // TODO
  }
}
