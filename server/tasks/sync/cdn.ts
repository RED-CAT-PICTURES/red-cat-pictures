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
    const assets = await notionQueryDb<NotionAsset>(notion, notionDbId.asset)

    for await (const asset of assets) {
      // current cover -> https://ucarecdn.com/17dc5f16-3961-47c2-9ea2-996b4fac0d19/-/preview/1620x1080/
      // update cover -> https://cdn.redcatpictures.com/media/w_1620&h_1080/product-photo-033-033

      // asset.properties.Type.select.name === 'Photo' && asset.properties.Status.status.name === 'Plan'
      // if (asset.properties.Status.status.name !== 'Plan') continue

      const slug = asset.properties.Slug?.formula?.string.includes('video-0000-0000') ? asset.properties.Slug?.formula?.string + '-landscape' : asset.properties.Slug?.formula?.string
      // const type = asset.properties.Type.select.name.toLowerCase() as 'photo' | 'video'

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
        console.log('🍃 Updating', { slug, updateCoverURL })

        await notion.pages.update({
          page_id: asset.id,
          cover: {
            type: 'external',
            external: { url: updateCoverURL },
          },
          properties: {
            Status: {
              status: {
                name: asset.properties.Status.status.name, //coverExists ? (asset.properties.Status.status.name !== 'Plan' ? asset.properties.Status.status.name : 'Draft') : 'Plan',
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
      } catch {
        console.log('🚩 Failed Updating', { slug })
      }
    }

    return { result: 'Success' }
  },
})
