import { Chat } from "@/types/chat"
import { useQuery } from "@tanstack/react-query"

export function useGetChatHistoryQuery() {
  return useQuery<Chat[]>({
    queryKey: ["chatHistory"],
    queryFn: async () => {
      const res = await fetch("/api/chatHistory")
      if (!res.ok) {
        throw new Error("Network response was not ok")
      }

      return res.json()
    },
    staleTime: Infinity,
  })
}
