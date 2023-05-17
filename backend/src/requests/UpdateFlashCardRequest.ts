/**
 * Fields in a request to update a single Flash Card item.
 */
export interface UpdateFlashCardRequest {
  name: string
  flashCardDef: string
  dueDate: string
  done: boolean
}
