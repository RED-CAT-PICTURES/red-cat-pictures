import type { StreamMetadata } from '../../../types'
import { updateStreamInNotion } from '../../utils/notion'

const activeStreams = new Map<string, StreamMetadata>()

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { name } = body

    const streamId = name || `stream-${Date.now()}`

    const streamMetadata = activeStreams.get(streamId)

    if (streamMetadata) {
      streamMetadata.status = 'offline'
      streamMetadata.endTime = new Date().toISOString()

      try {
        await updateStreamInNotion(streamId, {
          status: 'offline',
          endTime: streamMetadata.endTime,
        })
        console.log(`Stream metadata updated in Notion: ${streamId}`)
      } catch (error) {
        console.error('Failed to update Notion, continuing with in-memory storage:', error)
      }

      console.log(`Stream stopped: ${streamId}`)
    }

    return { success: true, streamId }
  } catch (error) {
    console.error('Error stopping stream:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to stop stream',
    })
  }
})
