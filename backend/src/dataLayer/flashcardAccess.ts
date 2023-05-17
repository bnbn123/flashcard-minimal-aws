import * as AWS from 'aws-sdk'
import { createLogger } from '../utils/logger'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { FlashCardItem, FlashCardUpdate } from '../models'
const AWSXRay = require('aws-xray-sdk')

const XAWS = AWSXRay.captureAWS(AWS)
const logger = createLogger('flashcardAccess')

export class FlashCardAccess {
  constructor(
    private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
    private readonly flashcardsTable = process.env.FLASHCARDS_TABLE
  ) {}

  async getFlashCards(userId: string): Promise<FlashCardItem[]> {
    logger.info('Getting all flash card items')
    const result = await this.docClient
      .query({
        TableName: this.flashcardsTable,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId
        }
      })
      .promise()

    return result.Items as FlashCardItem[]
  }

  async createFlashCard(newFlashCard: FlashCardItem): Promise<FlashCardItem> {
    logger.info(`Creating new flash card item: ${newFlashCard.flashCardId}`)
    await this.docClient
      .put({
        TableName: this.flashcardsTable,
        Item: newFlashCard
      })
      .promise()
    return newFlashCard
  }

  async updateFlashCard(
    userId: string,
    flashCardId: string,
    updatedFlashCard: FlashCardUpdate
  ): Promise<void> {
    logger.info(`Updating a flash card item: ${flashCardId}`)
    await this.docClient
      .update({
        TableName: this.flashcardsTable,
        Key: { userId, flashCardId },
        ConditionExpression: 'attribute_exists(flashCardId)',
        UpdateExpression: 'set #n = :n, dueDate = :due, done = :dn',
        ExpressionAttributeNames: { '#n': 'name' },
        ExpressionAttributeValues: {
          ':n': updatedFlashCard.name,
          ':due': updatedFlashCard.dueDate,
          ':dn': updatedFlashCard.done
        },
        ReturnValues: 'ALL_NEW'
      })
      .promise()

    // const FlashCardUpdatedItem = result.Attributes
    // logger.info(`Todo Updated Item: ${FlashCardUpdatedItem}`)
    // return FlashCardUpdatedItem as FlashCardUpdate
  }

  async deleteFlashCard(userId: string, flashCardId: string): Promise<void> {
    await this.docClient
      .delete({
        TableName: this.flashcardsTable,
        Key: { userId, flashCardId }
      })
      .promise()
  }

  async saveImgUrl(
    userId: string,
    flashCardId: string,
    attachmentUrl: string
  ): Promise<void> {
    await this.docClient
      .update({
        TableName: this.flashcardsTable,
        Key: { userId, flashCardId },
        ConditionExpression: 'attribute_exists(flashCardId)',
        UpdateExpression: 'set attachmentUrl = :attachmentUrl',
        ExpressionAttributeValues: {
          ':attachmentUrl': attachmentUrl
        }
      })
      .promise()
  }

  async getFlashCardsById(
    userId: string,
    flashCardId: string
  ): Promise<FlashCardItem> {
    const result = await this.docClient
      .get({
        TableName: this.flashcardsTable,
        Key: {
          userId: userId,
          flashCardId: flashCardId
        }
      })
      .promise()

    if (result.Item !== undefined && result.Item !== null) {
      return result.Item as FlashCardItem
    }

    return null
  }
}
