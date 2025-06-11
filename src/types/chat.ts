export type Chat = {
  chatId: string
  title: string
  updatedAt: Date
}

export type ChatWithCategory = Chat & {
  category: string
}
