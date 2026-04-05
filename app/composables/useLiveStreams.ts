import type { LiveStream } from '../../types'

let es: EventSource | null = null

export const useLiveStreams = () => {
  const streams = ref<LiveStream[]>([])
  const viewCounts = ref<Record<string, number>>({})
  const isConnected = ref(false)

  const fetchStreams = async () => {
    try {
      const data = await $fetch<LiveStream[]>('/api/streams')
      streams.value = data || []
    } catch (error) {
      console.error('Failed to fetch streams:', error)
    }
  }

  const connectSSE = () => {
    if (isConnected.value) return

    if (es) {
      try {
        es.close()
      } catch {
        // ignore
      }
      es = null
    }

    es = new EventSource('/api/sse')

    es.onopen = () => {
      isConnected.value = true
      console.log('SSE connection opened')
    }

    es.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)

        if (data.type === 'view_counts') {
          viewCounts.value = data.data
        }
      } catch (error) {
        console.error('Failed to parse SSE data:', error)
      }
    }

    es.onerror = () => {
      isConnected.value = false
    }

    onUnmounted(() => {
      try {
        es?.close()
      } catch {
        // ignore
      }
      es = null
      isConnected.value = false
    })
  }

  const getViewCount = (streamId: string) => {
    return computed(() => viewCounts.value[streamId] || 0)
  }

  const liveStreams = computed(() => streams.value.filter((stream) => stream.status === 'live'))

  const offlineStreams = computed(() => streams.value.filter((stream) => stream.status === 'offline'))

  return {
    streams: readonly(streams),
    viewCounts: readonly(viewCounts),
    isConnected: readonly(isConnected),
    liveStreams,
    offlineStreams,
    fetchStreams,
    connectSSE,
    getViewCount,
  }
}
