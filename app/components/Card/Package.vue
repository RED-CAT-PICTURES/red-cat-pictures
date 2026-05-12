<script setup lang="ts">
defineProps<{ package: Package }>()

const emit = defineEmits<{
  contact: []
}>()
</script>

<template>
  <article
    class="relative flex aspect-[418/628] flex-shrink-0 snap-start flex-col overflow-hidden bg-light-500 p-6 transition-transform duration-300 dark:bg-dark-500 md:w-auto md:min-w-0 md:max-w-[418px] md:flex-shrink md:hover:-translate-y-1">
    <div class="absolute -top-1/2 left-1/2 aspect-square w-full -translate-x-1/2">
      <div class="aspect-square w-full rounded-full bg-primary-500/50 blur-[120px]" />
      <!-- Secondary deeper glow -->
      <div class="absolute left-1/2 top-1/2 aspect-square w-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-500/30 blur-[80px]" />
    </div>
    <div class="relative mt-16 flex max-w-80 flex-1 flex-col justify-start gap-4 md:mt-32">
      <div>
        <h2 class="text-lg font-bold md:text-xl">
          {{ package.title }}
        </h2>
        <p class="mt-2 text-xs md:text-sm">
          {{ package.subtitle }}
        </p>
      </div>

      <div class="flex items-baseline gap-1">
        <span class="text-2xl capitalize"> ₹{{ package.price }} </span>
        <span class="ml-0.5 text-lg"> / {{ package.unit }} </span>
      </div>

      <button
        class="w-full border border-light-600 bg-light-600/40 py-3 text-sm font-semi-bold transition-all duration-200 hover:bg-light-600 active:scale-95 dark:border-dark-600 dark:bg-dark-600/40 hover:dark:bg-dark-600"
        @click="emit('contact')">
        Contact Us
      </button>

      <ul class="flex flex-col gap-2">
        <li v-for="feature in package.features" :key="feature.title" class="flex items-center gap-2 text-xs md:text-sm">
          <NuxtIcon name="local:badge-check" class="fill-primary-500 text-[20px]" />
          <span>{{ feature.title }}</span>
        </li>
      </ul>
    </div>
  </article>
</template>
