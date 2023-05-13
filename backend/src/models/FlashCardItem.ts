export interface FlashCardItem {
  userId: string
  flashCardId: string
  flashCardDef: string
  createdAt: string
  name: string
  dueDate: string
  done: boolean
  attachmentUrl?: string
}
