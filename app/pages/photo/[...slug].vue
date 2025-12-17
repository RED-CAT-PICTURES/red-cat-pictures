<script setup lang="ts">
definePageMeta({
  layout: false,
})

const route = useRoute()
const slug = route.params.slug!.toString()
const { data: photos } = await useAPI('/api/photo', { default: () => [] })

const activePhotoSlug = computed<string>(() => slugify(slug))
const activePhoto = computed(() => photos.value.find(({ id }) => id === activePhotoSlug.value))

if (!activePhoto.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found' })
}

const title = `${activePhoto.value.title}`
const shortTitle = stringTrim(title, 45, 60)
const description = `${activePhoto.value.description}`
const shortDescription = stringTrim(description, 90, 110)
const {
  public: { siteUrl, cdnUrl },
} = useRuntimeConfig()
const url = `${siteUrl}/photo/${activePhotoSlug.value}`
const cover = activePhoto.value?.image ? extractCdnId(activePhoto.value?.image) : ''
const imageUrl = `${cdnUrl}/media/image/f_jpeg&fit_cover&s_${Math.round(640 * activePhoto.value.aspectRatio)}x${640}/${cover}`

useSeoMeta({
  title: shortTitle,
  ogTitle: shortTitle,
  twitterTitle: shortTitle,
  description: shortDescription,
  ogDescription: shortDescription,
  twitterDescription: shortDescription,
  viewport: {
    initialScale: 1.0,
    maximumScale: 5.0,
    minimumScale: 1.0,
    userScalable: 'yes',
    viewportFit: 'cover',
  },
  ogImage: imageUrl,
  twitterImage: imageUrl,
  ogUrl: url,
})

useSchemaOrg([
  defineImage({
    caption: title,
    contentUrl: imageUrl,
    width: Math.round(640 * activePhoto.value.aspectRatio),
    height: 640,
    license: `${siteUrl}/license`,
    creditText: 'RED CAT PICTURES',
    creator: {
      '@type': 'ORGANIZATION',
      name: 'RED CAT PICTURES',
    },
    copyrightNotice: 'RED CAT PICTURES',
    url: url,
  }),
])

const img = useImage()
const isImageLoaded = ref(false)
</script>

<template>
  <main v-if="activePhoto" class="relative mx-auto flex h-screen w-screen flex-col items-center justify-center overflow-hidden p-4 md:p-8">
    <!-- App Header -->
    <header class="absolute left-0 right-0 top-4 mx-auto fill-black px-4 text-black dark:fill-white dark:text-white md:px-16">
      <nav class="relative z-20 grid grid-cols-3 items-center">
        <NuxtLink to="/" class="size-fit" aria-label="home">
          <NuxtIcon name="local:logo" filled class="hidden text-[64px] dark:inline md:text-[96px]" />
          <NuxtIcon name="local:logo-dark" filled class="inline text-[64px] dark:hidden md:text-[96px]" />
        </NuxtLink>
        <div class="col-start-3 justify-self-end">
          <LazyButtonColorMode hydrate-on-visible />
        </div>
      </nav>
    </header>
    <!-- App Header -->
    <div class="shimmer-overlay w-full overflow-hidden bg-light-600 dark:bg-dark-500 md:h-full md:w-auto">
      <NuxtImg
        :src="cover"
        :alt="activePhoto.description"
        height="100vh"
        loading="eager"
        preload
        :placeholder="img(cover, { width: Math.round(240 * activePhoto.aspectRatio), height: 240, q: 80 })"
        class="size-full object-contain"
        :class="{ shimmer: !isImageLoaded }"
        @load="isImageLoaded = true" />
    </div>
    <!-- <h1 class="text-center my-8">{{ activeImage.title }}</h1> -->
  </main>
</template>

<style scoped>
img {
  view-transition-name: selected-photo;
}
</style>
