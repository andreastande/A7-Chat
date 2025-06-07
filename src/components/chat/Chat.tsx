"use client"

import ChatInput from "./ChatInput"

export default function Chat() {
  const chats = Array(100).fill("Chat")

  return (
    <div className="w-full max-w-3xl px-6 pt-14">
      {chats.map((chat, i) => (
        <p key={i}>{chat}</p>
      ))}
      <ChatInput />
    </div>
  )
}
