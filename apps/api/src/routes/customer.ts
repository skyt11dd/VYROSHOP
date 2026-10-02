import { FastifyInstance } from 'fastify';
import { prisma } from '@vyro/database';
import { sendTelegramNotification } from '../telegram';

export async function customerRoutes(fastify: FastifyInstance) {
  // Middleware
  const auth = async (req: any, reply: any) => {
    try {
      await req.jwtVerify();
      if (req.user.role !== 'customer') return reply.status(403).send({ error: 'Forbidden' });
    } catch {
      return reply.status(401).send({ error: 'Unauthorized' });
    }
  };

  // Get profile
  fastify.get('/profile', { preHandler: auth }, async (req, reply) => {
    const customer = await prisma.customer.findUnique({ where: { id: (req as any).user.id } });
    if (!customer) return reply.status(404).send({ error: 'Not found' });
    return { customer };
  });

  fastify.patch('/profile', { preHandler: auth }, async (req) => {
    const { id } = (req as any).user;
    const data = req.body as any;
    const customer = await prisma.customer.update({ where: { id }, data });
    return { customer };
  });

  // Orders
  fastify.get('/orders', { preHandler: auth }, async (req) => {
    const orders = await prisma.order.findMany({
      where: { customerId: (req as any).user.id },
      include: { items: { include: { product: { include: { images: { take: 1 } } } } } },
      orderBy: { createdAt: 'desc' },
    });
    return { orders };
  });

  // Create order (checkout)
  fastify.post('/orders', { preHandler: auth }, async (req, reply) => {
    const customerId = (req as any).user.id;
    const { items, customerName, customerPhone, customerCity, deliveryMethod, comment } = req.body as any;

    if (!items || !items.length) return reply.status(400).send({ error: 'No items' });

    // Verify products and calculate total
    let totalAmount = 0;
    const orderItems: { productId: string; quantity: number; price: number }[] = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({ where: { id: item.productId, active: true } });
      if (!product) return reply.status(400).send({ error: `Product ${item.productId} not found` });
      if (product.stock < item.quantity) return reply.status(400).send({ error: `Insufficient stock for ${product.name}` });
      totalAmount += product.price * item.quantity;
      orderItems.push({ productId: product.id, quantity: item.quantity, price: product.price });
    }

    const order = await prisma.order.create({
      data: {
        customerId, totalAmount, customerName, customerPhone, customerCity,
        comment: comment || null, source: 'WEBSITE', status: 'NEW',
        items: { create: orderItems },
      },
      include: { items: { include: { product: true } } },
    });

    // Decrease stock
    for (const item of orderItems) {
      await prisma.product.update({ where: { id: item.productId }, data: { stock: { decrement: item.quantity } } });
    }

    // Update customer stats
    await prisma.customer.update({
      where: { id: customerId },
      data: { ordersCount: { increment: 1 }, totalSpent: { increment: totalAmount }, lastActivityAt: new Date() },
    });

    // Send Telegram notification
    await sendTelegramNotification(order);

    // Create CRM notification
    await prisma.notification.create({
      data: { title: 'Нове замовлення', message: `Замовлення #${order.orderNumber} на суму ${totalAmount} ₴`, type: 'NEW_ORDER' },
    });

    return reply.status(201).send({ order });
  });

  // Guest order (no auth)
  fastify.post('/orders/guest', async (req, reply) => {
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
        totalAmount, customerName, customerPhone, customerCity,
        comment: comment || null, source: 'WEBSITE', status: 'NEW',
        items: { create: orderItems },
      },
      include: { items: { include: { product: true } } },
    });

    await sendTelegramNotification(order);
    await prisma.notification.create({
      data: { title: 'Нове замовлення', message: `Замовлення #${order.orderNumber} на суму ${totalAmount} ₴`, type: 'NEW_ORDER' },
    });

    return reply.status(201).send({ order });
  });

  // Favorites
  fastify.get('/favorites', { preHandler: auth }, async (req) => {
    const favorites = await prisma.favorite.findMany({
      where: { customerId: (req as any).user.id },
      include: { product: { include: { images: { take: 1 }, category: true } } },
    });
    return { favorites };
  });

  fastify.post('/favorites/:productId', { preHandler: auth }, async (req, reply) => {
    const customerId = (req as any).user.id;
    const { productId } = req.params as { productId: string };
    const existing = await prisma.favorite.findUnique({ where: { customerId_productId: { customerId, productId } } });
    if (existing) return reply.status(409).send({ error: 'Already in favorites' });
    const fav = await prisma.favorite.create({ data: { customerId, productId } });
    return reply.status(201).send({ favorite: fav });
  });

  fastify.delete('/favorites/:productId', { preHandler: auth }, async (req) => {
    const customerId = (req as any).user.id;
    const { productId } = req.params as { productId: string };
    await prisma.favorite.deleteMany({ where: { customerId, productId } });
    return { success: true };
  });

  // Addresses
  fastify.get('/addresses', { preHandler: auth }, async (req) => {
    const addresses = await prisma.address.findMany({ where: { customerId: (req as any).user.id } });
    return { addresses };
  });

  fastify.post('/addresses', { preHandler: auth }, async (req, reply) => {
    const customerId = (req as any).user.id;
    const data = req.body as any;
    if (data.isDefault) await prisma.address.updateMany({ where: { customerId }, data: { isDefault: false } });
    const address = await prisma.address.create({ data: { ...data, customerId } });
    return reply.status(201).send({ address });
  });

  fastify.patch('/addresses/:addressId', { preHandler: auth }, async (req, reply) => {
    const customerId = (req as any).user.id;
    const { addressId } = req.params as { addressId: string };
    const data = req.body as any;
    // Verify ownership
    const existing = await prisma.address.findFirst({ where: { id: addressId, customerId } });
    if (!existing) return reply.status(404).send({ error: 'Address not found' });
    if (data.isDefault) await prisma.address.updateMany({ where: { customerId, id: { not: addressId } }, data: { isDefault: false } });
    const address = await prisma.address.update({ where: { id: addressId }, data });
    return { address };
  });
}
