interface ClaimRequestBody {
  offer: string
  company: string
  email: string
  contactNumber: string
  projectDetails: string
}

export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig()
    const notionDbId = config.private.notionDbId as unknown as NotionDB
    const body = await readBody<ClaimRequestBody>(event)

    if (!body || !body.offer || !body.company || !body.email || !body.contactNumber || !body.projectDetails) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing required fields (Name, Email, or Contact Number)',
      })
    }

    await notion.pages.create({
      parent: { data_source_id: notionDbId.prospect },
      properties: {
        Name: {
          title: [
            {
              text: {
                content: body.company,
              },
            },
          ],
        },
        Email: {
          email: body.email,
        },
        Phone: {
          phone_number: body.contactNumber,
        },
        Status: {
          status: {
            name: 'Initiate',
          },
        },
        Tags: {
          multi_select: [
            {
              name: body.offer,
            },
          ],
        },
      },
      children: [
        {
          object: 'block',
          type: 'heading_3',
          heading_3: {
            rich_text: [{ text: { content: 'Project Details' } }],
          },
        },
        {
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: [
              {
                text: {
                  content: body.projectDetails || 'No details provided.',
                },
              },
            ],
          },
        },
      ],
    })

    console.log('Backend received offer claim:', body)

    return {
      success: true,
      message: 'Offer claimed successfully',
    }
  } catch (error) {
    console.error('API client GET', error)

    throw createError({
      statusCode: 500,
      statusMessage: 'Some Unknown Error Found',
    })
  }
})
