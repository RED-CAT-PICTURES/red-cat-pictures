<script setup lang="ts">
const { proxy: gaProxy } = useScriptGoogleAnalytics()
const { data: packages, pending } = await useAPI('/api/package')

const isModelContactOpen = useState<boolean>('isModelContactOpen', () => false)

function onContact(open: boolean) {
  isModelContactOpen.value = open
  gaProxy.gtag('event', open ? 'contact_open' : 'contact_close')
}
</script>

<template>
  <section v-if="!pending && packages?.length" id="packages" class="relative h-min">
    <SectionLabel icon="cart" title="Packages" />
    <div
      class="scrollbar-hidden flex aspect-[3/5] h-min snap-x snap-mandatory gap-4 overflow-x-auto text-black dark:text-white md:mx-auto md:grid md:aspect-auto md:max-w-4xl md:grid-cols-2 md:overflow-visible">
      <article
        v-for="plan in packages"
        :key="plan.id"
        class="relative flex w-[78vw] min-w-[78vw] flex-shrink-0 snap-start flex-col overflow-hidden border border-light-600 bg-light-500 transition-transform duration-300 dark:border-dark-600 dark:bg-dark-500 md:w-auto md:min-w-0 md:flex-shrink md:hover:-translate-y-1">
        <div class="relative h-36 w-full overflow-hidden bg-gradient-to-br from-light-500 to-light-600 dark:from-dark-500 dark:to-dark-600"></div>

        <div class="flex flex-1 flex-col gap-4 p-5">
          <div>
            <h2 class="text-xl font-bold">
              {{ plan.title }}
            </h2>
            <p class="mt-1 text-xs font-regular leading-relaxed">
              {{ plan.subtitle }}
            </p>
          </div>

          <div class="flex items-baseline gap-1">
            <span class="text-sm font-semi-bold">₹</span>
            <span class="text-2xl font-bold tracking-tight">
              {{ plan.price === 'custom' ? 'Custom' : Number(plan.price).toLocaleString('en-IN') }}
            </span>
            <span class="text-xs font-regular"> / {{ plan.unit }} </span>
          </div>

          <button
            class="w-full border border-light-600 bg-light-600/40 py-3 text-sm font-semi-bold transition-all duration-200 hover:bg-light-600 active:scale-95 dark:border-dark-600 dark:bg-dark-600/40 hover:dark:bg-dark-600"
            @click="onContact(true)">
            Contact Us
          </button>

          <hr class="border-dark-600" />

          <ul class="flex flex-col gap-2">
            <li v-for="feature in plan.features" :key="feature.title" class="flex items-center gap-2 text-sm font-regular">
              <NuxtIcon name="local:badge-check" class="fill-primary-500 text-[20px]" />
              <span>{{ feature.title }}</span>
            </li>
          </ul>
        </div>
      </article>
    </div>
  </section>
</template>
