import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'
import { updateFlashCard } from '../../businessLogic/flashcards'
import { UpdateFlashCardRequest } from '../../requests/UpdateFlashCardRequest'

const logger = createLogger('updateFlashCard')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Processing UpdateFlashCard event...')
    const flashCardId = event.pathParameters.flashCardId
    const updatedFlashCard: UpdateFlashCardRequest = JSON.parse(event.body)
    const userId: string = getUserId(event)

    try {
      await updateFlashCard(userId, flashCardId, updatedFlashCard)
      logger.info(`Successfully updated the flash card item: ${flashCardId}`)
      return {
        statusCode: 200,
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
