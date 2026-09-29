import { FastifyInstance } from 'fastify';
import { prisma } from '@vyro/database';
import bcrypt from 'bcryptjs';

export async function authRoutes(fastify: FastifyInstance) {
  // Customer register
  fastify.post('/customer/register', async (req, reply) => {
    const { email, password, firstName, lastName, phone } = req.body as any;

    if (!email || !password) return reply.status(400).send({ error: 'Email and password required' });

    const existing = await prisma.customer.findUnique({ where: { email } });
    if (existing) return reply.status(409).send({ error: 'Email already in use' });

    const hashed = await bcrypt.hash(password, 12);
    const customer = await prisma.customer.create({
      data: { email, password: hashed, firstName, lastName, phone },
    });

    const token = fastify.jwt.sign({ id: customer.id, role: 'customer' }, { expiresIn: '7d' });
    const refreshToken = fastify.jwt.sign({ id: customer.id, role: 'customer', type: 'refresh' }, { expiresIn: '30d' });

    return { token, refreshToken, customer: { id: customer.id, email: customer.email, firstName: customer.firstName, lastName: customer.lastName } };
  });

  // Customer login
  fastify.post('/customer/login', async (req, reply) => {
    const { email, password } = req.body as any;

    const customer = await prisma.customer.findUnique({ where: { email } });
    if (!customer || !(customer as any).password) return reply.status(401).send({ error: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, (customer as any).password);
    if (!valid) return reply.status(401).send({ error: 'Invalid credentials' });

    await prisma.customer.update({ where: { id: customer.id }, data: { lastActivityAt: new Date() } });

    const token = fastify.jwt.sign({ id: customer.id, role: 'customer' }, { expiresIn: '7d' });
    const refreshToken = fastify.jwt.sign({ id: customer.id, role: 'customer', type: 'refresh' }, { expiresIn: '30d' });

    return { token, refreshToken, customer: { id: customer.id, email: customer.email, firstName: customer.firstName, lastName: customer.lastName } };
  });

  // Manager login (CRM)
  fastify.post('/manager/login', async (req, reply) => {
    const { email, password } = req.body as any;

    const manager = await prisma.user.findUnique({ where: { email } });
    if (!manager) return reply.status(401).send({ error: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, manager.password);
    if (!valid) return reply.status(401).send({ error: 'Invalid credentials' });

    const token = fastify.jwt.sign({ id: manager.id, role: manager.role }, { expiresIn: '8h' });
    const refreshToken = fastify.jwt.sign({ id: manager.id, role: manager.role, type: 'refresh' }, { expiresIn: '7d' });

    return { token, refreshToken, manager: { id: manager.id, email: manager.email, role: manager.role } };
  });

  // Refresh token
  fastify.post('/refresh', async (req, reply) => {
    const { refreshToken } = req.body as any;
    try {
      const decoded = fastify.jwt.verify(refreshToken) as any;
      if (decoded.type !== 'refresh') return reply.status(401).send({ error: 'Invalid token' });

      const newToken = fastify.jwt.sign({ id: decoded.id, role: decoded.role }, { expiresIn: decoded.role === 'customer' ? '7d' : '8h' });
      return { token: newToken };
    } catch {
      return reply.status(401).send({ error: 'Invalid or expired token' });
    }
  });

  // Get current user (customer)
  fastify.get('/customer/me', { preHandler: [(fastify as any).authenticate] }, async (req, reply) => {
    const user = (req as any).user;
    if (user.role !== 'customer') return reply.status(403).send({ error: 'Forbidden' });

    const customer = await prisma.customer.findUnique({ where: { id: user.id } });
    if (!customer) return reply.status(404).send({ error: 'Not found' });
    return { customer };
  });

  // Get current manager
  fastify.get('/manager/me', { preHandler: [(fastify as any).authenticate] }, async (req, reply) => {
    const user = (req as any).user;
    if (!['ADMIN', 'MANAGER'].includes(user.role)) return reply.status(403).send({ error: 'Forbidden' });

    const manager = await prisma.user.findUnique({ where: { id: user.id }, select: { id: true, email: true, role: true, createdAt: true } });
    if (!manager) return reply.status(404).send({ error: 'Not found' });
    return { manager };
  });
}
