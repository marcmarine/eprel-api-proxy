# EPREL Proxy Server

Proxy server for accessing the EPREL API with CORS support.

Solution for server-side access and CORS restrictions when integrating EPREL into web applications.

## Environment Variables

Create an `.env.local` file with the following variables:

```env
# Base URL of the EPREL API (required)
EPREL_API_URL=https://eprel.ec.europa.eu/api
# Your EPREL API key (optional)
API_KEY=
# Allowed CORS origin (default: "*")
CORS_ORIGIN=*
```

`API_KEY` is not needed to look up a product by registration number. If it is not set, the `X-Api-Key` header is not sent.

> [!TIP]
> You can obtain a public API key by submitting a request at: [https://eprel.ec.europa.eu/screen/requestpublicapikey](https://eprel.ec.europa.eu/screen/requestpublicapikey)

> [!NOTE]
> `CORS_ORIGIN` only stops other websites from calling the proxy from the browser. It does not block server-side requests, so anyone who knows the URL can use it.

## Endpoints

| Method | Path                           | Description                                              |
| ------ | ------------------------------ | -------------------------------------------------------- |
| `GET`  | `/health`                      | Health check                                             |
| `GET`  | `/product/:registrationNumber` | Proxied to `{EPREL_API_URL}/product/:registrationNumber` |

`registrationNumber` must be numeric. Any other path returns `404`.

```bash
curl http://localhost:3000/product/123456
```

## Get started

```bash
bun create marcmarine/eprel-api-proxy
cd eprel-api-proxy
echo "EPREL_API_URL=https://eprel.ec.europa.eu/api" > .env.local
bun dev
```

Once the server is running, you can access the health check endpoint in your browser: [http://localhost:3000/health](http://localhost:3000/health)

### Docker

Build the Docker image:

```bash
docker build --pull -t eprel-api-proxy .
```

Run the container, passing your environment file:

```bash
docker run --env-file .env.local -p 3000:3000 eprel-api-proxy
```

Once running, you can visit: [http://localhost:3000/health](http://localhost:3000/health)

## Scripts

```bash
bun dev    # Run in development mode
bun start  # Run in production
```

## License

MIT License © 2025 [Marc Mariné](https://github.com/marcmarine)
