export default defineCachedEventHandler<Promise<Video[]>>(
  async () => {
    try {
      const assetStorage = useStorage<Resource<'asset'>>(`data:resource:asset`)
      const assets = (await assetStorage.getItems(await assetStorage.getKeys())).flatMap(({ value }) => value.record)

      const videos = assets.filter(({ properties }) => properties.Type?.select?.name === 'Video' && properties.Status.status?.name === 'Release')

      if (!videos) throw createError({ statusCode: 500, statusMessage: 'videos is undefined' })

      // const slugMap: Record<string, string> = {}
      const results = await Promise.allSettled(
        videos
          .toSorted((a, b) => {
            const pa = b.properties['Project Index'].rollup?.array[0]?.number ?? 0
            const pb = a.properties['Project Index'].rollup?.array[0]?.number ?? 0
            return pa - pb || (b.properties.Index?.number ?? 0) - (a.properties.Index?.number ?? 0)
          })
          .map<Promise<Video>>(async ({ cover, properties, created_time }) => {
            const slug: string = properties.Slug.formula.string

            // if (slugify(notionTextStringify(properties.Slug.rich_text)) !== slug)
            //   slugMap[slugify(notionTextStringify(properties.Slug.rich_text))] = slug

            const [aW, aH] = properties['Aspect ratio'].select.name.split(':').map((item) => parseInt(item))
            const aspectRatio = aW / aH

            const additionalProperties = JSON.parse(notionTextStringify(properties['Additional'].rich_text)) as {
              duration: number
            }

            return {
              id: slug,
              title: notionTextStringify(properties.Name.title),
              description: notionTextStringify(properties.Description.rich_text),
              type: slug.includes('video-0000-0000') ? 'hero' : 'feature',
              poster: cover?.type === 'external' ? cover.external.url : undefined,
              sources: videoGenerateSources(slug, slug.includes('video-0000-0000') ? heroPreset : aspectRatio < 1 ? portraitPreset : landscapePreset),
              aspectRatio: aspectRatio,
              duration: additionalProperties.duration,
              category: properties.Segment.select.name,
              gallery: properties.Gallery.checkbox,
              featured: properties.Featured.number,
              url: `/video/${slug}`,
              uploadDate: created_time,
            }
          })
      )

      // return slugMap

      return results.filter((result) => result.status === 'fulfilled').map((result) => result.value)
    } catch (error: unknown) {
      console.error('API video GET', error)

      if (error instanceof Error && 'statusCode' in error) {
        throw error
      }

      throw createError({
        statusCode: 500,
        statusMessage: 'Some Unknown Error Found',
      })
    }
  },
  { maxAge: 60 * 1, swr: true }
)
