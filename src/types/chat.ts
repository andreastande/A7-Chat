export type Chat = {
  chatId: string
  title: string
  updatedAt: Date
  usesDefaultTitle: boolean
}

export type ChatWithCategory = Chat & {
  category: string
}
