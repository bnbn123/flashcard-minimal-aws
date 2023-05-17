import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'
import { getFlashCardsById } from '../../businessLogic/flashcards'
import { FlashCardItem } from '../../models'

const logger = createLogger('getFlashCardsById')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Processing getFlashCards event...')
    const flashCardId = event.pathParameters.flashCardId
    const userId: string = getUserId(event)

    try {
      const flashcardItem: FlashCardItem = await getFlashCardsById(
        userId,
        flashCardId
      )
      logger.info('Successfully retrieved getFlashCardsById')
      return {
        statusCode: 200,
        body: JSON.stringify({ items: flashcardItem })
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
