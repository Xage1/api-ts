import Fastify, { FastifyReply, FastifyRequest } from 'fastify';
import jwt from '@fastify/jwt';
import cookie from '@fastify/cookie';
import proxy from '@fastify/http-proxy';
import redis from '@fastify/redis';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import { z } from 'zod';
import { Readable } from 'stream';

const app = Fastify({ logger: true });

app.register(jwt, {
  secret: 'your_secret_key',
  sign: { expiresIn: '1h' },
});

app.register(cookie);
app.register(cors, { origin: '*' });
app.register(rateLimit, { max: 100, timeWindow: '1 minute' });

async function setupRedis() {
  try {
    await app.register(redis, {
      host: '127.0.0.1',
      port: 6379,
    });
    app.log.info('Redis connected successfully');
  } catch (err) {
    app.log.error('Failed to connect to Redis:', err);
    process.exit(1);
  }
}

setupRedis();

app.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.status(401).send({ error: 'Unauthorized' });
  }
});

async function cache(request: FastifyRequest, reply: FastifyReply) {
  if (!app.redis) {
    request.log.error("Redis not initialized");
    return false;
  }
  const cachedData = await app.redis.get(request.url);
  if (cachedData) {
    reply.send(JSON.parse(cachedData));
    return true;
  }
  return false;
}

function registerProxy(upstream: string, prefix: string, rewritePrefix: string) {
  app.register(proxy, {
    upstream,
    prefix,
    rewritePrefix,
    async preHandler(request, reply) {
      const isCached = await cache(request, reply);
      if (isCached) return;
    },
    replyOptions: {
      async onResponse(request, reply, res) {
        try {
          let body = '';
          const stream = Readable.from(res as any);
          for await (const chunk of stream) {
            body += chunk;
          }
          const jsonBody = JSON.parse(body);
          await app.redis.set(request.url, JSON.stringify(jsonBody), 'EX', 60);
          reply.send(jsonBody);
        } catch (error) {
          reply.send({ error: 'Failed to process response' });
        }
      }
    }
  });
}

registerProxy('http://localhost:4000', '/users', '/api/users');
registerProxy('http://localhost:5000', '/orders', '/api/orders');
registerProxy('http://localhost:6000', '/payments', '/api/payments');
registerProxy('http://localhost:7000', '/notifications', '/api/notifications');
registerProxy('http://localhost:8000', '/products', '/api/products');

const start = async () => {
  try {
    await app.ready();
    await app.listen({ port: 3000 });
    app.log.info("API Gateway running at http://localhost:3000");
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();