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
    private readonly todosTable = process.env.TODOS_TABLE
  ) {}

  async getFlashCards(userId: string): Promise<FlashCardItem[]> {
    logger.info('Getting all todo items')
    const result = await this.docClient
      .query({
        TableName: this.todosTable,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId
        }
      })
      .promise()

    return result.Items as FlashCardItem[]
  }

  async createFlashCard(newTodo: FlashCardItem): Promise<FlashCardItem> {
    logger.info(`Creating new todo item: ${newTodo.flashCardId}`)
    await this.docClient
      .put({
        TableName: this.todosTable,
        Item: newTodo
      })
      .promise()
    return newTodo
  }

  async updateFlashCard(
    userId: string,
    flashCardId: string,
    updatedTodo: FlashCardUpdate
  ): Promise<void> {
    logger.info(`Updating a todo item: ${flashCardId}`)
    await this.docClient
      .update({
        TableName: this.todosTable,
        Key: { userId, flashCardId },
        ConditionExpression: 'attribute_exists(flashCardId)',
        UpdateExpression: 'set #n = :n, dueDate = :due, done = :dn',
        ExpressionAttributeNames: { '#n': 'name' },
        ExpressionAttributeValues: {
          ':n': updatedTodo.name,
          ':due': updatedTodo.dueDate,
          ':dn': updatedTodo.done
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
        TableName: this.todosTable,
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
        TableName: this.todosTable,
        Key: { userId, flashCardId },
        ConditionExpression: 'attribute_exists(flashCardId)',
        UpdateExpression: 'set attachmentUrl = :attachmentUrl',
        ExpressionAttributeValues: {
          ':attachmentUrl': attachmentUrl
        }
      })
      .promise()
  }
}
