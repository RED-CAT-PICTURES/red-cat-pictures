<script setup lang="ts">
import RxPlayer from 'rx-player'

const {
  public: { cdnUrl },
} = useRuntimeConfig()

type Orientation = 'portrait' | 'landscape'

const props = withDefaults(
  defineProps<{
    media: string
    multiOrentation?: boolean
    poster?: string
    controlsList?: string
    preload?: 'none' | 'metadata' | 'auto'
    controls?: boolean
    autoplay?: boolean
    state?: 'play' | 'pause' | 'stop'
    muted?: boolean
    playsinline?: boolean
    disablePictureInPicture?: boolean
  }>(),
  {
    multiOrentation: false,
    poster: undefined,
    controlsList: undefined,
    preload: 'auto',
    controls: false,
    autoplay: false,
    state: 'stop',
    muted: false,
    playsinline: false,
    disablePictureInPicture: false,
  }
)

const emit = defineEmits<{
  started: []
  buffer: [value: number]
  progress: [value: number]
  ended: []
}>()

const videoRef = useTemplateRef<HTMLVideoElement>('videoRef')
let player: RxPlayer

defineExpose({ videoRef })

watch(
  () => props.state,
  async (value) => {
    switch (value) {
      case 'play':
        await videoRef.value?.play()
        break
      case 'pause':
        videoRef.value?.pause()
        break
      case 'stop':
        videoRef.value?.pause()
        break
      default:
        break
    }
  }
)

const progress = ref(0)
const buffer = ref(0)
const isVideoLoaded = ref(false)

function handleError(e?: Error) {
  console.error('Video Error occurred:', e)
}

function handleCanPlay() {
  // console.log('Video can start playing')
}

function handlePlay() {
  // console.log('Video played')
}

function handlePause() {
  // console.log('Video paused')
}

function handleLoadedData() {
  isVideoLoaded.value = true
}

function handleProgress() {
  if (!videoRef.value) return

  const { currentTime, duration } = videoRef.value
  if (duration > 0) {
    progress.value = currentTime / duration
    emit('progress', progress.value)
  }
}

function handleEnded() {
  progress.value = 1
  emit('progress', progress.value)
  emit('ended')
}

const { width, height } = useElementSize(videoRef)

// TODO: remove when hero video is same as landscape and portrait
const adaptivePoster = computed(() => {
  const orientation = width.value > height.value ? 'landscape' : 'portrait'
  return props.poster ? `${cdnUrl}/media/image/fit_cover&${orientation === 'portrait' ? 'h' : 'w'}_720/${extractCdnId(props.poster)}` : '/previews/placeholder-blank.jpg'
})

const streamStats = ref({
  bitrate: 0,
  codec: '',
  resolution: '',
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const formattedBitrate = computed(() => {
  const bps = streamStats.value.bitrate || 0
  return bps > 1000000 ? `${(bps / 1000000).toFixed(2)} Mbps` : `${Math.round(bps / 1000)} kbps`
})

const currentOrientation = computed<Orientation>(() => (width.value > height.value ? 'landscape' : 'portrait'))

const activeSource = computed(() => (props.multiOrentation ? `${props.media}-${currentOrientation.value}` : props.media))

onMounted(() => {
  player = new RxPlayer({
    videoElement: videoRef.value!,
  })

  player.addEventListener('videoRepresentationChange', (rep) => {
    if (rep) {
      streamStats.value = {
        bitrate: rep.bitrate || 0,
        codec: rep.codec || 'unknown',
        resolution: rep.width && rep.height ? `${rep.width}x${rep.height}` : 'unknown',
      }
    }
  })

  // Add buffer tracking
  player.addEventListener('positionUpdate', () => {
    buffer.value = parseFloat(player.getCurrentBufferGap().toFixed(2))
    if (buffer.value !== undefined) {
      emit('buffer', 0)
    }
  })

  player.loadVideo({
    url: `${cdnUrl}/media/video/s_720-1080/${activeSource.value}.mpd`,
    transport: 'dash',
    autoPlay: props.autoplay,
  })
})

watch(activeSource, (newSource, oldSource) => {
  if (!player || newSource === oldSource) return

  const currentTime = videoRef.value?.currentTime || 0
  const wasPlaying = !videoRef.value?.paused

  player.loadVideo({
    url: `${cdnUrl}/media/video/s_720-1080/${newSource}.mpd`,
    transport: 'dash',
    autoPlay: props.autoplay,
    startAt: { position: currentTime },
  })

  if (wasPlaying) {
    videoRef.value?.play()
  }
})
</script>

<template>
  <!-- <div class="size-full bg-black"> -->
  <video
    ref="videoRef"
    class="size-full"
    :poster="adaptivePoster"
    :controlsList="controlsList"
    :preload="preload"
    :controls="controls"
    :autoplay="autoplay"
    :muted="muted"
    :playsinline="playsinline"
    :disablePictureInPicture="disablePictureInPicture"
    :class="{ shimmer: !isVideoLoaded }"
    @error="handleError()"
    @canplay="handleCanPlay"
    @play="handlePlay"
    @pause="handlePause"
    @timeupdate="handleProgress"
    @ended="handleEnded"
    @loadeddata="handleLoadedData"
    @loadedmetadata="handleLoadedData"
    @contextmenu.prevent>
    Your browser does not support the video tag.
  </video>
  <!-- STATS OVERLAY -->
  <!-- <div v-if="isVideoLoaded"
      class="absolute bottom-2 right-2 bg-black/60 text-white text p-2 rounded font-mono pointer-events-none">
      <p>Bitrate: {{ formattedBitrate }}</p>
      <p>Resolution: {{ streamStats.resolution }}</p>
      <p>Codec: {{ streamStats.codec }}</p>
      <p>Buffer: {{ buffer }} sec</p>
    </div> -->
  <!-- </div> -->
</template>
