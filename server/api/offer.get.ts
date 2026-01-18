interface OfferDetails {
  id: string
  name: string
  cover?: string
  description: string
  amount: string
  features: string[]
}

export default defineEventHandler<Promise<OfferDetails[]>>(async () => {
  try {
    const config = useRuntimeConfig()
    const notionDbId = config.private.notionDbId as unknown as NotionDB

    const offers = await notionQueryDb<NotionOffer>(notion, notionDbId.offer, {
      filter: {
        property: 'Status',
        status: {
          equals: 'Active',
        },
      },
    })

    return offers.map<OfferDetails>(({ properties, cover }) => ({
      id: notionTextStringify(properties.ID.rich_text),
      name: notionTextStringify(properties.Name.title),
      cover: cover?.type === 'external' ? cover.external.url : undefined,
      description: notionTextStringify(properties.Description.rich_text),
      amount: notionTextStringify(properties.Amount.rich_text),
      features: properties.Features.multi_select.map(({ name }) => name),
    }))
  } catch (error) {
    console.error('API client GET', error)

    throw createError({
      statusCode: 500,
      statusMessage: 'Some Unknown Error Found',
    })
  }
})
