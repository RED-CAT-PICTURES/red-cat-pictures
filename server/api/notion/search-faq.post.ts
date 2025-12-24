import { Client } from '@notionhq/client'
import { createError, defineEventHandler, readBody } from 'h3'


interface RequestBody {
  query: string
}

export default defineEventHandler(async (event) => {
  try {
    const { query } = await readBody<RequestBody>(event)
    const config = useRuntimeConfig()
    
    // const notion = new Client({
    //   auth: config.notionApiKey as string
    // })

    // Query FAQ database
    const notionDbId = config.private.notionDbId as unknown as NotionDB
    const response = await notion.databases.query({
      database_id: notionDbId.knowledgebase,
      filter: {
        property: 'Status',
        select: {
          equals: 'Active'
        }
      }
    })

    // Search through results
    const results = response.results.filter((page: any) => {
  // Safely extract question text
  const question = Array.isArray(page.properties.Question?.title) && page.properties.Question.title.length > 0
    ? page.properties.Question.title[0].plain_text.toLowerCase()
    : '';

  // Safely extract keywords names array
  const keywords = Array.isArray(page.properties.Keywords?.multi_select)
    ? page.properties.Keywords.multi_select.map((k: any) => (k.name ?? '').toLowerCase())
    : [];

  // Safely extract alternative phrasings text
  const altPhrases = Array.isArray(page.properties['Alternative Phrasings']?.rich_text) &&
                     page.properties['Alternative Phrasings'].rich_text.length > 0
    ? page.properties['Alternative Phrasings'].rich_text[0].plain_text.toLowerCase()
    : '';

  const searchTerm = query.toLowerCase();

  return question.includes(searchTerm) ||
         keywords.some((kw: string) => searchTerm.includes(kw)) ||
         altPhrases.includes(searchTerm);
});

const faqs = results.map((page: any) => {
  const answerProp = page.properties.Answer

  let answerText = ''

  // TEXT (long answers)
  if (answerProp?.type === 'rich_text') {
    answerText = answerProp.rich_text
      .map((t: any) => t.plain_text)
      .join('\n')
  }

  // EMAIL
  const email = page.properties['Contact Email']?.email ?? ''

  // PHONE
  const phone = page.properties['Contact Phone']?.phone_number ?? ''

  return {
    question:
      page.properties.Question?.title?.[0]?.plain_text ?? '',
    answer: answerText,
    email,
    phone,
    category: page.properties.Category?.select?.name ?? '',
    priority: page.properties.Priority?.select?.name ?? ''
  }
})


  } catch (error: any) {
    console.error('Notion FAQ search error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to search FAQ'
    })
  }
})