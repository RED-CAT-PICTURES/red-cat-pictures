<template>
  <section>
    <h1 class="text-4xl font-bold">Live Streams</h1>
    <p class="text-slate-600 mt-2">Watch past, present, and future streams from our creators.</p>

    <div class="mt-10 space-y-12">
      <div>
        <h2 class="font-semibold flex items-center gap-2 text-2xl">Present <span class="text-brand text-base">(Live)</span></h2>
        <div class="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <VideoCard v-for="v in liveVideos" :key="v.id" :video="v" />
        </div>
      </div>

      <div>
        <h2 class="font-semibold text-2xl">Past (VOD)</h2>
        <div class="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <VideoCard v-for="v in pastVideos" :key="v.id" :video="v" />
        </div>
      </div>

      <div>
        <h2 class="font-semibold text-2xl">Future (Coming Soon)</h2>
        <div class="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <VideoCard v-for="v in upcomingVideos" :key="v.id" :video="v" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Video } from '../../../types'
import { useLiveStreams } from '../../composables/useLiveStreams'

const { data } = await useFetch<Video[]>('/api/videos')
const videos = computed(() => data.value ?? [])

const { connectSSE, fetchStreams } = useLiveStreams()

onMounted(() => {
  connectSSE()
  fetchStreams()
})

const liveVideos = computed(() => videos.value.filter((v) => v.status === 'live'))
const pastVideos = computed(() => videos.value.filter((v) => v.status === 'past'))
const upcomingVideos = computed(() => videos.value.filter((v) => v.status === 'upcoming'))
</script>
