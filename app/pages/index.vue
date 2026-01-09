<script setup lang="ts">
const title = `Product Photographer in Kolkata | India`
const description = `Create your brand identity that speaks to your clients, with our product photography and videography service`

const {
  app: { buildTime },
  public: { siteUrl },
} = useRuntimeConfig()
const imageUrl = `${siteUrl}/previews/landing.jpg`

definePageMeta({
  layout: 'landing',
})

useHead({
  bodyAttrs: {
    class: 'scrollbar-hidden',
  },
})

useSeoMeta({
  ogImage: imageUrl,
  twitterImage: imageUrl,
  title: title,
  ogTitle: title,
  twitterTitle: title,
  description: description,
  ogDescription: description,
  twitterDescription: description,
  ogUrl: siteUrl,
})

const { data: allPhotos } = await useAPI<Photo[]>('/api/photo', { default: (): Photo[] => [] })
const { data: allVideos } = await useAPI('/api/video', { default: () => [] })

const featuredVideo = computed(() => allVideos.value.find(({ type }) => type === 'hero')!)
const videos = computed(() => allVideos.value.filter(({ type }) => type === 'feature'))
/* const featuredPhotos = allPhotos
  .value!.filter(({ featured, category }) => featured !== null && (category === 'product' || category === 'food'))
  .toSorted((a, b) => a.featured! - b.featured!)
  .slice(0, 4) */

useSchemaOrg([
  defineOrganization({
    name: 'RED CAT PICTURES',
    description: description,
    image: imageUrl,
    logo: siteUrl + '/logo-dark.png',
    url: siteUrl,
    address: {
      streetAddress: '17 NS Road, Vivekananda pally near Joyram Bhavan, rajpur sonarpur',
      addressLocality: 'Kolkata',
      addressRegion: 'WB',
      postalCode: '700146',
      addressCountry: 'IN',
    },
    sameAs: [
      'https://wa.me/c/918910489578',
      'https://www.instagram.com/redcatpictures',
      'https://www.facebook.com/redcatpictures',
      'https://www.linkedin.com/company/red-cat-pictures',
      'https://www.youtube.com/@red_cat_pictures',
      'https://maps.app.goo.gl/uWqh8LjcF5ez4WZY8',
    ],
  }),
  defineWebSite({
    url: siteUrl,
    name: title,
    description: description,
  }),
  defineWebPage({
    datePublished: new Date(2023, 10, 24).toISOString(),
    dateModified: buildTime,
    author: 'Shirsendu Bairagi',
  }),
  defineBreadcrumb({
    itemListElement: [
      { name: 'Photo', item: '/photo' },
      { name: 'Video', item: '/video' },
      { name: 'Episode', item: '/episode' },
      { name: 'Blog', item: '/blog' },
      { name: 'About Us', item: '/about' },
    ],
  }),
  /*   featuredPhotos.map(({ title, image, aspectRatio, url }) =>
      defineImage({
        caption: title,
        contentUrl: `${cdnUrl}/media/image/f_jpeg&fit_cover&s_${Math.round(640 * aspectRatio)}x${640}/${extractCdnId(image)}`,
        width: Math.round(640 * aspectRatio),
        height: 640,
        url: url,
      })
    ), */
])

const { proxy: gaProxy } = useScriptGoogleAnalytics()

const activeCategory = ref<Category>('product')
const activePhotoName = useState<string>()
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
</script>

<template>
  <div>
    <LazyButtonFloatingAction hydrate-on-idle :active-category="activeCategory" />
    <SectionHero :video="featuredVideo" class="fixed inset-0 -z-10" @contact="onContact(true)" />
    <div class="gradient mt-[100vh] flex flex-col gap-4 bg-light-400 px-2 dark:bg-dark-400 md:px-4">
      <SectionPhotoGallery :photos="allPhotos" :active-photo="activePhotoName" @active="(name) => (activePhotoName = name)" />
      <LazySectionVideoGallery hydrate-on-visible :videos="videos" :active-category="activeCategory" />
      <LazySectionFeaturedPhoto
        hydrate-on-visible
        :photos="allPhotos"
        :active-category="activeCategory"
        :active-photo="activePhotoName"
        @active="(name) => (activePhotoName = name)"
        @update="(value) => (activeCategory = value)" />
      <SectionPricing :photos="allPhotos" @contact="onContact(true)" />
    </div>
  </div>
</template>
