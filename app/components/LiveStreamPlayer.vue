<template>
  <div class="w-full overflow-hidden rounded-xl bg-black">
    <div class="relative">
      <video ref="videoEl" :src="hlsUrl" class="h-auto w-full" controls autoplay muted @loadstart="onLoadStart" @canplay="onCanPlay" @error="onError" />

      <div class="absolute left-4 top-4 flex items-center gap-2">
        <div class="bg-red-500 h-3 w-3 animate-pulse rounded-full"></div>
        <span class="font-semibold rounded bg-black/50 px-2 py-1 text-sm text-white"> LIVE </span>
        <span v-if="viewerCount && viewerCount > 0" class="rounded bg-black/50 px-2 py-1 text-sm text-white"> {{ viewerCount.toLocaleString() }} viewers </span>
      </div>

      <div v-if="isLoading" class="absolute inset-0 flex items-center justify-center bg-black/50">
        <div class="text-center text-white">
          <div class="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-white"></div>
          <p>Loading stream...</p>
        </div>
      </div>

      <div v-if="hasError" class="absolute inset-0 flex items-center justify-center bg-black/50">
        <div class="text-center text-white">
          <p class="text-red-400 mb-4">Failed to load stream</p>
          <button class="bg-red-500 hover:bg-red-600 rounded px-4 py-2" @click="retry">Retry</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  hlsUrl: string
  viewerCount?: number
}

const props = defineProps<Props>()

const videoEl = ref<HTMLVideoElement | null>(null)
const isLoading = ref(true)
const hasError = ref(false)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let hls: any = null

const onLoadStart = () => {
  isLoading.value = true
  hasError.value = false
}

const onCanPlay = () => {
  isLoading.value = false
  hasError.value = false
}

const onError = (event: Event) => {
  console.error('Video error:', event)
  isLoading.value = false
  hasError.value = true
}

const retry = () => {
  if (videoEl.value) {
    videoEl.value.load()
  }
}

const initHLS = async () => {
  if (!videoEl.value) return

  try {
    const Hls = (await import('hls.js')).default

    if (Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90,
      })

      hls.loadSource(props.hlsUrl)
      hls.attachMedia(videoEl.value)

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        console.log('HLS manifest parsed')
        isLoading.value = false
      })

      hls.on(Hls.Events.ERROR, (_event: unknown, data: { fatal: boolean }) => {
        console.error('HLS error:', data)
        if (data.fatal) {
          hasError.value = true
          isLoading.value = false
        }
      })
    } else if (videoEl.value.canPlayType('application/vnd.apple.mpegurl')) {
      videoEl.value.src = props.hlsUrl
    } else {
      throw new Error('HLS not supported')
    }
  } catch (error) {
    console.error('Failed to initialize HLS:', error)
    hasError.value = true
    isLoading.value = false
  }
}

onMounted(() => {
  if (videoEl.value) {
    initHLS()
  }
})

onUnmounted(() => {
  if (hls) {
    hls.destroy()
  }
})

watch(hasError, (error) => {
  if (error) {
    setTimeout(() => {
      retry()
    }, 3000)
  }
})
</script>
