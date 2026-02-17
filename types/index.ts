export interface Video {
  id: string
  title: string
  description: string
  thumbnailUrl: string
  videoUrl: string
  creator: {
    name: string
    avatarUrl: string
  }
  status: 'live' | 'past' | 'upcoming'
  postedDate: string
  views?: number
  scheduledTime?: string
}

export interface LiveStream {
  id: string
  streamKey: string
  title: string
  description: string
  thumbnailUrl: string
  hlsUrl: string
  dashUrl: string
  creator: {
    name: string
    avatarUrl: string
  }
  status: 'live' | 'offline' | 'starting'
  startTime?: string
  endTime?: string
  viewerCount: number
  isRecording: boolean
  recordingUrl?: string
}

export interface StreamMetadata {
  streamId: string
  title: string
  description: string
  creator: string
  status: 'live' | 'offline' | 'starting'
  startTime?: string
  endTime?: string
  viewerCount: number
  hlsUrl: string
  dashUrl: string
  thumbnailUrl?: string
  isRecording: boolean
  recordingUrl?: string
}
