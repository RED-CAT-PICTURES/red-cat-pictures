import { createError, defineEventHandler, readBody, type H3Event } from 'h3'


interface RequestBody {
  message: string
  section?: string
  sectionUrl?: string
  companyName: string
  contactInfo: {
    phone: string
    email: string
    address: string
    hours: string
  }
}

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string
      }>
    }
  }>
}

export default defineEventHandler(async (event: H3Event) => {
  try {
    const body = await readBody<RequestBody>(event)
    const { message, section, sectionUrl, companyName, contactInfo } = body
    const config = useRuntimeConfig()
    
    const GEMINI_API_KEY = config.geminiApiKey as string
    
    if (!GEMINI_API_KEY) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Gemini API key not configured'
      })
    }

    // Fetch website content if section provided
    let websiteContext: string = ''
    if (section && sectionUrl) {
      try {
        const proxyUrl: string = 'https://api.allorigins.win/raw?url='
        const html = await $fetch<string>(proxyUrl + encodeURIComponent('https://redcatpictures.com/'))
        
        // Parse HTML and extract section
        const sectionMatch = html.match(new RegExp(`<[^>]+id="${section}"[^>]*>([\\s\\S]*?)<\\/[^>]+>`, 'i'))
        if (sectionMatch) {
          // Clean HTML tags and get text
          websiteContext = sectionMatch[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().substring(0, 2000)
        }
      } catch (err) {
        console.error('Error fetching website context:', err)
      }
    }

    // Build prompt for Gemini
    const systemPrompt: string = `You are an AI assistant for ${companyName}, a professional photography company in India.

Contact Information:
- Phone: ${contactInfo.phone}
- Email: ${contactInfo.email}
- Address: ${contactInfo.address}
- Hours: ${contactInfo.hours}

${websiteContext ? `Website Information about ${section}:\n${websiteContext}\n\n` : ''}

Instructions:
- Provide helpful, accurate, and friendly responses
- Use information from the website context when available
- Keep responses concise (2-4 sentences)
- Format responses with HTML tags like <strong>, <br>, <a href="...">
- For pricing, list packages with prices clearly
- For team/founder questions, use website information
- Always be professional and enthusiastic about photography`

    const fullPrompt: string = `${systemPrompt}\n\nUser Question: ${message}\n\nProvide a helpful response:`

    // Call Gemini API
    const geminiResponse = await $fetch<GeminiResponse>(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: {
          contents: [{
            parts: [{ text: fullPrompt }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 500
          }
        }
      }
    )

    const aiResponse: string = geminiResponse.candidates[0].content.parts[0].text

    return { response: aiResponse }
    
  } catch (error: any) {
    console.error('Gemini API error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to get AI response'
    })
  }
})