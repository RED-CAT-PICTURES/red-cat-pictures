<script setup lang="ts">
definePageMeta({
  layout: false,
})

const route = useRoute()
const slug = route.params.slug!.toString()
const { data: videos } = await useAPI('/api/video', { default: () => [] })

const activeVideoSlug = computed<string>(() => slugify(slug))
const activeVideo = computed(() => videos.value.find(({ id }) => id === activeVideoSlug.value))

if (!activeVideo.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found' })
}

const title = `${activeVideo.value.title}`
const shortTitle = stringTrim(title, 45, 60)
const description = `${activeVideo.value.description}`
const shortDescription = stringTrim(description, 90, 110)
const {
  public: { siteUrl, cdnUrl },
} = useRuntimeConfig()
const url = `${siteUrl}/video/${activeVideoSlug.value}`
const cover = activeVideo.value?.poster ? extractCdnId(activeVideo.value?.poster) : ''
const imageUrl = `${cdnUrl}/image/f_jpeg&fit_cover&s_1200x630/${cover}`

useSeoMeta({
  ogType: 'video.other',
  title: shortTitle,
  ogTitle: shortTitle,
  twitterTitle: shortTitle,
  description: shortDescription,
  ogDescription: shortDescription,
  twitterDescription: shortDescription,
  ogImage: imageUrl,
  twitterImage: imageUrl,
  ogUrl: url,
})

useSchemaOrg([
  defineVideo({
    name: title,
    description,
    thumbnailUrl: imageUrl,
    url: url,
  }),
])

const activeVideoIndex = ref(0)

async function updateVideoIndex() {
  activeVideoIndex.value = (activeVideoIndex.value + 1) % videos.value.length
}

const videoContainerRef = useTemplateRef<HTMLVideoElement>('videoContainerRef')
const videoRef = computed(() => videoContainerRef.value as HTMLVideoElement)
const { isFullscreen, toggle } = useFullscreen(videoRef)

async function toggleFullScreen() {
  if (!videoRef.value) return
  await toggle()

  videoRef.value.muted = !isFullscreen.value
  videoRef.value.play()
}
</script>

<template>
  <main v-if="activeVideo" class="shimmer-overlay relative mx-auto flex h-screen w-screen flex-col items-center justify-center overflow-hidden p-4 md:p-8">
    <NuxtVideo
      ref="videoContainerRef"
      :key="activeVideoSlug"
      :poster="cover"
      :source="activeVideo.sources"
      :disable-picture-in-picture="true"
      controls-list="nodownload"
      :autoplay="true"
      :muted="true"
      :playsinline="true"
      preload="metadata"
      class="aspect-video cursor-pointer"
      @ended="updateVideoIndex"
      @click="toggleFullScreen()" />
  </main>
</template>
