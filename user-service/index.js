const Fastify = require('fastify');
const app = Fastify();

app.get('/api/users', async () => {
  return { users: ['Alice', 'Bob'] };
});

app.listen({ port: 4000 }, () => {
  console.log('User Service running on port 4000');
});