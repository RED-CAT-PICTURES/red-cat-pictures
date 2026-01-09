<script setup lang="ts">
import iconLogo from '~/assets/icons/logo.svg'
import iconLogoDark from '~/assets/icons/logo-dark.svg'

const { $pwa } = useNuxtApp()
const { proxy: gaProxy } = useScriptGoogleAnalytics()

function onInstall() {
  gaProxy.gtag('event', 'install')
  $pwa?.install()
}

const isDark = useDark()
</script>

<template>
  <div v-if="$pwa?.showInstallPrompt && !$pwa?.offlineReady && !$pwa?.needRefresh" class="fixed left-0 top-2/3 z-50 -translate-y-1/2 md:top-1/2" role="alert">
    <button class="flex flex-col items-center gap-3 rounded-r-2xl bg-white px-2 pb-4 pt-3 hover:bg-light-400 dark:bg-dark-500 dark:hover:bg-dark-400" aria-label="Install PWA" @click="onInstall">
      <img :src="isDark ? iconLogo : iconLogoDark" alt="red-cat-pictures-logo" :width="32" :height="32" />
      <div class="[writing-mode:vertical-rl]">
        <span class="font-semibold rotate-180 whitespace-nowrap text-sm tracking-wide text-black dark:text-white"> Install App </span>
      </div>
    </button>
  </div>
</template>
