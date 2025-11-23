<script setup lang="ts">
defineProps<{ href: string; title?: string }>()
const attrs = useAttrs()

const {
  public: { cdnUrl },
} = useRuntimeConfig()

const hoveredLink = ref<{
  url: string
  title: string
}>()

function showTooltip(event: TouchEvent | MouseEvent | FocusEvent) {
  const target = (event.target as HTMLElement).closest('a') as HTMLAnchorElement | null

  if (target?.classList.contains('cta')) return

  if (target) {
    hoveredLink.value =
      hoveredLink.value && hoveredLink.value.url === target.href
        ? hoveredLink.value
        : {
            url: target.href,
            title: target.title || target.textContent || '',
          }
  }
}

function hideTooltip() {
  hoveredLink.value = undefined
}

const activePhotoName = useState<string | null>()
const activeVideoName = useState<string | null>()
</script>

<template>
  <Suspense suspensible>
    <template v-if="title === 'embed' || $slots.default?.()[0]?.children === 'embed'">
      <NuxtLink :to="`/photo/${extractCdnId(href)}`" @click="activePhotoName = extractCdnId(href)">
        <NuxtImg
          :src="extractCdnId(href)"
          alt="image"
          :width="Math.round(640 * (16 / 9))"
          :height="640"
          fit="cover"
          loading="eager"
          preload
          :placeholder="[320, Math.round(320 / (16 / 9)), 50, 5]"
          class="aspect-video w-full object-cover"
          v-bind="attrs" />
      </NuxtLink>
    </template>
    <template v-else-if="title === 'video' || $slots.default?.()[0]?.children === 'video'">
      <NuxtLink :to="`/video/${extractCdnId(href)}`" @click="activeVideoName = extractCdnId(href)">
        <NuxtVideo
          :poster="`${cdnUrl}/image/fit_cover&s_1280x720/${extractCdnId(href)}`"
          :source="videoGenerateSources(extractCdnId(href), landscapePreset)"
          :disable-picture-in-picture="true"
          controls-list="nodownload"
          :autoplay="true"
          :muted="true"
          :playsinline="true"
          :loop="true"
          preload="metadata"
          class="aspect-video" />
      </NuxtLink>
    </template>
    <NuxtLink
      v-else-if="!href.startsWith('#')"
      :to="href + '?utm_source=redcatpictures.com'"
      external
      target="_blank"
      rel="noopener"
      v-bind="attrs"
      class="relative"
      @touchstart.capture="showTooltip"
      @touchend.capture="hideTooltip"
      @touchcancel.capture="hideTooltip"
      @focusin.capture="showTooltip"
      @focusout.capture="hideTooltip"
      @mouseover.capture="showTooltip"
      @mouseleave.capture="hideTooltip">
      <MDCSlot unwrap="p" />
      <LazyLinkToolTip :active-link="hoveredLink" hydrate-on-idle />
    </NuxtLink>
    <NuxtLink v-else internal :to="href" :title="title" v-bind="attrs">
      <slot />
    </NuxtLink>
  </Suspense>
</template>

<style lang="css" scoped>
a {
  @apply whitespace-normal;
}
</style>
