"use client"

import { OverlayScrollbarsComponent } from "overlayscrollbars-react"

type OverlayScrollWrapperProps = {
  children: React.ReactNode
  className?: string
}

export default function OverlayScrollWrapper({ children, className }: OverlayScrollWrapperProps) {
  return (
    <OverlayScrollbarsComponent options={{ scrollbars: { autoHide: "scroll" } }} defer className={className}>
      {children}
    </OverlayScrollbarsComponent>
  )
}
