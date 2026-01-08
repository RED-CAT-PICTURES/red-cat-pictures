<script setup lang="ts">
const props = defineProps<{
  photos: Photo[]
  activePhoto?: string
}>()

const emit = defineEmits<{
  active: [value: string]
}>()

const categoryOrder = ['product', 'food', 'ecommerce'] as Category[]

const allPhotos = computed(() => {
  const filterPhotos = props.photos.filter(({ gallery }) => gallery)
  return categoryOrder.flatMap((cat) => filterPhotos.filter((p) => p.category === cat))
})

const slider = useTemplateRef<HTMLDivElement>('slider')
const { height: sliderHeight } = useElementSize(slider)
</script>

<template>
  <section id="photo-gallery" class="relative z-0 h-screen overflow-hidden">
    <SectionLabel icon="grid" title="Photo Gallery" />
    <div class="overflow-hidden">
      <div ref="slider" class="autoscroll-y relative z-10 grid grid-cols-2 gap-2 md:grid-cols-4 2xl:grid-cols-6" :style="{ animationDuration: 0.008 * sliderHeight + 's' }">
        <template v-for="dupIndex in [1, 2]" :key="dupIndex">
          <NuxtLink v-for="{ id, title, image, description, url } in allPhotos" :key="`${dupIndex}-${id}`" :to="url" @click="emit('active', `${dupIndex}-${title}`)">
            <NuxtImg
              :src="extractCdnId(image)"
              :alt="description"
              :width="420"
              :height="Math.round(420 / (3 / 4))"
              sizes="50vw md:25vw 2xl:16vw"
              fit="cover"
              loading="lazy"
              :placeholder="[120, Math.round(120 / (3 / 4)), 50, 5]"
              class="aspect-[3/4] size-full bg-light-600 object-cover dark:bg-dark-500"
              :class="{ active: activePhoto === `${dupIndex}-${title}` }" />
          </NuxtLink>
        </template>
      </div>
    </div>
  </section>
</template>

<style scoped>
img.active {
  view-transition-name: selected-photo;
}
</style>
