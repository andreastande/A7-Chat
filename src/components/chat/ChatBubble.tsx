import { UIMessage } from "ai"
import MarkdownRenderer from "./MarkdownRenderer"

export default function ChatBubble({ message }: { message: UIMessage }) {
  return (
    <div className={message.role === "user" ? "flex justify-end" : ""}>
      <div className={message.role === "user" ? "bg-sky-100 dark:bg-sky-900 max-w-126 rounded-xl p-4 w-fit" : ""}>
        {message.parts.map((part, i) => {
          switch (part.type) {
            case "text":
              return message.role === "assistant" ? (
                <MarkdownRenderer key={`${message.id}-${i}`} content={part.text} />
              ) : (
                <p key={`${message.id}-${i}`} className="whitespace-pre-wrap break-words">
                  {part.text}
                </p>
              )
          }
        })}
      </div>
    </div>
  )
}
