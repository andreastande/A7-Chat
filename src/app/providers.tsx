import { QueryClientProvider } from "@/components/providers/QueryClientProvider"
import { ThemeProvider } from "@/components/providers/ThemeProvider"
import { SidebarProvider } from "@/components/ui/sidebar"
import { ChatStoreProvider } from "@/stores/chatStoreProvider"
import { MessageStoreProvider } from "@/stores/messageStoreProvider"
import { cookies } from "next/headers"
import React from "react"

export async function Providers({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <QueryClientProvider>
        <SidebarProvider defaultOpen={defaultOpen}>
          <MessageStoreProvider>
            <ChatStoreProvider>{children}</ChatStoreProvider>
          </MessageStoreProvider>
        </SidebarProvider>
      </QueryClientProvider>
    </ThemeProvider>
  )
}
