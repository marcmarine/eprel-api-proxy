const FORWARDED_HEADERS = [
  'Content-Type',
  'Content-Disposition',
  'Cache-Control',
]

const server = Bun.serve({
  routes: {
    '/health': new Response('OK'),

    '/product/:registrationNumber': async (request) => {
      if (request.method !== 'GET') {
        return withCORS(
          Response.json(
            { message: 'Method not allowed' },
            { status: 405, headers: { Allow: 'GET' } }
          )
        )
      }

      const { registrationNumber } = request.params
      if (!/^\d+$/.test(registrationNumber)) {
        return withCORS(
          Response.json(
            { message: 'Invalid registration number' },
            { status: 400 }
          )
        )
      }

      const { search } = new URL(request.url)

      try {
        // Proxy request to EPREL API, authenticating only if an API key is set
        const response = await fetch(
          `${Bun.env.EPREL_API_URL}/product/${registrationNumber}${search}`,
          {
            headers: Bun.env.API_KEY ? { 'X-Api-Key': Bun.env.API_KEY } : {},
          }
        )

        // Pass the body through untouched (JSON, SVG, PNG...). Encoding and
        // length headers are not copied because fetch already decompressed it.
        const headers = new Headers()
        for (const name of FORWARDED_HEADERS) {
          const value = response.headers.get(name)
          if (value) headers.set(name, value)
        }

        return withCORS(
          new Response(response.body, { status: response.status, headers })
        )
      } catch (error) {
        return withCORS(
          Response.json({ message: (error as any).message }, { status: 502 })
        )
      }
    },
  },

  fetch() {
    return withCORS(Response.json({ message: 'Not found' }, { status: 404 }))
  },
})

console.log(`🚀 Server running at ${server.url}`)

export function withCORS(response: Response) {
  response.headers.set(
    'Access-Control-Allow-Origin',
    Bun.env.CORS_ORIGIN || '*'
  )
  return response
}
