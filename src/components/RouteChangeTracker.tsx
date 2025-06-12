"use client"

import { usePathname } from "next/navigation"
import { useEffect } from "react"

export default function RouteChangeTracker() {
  const pathname = usePathname()

  useEffect(() => {
    sessionStorage.setItem("lastPath", pathname)
  }, [pathname])

  return null
}
