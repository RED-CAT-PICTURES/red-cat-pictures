import { z } from 'zod'

export default defineMcpTool({
  description: 'Retrieves pricing, features, and calculates total project estimates for photography and video production packages.',
  inputSchema: {
    days: z.number().int().min(1).default(1).describe('Duration of the shoot/project in days'),
    packageId: z.enum(['standard', 'custom']).optional().describe('Filter for a specific package'),
    includeAddons: z.boolean().default(false).describe('Whether to include optional premium add-ons in the response'),
  },
  handler: async ({ days = 1, packageId, includeAddons }) => {
    const basePackages = await $fetch<Package[]>('/api/package')

    const filteredPackages = packageId ? basePackages.filter((p) => p.id === packageId) : basePackages

    const processedPackages = filteredPackages.map((pkg) => {
      const isNumericPrice = typeof pkg.price === 'number'
      const totalCost = isNumericPrice ? (pkg.price as unknown as number) * days : 'Requires Consultation'

      return {
        ...pkg,
        calculation: {
          requestedDays: days,
          dailyRate: pkg.price,
          totalEstimatedCost: totalCost,
          currency: 'INR', // Assuming based on the 20k price point
        },
      }
    })

    // 3. New Options: Optional Add-ons
    const addons = includeAddons ? [{ item: 'Additional Model Casting', price: 'Varies' }] : []

    return {
      packages: processedPackages,
      addons: includeAddons ? addons : undefined,
      summary: `Estimated project duration: ${days} day(s). ${packageId ? `Showing details for ${packageId}.` : 'Showing all available tiers.'}`,
    }
  },
})
