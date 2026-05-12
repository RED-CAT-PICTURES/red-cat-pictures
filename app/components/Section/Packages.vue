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
  <section v-if="!pending && packages?.length" id="packages" class="relative -left-2 w-screen px-8 py-1">
    <SectionLabel icon="cart" title="Packages" />
    <div class="scrollbar-hidden flex snap-x snap-mandatory gap-4 overflow-x-auto md:mx-auto md:grid md:aspect-auto md:max-w-4xl md:grid-cols-2 md:overflow-visible">
      <CardPackage v-for="pricingPackage in packages" :key="pricingPackage.id" :package="pricingPackage" @contact="onContact(true)" />
    </div>
  </section>
</template>
