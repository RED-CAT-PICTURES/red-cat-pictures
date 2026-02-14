<script setup lang="ts">
import type { Service } from '~~/shared/types'

const { proxy: gaProxy } = useScriptGoogleAnalytics()
const { data: prices, pending } = await useAPI('/api/price')

const tabs = [
  { icon: 'photo', title: 'photo' },
  { icon: 'youtube', title: 'video' },
] as const

const activeTab = ref<Service>('photo')

const isModelContactOpen = useState<boolean>('isModelContactOpen', () => false)

function onContact(open: boolean) {
  isModelContactOpen.value = open
  gaProxy.gtag('event', open ? 'contact_open' : 'contact_close')
}

const packages = computed(() => {
  return prices.value?.[activeTab.value] ?? []
})

const featuredIndex = computed(() => {
  const n = packages.value.length
  return n ? Math.floor((n - 1) / 2) : 0
})

const activeIndex = ref(0)
watch(
  () => packages.value.length,
  () => (activeIndex.value = featuredIndex.value),
  { immediate: true }
)

function setActive(i: number) {
  activeIndex.value = i
}
function resetActive() {
  activeIndex.value = featuredIndex.value
}

// Carousel navigation
const scrollContainer = ref<HTMLElement | null>(null)

function scrollPrev() {
  if (!scrollContainer.value) return
  const cards = scrollContainer.value.querySelectorAll('.package-card')
  if (cards.length === 0) return

  const cardWidth = cards[0].getBoundingClientRect().width
  const gap = 48 // gap-6 = 48px

  scrollContainer.value.scrollBy({
    left: -(cardWidth + gap),
    behavior: 'smooth',
  })
}

function scrollNext() {
  if (!scrollContainer.value) return
  const cards = scrollContainer.value.querySelectorAll('.package-card')
  if (cards.length === 0) return

  const cardWidth = cards[0].getBoundingClientRect().width
  const gap = 48 // gap-6 = 48px

  scrollContainer.value.scrollBy({
    left: cardWidth + gap,
    behavior: 'smooth',
  })
}
</script>

<template>
  <section v-if="!pending" id="packages" class="relative mx-auto w-full">
    <!-- Tabs -->
    <div class="mb-6 flex w-full justify-center md:mb-10">
      <div class="inline-flex gap-2 rounded-full bg-light-400/70 p-1 dark:bg-dark-400/60" role="tablist" aria-label="Pricing service type">
        <ButtonLabel
          v-for="{ icon, title } in tabs"
          :key="title"
          :icon="icon"
          :title="title"
          :active="title === activeTab"
          role="tab"
          :aria-selected="title === activeTab"
          @click="activeTab = title" />
      </div>
    </div>
    <!-- Cards Container with Navigation -->
    <div class="relative">
      <!-- Previous Button -->
      <button
        class="absolute -left-2 top-1/2 z-10 flex -translate-y-1/2 items-center justify-center bg-primary-500 px-2 py-4 text-white shadow-lg transition-all duration-300 hover:scale-110 hover:bg-primary-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/50"
        aria-label="Previous packages"
        @click="scrollPrev">
        <NuxtIcon name="local:chevron-bold" class="text-[16px] md:text-[20px]" />
      </button>
      <div ref="scrollContainer" class="scrollbar-hidden flex snap-x snap-mandatory gap-6 overflow-x-auto px-1 md:px-12">
        <div
          v-for="({ title, price, unit, points }, index) in packages"
          :key="title"
          class="package-card shrink-0 snap-center"
          @mouseenter="setActive(index)"
          @focusin="setActive(index)"
          @mouseleave="resetActive()"
          @focusout="resetActive()">
          <CardPackage :is-active="index === activeIndex" :title="title" :price="price" :unit="unit" :points="points" @contact="onContact(true)" />
        </div>
      </div>
      <!-- Next Button -->
      <button
        class="absolute -right-2 top-1/2 z-10 flex -translate-y-1/2 items-center justify-center bg-primary-500 px-2 py-4 text-white shadow-lg transition-all duration-300 hover:scale-110 hover:bg-primary-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/50"
        aria-label="Next packages"
        @click="scrollNext">
        <NuxtIcon name="local:chevron-bold" class="rotate-180 text-[16px] md:text-[20px]" />
      </button>
    </div>
  </section>
</template>

<style scoped>
#pricing {
  scroll-margin-top: 96px;
}

#pricing :where(.overflow-x-auto)::-webkit-scrollbar {
  height: 10px;
}

#pricing :where(.overflow-x-auto)::-webkit-scrollbar-thumb {
  background: color-mix(in srgb, #000 18%, transparent);
  border-radius: 999px;
}

:global(.dark) #pricing :where(.overflow-x-auto)::-webkit-scrollbar-thumb {
  background: color-mix(in srgb, #fff 18%, transparent);
}

@media (min-width: 768px) {
  #pricing :where(.overflow-x-auto)::-webkit-scrollbar {
    height: 6px;
  }
}
</style>
