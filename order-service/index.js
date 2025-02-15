const Fastify = require('fastify');
const app = Fastify();

app.get('/api/orders', async () => {
  return { orders: ['Order1', 'Order2'] };
});

app.listen({ port: 5000 }, () => {
  console.log('Order Service running on port 5000');
});
