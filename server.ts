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
        // Proxy request to EPREL API with API key authentication
        const response = await fetch(
          `${Bun.env.EPREL_API_URL}/product/${registrationNumber}${search}`,
          {
            headers: {
              'X-Api-Key': Bun.env.API_KEY as string,
            },
          }
        )

        const data = await response.json()
        return withCORS(Response.json(data, { status: response.status }))
      } catch (error) {
        return withCORS(
          Response.json({ message: (error as any).message }, { status: 500 })
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
