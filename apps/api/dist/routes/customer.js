"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customerRoutes = customerRoutes;
const database_1 = require("@vyro/database");
const telegram_1 = require("../telegram");
async function customerRoutes(fastify) {
    // Middleware
    const auth = async (req, reply) => {
        try {
            await req.jwtVerify();
            if (req.user.role !== 'customer')
                return reply.status(403).send({ error: 'Forbidden' });
        }
        catch {
            return reply.status(401).send({ error: 'Unauthorized' });
        }
    };
    // Get profile
    fastify.get('/profile', { preHandler: auth }, async (req, reply) => {
        const customer = await database_1.prisma.customer.findUnique({ where: { id: req.user.id } });
        if (!customer)
            return reply.status(404).send({ error: 'Not found' });
        return { customer };
    });
    fastify.patch('/profile', { preHandler: auth }, async (req) => {
        const { id } = req.user;
        const data = req.body;
        const customer = await database_1.prisma.customer.update({ where: { id }, data });
        return { customer };
    });
    // Orders
    fastify.get('/orders', { preHandler: auth }, async (req) => {
        const orders = await database_1.prisma.order.findMany({
            where: { customerId: req.user.id },
            include: { items: { include: { product: { include: { images: { take: 1 } } } } } },
            orderBy: { createdAt: 'desc' },
        });
        return { orders };
    });
    // Create order (checkout)
    fastify.post('/orders', { preHandler: auth }, async (req, reply) => {
        const customerId = req.user.id;
        const { items, customerName, customerPhone, customerCity, deliveryMethod, comment } = req.body;
        if (!items || !items.length)
            return reply.status(400).send({ error: 'No items' });
        // Verify products and calculate total
        let totalAmount = 0;
        const orderItems = [];
        for (const item of items) {
            const product = await database_1.prisma.product.findUnique({ where: { id: item.productId, active: true } });
            if (!product)
                return reply.status(400).send({ error: `Product ${item.productId} not found` });
            if (product.stock < item.quantity)
                return reply.status(400).send({ error: `Insufficient stock for ${product.name}` });
            totalAmount += product.price * item.quantity;
            orderItems.push({ productId: product.id, quantity: item.quantity, price: product.price });
        }
        const order = await database_1.prisma.order.create({
            data: {
                customerId, totalAmount, customerName, customerPhone, customerCity,
                comment: comment || null, source: 'WEBSITE', status: 'NEW',
                items: { create: orderItems },
            },
            include: { items: { include: { product: true } } },
        });
        // Decrease stock
        for (const item of orderItems) {
            await database_1.prisma.product.update({ where: { id: item.productId }, data: { stock: { decrement: item.quantity } } });
        }
        // Update customer stats
        await database_1.prisma.customer.update({
            where: { id: customerId },
            data: { ordersCount: { increment: 1 }, totalSpent: { increment: totalAmount }, lastActivityAt: new Date() },
        });
        // Send Telegram notification
        await (0, telegram_1.sendTelegramNotification)(order);
        // Create CRM notification
        await database_1.prisma.notification.create({
            data: { title: 'Нове замовлення', message: `Замовлення #${order.orderNumber} на суму ${totalAmount} ₴`, type: 'NEW_ORDER' },
        });
        return reply.status(201).send({ order });
    });
    // Guest order (no auth)
    fastify.post('/orders/guest', async (req, reply) => {
        const { items, customerName, customerPhone, customerCity, comment } = req.body;
        let totalAmount = 0;
        const orderItems = [];
        for (const item of items) {
            const product = await database_1.prisma.product.findUnique({ where: { id: item.productId, active: true } });
            if (!product)
                return reply.status(400).send({ error: `Product ${item.productId} not found` });
            totalAmount += product.price * item.quantity;
            orderItems.push({ productId: product.id, quantity: item.quantity, price: product.price });
        }
        const order = await database_1.prisma.order.create({
            data: {
                totalAmount, customerName, customerPhone, customerCity,
                comment: comment || null, source: 'WEBSITE', status: 'NEW',
                items: { create: orderItems },
            },
            include: { items: { include: { product: true } } },
        });
        await (0, telegram_1.sendTelegramNotification)(order);
        await database_1.prisma.notification.create({
            data: { title: 'Нове замовлення', message: `Замовлення #${order.orderNumber} на суму ${totalAmount} ₴`, type: 'NEW_ORDER' },
        });
        return reply.status(201).send({ order });
    });
    // Favorites
    fastify.get('/favorites', { preHandler: auth }, async (req) => {
        const favorites = await database_1.prisma.favorite.findMany({
            where: { customerId: req.user.id },
            include: { product: { include: { images: { take: 1 }, category: true } } },
        });
        return { favorites };
    });
    fastify.post('/favorites/:productId', { preHandler: auth }, async (req, reply) => {
        const customerId = req.user.id;
        const { productId } = req.params;
        const existing = await database_1.prisma.favorite.findUnique({ where: { customerId_productId: { customerId, productId } } });
        if (existing)
            return reply.status(409).send({ error: 'Already in favorites' });
        const fav = await database_1.prisma.favorite.create({ data: { customerId, productId } });
        return reply.status(201).send({ favorite: fav });
    });
    fastify.delete('/favorites/:productId', { preHandler: auth }, async (req) => {
        const customerId = req.user.id;
        const { productId } = req.params;
        await database_1.prisma.favorite.deleteMany({ where: { customerId, productId } });
        return { success: true };
    });
    // Addresses
    fastify.get('/addresses', { preHandler: auth }, async (req) => {
        const addresses = await database_1.prisma.address.findMany({ where: { customerId: req.user.id } });
        return { addresses };
    });
    fastify.post('/addresses', { preHandler: auth }, async (req, reply) => {
        const customerId = req.user.id;
        const data = req.body;
        if (data.isDefault)
            await database_1.prisma.address.updateMany({ where: { customerId }, data: { isDefault: false } });
        const address = await database_1.prisma.address.create({ data: { ...data, customerId } });
        return reply.status(201).send({ address });
    });
}
