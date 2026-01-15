// server/utils/semanticSearch.ts

import { Client } from '@notionhq/client'

interface IntentResult {
  intent: string
  entities: string[]
  sentiment: string
}

interface SearchResult {
  content: string
  similarity: number
  metadata: {
    question: string
    category?: string
  }
}

/**
 * Extract intent, entities and sentiment from user message
 */
export function extractIntent(message: string): IntentResult {
  const msg = message.toLowerCase()
  
  let intent = 'general_inquiry'
  const entities: string[] = []
  let sentiment = 'neutral'

  // Intent detection with comprehensive patterns
  if (msg.match(/price|pricing|cost|rate|package|charge|fee|budget|how much|quote/)) {
    intent = 'pricing_inquiry'
  } else if (msg.match(/book|schedule|appointment|available|reserve|date|availability/)) {
    intent = 'booking_intent'
  } else if (msg.match(/service|offer|provide|what do you do|specializ|capability/)) {
    intent = 'service_inquiry'
  } else if (msg.match(/contact|phone|email|address|location|reach|call/)) {
    intent = 'contact_request'
  } else if (msg.match(/team|member|founder|who are|people|staff|about|owner/)) {
    intent = 'about_inquiry'
  } else if (msg.match(/photo|picture|portfolio|gallery|work|sample|example/)) {
    intent = 'portfolio_request'
  }

  // Entity extraction (services)
  if (msg.match(/wedding|marriage|shaadi/)) entities.push('wedding')
  if (msg.match(/food|cuisine|dish|meal|restaurant|culinary/)) entities.push('food')
  if (msg.match(/video|film|cinema|cinematography/)) entities.push('video')
  if (msg.match(/event|party|celebration|function/)) entities.push('event')
  if (msg.match(/portrait|headshot|profile/)) entities.push('portrait')
  if (msg.match(/commercial|business|corporate|product/)) entities.push('commercial')

  // Sentiment analysis
  if (msg.match(/urgent|asap|immediately|quickly|rush/)) {
    sentiment = 'urgent'
  } else if (msg.match(/thank|great|love|amazing|wonderful|perfect/)) {
    sentiment = 'positive'
  } else if (msg.match(/confused|not sure|maybe|thinking|considering/)) {
    sentiment = 'uncertain'
  }

  return { intent, entities, sentiment }
}

/**
 * Semantic search in Notion FAQ database
 */
export async function semanticSearchFAQ(
  query: string,
  //notionApiKey: string,
  geminiApiKey: string,
  databaseId: string,
  threshold: number = 0.7
): Promise<SearchResult[]> {
  try {
    // Validate inputs
    if (!databaseId) {
      console.error('❌ Missing Notion credentials')
      return []
    }

    //const notion = new Client({ auth: notionApiKey })

    console.log('🔍 Querying Notion database:', databaseId)

    // Query all FAQ entries from Notion
    const response = await notion.databases.query({
      database_id: databaseId
    })

    if (!response.results || response.results.length === 0) {
      console.warn('⚠️ No FAQ entries found in Notion database')
      return []
    }

    console.log(`📚 Found ${response.results.length} FAQ entries`)

    // Extract FAQ data
    const faqs = await Promise.all(
      response.results.map(async (page: any) => {
        try {
          const question = page.properties.Question?.title?.[0]?.plain_text || ''
          const category = page.properties.Category?.select?.name || ''
          const answer = page.properties.Answer?.rich_text?.[0]?.plain_text || ''
        //   // Get answer from page content
        //   const blocks = await notion.blocks.children.list({ block_id: page.id })
        //  // console.log(blocks.results)
        //   const answer = blocks.results
        //     .map((block: any) => {
        //       if (block.type === 'paragraph' && block.paragraph?.rich_text) {
        //         return block.paragraph.rich_text.map((t: any) => t.plain_text).join('')
        //       }
        //       if (block.type === 'heading_1' && block.heading_1?.rich_text) {
        //         return block.heading_1.rich_text.map((t: any) => t.plain_text).join('')
        //       }
        //       if (block.type === 'heading_2' && block.heading_2?.rich_text) {
        //         return block.heading_2.rich_text.map((t: any) => t.plain_text).join('')
        //       }
        //       if (block.type === 'bulleted_list_item' && block.bulleted_list_item?.rich_text) {
        //         return '• ' + block.bulleted_list_item.rich_text.map((t: any) => t.plain_text).join('')
        //       }
        //       return ''
        //     })
        //     .filter(Boolean)
            //.join(' ')

          return { question, answer, category }
        } catch (blockError) {
          console.error('Error processing FAQ block:', blockError)
          return { question: '', answer: '', category: '' }
        }
      })
    )
    //console.log({ faqs })
    // Filter out empty FAQs
    const validFaqs = faqs.filter(faq => faq.question && faq.answer)

    if (validFaqs.length === 0) {
      console.warn('⚠️ No valid FAQ entries with questions and answers')
      return []
    }

    console.log(`✅ Processed ${validFaqs.length} valid FAQs`)

    // Simple keyword-based similarity
    const results: SearchResult[] = validFaqs
      .map(faq => {
        const similarity = calculateKeywordSimilarity(query, faq.question + ' ' + faq.answer)
        return {
          content: faq.answer,
          similarity,
          metadata: {
            question: faq.question,
            category: faq.category
          }
        }
      })
      .filter(r => r.similarity >= threshold)
      .sort((a, b) => b.similarity - a.similarity)

    console.log(`🎯 Found ${results.length} matches above threshold ${threshold}`)

    return results

  } catch (error: any) {
    console.error('❌ Semantic search error:', error.message)
    console.error('Error details:', error)
    return []
  }
}

/**
 * Calculate simple keyword similarity
 */
function calculateKeywordSimilarity(query: string, text: string): number {
  const queryWords = query.toLowerCase().split(/\s+/).filter(w => w.length > 3)
  const textLower = text.toLowerCase()
  
  if (queryWords.length === 0) return 0

  let matches = 0
  queryWords.forEach(word => {
    if (textLower.includes(word)) matches++
  })

  return matches / queryWords.length
}

/**
 * Select best response based on intent and entities
 */
export function selectBestResponse(
  results: SearchResult[],
  intent: string,
  entities: string[]
): SearchResult | null {
  if (results.length === 0) return null

  // Boost scores based on category match
  const scored = results.map(result => {
    let score = result.similarity
    
    const category = result.metadata.category?.toLowerCase() || ''
    const question = result.metadata.question.toLowerCase()

    // Boost if category matches intent
    if (intent === 'pricing_inquiry' && category.includes('pricing')) score += 0.15
    if (intent === 'booking_intent' && category.includes('booking')) score += 0.15
    if (intent === 'service_inquiry' && category.includes('service')) score += 0.15
    if (intent === 'contact_request' && category.includes('contact')) score += 0.15
    if (intent === 'about_inquiry' && category.includes('about')) score += 0.15
    if (intent === 'portfolio_request' && category.includes('portfolio')) score += 0.15

    // Boost if entities match
    entities.forEach(entity => {
      if (question.includes(entity) || category.includes(entity)) {
        score += 0.1
      }
    })

    return { ...result, similarity: Math.min(score, 1) }
  })

  // Return highest scored result
  scored.sort((a, b) => b.similarity - a.similarity)
  return scored[0]
}
