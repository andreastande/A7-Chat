import RouteChangeTracker from "@/components/RouteChangeTracker"
import { Toaster } from "@/components/ui/sonner"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "overlayscrollbars/overlayscrollbars.css"
import "./globals.css"
import { Providers } from "./providers"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "A7 Chat",
  description:
    "A7 Chat is a blazing-fast, all-in-one AI chat platform that gives you access to GPT-4, Claude, Gemini, and more—at half the price of ChatGPT.",
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          {children}
          <RouteChangeTracker />
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
