<script setup lang="ts">
import RxPlayer from 'rx-player'

const {
  public: { cdnUrl },
} = useRuntimeConfig()

type Orientation = 'portrait' | 'landscape'

interface Source {
  src: string
  orientation: Orientation
  // resolution: Resolution
}

const props = withDefaults(
  defineProps<{
    source: Source[]
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
  progress: [value: number]
  ended: []
}>()

const videoRef = useTemplateRef<HTMLVideoElement>('videoRef')
let player: RxPlayer

defineExpose({ videoRef })

watch(
  () => props.source,
  async () => {
    if (!videoRef.value) return

    videoRef.value.pause()
    videoRef.value.currentTime = 0
    await videoRef.value.play()
  }
)

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

// const qualtiy = 80
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

// Helper to format bitrate (bps -> kbps/Mbps)
/* const formattedBitrate = computed(() => {
  const bps = streamStats.value.bitrate || 0
  return bps > 1000000
    ? `${(bps / 1000000).toFixed(2)} Mbps`
    : `${Math.round(bps / 1000)} kbps`
}) */

const currentOrientation = computed<Orientation>(() => (width.value > height.value ? 'landscape' : 'portrait'))

// Add this computed to get the correct source based on orientation
const activeSource = computed(() => props.source.find((s) => s.orientation === currentOrientation.value) || props.source[0]!)

onMounted(() => {
  player = new RxPlayer({
    videoElement: videoRef.value!,
  })

  // LISTEN FOR QUALITY CHANGES
  player.addEventListener('videoRepresentationChange', (rep) => {
    if (rep) {
      streamStats.value = {
        bitrate: rep.bitrate || 0,
        codec: rep.codec || 'unknown',
        resolution: rep.width && rep.height ? `${rep.width}x${rep.height}` : 'unknown',
      }
    }
  })

  player.loadVideo({
    url: `${cdnUrl}/media/video/s_720-1080/${extractCdnId(activeSource.value.src)}.mpd`,
    transport: 'dash',
    autoPlay: props.autoplay,
  })
})

// Watch orientation changes and reload appropriate video
watch(activeSource, (newSource, oldSource) => {
  if (!player || newSource.src === oldSource?.src) return

  const currentTime = videoRef.value?.currentTime || 0
  const wasPlaying = !videoRef.value?.paused

  player.loadVideo({
    url: `${cdnUrl}/media/video/s_720-1080/${extractCdnId(newSource.src)}.mpd`,
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
    @loadedmetadata="handleLoadedData">
    <!--  <template v-if="Array.isArray(source)">
      <source v-for="{ src, type, media, codec, orientation } of source" :key="src"
        :src="`${cdnUrl}/media/video/s_${videoFitCoverAspect(orientation, orientation === 'landscape' ? 16 / 9 : 9 / 16, width, height)}&c_${codec}&q_${qualtiy}/${src}`"
        :type="type" :media="media" />
    </template>
<template v-else>
      <source
        :src="`${cdnUrl}/media/video/s_${videoFitCoverAspect(source.orientation, source.orientation === 'landscape' ? 16 / 9 : 9 / 16, width, height)}&c_${source.codec}&q_${qualtiy}/${source.src}`"
        :type="source.type" />
    </template> -->
    Your browser does not support the video tag.
  </video>

  <!-- STATS OVERLAY -->
  <!--  <div v-if="isVideoLoaded"
      class="absolute top-2 left-2 bg-black/60 text-white text-xs p-2 rounded font-mono pointer-events-none">
      <p>Res: {{ streamStats.resolution }}</p>
      <p>Bitrate: {{ formattedBitrate }}</p>
      <p>Codec: {{ streamStats.codec }}</p>
    </div> -->
  <!-- </div> -->
</template>
