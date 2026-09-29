import fp from 'fastify-plugin';
import { FastifyInstance } from 'fastify';

export default fp(async (fastify: FastifyInstance) => {
  fastify.decorate('authenticate', async function (req: any, reply: any) {
    try {
      await req.jwtVerify();
    } catch (err) {
      reply.status(401).send({ error: 'Unauthorized' });
    }
  });
});
