"use server"

import { db } from "@/db"
import { pinnedModels } from "@/db/schema"
import { verifySession } from "@/lib/dal"
import { and, eq } from "drizzle-orm"

export async function addPinnedModel(modelId: string, position: number) {
  const { userId } = await verifySession()

  try {
    await db.insert(pinnedModels).values({
      modelId,
      userId,
      position,
    })
  } catch (error) {
    console.error(error) // TODO
  }
}

export async function removePinnedModel(modelId: string) {
  const { userId } = await verifySession()

  try {
    await db.delete(pinnedModels).where(and(eq(pinnedModels.modelId, modelId), eq(pinnedModels.userId, userId)))
  } catch (error) {
    console.error(error) // TODO
  }
}

export async function updatePinnedModelPosition(modelId: string, position: number) {
  const { userId } = await verifySession()

  try {
    await db
      .update(pinnedModels)
      .set({ position })
      .where(and(eq(pinnedModels.modelId, modelId), eq(pinnedModels.userId, userId)))
  } catch (error) {
    console.log(error) // TODO
  }
}
