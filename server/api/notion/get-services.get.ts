import { Client } from '@notionhq/client'
import { createError, defineEventHandler } from 'h3'


export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig()
    
    const notion = new Client({
      auth: config.notionApiKey as string
    })

    const response = await notion.databases.query({
      database_id: config.notionServicesDatabaseId as string,
      filter: {
        property: 'Active',
        checkbox: {
          equals: true
        }
      }
    })

    const services = response.results.map((page: any) => ({
      name: Array.isArray(page.properties['Service Name']?.title) && page.properties['Service Name'].title.length > 0
  ? page.properties['Service Name'].title[0].plain_text : '',
description: Array.isArray(page.properties['Detailed Description']?.rich_text) && page.properties['Detailed Description'].rich_text.length > 0
  ? page.properties['Detailed Description'].rich_text[0].plain_text : '',
shortDesc: Array.isArray(page.properties['Short Description']?.rich_text) && page.properties['Short Description'].rich_text.length > 0
  ? page.properties['Short Description'].rich_text[0].plain_text : '',
pricing: Array.isArray(page.properties['Base Price Range']?.rich_text) && page.properties['Base Price Range'].rich_text.length > 0
  ? page.properties['Base Price Range'].rich_text[0].plain_text : '',
timeline: Array.isArray(page.properties['Typical Timeline']?.rich_text) && page.properties['Typical Timeline'].rich_text.length > 0
  ? page.properties['Typical Timeline'].rich_text[0].plain_text : '',
category: page.properties.Category?.select?.name ?? '',

    }))

    return { services }

  } catch (error: any) {
    console.error('Notion services error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to get services'
    })
  }
})