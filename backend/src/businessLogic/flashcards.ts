import * as uuid from 'uuid'

import { AttachmentUtils } from '../helpers/attachmentUtils'
import { FlashCardItem, FlashCardUpdate } from '../models'
import { CreateFlashCardRequest } from '../requests/CreateFlashCardRequest'
import { FlashCardAccess } from '../dataLayer/flashcardAccess'

const flashcardAccess = new FlashCardAccess()
const attachmentUtils = new AttachmentUtils()

export async function getFlashCards(userId: string): Promise<FlashCardItem[]> {
  return flashcardAccess.getFlashCards(userId)
}

export async function createFlashCard(
  userId: string,
  newFlashCardData: CreateFlashCardRequest
): Promise<FlashCardItem> {
  const flashCardId = uuid.v4()
  const createdAt = new Date().toISOString()
  const done = false

  const newFlashCard: FlashCardItem = {
    flashCardId,
    userId,
    createdAt,
    done,
    ...newFlashCardData
  }
  return flashcardAccess.createFlashCard(newFlashCard)
}

export async function updateFlashCard(
  userId: string,
  flashCardId: string,
  updatedFlashCard: FlashCardUpdate
): Promise<void> {
  return flashcardAccess.updateFlashCard(userId, flashCardId, updatedFlashCard)
}

export async function deleteFlashCard(
  userId: string,
  flashCardId: string
): Promise<void> {
  return flashcardAccess.deleteFlashCard(userId, flashCardId)
}

export async function createAttachmentPresignedUrl(
  userId: string,
  flashCardId: string
): Promise<string> {
  const attachmentUrl = attachmentUtils.getAttachmentUrl(flashCardId)
  await flashcardAccess.saveImgUrl(userId, flashCardId, attachmentUrl)
  console.log(`createSignedUrl ${flashCardId}`, userId)
  return attachmentUtils.getUploadUrl(flashCardId)
}

export async function getFlashCardsById(
  userId: string,
  flashCardId: string
): Promise<FlashCardItem> {
  return flashcardAccess.getFlashCardsById(userId, flashCardId)
}
