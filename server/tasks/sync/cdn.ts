interface MetaVideo {
  format: {
    filename: string
    formatName: string
    duration: number
    size: number
    bitRate: number
  }
  stream: {
    codecName: string
    codecType: string
    width: number
    height: number
    bitRate: number
    duration: number
    frameRate: number
  }
}

interface MetaPhoto {
  format: {
    filename: string
    formatName: string
    size: number
    width: number
    height: number
  }
}

export default defineTask({
  meta: {
    name: 'sync:cdn',
    description: 'Sync Drive Resources into CDN',
  },
  async run() {
    const config = useRuntimeConfig()
    const notionDbId = config.private.notionDbId as unknown as NotionDB
    const driveAssetSlugs = await $fetch<string[]>(`/api/media`, {
      baseURL: config.public.cdnUrl,
    })
    const notionAssets = await notionQueryDb<NotionAsset>(notion, notionDbId.asset)
    const slugToId = new Map(
      notionAssets
        .map((asset) => {
          const raw = asset.properties.Slug?.formula?.string

          const slug = raw && raw.includes('video-0000-0000') ? `${raw}-landscape` : raw

          return [slug, asset.id] as const
        })
        .filter(([slug]) => typeof slug === 'string' && slug.length > 0)
    )

    const assets = Object.fromEntries(driveAssetSlugs.filter((k): k is string => typeof k === 'string' && k.length > 0).map((k) => [k, slugToId.get(k) ?? null] as const)) as Record<
      string,
      string | null
    >

    for await (const [slug, id] of Object.entries(assets)) {
      // current cover -> https://ucarecdn.com/17dc5f16-3961-47c2-9ea2-996b4fac0d19/-/preview/1620x1080/
      // update cover -> https://cdn.redcatpictures.com/media/w_1620&h_1080/product-photo-033-033

      try {
        const metaData = await $fetch<MetaPhoto | MetaVideo>(`/api/media/${slug}`, {
          baseURL: config.public.cdnUrl,
        })

        const originalWidth = !('stream' in metaData) ? metaData.format.width : metaData.stream.width
        const originalHeight = !('stream' in metaData) ? metaData.format.height : metaData.stream.height

        const resolutionLabel = getResolution(originalWidth, originalHeight)
        const aspectRatioLabel = getAspectRatio(originalWidth, originalHeight)
        const [aW, aH] = aspectRatioLabel.split(':').flatMap((item) => parseInt(item))
        const aspectRatio = aW / aH

        const { width: coverWidth, height: coverHeight } = calculateDimension(1080, aspectRatio)

        let updateCoverURL = `${config.public.cdnUrl}/media/image/s_${coverWidth}x${coverHeight}/${slug}`
        await $fetch(updateCoverURL, { method: 'HEAD' })

        updateCoverURL = `https://cdn.redcatpictures.com/media/image/s_${coverWidth}x${coverHeight}/${slug}`

        if (id) {
          await notion.pages.update({
            page_id: id,
            cover: {
              type: 'external',
              external: { url: updateCoverURL },
            },
            properties: {
              Resolution: {
                type: 'select',
                select: {
                  name: resolutionLabel,
                },
              },
              'Aspect ratio': {
                select: {
                  name: `${aW}:${aH}`,
                },
              },
              ...(metaData && {
                Additional: {
                  rich_text: [{ text: { content: `${JSON.stringify({ duration: metaData.format.duration })}` } }],
                },
              }),
            },
          })

          console.log('🍃 Updating', { slug, updateCoverURL })
        } else {
          const { results } = await notion.databases.query({
            database_id: notionDbId.project,
            filter: {
              property: 'Index',
              number: { equals: parseInt(slug.split('-')[1]) },
            },
            page_size: 10,
          })
          const projectId = results[0].id

          await notion.pages.create({
            parent: {
              database_id: notionDbId.asset,
            },
            cover: {
              type: 'external',
              external: { url: updateCoverURL },
            },
            properties: {
              Project: {
                type: 'relation',
                relation: projectId
                  ? [
                      {
                        id: projectId,
                      },
                    ]
                  : [],
              },
              Index: {
                type: 'number',
                number: parseInt(slug.split('-')[2]),
              },
              'Version Index': {
                type: 'number',
                number: parseInt(slug.split('-')[3]),
              },
              Name: {
                type: 'title',
                title: [
                  {
                    type: 'text',
                    text: {
                      content: slug,
                    },
                  },
                ],
              },
              Type: {
                type: 'select',
                select: {
                  name: slug.split('-')[0] === 'photo' ? 'Photo' : 'Video',
                },
              },
              Status: {
                type: 'status',
                status: {
                  name: 'Plan',
                },
              },
              Resolution: {
                type: 'select',
                select: {
                  name: resolutionLabel,
                },
              },
              'Aspect ratio': {
                select: {
                  name: `${aW}:${aH}`,
                },
              },
              ...(metaData && {
                Additional: {
                  rich_text: [{ text: { content: `${JSON.stringify({ duration: metaData.format.duration })}` } }],
                },
              }),
            },
          })

          console.log('⚒️ Creating', { slug, updateCoverURL })
        }
      } catch {
        console.log('🚩 Failed Updating', { slug })
      }
    }

    return { result: 'Success' }
  },
})
