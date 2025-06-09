"use server"

import { auth } from "@/lib/auth"
import { headers } from "next/headers"

export async function getUserId() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    // TODO: Log out and redirect?
    throw new Error("You must be signed in to perform this action")
  }

  return session.user.id
}
