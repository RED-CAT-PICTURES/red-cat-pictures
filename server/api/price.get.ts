export default defineCachedEventHandler<Promise<Price>>(
  async () => {
    try {
      const prices: Price = {
        photo: [
          {
            title: 'White Background Ecommerce',
            price: 150,
            unit: 'photo',
            points: [
              { icon: 'local:camera', title: '1 time change included' },
              { icon: 'local:badge-check', title: 'Edited for Amazon, Flipkart etc' },
              { icon: 'local:layout', title: 'Clean marketplace-ready shots' },
            ],
          },
          {
            title: 'Standard Food Photography',
            price: 150,
            unit: 'photo',
            points: [
              { icon: 'local:utensils', title: 'Premium edited photos' },
              { icon: 'local:sparkles', title: 'Premium cutlery set' },
              { icon: 'local:palette', title: '1 premium set design' },
            ],
          },
          {
            title: 'Standard Product Photography',
            price: 200,
            unit: 'photo',
            points: [
              { icon: 'local:camera', title: 'Premium edited photos' },
              { icon: 'local:layers', title: 'Premium real props' },
              { icon: 'local:layout', title: 'Premium set design' },
            ],
          },
          {
            title: 'Standard Garment Photography',
            price: 200,
            unit: 'photo',
            points: [
              { icon: 'local:users', title: 'Various models available (charges separate)' },
              { icon: 'local:badge-check', title: 'Edited for Amazon, Flipkart etc' },
              { icon: 'local:camera', title: '1 time change included' },
            ],
          },
          {
            title: 'Standard Ecommerce Package',
            price: 1000,
            unit: 'product',
            points: [
              { icon: 'local:package', title: '5 photos per product' },
              { icon: 'local:layout', title: '1 white BG + 3 infographics + 1 creative' },
              { icon: 'local:badge-check', title: 'Marketplace-ready delivery' },
            ],
          },
          {
            title: 'Customized Product Photography',
            price: 400,
            unit: 'photo',
            points: [
              { icon: 'local:compass', title: 'Custom mood board' },
              { icon: 'local:sparkles', title: 'Product retouching' },
              { icon: 'local:wand', title: 'Ultra premium props & custom set design' },
            ],
          },
          {
            title: 'Premium Food Photography',
            price: 450,
            unit: 'photo',
            points: [
              { icon: 'local:sparkles', title: 'Ultra premium edited photos' },
              { icon: 'local:palette', title: 'Ultra premium cutlery set' },
              { icon: 'local:layout', title: '3 ultra premium set designs' },
            ],
          },
        ],
        video: [
          {
            title: '360 Video',
            price: 500,
            unit: 'video',
            points: [
              { icon: 'local:cube-rotate', title: 'Complete 360° product view' },
              { icon: 'local:bag', title: 'Ecommerce-ready format' },
              { icon: 'local:timer', title: 'Quick turnaround delivery' },
            ],
          },
          {
            title: 'White Background Unboxing',
            price: 1000,
            unit: 'video',
            points: [
              { icon: 'local:package', title: 'Clean unboxing experience' },
              { icon: 'local:grid', title: 'White background setup' },
              { icon: 'local:badge-check', title: 'Platform-ready cuts' },
            ],
          },
          {
            title: 'Creative Video (up to 30s)',
            price: 2500,
            unit: 'video',
            points: [
              { icon: 'local:timer', title: 'Up to 30 seconds runtime' },
              { icon: 'local:movie', title: 'Creative concept execution' },
              { icon: 'local:target', title: 'Social & ad-ready deliverable' },
            ],
          },
          {
            title: 'Premium Product Video',
            price: 8000,
            unit: 'video',
            points: [
              { icon: 'local:star', title: 'Premium production quality' },
              { icon: 'local:layers', title: 'Advanced editing & motion graphics' },
              { icon: 'local:package', title: 'Campaign-ready hero asset' },
            ],
          },
        ],
      }

      if (!prices) throw createError({ statusCode: 500, statusMessage: 'prices is undefined' })

      return prices
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
  },
  { maxAge: 60 * 60, swr: true }
)
