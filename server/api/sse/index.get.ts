export default defineEventHandler(async (event) => {
  setHeader(event, 'Content-Type', 'text/event-stream')
  setHeader(event, 'Cache-Control', 'no-cache')
  setHeader(event, 'Connection', 'keep-alive')
  setHeader(event, 'Access-Control-Allow-Origin', '*')

  const res = event.node.res

  const send = (data: unknown) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`)
  }

  const streamViewCounts = new Map<string, number>([
    ['stream-1', 42],
    ['stream-2', 15],
    ['stream-3', 8],
  ])

  send({
    type: 'view_counts',
    data: Object.fromEntries(streamViewCounts),
  })

  const updates = setInterval(() => {
    for (const [id, n] of streamViewCounts.entries()) {
      const change = Math.floor(Math.random() * 3) - 1
      streamViewCounts.set(id, Math.max(0, n + change))
    }
    send({
      type: 'view_counts',
      data: Object.fromEntries(streamViewCounts),
      timestamp: new Date().toISOString(),
    })
  }, 5000)

  const pings = setInterval(() => {
    res.write(': ping\n\n')
  }, 15000)

  event.node.req.on('close', () => {
    clearInterval(updates)
    clearInterval(pings)
    res.end()
  })
})
