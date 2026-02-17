<template>
  <NuxtLink :to="link" class="shadow-card group block overflow-hidden rounded-xl bg-white transition-shadow hover:shadow-lg">
    <div class="relative">
      <img :src="video.thumbnailUrl" :alt="video.title" class="h-48 w-full object-cover" />
      <span v-if="video.status === 'live'" class="font-semibold bg-red-500 absolute left-3 top-3 flex items-center gap-1 rounded px-2 py-1 text-xs text-white">
        <div class="h-2 w-2 animate-pulse rounded-full bg-white"></div>
        LIVE
      </span>
      <span v-if="video.status === 'upcoming' && video.scheduledTime" class="font-medium text-slate-800 absolute left-3 top-3 rounded bg-white/90 px-2 py-1 text-xs">
        {{ scheduleLabel }}
      </span>

      <div v-if="video.status === 'live' && liveViewCount > 0" class="font-medium absolute right-3 top-3 rounded bg-black/50 px-2 py-1 text-xs text-white">
        {{ liveViewCount.toLocaleString() }} watching
      </div>
    </div>
    <div class="p-4">
      <h3 class="font-semibold group-hover:text-brand text-lg leading-snug">
        {{ video.title }}
      </h3>
      <p class="text-slate-600 mt-2 line-clamp-2 text-sm">
        {{ video.description }}
      </p>
      <div class="mt-4 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <img :src="video.creator.avatarUrl" :alt="video.creator.name" class="h-8 w-8 rounded-full" />
          <div class="text-sm">
            <p class="font-medium">{{ video.creator.name }}</p>
            <p class="text-slate-500">{{ video.postedDate }}</p>
          </div>
        </div>
        <div v-if="video.status === 'past' && video.views" class="text-slate-500 text-xs">{{ video.views.toLocaleString() }} views</div>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { Video } from '../../types'
import { useLiveStreams } from '../composables/useLiveStreams'

const props = defineProps<{ video: Video }>()

const { getViewCount } = useLiveStreams()

const link = computed(() => (props.video.status === 'upcoming' ? '#' : `/watch/${props.video.id}`))

const scheduleLabel = computed(() => {
  if (!props.video.scheduledTime) return ''
  const dt = new Date(props.video.scheduledTime)
  return dt.toLocaleString()
})

const liveViewCount = computed(() => {
  if (props.video.status !== 'live') return 0
  return getViewCount(props.video.id).value
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
