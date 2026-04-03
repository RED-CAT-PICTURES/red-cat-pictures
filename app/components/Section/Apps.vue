<script setup lang="ts">
import type { CSSProperties } from 'vue'

const container = useTemplateRef<HTMLElement>('container')
const isHovering = ref(false)

const parallax = reactive(useParallax(container))

const MAX_ROTATE = 40

const phoneStyle = computed<CSSProperties>(() => ({
  perspective: '900px',
  transform: `rotateX(${parallax.roll * MAX_ROTATE}deg) rotateY(${parallax.tilt * MAX_ROTATE}deg)`,
  transition: '0.3s ease-out all',
}))

const appFeatures = ['Book shoots instantly', 'Watch production pipeline', 'Read Episodes on the go']
</script>

<template>
  <section class="lbg-white relative min-h-dvh w-full overflow-hidden text-black dark:bg-black dark:text-white">
    <div class="absolute -left-20 top-20 h-56 w-56 rounded-full bg-primary-500 opacity-20 blur-[100px] sm:h-72 sm:w-72" />
    <div class="absolute bottom-0 right-0 h-72 w-72 translate-x-1/3 translate-y-1/3 rounded-full bg-primary-600/40 blur-[120px]" />
    <div
      class="absolute inset-0 z-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]" />
    <div class="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid min-h-dvh grid-cols-1 items-center gap-8 py-10 sm:gap-10 sm:py-12 lg:grid-cols-2 lg:gap-16">
        <div class="order-2 flex flex-col items-start lg:order-1">
          <span class="font-black mb-3 inline-block px-3 py-1 text-xs uppercase tracking-widest text-primary-500"> Now Available </span>
          <h2 class="font-black sm:text-6xl lg:text-7xl mb-4 text-4xl uppercase leading-[0.9] tracking-tighter">
            Control <br />
            <span class="sweep-gradient bg-gradient-to-r from-primary-500 from-50% to-white">The Chaos.</span>
          </h2>
          <p class="font-medium mb-6 max-w-lg text-base leading-relaxed opacity-70 sm:text-lg">
            Watch our production pipeline, book your next campaign directly from the messy reality of your pocket.
          </p>
          <ul class="mb-7 space-y-2 sm:mb-8 sm:space-y-3">
            <li v-for="(feature, index) in appFeatures" :key="index" class="flex items-center text-xs font-bold uppercase tracking-wider opacity-70 md:text-sm">
              <span class="mr-3 flex h-2 w-2 items-center justify-center bg-primary-600"></span>
              {{ feature }}
            </li>
          </ul>
          <NuxtLink
            to="https://play.google.com/store/apps/details?id=com.redcatpictures.studio"
            external
            target="__blank"
            class="hover:border-red-600 hover:bg-red-600/10 group relative inline-flex items-center gap-3 overflow-hidden border border-black/20 bg-black/5 px-5 py-3 backdrop-blur-sm transition-all duration-300 dark:border-white/20 dark:bg-white/5">
            <div class="absolute inset-y-0 left-0 w-1 bg-primary-600 transition-all duration-300 group-hover:w-full group-hover:opacity-10" />
            <NuxtIcon name="local:playstore" class="z-10 text-[2rem] transition-transform duration-300 group-hover:scale-110" />
            <div class="relative z-10 flex flex-col items-start">
              <span class="text-[10px] font-bold uppercase opacity-70 group-hover:text-primary-400 group-hover:opacity-100">Get it on</span>
              <span class="text-lg font-bold leading-none tracking-wide">Google Play</span>
            </div>
          </NuxtLink>
        </div>
        <div ref="container" class="group relative" @mouseenter="isHovering = true" @mouseleave="isHovering = false">
          <div
            class="relative z-10 mx-auto h-[520px] w-[260px] overflow-hidden rounded-[2.2rem] border-8 border-dark-400 bg-black shadow-2xl transition-transform duration-300 will-change-transform motion-reduce:transform-none sm:h-[600px] sm:w-[300px]"
            :style="phoneStyle">
            <div class="absolute left-1/2 top-0 z-20 h-6 w-32 -translate-x-1/2 rounded-b-xl bg-dark-400" />
            <img src="/pwa/screenshot-mobile-1-v3.png" alt="App screenshot" class="size-full object-cover object-top" loading="lazy" />
            <div class="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-50" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
