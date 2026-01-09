// server/api/chat-semantic.post.ts



interface RequestBody {
  message: string
  conversationHistory?: Array<{ role: string; content: string }>
}

interface BotResponse {
  response: string
  confidence: number
  source: string
  metadata: {
    intent: string
    entities: string[]
    sentiment: string
    matchedQuestion?: string
    contextUsed?: boolean
    errorDetails?: string
  }
}

export default defineEventHandler(async (event): Promise<BotResponse> => {
  const startTime = Date.now()
  console.log('🚀 Chat endpoint called')
  const config = useRuntimeConfig()
const notionDbId = config.private.notionDbId as unknown as NotionDB
  try {
    const body = await readBody<RequestBody>(event)
    const { message, conversationHistory = [] } = body

    console.log('📨 Message received:', message)

    // Validate input
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      console.error('❌ Invalid message')
      return getErrorFallback('Invalid message')
    }


    // Check if we have required config
    // const hasNotion = !!(config.notionApiKey && config.notionFaqDatabaseId)
    const hasGemini = !!config.geminiApiKey

    console.log('🔧 Config check - Notion:',  'Gemini:', hasGemini)

    // Step 1: Extract intent using local function (always works)
    const { intent, entities, sentiment } = extractIntentLocal(message)
    
    console.log('🧠 Intent:', intent)
    console.log('📦 Entities:', entities)
    console.log('😊 Sentiment:', sentiment)

    // Step 2: Try Notion search if available
    let searchResults: any[] = []
    //if (hasNotion) {
      try {
        console.log('🔍 Attempting Notion search...')
        const { semanticSearchFAQ, selectBestResponse } = await import('../utils/semanticSearch')
        
        searchResults = await semanticSearchFAQ(
          message,
         // config.notionApiKey as string,
          config.geminiApiKey as string,
           notionDbId.knowledgebase as string,
          0.5 // Lower threshold for better recall
        )
        
        console.log(`✅ Notion search complete: ${searchResults.length} results`)

        // Try to find best match
        const bestMatch = selectBestResponse(searchResults, intent, entities)
        
        if (bestMatch && bestMatch.similarity > 0.65) {
          console.log(`🎯 High confidence Notion match: ${(bestMatch.similarity * 100).toFixed(1)}%`)
          console.log(`⏱️ Response time: ${Date.now() - startTime}ms`)
          
          return {
            response: bestMatch.content,
            confidence: bestMatch.similarity,
            source: 'notion',
            metadata: {
              intent,
              entities,
              sentiment,
              matchedQuestion: bestMatch.metadata.question
            }
          }
        }
      } catch (notionError: any) {
        console.error('⚠️ Notion search failed:', notionError.message)
        // Continue to next fallback
      }
    // } else {
    //   console.log('⚠️ Notion not configured, skipping')
    // }

    // Step 3: Try Gemini if available and we have some context
    if (hasGemini) {
      try {
        console.log('🤖 Attempting Gemini AI...')

        // Build context from search results
        const context = searchResults.slice(0, 2).map((r, i) => 
          `FAQ ${i + 1}: ${r.metadata.question}\n${r.content}`
        ).join('\n\n')

        const systemPrompt = `You are RED CAT PICTURES AI assistant. Respond in 2-3 sentences about photography services.

User Intent: ${intent}
Topics: ${entities.join(', ') || 'general'}

${context ? `Knowledge:\n${context}\n\n` : ''}

Answer the user's question helpfully and concisely.`

        const controller = new AbortController()
        const timeout = setTimeout(() => controller.abort(), 8000)

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${config.geminiApiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{
                role: 'user',
                parts: [{ text: `${systemPrompt}\n\nQuestion: ${message}` }]
              }],
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 300
              }
            }),
            signal: controller.signal
          }
        )

        clearTimeout(timeout)

        if (response.ok) {
          const data = await response.json()
          const aiResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text

          if (aiResponse) {
            console.log('✅ Gemini response generated')
            console.log(`⏱️ Response time: ${Date.now() - startTime}ms`)

            return {
              response: aiResponse,
              confidence: searchResults.length > 0 ? 0.7 : 0.6,
              source: 'ai',
              metadata: {
                intent,
                entities,
                sentiment,
                contextUsed: searchResults.length > 0
              }
            }
          }
        }
      } catch (geminiError: any) {
        console.error('⚠️ Gemini failed:', geminiError.message)
        // Continue to fallback
      }
    } else {
      console.log('⚠️ Gemini not configured, skipping')
    }

    // Step 4: Use structured fallback (always works)
    console.log('📋 Using structured fallback')
    console.log(`⏱️ Response time: ${Date.now() - startTime}ms`)
    
    return getFallbackResponse(intent, entities, searchResults)

  } catch (error: any) {
    console.error('❌ Critical error:', error)
    console.log(`⏱️ Error after: ${Date.now() - startTime}ms`)
    return getErrorFallback(error.message)
  }
})

// Local intent extraction (no external dependencies)
function extractIntentLocal(message: string): { intent: string, entities: string[], sentiment: string } {
  const msg = message.toLowerCase()
  let intent = 'general_inquiry'
  const entities: string[] = []
  let sentiment = 'neutral'

  if (msg.match(/price|pricing|cost|rate|package|charge|fee|budget|how much|quote/)) {
    intent = 'pricing_inquiry'
  } else if (msg.match(/book|schedule|appointment|available|reserve|date/)) {
    intent = 'booking_intent'
  } else if (msg.match(/service|offer|provide|what do you do|what are your services/)) {
    intent = 'service_inquiry'
  } else if (msg.match(/contact|phone|email|address|location|reach|call/)) {
    intent = 'contact_request'
  } else if (msg.match(/team|member|founder|who are|people|staff|about/)) {
    intent = 'about_inquiry'
  } else if (msg.match(/photo|picture|portfolio|gallery|work|sample/)) {
    intent = 'portfolio_request'
  }

  if (msg.match(/food|cuisine|dish|restaurant/)) entities.push('food')
  if (msg.match(/video|film|cinema/)) entities.push('video')
  if (msg.match(/event|party|celebration/)) entities.push('event')
  if (msg.match(/commercial|business|corporate|product/)) entities.push('commercial')

  if (msg.match(/urgent|asap|immediately|quickly/)) sentiment = 'urgent'

  return { intent, entities, sentiment }
}

// Fallback response generator
function getFallbackResponse(intent: string, entities: string[], searchResults: any[]): BotResponse {
  const contactInfo = {
    phone: '+91 8910489578',
    email: 'contact@redcatpictures.com',
    website: 'https://redcatpictures.com'
  }

  // Use Notion result if available (even low confidence)
  if (searchResults.length > 0) {
    const topResult = searchResults[0]
    return {
      response: `${topResult.content}<br><br>Need more info? Call <strong>${contactInfo.phone}</strong> or <a href="${contactInfo.website}" target="_blank" style="color: #60a5fa;">visit our website</a>`,
      confidence: topResult.similarity,
      source: 'notion-fallback',
      metadata: {
        intent,
        entities,
        sentiment: 'neutral',
        matchedQuestion: topResult.metadata.question
      }
    }
  }

  // Intent-based responses
  const responses: Record<string, string> = {
    pricing_inquiry: `Our photography packages are customized for your needs! 💰<br><br>📞 Call <strong>${contactInfo.phone}</strong> for a detailed quote<br>🌐 <a href="${contactInfo.website}/#pricing" target="_blank" style="color: #60a5fa;">View pricing page</a>`,
    
    booking_intent: `We'd love to capture your moments! 📸<br><br>To book or check availability:<br>📞 <strong>${contactInfo.phone}</strong><br>📧 <strong>${contactInfo.email}</strong><br>🌐 <a href="${contactInfo.website}" target="_blank" style="color: #60a5fa;">Book online</a>`,
    
    service_inquiry: `RED CAT PICTURES specializes in:<br>• Wedding & Event Photography<br>• Food Photography<br>• Commercial Shoots<br>• Video Production<br><br><a href="${contactInfo.website}/#services" target="_blank" style="color: #60a5fa;">View all services</a>`,
    
    contact_request: `📞 <strong>${contactInfo.phone}</strong><br>📧 <strong>${contactInfo.email}</strong><br>🌐 <a href="${contactInfo.website}" target="_blank" style="color: #60a5fa;">redcatpictures.com</a><br>📍 17, Netaji Subhash Road, Beltala, Harinavi<br><br>⏰ Mon-Fri: 9AM-10PM | Sat-Sun: 9AM-8PM`,
    
    about_inquiry: `RED CAT PICTURES is a creative photo studio delivering professional, memorable photography for every client! 📸<br><br><a href="${contactInfo.website}/about" target="_blank" style="color: #60a5fa;">Meet our team</a>`,
    
    portfolio_request: `Check out our stunning work! 🎨<br><br>📸 <a href="${contactInfo.website}/#featuredphotos" target="_blank" style="color: #60a5fa;">Featured Photos</a><br>🍽️ <a href="${contactInfo.website}/photo" target="_blank" style="color: #60a5fa;">Food Gallery</a><br>🎥 <a href="${contactInfo.website}/#video-gallery" target="_blank" style="color: #60a5fa;">Video Portfolio</a>`,
    
    general_inquiry: `Hi! I'm here to help with RED CAT PICTURES! 👋<br><br>I can assist with:<br>• Services & Pricing<br>• Booking & Availability<br>• Portfolio & Samples<br>• Contact Info<br><br>What would you like to know?`
  }

  return {
    response: responses[intent] || responses.general_inquiry,
    confidence: 0.5,
    source: 'fallback',
    metadata: { intent, entities, sentiment: 'neutral' }
  }
}

// Error fallback
function getErrorFallback(errorMessage: string): BotResponse {
  return {
    response: `I'm having technical difficulties right now. 🔧<br><br>Please contact us directly:<br>📞 <strong>+91 8910489578</strong><br>📧 <strong>contact@redcatpictures.com</strong><br>🌐 <a href="https://redcatpictures.com" target="_blank" style="color: #60a5fa;">Visit website</a><br><br>We respond within minutes during business hours!`,
    confidence: 0,
    source: 'error',
    metadata: {
      intent: 'error',
      entities: [],
      sentiment: 'neutral',
      errorDetails: errorMessage
    }
  }
}