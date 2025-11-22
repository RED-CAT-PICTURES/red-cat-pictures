<script setup lang="ts">
const title = `Privacy Policy`
const description = `Our Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website`
const {
  public: { siteUrl },
} = useRuntimeConfig()

useHead({
  bodyAttrs: {
    class: 'scrollbar-hidden',
  },
})

useSeoMeta({
  title: title,
  ogTitle: title,
  twitterTitle: title,
  description: description,
  ogDescription: description,
  twitterDescription: description,
  ogUrl: `${siteUrl}/privacy`,
})

const { data } = await useAPI<{
  privacy: {
    content: string
    lastUpdated: string
  }
}>(`/api/complience`)
</script>

<template>
  <section class="mx-auto mt-28 max-w-4xl px-4 py-12 lg:mt-36">
    <h1 class="mb-8 w-fit text-2xl font-semi-bold md:text-3xl lg:mx-auto">Privacy Policy</h1>
    <NuxtTime :datetime="data!.privacy.lastUpdated" day="numeric" month="short" year="numeric" class="mb-8 inline-block opacity-80"> Last updated: {{ data!.privacy.lastUpdated }}</NuxtTime>
    <MarkdownContent :content="data!.privacy.content" />
  </section>
</template>
