"use client"

import { Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "../ui/button"

export default function DarkModePanel() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="fixed right-4 top-4 z-20 p-1 border bg-sky-100 dark:bg-secondary rounded-lg border-sky-200 dark:border-sky-900">
      <Button
        variant="ghost"
        size="icon"
        className="cursor-pointer hover:bg-sky-200 dark:hover:bg-zinc-700"
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      >
        <Sun className="size-5" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    </div>
  )
}
