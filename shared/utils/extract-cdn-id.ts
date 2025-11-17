export default function getLastSegment(url: string): string
export default function getLastSegment(url?: undefined): undefined
export default function getLastSegment(url?: string): string | undefined {
  return url ? url.split('/').at(-1) : undefined
}
