import Fastify from 'fastify';
import jwt from '@fastify/jwt';
import cookie from '@fastify/cookie';
import proxy from '@fastify/http-proxy';

const app = Fastify({ logger: true });

app.register(jwt, {
  secret: 'your_secret_key',
  sign: { expiresIn: '1h' },
});

app.register(cookie);

// Middleware for authentication
app.decorate('authenticate', async (request, reply) => {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.status(401).send({ error: 'Unauthorized' });
  }
});

// Register proxy routes
app.register(proxy, {
  upstream: 'http://localhost:4000', // Example User Service
  prefix: '/users', // Any request to /users will be forwarded
  rewritePrefix: '/api/users', // Optional: Rewrite /users to /api/users
});

app.register(proxy, {
  upstream: 'http://localhost:5000', // Example Order Service
  prefix: '/orders',
  rewritePrefix: '/api/orders',
});

// Start the gateway
app.listen({ port: 3000 }, (err, address) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  app.log.info(`API Gateway running at ${address}`);
});