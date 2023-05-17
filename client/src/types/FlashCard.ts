export interface FlashCard {
  flashCardId: string
  flashCardDef: string
  createdAt: string
  name: string
  dueDate: string
  done: boolean
  attachmentUrl?: string
}
