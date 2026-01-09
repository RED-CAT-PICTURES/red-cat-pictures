<script setup lang="ts">
const { proxy: gaProxy } = useScriptGoogleAnalytics()

const isModelContactOpen = useState<boolean>('isModelContactOpen', () => false)

function onContact(action: boolean) {
  if (action) {
    isModelContactOpen.value = true
    gaProxy.gtag('event', 'contact_open')
  } else {
    isModelContactOpen.value = false
    gaProxy.gtag('event', 'contact_close')
  }
}

const route = useRoute()
const hasFloatingActionButton = computed(() => route.path === '/')

const isLightMode = ref(true)
const isDarkMode = ref(false)
</script>

<template>
  <div class="isolate flex min-h-screen w-screen flex-col items-center justify-start">
    <LazyAppHeader hydrate-on-idle :color-mode="isLightMode ? 'light' : isDarkMode ? 'dark' : 'auto'" />
    <main class="relative mx-auto flex w-full grow flex-col gap-4">
      <slot />
    </main>
    <div class="w-full bg-light-400 dark:bg-dark-400">
      <LazyAppFooter hydrate-on-visible :has-floating-action-button="hasFloatingActionButton" @contact="onContact(true)" />
    </div>
    <LazyModalContact v-show="isModelContactOpen" hydrate-on-visible :is-open="isModelContactOpen" @close="onContact(false)" />
  </div>
</template>
