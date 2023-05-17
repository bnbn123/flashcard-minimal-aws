import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'
import { createFlashCard } from '../../businessLogic/flashcards'
import { CreateFlashCardRequest } from '../../requests/CreateFlashCardRequest'

const logger = createLogger('createFlashCard')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Processing createFlashCard event...')
    const newFlashCard: CreateFlashCardRequest = JSON.parse(event.body)
    const userId = getUserId(event)

    try {
      const newItem = await createFlashCard(userId, newFlashCard)
      logger.info(`Successfully created a new flashcard item: ${newItem}`)

      return {
        statusCode: 201,
        body: JSON.stringify({
          item: newItem
        })
      }
    } catch (err) {
      logger.error(`Error: ${err.message}`)
      return {
        statusCode: 500,
        body: JSON.stringify({ err })
      }
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)
