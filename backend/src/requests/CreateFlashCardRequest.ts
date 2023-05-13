/**
 * Fields in a request to create a single TODO item.
 */
export interface CreateFlashCardRequest {
  name: string
  flashCardDef: string
  dueDate: string
}
