import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'
import { deleteFlashCard } from '../../businessLogic/flashcards'

const logger = createLogger('deleteFlashCard')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Processing deleteFlashCard event...')
    const flashCardId = event.pathParameters.flashCardId
    const userId = getUserId(event)

    try {
      await deleteFlashCard(userId, flashCardId)
      logger.info(`Successfully deleted flash card item: ${flashCardId}`)
      return {
        statusCode: 204,
        body: undefined
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

handler.use(httpErrorHandler()).use(
  cors({
    credentials: true
  })
)
