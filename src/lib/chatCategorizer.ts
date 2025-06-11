import { Chat, ChatWithCategory } from "@/types/chat"
import { differenceInCalendarDays, format, isThisYear, isToday, isYesterday, startOfToday, subDays } from "date-fns"

/**
 * Given a Date, return its bucket label.
 */
export function getCategoryLabel(date: Date, now = new Date()): string {
  if (isToday(date)) return "Today"
  if (isYesterday(date)) return "Yesterday"

  const diff = differenceInCalendarDays(now, date)
  if (diff <= 7) return "Last 7 days"
  if (diff <= 30) return "Last 30 days"
  return isThisYear(date) ? format(date, "MMMM") : format(date, "MMMM, yyyy")
}

/**
 * For sorting the groups chronologically, pick a representative date for each bucket.
 */
export function getRepresentativeDate(label: string, updated: Date): Date {
  const today = startOfToday()
  switch (label) {
    case "Today":
      return today
    case "Yesterday":
      return subDays(today, 1)
    case "Last 7 days":
      return subDays(today, 7)
    case "Last 30 days":
      return subDays(today, 30)
    default:
      return updated
  }
}

/**
 * Main entry: take an array of chats, return them annotated with
 * `category` plus the sorted list of category labels.
 */
export function categorizeChats(chats: Chat[]): { chatsWithCategory: ChatWithCategory[]; categories: string[] } {
  const categoryDateMap: Record<string, Date> = {}

  const chatsWithCategory = chats
    .slice()
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .map((chat) => {
      const updated = new Date(chat.updatedAt)
      const category = getCategoryLabel(updated)
      const repDate = getRepresentativeDate(category, updated)

      // track the newest repDate for each category
      if (!categoryDateMap[category] || categoryDateMap[category].getTime() < repDate.getTime()) {
        categoryDateMap[category] = repDate
      }

      return { ...chat, category }
    })

  const categories = Object.entries(categoryDateMap)
    .sort(([, dateA], [, dateB]) => dateB.getTime() - dateA.getTime())
    .map(([label]) => label)

  return { chatsWithCategory, categories }
}
