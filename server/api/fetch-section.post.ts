import { createError, defineEventHandler, readBody, type H3Event } from 'h3'

interface RequestBody {
  websiteUrl: string
}

export default defineEventHandler(async (event: H3Event) => {
  try {
    const body = await readBody<RequestBody>(event)
    const { websiteUrl } = body
    
    const proxyUrl: string = 'https://api.allorigins.win/raw?url='
    const response = await $fetch<string>(proxyUrl + encodeURIComponent(websiteUrl))
    
    return { html: response }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch website section'
    })
  }
})