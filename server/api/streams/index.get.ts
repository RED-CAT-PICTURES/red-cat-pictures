import type { LiveStream } from '../../../types'

const liveStreams: LiveStream[] = [
  {
    id: 'stream-1',
    streamKey: 'live-stream-1',
    title: 'Live Coding Session',
    description: 'Building a live streaming platform with Nuxt.js and RTMP',
    thumbnailUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1600&auto=format&fit=crop',
    hlsUrl: '/hls/stream-1.m3u8',
    dashUrl: '/dash/stream-1.mpd',
    creator: {
      name: 'Developer',
      avatarUrl: 'https://i.pravatar.cc/100?img=1',
    },
    status: 'live',
    startTime: new Date().toISOString(),
    viewerCount: 42,
    isRecording: true,
    recordingUrl: '/recordings/stream-1.flv',
  },
]

export default defineEventHandler(async () => {
  try {
    return liveStreams
  } catch {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch streams',
    })
  }
})
