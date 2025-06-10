"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { toast } from "sonner"

const toastFunctions = {
  success: toast.success,
  error: toast.error,
  info: toast.info,
}

interface ToastInvokerProps {
  message: string
  type: keyof typeof toastFunctions
  navigateTo?: string
}

export default function ToastInvoker({ message, type, navigateTo }: ToastInvokerProps) {
  const router = useRouter()

  useEffect(() => {
    toastFunctions[type](message)

    if (navigateTo) {
      router.push(navigateTo)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}
