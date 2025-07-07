# EPREL Proxy Server

Proxy server for accessing the EPREL API with CORS support.

Solution for server-side access and CORS restrictions when integrating EPREL into web applications.

## Environment Variables

Create an `.env` file with the following variables:

```env
EPREL_API_URL= # Base URL of the EPREL API
API_KEY=       # Your EPREL API key
CORS_ORIGIN=*  # Allowed CORS origin (default: "*")
```

> [!TIP]
> You can obtain a public API key by submitting a request at: [https://eprel.ec.europa.eu/screen/requestpublicapikey](https://eprel.ec.europa.eu/screen/requestpublicapikey)

## Get started

```bash
bun create marcmarine/eprel-api-proxy
cd eprel-api-proxy
echo "EPREL_API_URL=https://eprel.ec.europa.eu/api" > .env.local
bun dev
```

Once the server is running, you can access the health check endpoint in your browser:

[http://localhost:3000/health](http://localhost:3000/health)

## Scripts

```bash
bun dev    # Run in development mode
bun start  # Run in production
```

## License

MIT License © 2025 [Marc Mariné](https://github.com/marcmarine)
