export interface FlashCard {
  flashCardId: string
  flashcardDef: string
  createdAt: string
  name: string
  dueDate: string
  done: boolean
  attachmentUrl?: string
}
