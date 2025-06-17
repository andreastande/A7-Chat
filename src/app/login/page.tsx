import LogInForm from "@/components/forms/LogInForm"
import GitHubSignIn from "@/components/GitHubSignIn"
import Image from "next/image"
import Link from "next/link"

export default function Page() {
  return (
    <div className="flex items-center h-screen w-full bg-[url(/images/log-in-bg_light.png)] dark:bg-[url(/images/log-in-bg_dark.png)] bg-cover bg-center pl-70">
      <div className="flex flex-col items-center">
        <div className="relative size-20 mb-8">
          <Image src="/images/A7_logo.png" alt="A7 Chat logo" fill />
        </div>
        <LogInForm />
        <span className="text-sm mt-2">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="underline text-sky-700 dark:tex-white">
            Sign up
          </Link>
        </span>
        <div className="flex items-center w-full gap-4 mt-6">
          <div className="flex-1 h-px bg-black dark:bg-white" />
          <span className="text-sm font-medium ">or</span>
          <div className="flex-1 h-px bg-black dark:bg-white" />
        </div>
        <GitHubSignIn />
      </div>
    </div>
  )
}
