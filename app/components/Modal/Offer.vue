<script setup lang="ts">
const props = defineProps<{
  offers: {
    id: string
    name: string
    cover?: string
    description: string
    amount: string
    features: string[]
  }[]
}>()

const activeOffer = computed(() => props.offers[0]!)

useCountdown(5, {
  immediate: true,
  onComplete() {
    showModal.value = true
  },
})
const showModal = ref(false)
const modalTab = ref<'offer' | 'form'>('offer')
const isSubmitting = ref(false)
const showSuccess = ref(false)

interface FormData {
  offer: string
  company: string
  email: string
  contactNumber: string
  projectDetails: string
}

const formData = ref<FormData>({
  offer: activeOffer.value.id,
  company: '',
  email: '',
  contactNumber: '',
  projectDetails: '',
})

function openClaimModal() {
  modalTab.value = 'form'
  showSuccess.value = false
}

async function handleSubmit() {
  isSubmitting.value = true

  try {
    // Call the Nuxt server route we just created
    const response = await $fetch('/api/client', {
      method: 'POST',
      body: {
        ...formData.value,
      },
    })

    console.log('Server response:', response)
    showSuccess.value = true
  } catch (error) {
    console.error('Error submitting form:', error)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <ModalBase :is-open="showModal" inner-class="max-w-md" @close="showModal = false">
    <!-- Offer Card -->
    <div v-if="modalTab === 'offer'" class="gradient relative flex flex-col gap-4 overflow-hidden p-4">
      <NuxtImg
        v-if="activeOffer.cover"
        :src="extractCdnId(activeOffer.cover)"
        :alt="activeOffer.name"
        :width="480"
        :height="Math.round(480 / (2 / 1))"
        fit="cover"
        class="-mx-4 -mt-4 w-[calc(100%+2rem)] max-w-none object-cover"
        :placeholder="[240, Math.round(240 / (2 / 1)), 50, 5]"
        @contextmenu.prevent />
      <!-- Offer Header -->
      <div class="flex items-start justify-between">
        <h2 class="text-xl font-bold">{{ activeOffer.name }}</h2>
        <span class="font-semibold text whitespace-nowrap"> {{ activeOffer.amount }} </span>
      </div>
      <!-- Offer Content -->
      <p class="leading-relaxed">
        {{ activeOffer.description }}
      </p>
      <ul class="flex flex-col gap-3">
        <li
          v-for="feature in activeOffer.features"
          :key="feature"
          class="flex items-center before:mr-2 before:h-2 before:w-2 before:rounded-full before:bg-black before:content-[''] dark:before:bg-white">
          {{ feature }}
        </li>
      </ul>
      <!-- CTA Button -->
      <button class="font-semibold shimmer-overlay w-full bg-gradient-to-r py-4 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl" @click="openClaimModal">
        <span class="shimmer"> Grab the Offer </span>
      </button>
    </div>
    <!-- Claim Modal -->
    <div v-else class="gradient relative overflow-hidden p-4">
      <div v-if="!showSuccess">
        <div class="mb-6 flex items-center justify-between">
          <h3 class="text-2xl font-bold">Claim Your Offer</h3>
        </div>
        <form class="space-y-5" @submit.prevent="handleSubmit">
          <!-- Name -->
          <div>
            <label for="company" class="font-medium mb-2 block text-sm"> Company Name <span class="text-alert-500">*</span> </label>
            <input
              id="company"
              v-model="formData.company"
              type="text"
              required
              class="w-full border bg-light-400 px-4 py-3 outline-none transition-all placeholder:text-black/60 focus:border-transparent focus:ring-2 focus:ring-dark-600 dark:bg-dark-400 dark:placeholder:text-white/60 dark:focus:ring-light-600"
              placeholder="Alcem .Inc" />
          </div>
          <!-- Company Email -->
          <div>
            <label for="email" class="font-medium mb-2 block text-sm"> Company Email <span class="text-alert-500">*</span> </label>
            <input
              id="email"
              v-model="formData.email"
              type="email"
              required
              class="w-full border bg-light-400 px-4 py-3 outline-none transition-all placeholder:text-black/60 focus:border-transparent focus:ring-2 focus:ring-dark-600 dark:bg-dark-400 dark:placeholder:text-white/60 dark:focus:ring-light-600"
              placeholder="john@company.com" />
          </div>
          <div>
            <label for="contactNumber" class="font-medium mb-2 block text-sm"> Contact Number <span class="text-alert-500">*</span> </label>
            <input
              id="contactNumber"
              v-model="formData.contactNumber"
              type="tel"
              required
              class="w-full border bg-light-400 px-4 py-3 outline-none transition-all placeholder:text-black/60 focus:border-transparent focus:ring-2 focus:ring-dark-600 dark:bg-dark-400 dark:placeholder:text-white/60 dark:focus:ring-light-600"
              placeholder="+1 (555) 000-0000" />
          </div>
          <!-- Project Details -->
          <div>
            <label for="projectDetails" class="font-medium mb-2 block text-sm"> Project Details <span class="text-alert-500">*</span> </label>
            <textarea
              id="projectDetails"
              v-model="formData.projectDetails"
              required
              rows="4"
              class="w-full resize-none border bg-light-400 px-4 py-3 outline-none transition-all placeholder:text-black/60 focus:border-transparent focus:ring-2 focus:ring-dark-600 dark:bg-dark-400 dark:placeholder:text-white/60 dark:focus:ring-light-600"
              placeholder="Tell us about your project (e.g., commercial shoot, duration, location, specific requirements...)"></textarea>
          </div>
          <!-- Submit Button -->
          <button type="submit" :disabled="isSubmitting" class="shimmer-overlay font-semibold w-full bg-gradient-to-r py-4 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
            <span class="shimmer">
              {{ isSubmitting ? 'Submitting...' : 'Claim Offer' }}
            </span>
          </button>
        </form>
      </div>
      <div v-else class="mt-6 flex flex-col items-center justify-center rounded-2xl p-8 text-center">
        <div class="mb-4 flex size-16 items-center justify-center rounded-full bg-success-400 ring-8 ring-success-400/50">
          <NuxtIcon name="local:check" class="text-[2rem] text-white" />
        </div>
        <h3 class="mb-2 text-xl font-bold text-success-500">Offer Claimed!</h3>
        <p class="max-w-xs text-sm leading-relaxed">We have received your details successfully. We will get back to you shortly.</p>
      </div>
    </div>
  </ModalBase>
</template>
