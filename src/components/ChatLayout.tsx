import ChatPanel from "./panels/ChatPanel"
import DarkModePanel from "./panels/DarkModePanel"

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ChatPanel />
      <DarkModePanel />
      {children}
    </>
  )
}
