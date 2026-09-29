import fp from 'fastify-plugin';
import { FastifyInstance } from 'fastify';

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (req: any, reply: any) => Promise<void>;
  }
}

export default fp(async (fastify: FastifyInstance) => {
  fastify.decorate('authenticate', async function (req: any, reply: any) {
    try {
      await req.jwtVerify();
    } catch (err) {
      reply.status(401).send({ error: 'Unauthorized' });
    }
  });
});
