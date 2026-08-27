export default defineEventHandler(() => {
  try {
    const config = useRuntimeConfig().meta
    // com.docker.compose.service || com.docker.swarm.task.name
    const node = import.meta.env.HOSTNAME || 'unknown-node'

    return { status: 'OK', ...config, node }
  } catch (error: unknown) {
    console.error('API /health GET', error)

    if (error instanceof Error && 'statusCode' in error) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Some Unknown Error Found',
    })
  }
})
