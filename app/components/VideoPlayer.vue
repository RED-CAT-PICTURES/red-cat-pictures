<template>
  <div class="w-full overflow-hidden rounded-xl bg-black">
    <div class="relative">
      <video ref="videoEl" :src="src" class="w-full" @timeupdate="onTimeUpdate" @loadedmetadata="onLoaded" />
      <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3">
        <input v-model.number="currentTime" type="range" min="0" :max="duration" step="0.1" class="accent-brand w-full" @input="onSeek" />
        <div class="mt-2 flex items-center gap-3 text-white">
          <button class="rounded bg-white/10 px-3 py-1 hover:bg-white/20" @click="toggle">
            {{ playing ? 'Pause' : 'Play' }}
          </button>
          <button class="rounded bg-white/10 px-3 py-1 hover:bg-white/20" @click="toggleMute">
            {{ muted ? 'Unmute' : 'Mute' }}
          </button>
          <input v-model.number="volume" type="range" min="0" max="1" step="0.01" @input="onVolume" />
          <select v-model.number="playbackRate" class="ml-auto rounded bg-white/10 px-2 py-1 text-white" @change="onRate">
            <option :value="0.5">0.5x</option>
            <option :value="1">1x</option>
            <option :value="1.5">1.5x</option>
            <option :value="2">2x</option>
          </select>
          <button class="rounded bg-white/10 px-3 py-1 hover:bg-white/20" @click="toggleFullscreen">Fullscreen</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ src: string }>()

const videoEl = ref<HTMLVideoElement | null>(null)
const playing = ref(false)
const muted = ref(false)
const duration = ref(0)
const currentTime = ref(0)
const volume = ref(1)
const playbackRate = ref(1)

function onLoaded() {
  if (videoEl.value) {
    duration.value = videoEl.value.duration || 0
  }
}

function onTimeUpdate() {
  if (videoEl.value) {
    currentTime.value = videoEl.value.currentTime
  }
}

function toggle() {
  const v = videoEl.value
  if (!v) return
  if (v.paused) {
    v.play()
    playing.value = true
  } else {
    v.pause()
    playing.value = false
  }
}

function onSeek() {
  if (videoEl.value) videoEl.value.currentTime = currentTime.value
}

function toggleMute() {
  const v = videoEl.value
  if (!v) return
  v.muted = !v.muted
  muted.value = v.muted
}

function onVolume() {
  if (videoEl.value) videoEl.value.volume = volume.value
}

function onRate() {
  if (videoEl.value) videoEl.value.playbackRate = playbackRate.value
}

function toggleFullscreen() {
  const v = videoEl.value
  if (!v) return
  if (document.fullscreenElement) document.exitFullscreen()
  else v.requestFullscreen()
}
</script>
