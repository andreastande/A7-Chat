"use client"

import { QueryClientProvider as NextQueryClientProvider, QueryClient } from "@tanstack/react-query"
import { useState } from "react"

export function QueryClientProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())

  return <NextQueryClientProvider client={queryClient}>{children}</NextQueryClientProvider>
}
