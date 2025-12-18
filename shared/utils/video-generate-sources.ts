import { codecs, type Codec, type FileSources, type Source } from '~~/shared/types'

export const landscapePreset: FileSources = {
  av1: {
    type: 'video/webm',
    orientation: ['landscape'],
  },
  vp9: {
    type: 'video/webm',
    orientation: ['landscape'],
  },
  avc: {
    type: 'video/mp4',
    orientation: ['landscape'],
  },
  hevc: {
    type: 'video/mp4',
    orientation: ['landscape'],
  },
}

export const portraitPreset: FileSources = {
  av1: {
    type: 'video/webm',
    orientation: ['portrait'],
  },
  vp9: {
    type: 'video/webm',
    orientation: ['portrait'],
  },
  avc: {
    type: 'video/mp4',
    orientation: ['portrait'],
  },
  hevc: {
    type: 'video/mp4',
    orientation: ['portrait'],
  },
}

export const heroPreset: FileSources = (() => {
  const merged: FileSources = {}

  for (const codec of codecs.toReversed()) {
    merged[codec] = { type: portraitPreset[codec]!.type, orientation: [...portraitPreset[codec]!.orientation!, ...landscapePreset[codec]!.orientation!] }
    // for (const res of resolutions.toReversed()) {
    //   merged[codec]![res] = [...portraitPreset[codec]![res]!, ...landscapePreset[codec]![res]!]
    // }
  }

  return merged
})()

// Use explicit RFC 6381 codec strings so browsers can quickly reject unsupported sources; for HEVC, tag as "hvc1" (not "hev1") to avoid black video on Apple decoders
function buildType(codec: Codec): string {
  switch (codec) {
    case 'avc':
      return 'video/mp4'
    case 'hevc':
      return 'video/mp4; codecs="hvc1"'
    case 'vp9':
      return 'video/webm'
    case 'av1':
      return 'video/webm'
  }
}

export default function (name: string, sources: FileSources): Source[] {
  // const order: Resolution[] = ['1080p', '1440p', '720p']
  const result: Source[] = []
  for (const codec of Object.keys(sources) as Codec[]) {
    const codecSources = sources[codec]
    if (!codecSources) continue
    const typeWithCodecs = buildType(codec)
    // const extension = mimeType === 'video/webm' ? 'webm' : mimeType === 'video/mp4' ? 'mp4' : ''
    // const resolutionKeys = (Object.keys(codecSources).filter((key) => key !== 'type') as Resolution[]).sort((a, b) => order.indexOf(a) - order.indexOf(b))
    // for (const resolution of resolutionKeys) {
    // const resolution = '1440p'
    const orientations = codecSources.orientation
    if (!orientations || !Array.isArray(orientations)) continue
    const hasBoth = orientations.includes('landscape') && orientations.includes('portrait')
    for (const orientation of orientations) {
      const media = hasBoth ? (orientation === 'landscape' ? '(orientation: landscape)' : '(orientation: portrait)') : ''
      // const src = `${cdnUrl}/media/video/h_${resolution.slice(0, -1)}&c_${codec}&q_90/${name}` // -${orientation}
      if (!name) continue

      result.push({
        src: name.includes('video-0000-0000') ? `${name}-${orientation}` : name,
        type: typeWithCodecs,
        orientation,
        media,
        codec,
      })
    }
    // }
  }
  return result
}
