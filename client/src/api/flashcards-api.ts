import { apiEndpoint } from '../config'
import { FlashCard } from '../types/FlashCard'
import { CreateFlashCardRequest } from '../types/CreateFlashCardRequest'
import Axios from 'axios'
import { UpdateFlashCardRequest } from '../types/UpdateFlashCardRequest'

export async function getFlashCards(idToken: string): Promise<FlashCard[]> {
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

export async function createFlashCard(
  idToken: string,
  newFlashCard: CreateFlashCardRequest
): Promise<FlashCard> {
  console.log('🚀 ~ file: flashcards-api.ts:24 ~ newFlashCard:', newFlashCard)
  console.log('🚀 ~ file: flashcards-api.ts:21 ~ createFlashCard:onCalled')
  const response = await Axios.post(
    `${apiEndpoint}/flashcards`,
    JSON.stringify(newFlashCard),
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`
      }
    }
  )
  return response.data.item
}

export async function patchFlashCard(
  idToken: string,
  flashCardId: string,
  updatedFlashCard: UpdateFlashCardRequest
): Promise<void> {
  await Axios.patch(
    `${apiEndpoint}/flashcards/${flashCardId}`,
    JSON.stringify(updatedFlashCard),
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`
      }
    }
  )
}

export async function deleteFlashCard(
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
