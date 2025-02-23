Fastify API Gateway

This project is an **API Gateway** built with **Fastify** in TypeScript. It provides authentication, caching, and request forwarding to multiple microservices using `@fastify/http-proxy`. Redis is used for caching API responses.

Features
- **JWT Authentication** using `@fastify/jwt`
- **Cookie Support** using `@fastify/cookie`
- **Request Caching** with `@fastify/redis`
- **Proxying Requests** to microservices (`/users`, `/orders`)
- **Fastify Logging** for debugging and monitoring

Installation
Prerequisites
- **Node.js** (>= 16.x)
- **Redis** (Ensure Redis is running locally on port `6379`)

Steps
# Clone the repository
git clone <repo-url>
cd api-ts

# Install dependencies
npm install

# Run the API Gateway
npx ts-node src/index.ts


## Configuration
Update the following in `index.ts` as needed:
- **JWT Secret** (`your_secret_key`)
- **Microservice URLs** (default: `http://localhost:4000`, `http://localhost:5000`)

## API Endpoints
### Authentication Middleware
- Requests require a **JWT token** in the `Authorization` header.

### Proxied Routes
| Route       | Proxied To               | Description               |
|------------|-------------------------|---------------------------|
| `/users/*` | `http://localhost:4000/*` | User-related API routes   |
| `/orders/*` | `http://localhost:5000/*` | Order-related API routes  |

### Caching
- Responses are cached for **60 seconds** in Redis.
- If cached data exists, the response is served from Redis without hitting the microservice.

## Development & Debugging
- Enable detailed logging by modifying the `Fastify` instance:
  ```ts
  const app = Fastify({ logger: true });

- Check Redis cache manually:
  redis-cli
  KEYS *
