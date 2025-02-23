# Fastify API Gateway

## Overview
This project is an API Gateway built using Fastify that routes requests to different microservices while providing authentication, caching, and rate limiting. It integrates with Redis for caching and supports request validation.

## Features
- **Microservices Proxying** 🚀
  - Users Service (`http://localhost:4000`)
  - Orders Service (`http://localhost:5000`)
  - Payments Service (`http://localhost:6000`)
  - Notifications Service (`http://localhost:7000`)
  - Products Service (`http://localhost:8000`)
- **Security Enhancements** 🔒
  - JWT Authentication
  - Rate Limiting using `@fastify/rate-limit`
  - CORS Handling using `@fastify/cors`
  - Request Validation with `zod`
- **Caching with Redis** ⚡
  - Cached API responses to improve performance
- **Real-time Notifications** 🔔
  - Future improvement: Push updates instead of polling
- **Structured Logging** 📊
  - Logs requests, response times, and errors for debugging & analytics

## Installation

1. Clone the repository:
   ```sh
   git clone <repository-url>
   cd api-ts
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start Redis (Ensure Redis is running on `127.0.0.1:6379`).
4. Run the API Gateway:
   ```sh
   npx ts-node src/index.ts
   ```

## Usage
The API Gateway routes requests as follows:

| Service         | Endpoint Prefix   | Target URL                   |
|---------------|-----------------|------------------------------|
| Users         | `/users`         | `http://localhost:4000/api/users` |
| Orders        | `/orders`        | `http://localhost:5000/api/orders` |
| Payments      | `/payments`      | `http://localhost:6000/api/payments` |
| Notifications | `/notifications` | `http://localhost:7000/api/notifications` |
| Products      | `/products`      | `http://localhost:8000/api/products` |

## API Security Enhancements
- **Rate Limiting**: Prevents API abuse by limiting requests per user/IP.
- **CORS Handling**: Controls access to the API based on domain.
- **JWT Authentication**: Protects routes by verifying tokens.

## Future Enhancements
- Push notifications for real-time updates instead of client polling.
- Advanced logging and monitoring to track performance and errors.
