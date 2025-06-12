import { UIMessage } from "ai"
import { RefObject, useLayoutEffect, useState } from "react"

const HEADER_OFFSET = 56
const STREAMING_BOTTOM_OFFSET = 112
const MIN_PADDING = 220

export function useDynamicPadding(
  messages: UIMessage[],
  status: "submitted" | "streaming" | string,
  userRef: RefObject<HTMLDivElement | null>,
  assistantRef: RefObject<HTMLDivElement | null>
) {
  const [padding, setPadding] = useState(MIN_PADDING)

  useLayoutEffect(() => {
    const userH = userRef.current?.offsetHeight ?? 0
    const assistantH = assistantRef.current?.offsetHeight ?? 0

    let raw: number | undefined
    if (status === "submitted") {
      raw = window.innerHeight - userH - HEADER_OFFSET
    } else if (status === "streaming") {
      raw = window.innerHeight - STREAMING_BOTTOM_OFFSET - userH - assistantH
    }

    if (raw !== undefined) {
      setPadding(Math.max(raw, MIN_PADDING))
    }
  }, [messages, status, userRef, assistantRef])

  return padding
}
