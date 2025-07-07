const server = Bun.serve({
  routes: {
    '/health': new Response('OK'),
  },

  async fetch(request) {
    const { pathname, searchParams } = new URL(request.url)

    try {
      // Proxy request to EPREL API with API key authentication
      const response = await fetch(
        Bun.env.EPREL_API_URL + `${pathname}?${searchParams.toString()}`,
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
})

console.log(`🚀 Server running at ${server.url}`)

export function withCORS(response: Response) {
  response.headers.set(
    'Access-Control-Allow-Origin',
    Bun.env.CORS_ORIGIN || '*'
  )
  return response
}
