import type { StreamMetadata } from '../../types'

import { Client } from '@notionhq/client'

const NOTION_API_KEY = process.env.NOTION_API_KEY || ''
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID || ''

class NotionClient {
  private apiKey: string
  private databaseId: string

  constructor(apiKey: string, databaseId: string) {
    this.apiKey = apiKey
    this.databaseId = databaseId
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`https://api.notion.com/v1${endpoint}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28',
        ...options.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`Notion API error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  async createStream(metadata: StreamMetadata) {
    const response = await this.request(`/databases/${this.databaseId}/pages`, {
      method: 'POST',
      body: JSON.stringify({
        parent: { database_id: this.databaseId },
        properties: {
          'Stream ID': {
            title: [{ text: { content: metadata.streamId } }],
          },
          Title: {
            rich_text: [{ text: { content: metadata.title } }],
          },
          Description: {
            rich_text: [{ text: { content: metadata.description } }],
          },
          Creator: {
            rich_text: [{ text: { content: metadata.creator } }],
          },
          Status: {
            select: { name: metadata.status },
          },
          'Start Time': {
            date: { start: metadata.startTime },
          },
          'End Time': {
            date: metadata.endTime ? { start: metadata.endTime } : null,
          },
          'Viewer Count': {
            number: metadata.viewerCount,
          },
          'HLS URL': {
            url: metadata.hlsUrl,
          },
          'DASH URL': {
            url: metadata.dashUrl,
          },
          'Thumbnail URL': {
            url: metadata.thumbnailUrl || '',
          },
          'Is Recording': {
            checkbox: metadata.isRecording,
          },
          'Recording URL': {
            url: metadata.recordingUrl || '',
          },
        },
      }),
    })

    return response
  }

  async updateStream(streamId: string, metadata: Partial<StreamMetadata>) {
    const searchResponse = await this.request(`/databases/${this.databaseId}/query`, {
      method: 'POST',
      body: JSON.stringify({
        filter: {
          property: 'Stream ID',
          title: {
            equals: streamId,
          },
        },
      }),
    })

    if (searchResponse.results.length === 0) {
      throw new Error(`Stream ${streamId} not found`)
    }

    const pageId = searchResponse.results[0].id

    const response = await this.request(`/pages/${pageId}`, {
      method: 'PATCH',
      body: JSON.stringify({
        properties: {
          Title: metadata.title
            ? {
                rich_text: [{ text: { content: metadata.title } }],
              }
            : undefined,
          Description: metadata.description
            ? {
                rich_text: [{ text: { content: metadata.description } }],
              }
            : undefined,
          Creator: metadata.creator
            ? {
                rich_text: [{ text: { content: metadata.creator } }],
              }
            : undefined,
          Status: metadata.status
            ? {
                select: { name: metadata.status },
              }
            : undefined,
          'Start Time': metadata.startTime
            ? {
                date: { start: metadata.startTime },
              }
            : undefined,
          'End Time': metadata.endTime
            ? {
                date: { start: metadata.endTime },
              }
            : undefined,
          'Viewer Count':
            metadata.viewerCount !== undefined
              ? {
                  number: metadata.viewerCount,
                }
              : undefined,
          'HLS URL': metadata.hlsUrl
            ? {
                url: metadata.hlsUrl,
              }
            : undefined,
          'DASH URL': metadata.dashUrl
            ? {
                url: metadata.dashUrl,
              }
            : undefined,
          'Thumbnail URL': metadata.thumbnailUrl
            ? {
                url: metadata.thumbnailUrl,
              }
            : undefined,
          'Is Recording':
            metadata.isRecording !== undefined
              ? {
                  checkbox: metadata.isRecording,
                }
              : undefined,
          'Recording URL': metadata.recordingUrl
            ? {
                url: metadata.recordingUrl,
              }
            : undefined,
        },
      }),
    })

    return response
  }

  async getStreams() {
    const response = await this.request(`/databases/${this.databaseId}/query`, {
      method: 'POST',
      body: JSON.stringify({
        sorts: [
          {
            property: 'Start Time',
            direction: 'descending',
          },
        ],
      }),
    })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return response.results.map((page: any) => ({
      id: page.id,
      streamId: page.properties['Stream ID'].title[0]?.text?.content || '',
      title: page.properties.Title.rich_text[0]?.text?.content || '',
      description: page.properties.Description.rich_text[0]?.text?.content || '',
      creator: page.properties.Creator.rich_text[0]?.text?.content || '',
      status: page.properties.Status.select?.name || 'offline',
      startTime: page.properties['Start Time'].date?.start || '',
      endTime: page.properties['End Time'].date?.start || '',
      viewerCount: page.properties['Viewer Count'].number || 0,
      hlsUrl: page.properties['HLS URL'].url || '',
      dashUrl: page.properties['DASH URL'].url || '',
      thumbnailUrl: page.properties['Thumbnail URL'].url || '',
      isRecording: page.properties['Is Recording'].checkbox || false,
      recordingUrl: page.properties['Recording URL'].url || '',
    }))
  }
}

export const notionClient = NOTION_API_KEY && NOTION_DATABASE_ID ? new NotionClient(NOTION_API_KEY, NOTION_DATABASE_ID) : null

export const createStreamInNotion = async (metadata: StreamMetadata) => {
  if (!notionClient) {
    console.warn('Notion client not configured, skipping database update')
    return null
  }
  return notionClient.createStream(metadata)
}

export const updateStreamInNotion = async (streamId: string, metadata: Partial<StreamMetadata>) => {
  if (!notionClient) {
    console.warn('Notion client not configured, skipping database update')
    return null
  }
  return notionClient.updateStream(streamId, metadata)
}

export const getStreamsFromNotion = async () => {
  if (!notionClient) {
    console.warn('Notion client not configured, returning empty array')
    return []
  }
  return notionClient.getStreams()
}

const notionClientSingleton = () => {
  return new Client({ auth: import.meta.env.NOTION_API_KEY })
}

declare const globalThis: {
  notionGlobal: ReturnType<typeof notionClientSingleton>
} & typeof global

const notion = globalThis.notionGlobal ?? notionClientSingleton()

export default notion

if (import.meta.env.NODE_ENV !== 'production') globalThis.notionGlobal = notion
