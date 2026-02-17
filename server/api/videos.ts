import type { Video } from '../../types'

const getBase = () => {
  const config = useRuntimeConfig()
  const base = config.public?.streamBaseUrl || 'http://localhost'
  return base.replace(/\/$/, '')
}

const videos: Video[] = [
  {
    id: '1',
    title: 'Sunset Over Mountains - Live',
    description: 'Enjoy a calm live stream with ambient music and mountain sunsets.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop',
    videoUrl: `${getBase()}/hls/stream-1.m3u8`,
    creator: {
      name: 'Kate',
      avatarUrl: 'https://i.pravatar.cc/100?img=1',
    },
    status: 'live',
    postedDate: '25 January 2025',
  },
  {
    id: '2',
    title: 'Building an Online Business',
    description: 'Recorded session covering the fundamentals of building an online brand.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=1600&auto=format&fit=crop',
    videoUrl: 'https://www.w3schools.com/html/movie.mp4',
    creator: {
      name: 'Arlene McCoy',
      avatarUrl: 'https://i.pravatar.cc/100?img=5',
    },
    status: 'past',
    postedDate: '26 January 2025',
    views: 3204,
  },
  {
    id: '3',
    title: 'Nutrition Goals & Workout Planning',
    description: 'Tips from a fitness trainer on how to plan workouts and nutrition.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1546484959-f9a53db89f5d?q=80&w=1600&auto=format&fit=crop',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    creator: {
      name: 'Ralph Edwards',
      avatarUrl: 'https://i.pravatar.cc/100?img=12',
    },
    status: 'past',
    postedDate: '27 January 2025',
    views: 18402,
  },
  {
    id: '4',
    title: 'AI Trends 2025 - Live Q&A',
    description: 'Join us for a live Q&A discussing the latest trends in AI.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?q=80&w=1600&auto=format&fit=crop',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    creator: {
      name: 'Sophia',
      avatarUrl: 'https://i.pravatar.cc/100?img=22',
    },
    status: 'upcoming',
    postedDate: '30 January 2025',
    scheduledTime: '2025-01-30T18:00:00Z',
  },
  {
    id: '5',
    title: 'Desk Setup Tour 2025',
    description: 'A look at a productive and minimalist desk setup for creators.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1600&auto=format&fit=crop',
    videoUrl: 'https://www.w3schools.com/html/movie.mp4',
    creator: {
      name: 'Liam',
      avatarUrl: 'https://i.pravatar.cc/100?img=33',
    },
    status: 'past',
    postedDate: '10 January 2025',
    views: 920,
  },
  {
    id: '6',
    title: 'City Photo Walk - Live',
    description: 'Walk through the city, capturing street photography live.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=1600&auto=format&fit=crop',
    videoUrl: `${getBase()}/hls/stream-1.m3u8`,
    creator: {
      name: 'Nina',
      avatarUrl: 'https://i.pravatar.cc/100?img=44',
    },
    status: 'live',
    postedDate: '25 January 2025',
  },
]

export default defineEventHandler(() => {
  return videos
})
