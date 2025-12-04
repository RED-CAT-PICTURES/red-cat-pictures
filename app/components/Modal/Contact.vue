<script setup lang="ts">
defineProps<{
  isOpen: boolean
}>()
const emit = defineEmits<{
  close: []
}>()

const { proxy: gaProxy } = useScriptGoogleAnalytics()

const methods = ref([
  { method: 'email', icon: 'email', link: 'mailto:contact@redcatpictures.com', position: 'top-left' },
  { method: 'whatsapp', icon: 'whatsapp', link: 'https://wa.me/918910489578', position: 'top-right' },
  { method: 'call', icon: 'phone', link: 'tel:+918910489578', position: 'bottom' },
])

function contact(method: string) {
  gaProxy.gtag('event', 'contact', { method })
}

function close() {
  emit('close')
}

function positionClass(position: string) {
  return {
    'col-start-1 row-start-2': position === 'top-left',
    'col-start-2 row-start-2': position === 'top-right',
    'col-span-2 row-start-3': position === 'bottom',
  }
}
</script>

<template>
  <ModalBase :is-open="isOpen" inner-class="grid grid-rows-[auto_1fr_1fr] grid-cols-2 gap-3 w-full !max-w-[24rem] p-4 overflow-hidden " @close="close">
    <span class="font-semibold col-span-2 row-start-1 mx-auto mb-2 text-xl text-white"> Book a Session </span>

    <NuxtLink
      v-for="{ method, icon, link, position } of methods"
      :key="method"
      :to="link"
      target="_blank"
      :aria-label="method"
      class="relative flex cursor-pointer flex-col items-center justify-center bg-gradient-to-br from-primary-500 via-40% to-transparent to-100% fill-black px-4 py-6 text-black transition-all duration-300 ease-out hover:bg-primary-500 dark:fill-white dark:text-white"
      :class="positionClass(position)"
      @click="contact(method)">
      <NuxtIcon :name="`local:${icon}`" class="text-[48px]" />
      <span class="font-semibold mt-2 text-sm capitalize">{{ method }}</span>
    </NuxtLink>
  </ModalBase>
</template>
