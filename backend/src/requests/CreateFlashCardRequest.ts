/**
 * Fields in a request to create a single Flash Card item.
 */
export interface CreateFlashCardRequest {
  name: string
  flashCardDef: string
  dueDate: string
}
