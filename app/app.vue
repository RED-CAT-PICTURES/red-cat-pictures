<script setup lang="ts">
const title = `Product Photographer in Kolkata | India`
const description = `Create your brand identity that speaks to your clients, with our product photography and videograpy service`

const {
  public: { siteUrl, vapidKey },
} = useRuntimeConfig()
const imageUrl = `${siteUrl}/previews/placeholder-blank.jpg`

useHead({
  htmlAttrs: {
    lang: 'en',
  },
  link: [
    {
      rel: 'icon',
      type: 'image/x-icon',
      href: '/favicon.ico',
    },
  ],
})

useSeoMeta({
  ogSiteName: 'RED CAT PICTURES',
  ogLogo: `${siteUrl}/logo-dark.png`,
  title: title,
  ogTitle: title,
  description: description,
  ogDescription: description,
  ogImage: imageUrl,
  twitterImage: imageUrl,
  ogImageWidth: 1200,
  ogImageHeight: 630,
  fbAppId: 966242223397117,
  twitterCard: 'summary_large_image',
  colorScheme: 'light dark',
  viewport: {
    initialScale: 1.0,
    maximumScale: 1.0,
    minimumScale: 1.0,
    userScalable: 'no',
    viewportFit: 'cover',
  },
})

const { $api } = useNuxtApp()
const { isSupported, permissionGranted } = useWebNotification()

async function getExistingSubscription() {
  const registration = await navigator.serviceWorker.ready
  let subscription = await registration.pushManager.getSubscription()

  if (!subscription) {
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: vapidKey,
    })
  }

  await $api('/api/notification/push/subscribe', {
    method: 'POST',
    body: subscription.toJSON(),
  })

  return subscription
}

onMounted(async () => {
  if (isSupported.value && permissionGranted.value) await getExistingSubscription()
})

watch(permissionGranted, async (value) => {
  if (value) await getExistingSubscription()
})
</script>

<template>
  <NuxtRouteAnnouncer />
  <NuxtPwaAssets />
  <NuxtLoadingIndicator color="#CD2D2D" />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <LazyAppInstallPrompt hydrate-on-idle />
  <LazyAppVisitPrompt hydrate-on-idle />
</template>

<style>
* {
  -webkit-tap-highlight-color: transparent;
  scrollbar-width: 6px;
  @apply antialiased;
}

*::-webkit-scrollbar {
  @apply block size-[6px] bg-light-400 dark:bg-dark-400;
}

*::-webkit-scrollbar-thumb {
  @apply rounded-md bg-light-600 dark:bg-dark-600;
}

html {
  @apply relative overflow-x-hidden scroll-smooth;
}

body {
  @apply relative min-h-screen overflow-x-hidden bg-light-400 fill-black font-main text-black dark:bg-dark-400 dark:fill-white dark:text-white;
  @apply bg-gradient-to-br from-primary-500/50 to-transparent to-40%;
}

svg.iconify--local {
  @apply !m-0 !box-content;
}

.scrollbar-hidden::-webkit-scrollbar {
  display: none;
}

.scrollbar-hidden::-webkit-scrollbar {
  width: 0;
  height: 0;
}

.overlay {
  @apply after:fixed after:left-0 after:top-0 after:z-20 after:h-screen after:w-screen after:bg-gradient-to-b after:from-black/40 after:from-[3%] after:via-transparent after:via-20% after:to-black/40 after:to-[97%] after:content-[''];
}

.autoscroll-x {
  animation: scroll-x linear infinite;
}

.autoscroll-y {
  animation: scroll-y linear infinite;
}

.shimmer-overlay:has(.shimmer) {
  position: relative;
  overflow: hidden;
}

.shimmer-overlay:has(.shimmer)::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  translate: -150% -50%;
  rotate: -30deg;
  height: 200%;
  width: 100%;
  background: linear-gradient(90deg, transparent 20%, rgba(255, 255, 255, 0.2) 50%, transparent 80%);
  animation: shimmer 2s infinite;
  z-index: 50;
  pointer-events: none;
}

@keyframes shimmer {
  to {
    translate: 150% -50%;
  }
}

@keyframes scroll-x {
  from {
    transform: translateX(0);
  }

  to {
    transform: translateX(-50%);
  }
}

@keyframes scroll-y {
  from {
    transform: translateY(0);
  }

  to {
    transform: translateY(-50%);
  }
}
</style>
