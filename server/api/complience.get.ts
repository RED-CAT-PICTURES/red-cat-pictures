import { NotionToMarkdown } from 'notion-to-md'

export default defineEventHandler(async () => {
  const config = useRuntimeConfig()

  const termsPageId = (config.private.notionDbId as unknown as NotionDB).terms
  const privacyPageId = (config.private.notionDbId as unknown as NotionDB).privacy
  const cancellationPageId = (config.private.notionDbId as unknown as NotionDB).cancellation
  const licensePageId = (config.private.notionDbId as unknown as NotionDB).license

  const n2m = new NotionToMarkdown({ notionClient: notion })

  const termsContent = (await notion.pages.retrieve({ page_id: termsPageId })) as unknown as NotionContent
  const termsLastUpdated = termsContent.last_edited_time
  const termsMarkdown = await notionPageToMarkdown(n2m, termsPageId, true)

  const privacyContent = (await notion.pages.retrieve({ page_id: privacyPageId })) as unknown as NotionContent
  const privacyLastUpdated = privacyContent.last_edited_time
  const privacyMarkdown = await notionPageToMarkdown(n2m, privacyPageId, true)

  const cancellationContent = (await notion.pages.retrieve({ page_id: cancellationPageId })) as unknown as NotionContent
  const cancellationLastUpdated = cancellationContent.last_edited_time
  const cancellationMarkdown = await notionPageToMarkdown(n2m, cancellationPageId, true)

  const licenseContent = (await notion.pages.retrieve({ page_id: licensePageId })) as unknown as NotionContent
  const licenseLastUpdated = licenseContent.last_edited_time
  const licenseMarkdown = await notionPageToMarkdown(n2m, licensePageId, true)

  return {
    terms: {
      content: termsMarkdown,
      lastUpdated: termsLastUpdated,
    },
    privacy: {
      content: privacyMarkdown,
      lastUpdated: privacyLastUpdated,
    },
    cancellation: {
      content: cancellationMarkdown,
      lastUpdated: cancellationLastUpdated,
    },
    license: {
      content: licenseMarkdown,
      lastUpdated: licenseLastUpdated,
    },
  }
})
