export default function extractCdnId(url: string): string
export default function extractCdnId(url?: undefined): undefined
export default function extractCdnId(url?: string): string | undefined {
  return url ? url.split('/').at(-1) : undefined
}
