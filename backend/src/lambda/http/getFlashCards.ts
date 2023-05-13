import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'
import { getFlashCards } from '../../businessLogic/flashcards'
import { FlashCardItem } from '../../models'

const logger = createLogger('getFlashCards')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Processing getFlashCards event...')
    const userId = getUserId(event)

    try {
      const flashcardList: FlashCardItem[] = await getFlashCards(userId)
      logger.info('Successfully retrieved flashcardList')
      return {
        statusCode: 200,
        body: JSON.stringify({ items: flashcardList })
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
