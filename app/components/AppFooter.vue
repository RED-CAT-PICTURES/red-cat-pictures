<script setup lang="ts">
defineProps<{
  hasFloatingActionButton: boolean
}>()

const emit = defineEmits<{
  contact: []
}>()

const policyLinks = [
  { label: 'terms', to: '/terms' },
  { label: 'privacy', to: '/privacy' },
  { label: 'cancellation', to: '/cancellation' },
  { label: 'license', to: '/license' },
]

const socialLinks = [
  { label: 'whatsapp', icon: 'local:whatsapp', to: 'https://wa.me/c/912269711501' },
  { label: 'instagram', icon: 'local:instagram', to: 'https://www.instagram.com/redcatpictures' },
  { label: 'facebook', icon: 'local:facebook', to: 'https://www.facebook.com/redcatpictures' },
  { label: 'linkedin', icon: 'local:linkedin', to: 'https://www.linkedin.com/company/red-cat-pictures' },
  { label: 'youtube', icon: 'local:youtube', to: 'https://www.youtube.com/@red_cat_pictures' },
  { label: 'google-map', icon: 'local:map', to: 'https://maps.app.goo.gl/a5RZtb1rxHC8MoaY6' },
]
</script>

<template>
  <footer class="mx-auto mt-8 w-full px-2 md:px-4" :class="hasFloatingActionButton ? 'mb-20 md:mb-24' : 'mb-2'">
    <div class="relative isolate grid grid-cols-2 gap-6 overflow-hidden bg-white p-6 text-dark-600/50 dark:bg-black dark:text-light-600 md:h-52 md:grid-cols-3 md:grid-rows-3 md:items-end md:p-8">
      <ButtonCTA v-if="!hasFloatingActionButton" class="col-span-2 justify-self-center md:col-span-1 md:col-start-2 md:row-start-2 md:self-center" @click="emit('contact')" />
      <NuxtLink
        href="tel:+912269711501"
        class="font-medium col-span-2 flex items-center justify-center gap-2 transition-colors hover:text-dark-600 dark:hover:text-light-400 md:col-span-1 md:col-start-3 md:row-start-1 md:justify-self-end">
        <NuxtIcon name="local:phone" class="text-xl" />
        <span>+91 22 6971 1501</span>
      </NuxtLink>
      <div class="relative col-span-1 flex flex-col gap-2 self-end justify-self-start text-sm md:col-start-1 md:row-start-3">
        <NuxtIcon
          name="local:logo"
          filled
          class="absolute left-[-60px] top-0 -z-10 -translate-y-[56%] text-[309px] opacity-10 md:-translate-y-[56%] md:text-[309px] lg:left-[-104px] lg:-translate-y-[37%] lg:text-[560px]" />
        <span>&copy; 2024-2026</span>
        <NuxtLink to="https://modesthumanbrands.com" target="__blank" class="flex items-center gap-4">
          <span>Powered by</span>
          <NuxtIcon name="local:mhb" filled class="text-[32px]" />
        </NuxtLink>
      </div>
      <ul class="col-span-1 grid grid-cols-3 gap-4 justify-self-end *:text-white *:transition-colors *:duration-500 *:ease-out hover:*:text-dark-600 md:col-start-3 md:row-start-3 md:flex md:gap-8">
        <li v-for="link in socialLinks" :key="link.label">
          <NuxtLink :aria-label="link.label" :to="link.to" target="_blank" external>
            <NuxtIcon :name="link.icon" class="text-[28px] md:text-[40px]" />
          </NuxtLink>
        </li>
      </ul>
    </div>
    <ul class="mx-auto mb-1 mt-5 flex w-min items-center justify-between gap-3 text-xs md:gap-4 md:text-sm">
      <li v-for="link in policyLinks" :key="link.label" class="capitalize">
        <NuxtLink :to="link.to">{{ link.label }}</NuxtLink>
      </li>
    </ul>
  </footer>
</template>
