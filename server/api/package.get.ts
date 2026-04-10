export default defineEventHandler<Promise<Package[]>>(
  async () => {
    try {
      const packages: Package[] = [
        {
          id: 'standard',
          title: 'Standard',
          subtitle: 'Everything you need for great product visuals',
          price: '20000',
          unit: 'day',
          features: [
            { icon: 'local:camera', title: 'Photo & video shoots included' },
            { icon: 'local:badge-check', title: 'Marketplace-ready edits (Amazon, Flipkart, etc.)' },
            { icon: 'local:layout', title: 'White background & infographic shots' },
            { icon: 'local:sparkles', title: 'Professional post-processing' },
            { icon: 'local:package', title: '360° product video available' },
            { icon: 'local:timer', title: 'Quick turnaround delivery' },
          ],
        },
        {
          id: 'custom',
          title: 'Custom',
          subtitle: 'Tailored end-to-end for premium brands',
          price: 'custom',
          unit: 'day',
          features: [
            { icon: 'local:compass', title: 'Custom mood board creation' },
            { icon: 'local:live', title: 'Live shoot streaming' },
            { icon: 'local:wand', title: 'Ultra-premium props & set design' },
            { icon: 'local:palette', title: 'Bespoke creative concept & direction' },
            { icon: 'local:movie', title: 'Campaign-ready hero video assets' },
            { icon: 'local:layers', title: 'Advanced motion graphics & retouching' },
            { icon: 'local:users', title: 'Model casting & styling support' },
            { icon: 'local:star', title: 'Dedicated production manager' },
          ],
        },
      ]

      if (!packages) throw createError({ statusCode: 500, statusMessage: 'packages is undefined' })

      return packages
    } catch (error: unknown) {
      console.error('API price GET', error)

      if (error instanceof Error && 'statusCode' in error) {
        throw error
      }

      throw createError({
        statusCode: 500,
        statusMessage: 'Some Unknown Error Found',
      })
    }
  }
  // { maxAge: 60 * 60, swr: true }
)
