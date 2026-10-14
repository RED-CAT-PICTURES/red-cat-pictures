import type { StreamMetadata } from '../../../types'
import { createStreamInNotion } from '../../utils/notion'

const activeStreams = new Map<string, StreamMetadata>()

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { name } = body

    const config = useRuntimeConfig()
    const base = (config.public?.streamBaseUrl || 'http://localhost').replace(/\/$/, '')

    const streamId = name || `stream-${Date.now()}`

    const streamMetadata: StreamMetadata = {
      streamId,
      title: `Live Stream - ${streamId}`,
      description: 'Live streaming session',
      creator: 'Streamer',
      status: 'live',
      startTime: new Date().toISOString(),
      viewerCount: 0,
      hlsUrl: `${base}/hls/${streamId}.m3u8`,
      dashUrl: `${base}/dash/${streamId}.mpd`,
      thumbnailUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1600&auto=format&fit=crop',
      isRecording: true,
      recordingUrl: `${base}/recordings/${streamId}.flv`,
    }

    activeStreams.set(streamId, streamMetadata)

    try {
      await createStreamInNotion(streamMetadata)
      console.log(`Stream metadata saved to Notion: ${streamId}`)
    } catch (error) {
      console.error('Failed to save to Notion, continuing with in-memory storage:', error)
    }

    console.log(`Stream started: ${streamId}`)

    return { success: true, streamId }
  } catch (error) {
    console.error('Error starting stream:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to start stream',
    })
  }
})
