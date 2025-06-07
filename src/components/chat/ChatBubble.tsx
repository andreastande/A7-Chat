import { UIMessage } from "ai"

export default function ChatBubble({ message }: { message: UIMessage }) {
  return (
    <div className={message.role === "user" ? "flex justify-end" : ""}>
      <div className={message.role === "user" ? "bg-sky-100 max-w-126 rounded-xl p-4 w-fit" : ""}>
        {message.parts.map((part, i) => {
          switch (part.type) {
            case "text":
              return (
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
