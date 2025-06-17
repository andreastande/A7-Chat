"use client"

import { authClient } from "@/lib/auth-client"
import Image from "next/image"
import { Button } from "./ui/button"

export default function GitHubSignIn() {
  const handleSignInWithGithub = async () => {
    await authClient.signIn.social({
      provider: "github",
    })
  }

  return (
    <Button variant="outline" className="cursor-pointer w-full mt-6 gap-2" onClick={handleSignInWithGithub}>
      <div className="relative size-5">
        <Image src="/images/Github_logo.svg" alt="GitHub logo" fill className="absolute scale-100 dark:scale-0" />
        <Image src="/images/Github_logo_dark.png" alt="GitHub logo" fill className="scale-0 dark:scale-100" />
      </div>
      Continue with Github
    </Button>
  )
}
