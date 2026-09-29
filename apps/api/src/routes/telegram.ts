import { FastifyInstance } from 'fastify';
import { prisma } from '@vyro/database';
import crypto from 'crypto';
import { sendTelegramNotification } from '../telegram';

function verifyTelegramInitData(initData: string): Record<string, string> | null {
  const botToken = process.env.TELEGRAM_BOT_TOKEN || '';
  const urlParams = new URLSearchParams(initData);
  const hash = urlParams.get('hash');
  if (!hash) return null;

  urlParams.delete('hash');
  const dataCheckString = Array.from(urlParams.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join('\n');

  const secretKey = crypto.createHmac('sha256', 'WebAppData').update(botToken).digest();
  const expectedHash = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');

  if (expectedHash !== hash) return null;

  const result: Record<string, string> = {};
  urlParams.forEach((v, k) => { result[k] = v; });
  return result;
}

export async function telegramRoutes(fastify: FastifyInstance) {
  // Authenticate via Telegram initData
  fastify.post('/auth', async (req, reply) => {
    const { initData } = req.body as { initData: string };
    const data = verifyTelegramInitData(initData);
    if (!data) return reply.status(401).send({ error: 'Invalid Telegram auth data' });

    const userObj = JSON.parse(data.user || '{}');
    const { id: telegramId, first_name, last_name, username } = userObj;

    if (!telegramId) return reply.status(400).send({ error: 'No user data' });

    const customer = await prisma.customer.upsert({
      where: { telegramId: String(telegramId) },
      update: { firstName: first_name, lastName: last_name, lastActivityAt: new Date() },
      create: { telegramId: String(telegramId), firstName: first_name, lastName: last_name },
    });

    const token = fastify.jwt.sign({ id: customer.id, role: 'customer', telegramId }, { expiresIn: '7d' });
    return { token, customer: { id: customer.id, firstName: customer.firstName, telegramId: customer.telegramId } };
  });

  // Middleware for Telegram auth
  const telegramAuth = async (req: any, reply: any) => {
    try {
      await req.jwtVerify();
      if (!req.user.telegramId) return reply.status(403).send({ error: 'Telegram only' });
    } catch {
      return reply.status(401).send({ error: 'Unauthorized' });
    }
  };

  // Create order from Telegram Mini App
  fastify.post('/orders', { preHandler: telegramAuth }, async (req, reply) => {
    const customerId = (req as any).user.id;
    const { items, customerName, customerPhone, customerCity, comment } = req.body as any;

    let totalAmount = 0;
    const orderItems: any[] = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({ where: { id: item.productId, active: true } });
      if (!product) return reply.status(400).send({ error: `Product ${item.productId} not found` });
      totalAmount += product.price * item.quantity;
      orderItems.push({ productId: product.id, quantity: item.quantity, price: product.price });
    }

    const order = await prisma.order.create({
      data: {
        customerId, totalAmount, customerName, customerPhone, customerCity,
        comment: comment || null, source: 'TELEGRAM', status: 'NEW',
        items: { create: orderItems },
      },
      include: { items: { include: { product: true } } },
    });

    for (const item of orderItems) {
      await prisma.product.update({ where: { id: item.productId }, data: { stock: { decrement: item.quantity } } });
    }

    await prisma.customer.update({
      where: { id: customerId },
      data: { ordersCount: { increment: 1 }, totalSpent: { increment: totalAmount } },
    });

    await sendTelegramNotification(order);
    await prisma.notification.create({
      data: { title: 'Нове замовлення з Telegram', message: `Замовлення #${order.orderNumber} на суму ${totalAmount} ₴`, type: 'NEW_ORDER' },
    });

    return reply.status(201).send({ order });
  });

  // Get telegram user orders
  fastify.get('/orders', { preHandler: telegramAuth }, async (req) => {
    const orders = await prisma.order.findMany({
      where: { customerId: (req as any).user.id },
      include: { items: { include: { product: { include: { images: { take: 1 } } } } } },
      orderBy: { createdAt: 'desc' },
    });
    return { orders };
  });
}
