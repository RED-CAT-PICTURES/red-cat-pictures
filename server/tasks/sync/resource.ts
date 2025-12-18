type ResourceQueries = {
  [K in ResourceType]: ResourceRecordMap[K][]
}

export default defineTask({
  meta: {
    name: 'sync:resource',
    description: 'Sync Notion Resources into cache',
  },
  async run() {
    const config = useRuntimeConfig()
    const notionDbId = config.private.notionDbId as unknown as NotionDB
    const resources: ResourceQueries = {
      prospect: (await notionQueryDb<NotionProspect>(notion, notionDbId.prospect)).filter((a) => !!a),
      client: (await notionQueryDb<NotionProjectClient>(notion, notionDbId.client)).filter((a) => !!a),
      project: (await notionQueryDb<NotionProject>(notion, notionDbId.project)).filter((a) => !!a),
      content: (await notionQueryDb<NotionContent>(notion, notionDbId.content)).filter((a) => !!a),
      asset: (await notionQueryDb<NotionAsset>(notion, notionDbId.asset)).filter((a) => !!a),
    }
    const results = await Promise.allSettled(Object.values(resources))

    for (const [idx, res] of results.entries()) {
      const type = Object.keys(resources)[idx] as keyof typeof resources
      const resourceStorage = useStorage<Resource>(`data:resource:${type}`)

      if (res.status === 'fulfilled')
        await Promise.allSettled(
          res.value.map(async (record) => {
            if (typeof record === 'string') return

            const resource = (await resourceStorage.getItem(notionNormalizeId(record.id))) ?? {
              type,
              notificationStatus: false,
              record,
            }

            resource.record = record
            resourceStorage.setItem(notionNormalizeId(record.id), resource)
          })
        )
      else console.warn(`Notion fetch failed for ${type}:`, res.reason)
    }

    const emailStorage = useStorage<EmailSubscription>('data:subscription:email')
    const whatsappStorage = useStorage<WhatsappSubscription>('data:subscription:whatsapp')

    await Promise.allSettled(
      resources.prospect.map(async ({ properties }) => {
        const companyName = notionTextStringify(properties.Name.title)
        const email = properties.Email.email
        const whatsapp = properties.Whatsapp.url.replace(/^https?:\/\/wa\.me\//, '')

        // Subscribe to Email Notification
        if (email)
          await emailStorage.setItem(email, {
            name: companyName,
            email,
          })
        if (whatsapp)
          // Subscribe to Whatsapp Notification
          await whatsappStorage.setItem(whatsapp, {
            name: companyName,
            phone: whatsapp,
          })
      })
    )

    return { result: 'success' }
  },
})
