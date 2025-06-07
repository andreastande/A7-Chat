import { ThemeProvider } from "@/components/ThemeProvider"
import { SidebarProvider } from "@/components/ui/sidebar"
import { cookies } from "next/headers"
import React from "react"

export async function Providers({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <SidebarProvider defaultOpen={defaultOpen}>{children}</SidebarProvider>
    </ThemeProvider>
  )
}
