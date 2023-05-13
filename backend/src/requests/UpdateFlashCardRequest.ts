/**
 * Fields in a request to update a single TODO item.
 */
export interface UpdateFlashCardRequest {
  name: string
  dueDate: string
  done: boolean
}
