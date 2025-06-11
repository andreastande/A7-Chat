"use server"

import { auth } from "@/lib/auth"

export default async function SignUp(email: string, password: string) {
  await auth.api.signInEmail({
    body: {
      email,
      password,
    },
  })
}
