<template>
  <section class="grid gap-8 lg:grid-cols-12">
    <div class="lg:col-span-8">
      <LiveStreamPlayer v-if="video && video.status === 'live'" :hls-url="video.videoUrl" :viewer-count="liveViewCount" />
      <VideoPlayer v-else-if="video" :src="video.videoUrl" />

      <div class="mt-4">
        <h1 class="font-semibold text-2xl">{{ video?.title }}</h1>
        <div class="text-slate-600 mt-2 flex items-center gap-4">
          <span v-if="video?.status === 'live' && liveViewCount > 0" class="text-red-600 font-medium flex items-center gap-1">
            <div class="bg-red-500 h-2 w-2 animate-pulse rounded-full"></div>
            {{ liveViewCount.toLocaleString() }} watching now
          </span>
          <span v-else-if="video?.views"> {{ video?.views?.toLocaleString() }} views </span>
          <span>{{ video?.postedDate }}</span>
          <NuxtLink to="#" class="bg-brand ml-auto rounded-md px-3 py-1.5 text-white"> Subscribe </NuxtLink>
        </div>
        <details class="mt-4 rounded-md border bg-white p-4">
          <summary class="font-medium cursor-pointer">Description</summary>
          <p class="text-slate-700 mt-2">{{ video?.description }}</p>
        </details>
      </div>

      <CommentSection class="mt-6" />
    </div>
    <aside class="space-y-4 lg:col-span-4">
      <h3 class="font-semibold text-lg">More videos</h3>
      <VideoCard v-for="item in others" :key="item.id" :video="item" />
    </aside>
  </section>
</template>

<script setup lang="ts">
import type { Video } from '../../types'
import VideoPlayer from '../../components/VideoPlayer.vue'
import LiveStreamPlayer from '../../components/LiveStreamPlayer.vue'
import CommentSection from '../../components/CommentSection.vue'
import VideoCard from '../../components/VideoCard.vue'
import { useLiveStreams } from '../../composables/useLiveStreams'

const route = useRoute()
const id = route.params.id as string
const { data } = await useFetch<Video[]>('/api/videos')
const all = computed(() => data.value ?? [])
const video = computed(() => all.value.find((v) => v.id === id))
const others = computed(() => all.value.filter((v) => v.id !== id && v.status !== 'upcoming').slice(0, 5))

const { getViewCount, connectSSE } = useLiveStreams()

onMounted(() => {
  connectSSE()
})

const liveViewCount = computed(() => {
  if (!video.value || video.value.status !== 'live') return 0
  return getViewCount(video.value.id).value
})
</script>
