<template>
  <div class="fixed bottom-5 right-5 z-50 font-sans">
    
    <!-- Toggle Button -->
    <button v-if="!isOpen" @click="isOpen = true" 
      class="relative w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-800 rounded-full text-white shadow-2xl hover:scale-105 transition-transform flex items-center justify-center">
      <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
      </svg>
      <span class="absolute w-16 h-16 border-2 border-purple-500 rounded-full animate-ping opacity-75"></span>
    </button>

    <!-- Chat Window -->
    <div v-if="isOpen" class="w-96 h-[600px] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-gray-100">
      <!-- Header -->
      <div class="bg-gradient-to-r from-purple-600 to-purple-800 p-5 flex justify-between items-center text-white">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full flex items-center justify-center bg-white">
              <img src="data:image/png;base64,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" alt="RED CAT PICTURES Logo" class="w-9 h-9 object-contain" />
          </div>

          <div>
            <h3 class="font-semibold text-base">AI Assistant</h3>
            <p class="text-xs opacity-90">{{ botStatus }}</p>
          </div>
        </div>
        <button @click="isOpen = false" class="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <!-- Messages -->
      <div ref="messagesContainer" class="scrollable-messages flex-1 p-5 bg-gray-50 space-y-4">
        <!-- Welcome Message -->
        <div v-if="messages.length === 0" class="text-center">
          <div class="bg-white p-6 rounded-2xl shadow-sm mb-4">
            <div class="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 bg-white">
              <img src="data:image/png;base64,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" alt="RED CAT PICTURES Logo" class="w-10 h-10 object-contain" />
                </div>

            <h4 class="font-semibold text-lg mb-2">Welcome to {{ companyName }}!</h4>
            <p class="text-gray-600 text-sm">Ask me about our services, pricing, team, or anything else!</p>
          </div>
          <div class="grid grid-cols-2 gap-2">
            <button v-for="action in quickActions" :key="action.id" @click="sendQuickAction(action.message)"
              class="bg-white border border-gray-200 rounded-xl p-3 text-sm font-medium text-gray-700 hover:border-purple-500 hover:text-purple-600 transition-all">
              {{ action.label }}
            </button>
          </div>
        </div>

        <!-- Chat Messages -->
        <div v-for="message in messages" :key="message.id" 
          :class="['flex items-end gap-2', message.sender === 'user' ? 'justify-end' : 'justify-start']">
          <!-- Bot Avatar -->
          <div v-if="message.sender === 'bot'" class="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 bg-white">
              <img src="data:image/png;base64,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" alt="RED CAT PICTURES Logo" class="w-6 h-6 object-contain" />
          </div>

          
          <!-- Message Bubble -->
          <div :class="['max-w-[280px] rounded-2xl p-3', message.sender === 'bot' ? 'bg-white shadow-sm border border-gray-100' : 'bg-gradient-to-r from-purple-600 to-purple-800 text-white']">
            <!-- Typing Indicator -->
            <div v-if="message.isTyping" class="flex gap-1">
              <span class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0ms"></span>
              <span class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 150ms"></span>
              <span class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 300ms"></span>
            </div>
            <!-- Message Content -->
            <div v-else>
              <div class="text-sm" v-html="message.text"></div>
              <div :class="['text-xs mt-1', message.sender === 'bot' ? 'text-gray-400' : 'text-white/70']">
                {{ formatTime(message.timestamp) }}
              </div>
            </div>
          </div>

          <!-- User Avatar -->
          <div v-if="message.sender === 'user'" class="w-7 h-7 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
            <svg class="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z"/>
            </svg>
          </div>
        </div>
      </div>

      <!-- Input Area -->
      <div class="bg-white border-t border-gray-200 p-4">
        <div class="flex gap-3 items-center mb-2">
          <input v-model="currentMessage" @keypress.enter="sendMessage" :disabled="isLoading"
            placeholder="Ask about photos, pricing, team..."
            class="flex-1 border border-gray-300 rounded-full px-4 py-2.5 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 bg-gray-50 focus:bg-white transition-all" />
          <button @click="sendMessage" :disabled="isLoading || !currentMessage.trim()"
            class="w-10 h-10 bg-gradient-to-r from-purple-600 to-purple-800 rounded-full text-white flex items-center justify-center hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed">
            <svg v-if="!isLoading" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
            </svg>
            <svg v-else class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </button>
        </div>
        <p class="text-xs text-gray-500 text-center">Powered by AI • {{ companyName }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'

const isOpen = ref(false)
const currentMessage = ref('')
const isLoading = ref(false)
const messages = ref([])
const botStatus = ref('Online')
const messagesContainer = ref(null)

const companyName = 'RED CAT PICTURES'
const knowledgeBase = {
  contact: {
    phone: '+91 8910489578',
    email: 'contact@redcatpictures.com',
    address: '17, Netaji Subhash Road, Beltala, P.O.- Harinavi',
    hours: 'Mon-Fri: 9AM-10PM, Sat-Sun: 9AM-8PM'
  },
  pricing: "Our photography packages start at affordable rates for personal, event, and commercial shoots. We tailor every project to fit your needs, offering hourly and full-day pricing. For detailed packages, please see our pricing section below.",
  about: "Red Cat Pictures is a creative photo studio specializing in professional, event, and commercial photography. Our team blends passion with expertise to deliver memorable images for every client. Discover more about our philosophy and journey in the About section.",
  team: "Our team consists of talented photographers, editors, and project managers—all dedicated to delivering outstanding results. Meet the faces and stories behind Red Cat Pictures in our Team section.",
  featuredphotos: "Browse some of our stunning featured photographs that highlight our best work across various themes and occasions. For more, visit our featured gallery.",
  food: "We specialize in mouth-watering food photography that captures the essence of every dish. From restaurants to food brands, our portfolio showcases a variety of culinary delights. Explore our food photography collection for inspiration.",
  video: "In addition to photography, we offer professional video production services. Our team creates engaging videos for events, commercials, and more. Check out our video gallery to see some of our dynamic work.",
  services: "We offer a range of photography services including personal portraits, event coverage, commercial shoots, and food photography. Each service is customized to meet your specific needs. Visit our services section for more details.",
}

const sectionLinks = {
  pricing: 'https://redcatpictures.com/#pricing',
  about: 'https://redcatpictures.com/about',
  team: 'https://redcatpictures.com/about',
  featuredphotos: 'https://redcatpictures.com/#featuredphotos',
  food: 'https://redcatpictures.com/food',
  video: 'https://redcatpictures.com/#video-gallery',
  services: 'https://redcatpictures.com/#services'
}

const quickActions = [
  { id: 1, label: 'Featured Photos', message: 'Show me your featured photos' },
  { id: 2, label: 'Pricing', message: 'What are your prices?' },
  { id: 3, label: 'About Us', message: 'Tell me about Red Cat Pictures' },
  { id: 4, label: 'Team', message: 'Who are the team members?' }
]

const getTargetSection = (query) => {
  const q = query.toLowerCase()
  if (q.match(/price|pricing|cost|rate|package|charge|fee|budget/)) return 'pricing'
  if (q.match(/about|company|who is red cat|what is red cat|tell me about/)) return 'about'
  if (q.match(/team|member|founder|who are|people|staff/)) return 'team'
  if (q.match(/feature|photo|gallery|portfolio|picture|sample picture/)) return 'featuredphotos'
  if (q.match(/food|cuisine|dish|meal|food photography|restaurant/)) return 'food'
  if (q.match(/video|film|clip|movie|cinema|sample video/)) return 'video'
  if (q.match(/service|offer|provide|what do you do|what are your services?|what services/)) return 'services'
  return null
}

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })
}

const sendQuickAction = (message) => {
  currentMessage.value = message
  setTimeout(() => sendMessage(), 100)
}

const sendMessage = async () => {
  if (!currentMessage.value.trim() || isLoading.value) return

  const userMessage = {
    id: Date.now(),
    text: currentMessage.value,
    sender: 'user',
    timestamp: new Date()
  }

  messages.value.push(userMessage)
  const messageText = currentMessage.value
  currentMessage.value = ''
  scrollToBottom()

  await getBotResponse(messageText)
}

const getBotResponse = async (userMessage) => {
  // isLoading.value = true
  // botStatus.value = 'Typing...'

  // const typingMessage = {
  //   id: Date.now() + 1,
  //   text: '',
  //   sender: 'bot',
  //   timestamp: new Date(),
  //   isTyping: true
  // }
  // messages.value.push(typingMessage)
  // scrollToBottom()

  // try {
  //   // Find relevant section
  //   const sectionKey = getTargetSection(userMessage)
  //   let response = null

  //   if (sectionKey && knowledgeBase[sectionKey]) {
  //     // Show summary + link
  //     response = `${knowledgeBase[sectionKey]}<br><br>
  //       <a href="${sectionLinks[sectionKey]}" target="_blank" style="color: #60a5fa; text-decoration: underline;">Go to ${sectionKey.charAt(0).toUpperCase() + sectionKey.slice(1)} Section</a>`
  //   } else {
  //     // Default fallback
  //     response = `I'm here to help with your photo and studio queries! Visit <a href="https://redcatpictures.com" target="_blank" style="color: #60a5fa; text-decoration: underline;">our website</a> or call ${knowledgeBase.contact.phone} for more details.`
  //   }

  //   // Remove typing indicator
  //   messages.value.pop()

  //   // Add bot response
  //   messages.value.push({
  //     id: Date.now() + 2,
  //     text: response,
  //     sender: 'bot',
  //     timestamp: new Date(),
  //     isTyping: false
  //   })

  // } catch (error) {
  //   console.error('Error:', error)
  //   messages.value.pop()
  //   messages.value.push({
  //     id: Date.now() + 3,
  //     text: `Visit <a href="https://redcatpictures.com" target="_blank" style="color: #60a5fa; text-decoration: underline;">our website</a> or call ${knowledgeBase.contact.phone}`,
  //     sender: 'bot',
  //     timestamp: new Date(),
  //     isTyping: false
  //   })
  // } finally {
  //   isLoading.value = false
  //   botStatus.value = 'Online'
  //   scrollToBottom()
  // }

  
  isLoading.value = true
  botStatus.value = 'Analyzing...'

  const typingMessage = {
    id: Date.now() + 1,
    text: '',
    sender: 'bot',
    timestamp: new Date(),
    isTyping: true
  }
  messages.value.push(typingMessage)
  scrollToBottom()

  try {
    // Call semantic search endpoint
    const result = await $fetch('/api/chat-semantic', {
    
      method: 'POST',
      body: {
        message: userMessage,
        conversationHistory: messages.value.slice(-5).map(m => ({
          role: m.sender === 'user' ? 'user' : 'assistant',
          content: m.text
        }))
      }
    })

    console.log('Response confidence:', (result.confidence * 100).toFixed(1) + '%')
    console.log('Source:', result.source)
    console.log('Intent:', result.metadata.intent)

    // Remove typing indicator
    messages.value.pop()

    // Format response with metadata
    let responseText = result.response

    // Add helpful follow-up based on intent
    if (result.metadata.intent === 'pricing_inquiry') {
      responseText += '<br><br>💰 Would you like me to send you a detailed quote?'
    } else if (result.metadata.intent === 'booking_intent') {
      responseText += '<br><br>📅 Ready to book? Share your email and we\'ll send you available dates!'
    } else if (result.metadata.intent === 'service_inquiry' && result.metadata.entities.length > 0) {
      responseText += '<br><br>Would you like to see sample work or get pricing?'
    }

    // Add bot response
    messages.value.push({
      id: Date.now() + 2,
      text: responseText,
      sender: 'bot',
      timestamp: new Date(),
      isTyping: false,
      metadata: result.metadata // Store for analytics
    })

    // Update bot status based on confidence
    if (result.confidence > 0.8) {
      botStatus.value = 'Online • High confidence'
    } else {
      botStatus.value = 'Online'
    }

  } catch (error) {
    console.error('Error:', error)
    messages.value.pop()
    messages.value.push({
      id: Date.now() + 3,
      text: `I'm having trouble right now. Please call us at ${knowledgeBase.contact.phone} or email ${knowledgeBase.contact.email}`,
      sender: 'bot',
      timestamp: new Date(),
      isTyping: false
    })
    botStatus.value = 'Online'
  } finally {
    isLoading.value = false
    scrollToBottom()
  }

}
</script>

<style scoped>
.scrollable-messages {
  overflow-y: scroll !important;
}
.scrollable-messages::-webkit-scrollbar { width: 8px; }
.scrollable-messages::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 10px; }
.scrollable-messages::-webkit-scrollbar-thumb { background: #a5b4fc; border-radius: 10px; }
.scrollable-messages::-webkit-scrollbar-thumb:hover { background: #60a5fa; }

/* Update your theme colors below */
.bg-gradient-to-br, .bg-gradient-to-r {
  background-image: linear-gradient(135deg, #a5b4fc 0%, #60a5fa 100%) !important;
}
.text-light-blue {
  color: #60a5fa;
}
.border-light-blue {
  border-color: #60a5fa;
}
</style>
    