<script setup lang="ts">
const emit = defineEmits<{
  click: [value: 'left' | 'right']
}>()
</script>

<template>
  <div class="inline-flex items-center gap-3 bg-dark-400">
    <button
      class="relative flex size-14 items-center justify-center bg-gradient-to-r from-primary-500 fill-white transition-all duration-300 ease-out hover:bg-primary-500 focus:bg-primary-500"
      aria-label="Previous"
      @click="emit('click', 'left')">
      <NuxtIcon name="local:chevron-bold" class="text-[24px]" />
    </button>

    <button
      class="relative flex size-14 scale-x-[-1] items-center justify-center bg-gradient-to-r from-primary-500 fill-white transition-all duration-300 ease-out hover:bg-primary-500 focus:bg-primary-500"
      aria-label="Next"
      @click="emit('click', 'right')">
      <NuxtIcon name="local:chevron-bold" class="pr-1 text-[24px]" />
    </button>
  </div>
</template>
