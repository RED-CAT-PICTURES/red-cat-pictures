import { Client } from '@notionhq/client'
import { createError, defineEventHandler, readBody } from 'h3'


interface RequestBody {
  infoType: string
}

export default defineEventHandler(async (event) => {
  try {
    const { infoType } = await readBody<RequestBody>(event)
    const config = useRuntimeConfig()
    
    const notion = new Client({
      auth: config.notionApiKey as string
    })

    const response = await notion.databases.query({
      database_id: config.notionCompanyInfoDatabaseId as string,
      filter: {
        property: 'Category Type',
        select: {
          equals: infoType
        }
      }
    })

    if (response.results.length === 0) {
      return { info: null }
    }

    function getPlainText(property: any, field: string) {
  if (property?.[field]?.length > 0) {
    return property[field][0].plain_text;
  }
  return '';
}

// later in your code:
const page: any = response.results[0]
const info = {
  category: getPlainText(page.properties, 'Info Category.title'),
  information: getPlainText(page.properties, 'Information.rich_text'),
  chatbotResponse: getPlainText(page.properties, 'Chatbot Response.rich_text')
}


    return { info }

  } catch (error: any) {
    console.error('Notion company info error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to get company info'
    })
  }
})