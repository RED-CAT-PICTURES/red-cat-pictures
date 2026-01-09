<script setup lang="ts">
const emit = defineEmits<{
  contact: []
}>()
</script>

<template>
  <div class="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 gap-0.5 overflow-hidden bg-white shadow-[0_0_28px_10px_rgba(205,45,45,0.3)] dark:bg-black">
    <ButtonCTA @click="emit('contact')" />
  </div>
</template>
