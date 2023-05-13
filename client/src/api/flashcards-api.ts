import { apiEndpoint } from '../config'
import { FlashCard } from '../types/FlashCard'
import { CreateFlashCardRequest } from '../types/CreateFlashCardRequest'
import Axios from 'axios'
import { UpdateFlashCardRequest } from '../types/UpdateFlashCardRequest'

export async function getTodos(idToken: string): Promise<FlashCard[]> {
  console.log('Fetching flashcards')

  const response = await Axios.get(`${apiEndpoint}/flashcards`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`
    }
  })
  console.log('FlashCards:', response.data)
  return response.data.items
}

export async function createTodo(
  idToken: string,
  newTodo: CreateFlashCardRequest
): Promise<FlashCard> {
  const response = await Axios.post(
    `${apiEndpoint}/flashcards`,
    JSON.stringify(newTodo),
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`
      }
    }
  )
  return response.data.item
}

export async function patchTodo(
  idToken: string,
  flashCardId: string,
  updatedTodo: UpdateFlashCardRequest
): Promise<void> {
  await Axios.patch(
    `${apiEndpoint}/flashcards/${flashCardId}`,
    JSON.stringify(updatedTodo),
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`
      }
    }
  )
}

export async function deleteTodo(
  idToken: string,
  flashCardId: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/flashcards/${flashCardId}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`
    }
  })
}

export async function getUploadUrl(
  idToken: string,
  flashCardId: string
): Promise<string> {
  const response = await Axios.post(
    `${apiEndpoint}/flashcards/${flashCardId}/attachment`,
    '',
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`
      }
    }
  )
  return response.data.uploadUrl
}

export async function uploadFile(
  uploadUrl: string,
  file: Buffer
): Promise<void> {
  await Axios.put(uploadUrl, file)
}
