"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.telegramRoutes = telegramRoutes;
const database_1 = require("@vyro/database");
const crypto_1 = __importDefault(require("crypto"));
const telegram_1 = require("../telegram");
function verifyTelegramInitData(initData) {
    const botToken = process.env.TELEGRAM_BOT_TOKEN || '';
    const urlParams = new URLSearchParams(initData);
    const hash = urlParams.get('hash');
    if (!hash)
        return null;
    urlParams.delete('hash');
    const dataCheckString = Array.from(urlParams.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([k, v]) => `${k}=${v}`)
        .join('\n');
    const secretKey = crypto_1.default.createHmac('sha256', 'WebAppData').update(botToken).digest();
    const expectedHash = crypto_1.default.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');
    if (expectedHash !== hash)
        return null;
    const result = {};
    urlParams.forEach((v, k) => { result[k] = v; });
    return result;
}
async function telegramRoutes(fastify) {
    // Authenticate via Telegram initData
    fastify.post('/auth', async (req, reply) => {
        const { initData } = req.body;
        const data = verifyTelegramInitData(initData);
        if (!data)
            return reply.status(401).send({ error: 'Invalid Telegram auth data' });
        const userObj = JSON.parse(data.user || '{}');
        const { id: telegramId, first_name, last_name, username } = userObj;
        if (!telegramId)
            return reply.status(400).send({ error: 'No user data' });
        const customer = await database_1.prisma.customer.upsert({
            where: { telegramId: String(telegramId) },
            update: { firstName: first_name, lastName: last_name, lastActivityAt: new Date() },
            create: { telegramId: String(telegramId), firstName: first_name, lastName: last_name },
        });
        const token = fastify.jwt.sign({ id: customer.id, role: 'customer', telegramId }, { expiresIn: '7d' });
        return { token, customer: { id: customer.id, firstName: customer.firstName, telegramId: customer.telegramId } };
    });
    // Middleware for Telegram auth
    const telegramAuth = async (req, reply) => {
        try {
            await req.jwtVerify();
            if (!req.user.telegramId)
                return reply.status(403).send({ error: 'Telegram only' });
        }
        catch {
            return reply.status(401).send({ error: 'Unauthorized' });
        }
    };
    // Create order from Telegram Mini App
    fastify.post('/orders', { preHandler: telegramAuth }, async (req, reply) => {
        const customerId = req.user.id;
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
                customerId, totalAmount, customerName, customerPhone, customerCity,
                comment: comment || null, source: 'TELEGRAM', status: 'NEW',
                items: { create: orderItems },
            },
            include: { items: { include: { product: true } } },
        });
        for (const item of orderItems) {
            await database_1.prisma.product.update({ where: { id: item.productId }, data: { stock: { decrement: item.quantity } } });
        }
        await database_1.prisma.customer.update({
            where: { id: customerId },
            data: { ordersCount: { increment: 1 }, totalSpent: { increment: totalAmount } },
        });
        await (0, telegram_1.sendTelegramNotification)(order);
        await database_1.prisma.notification.create({
            data: { title: 'Нове замовлення з Telegram', message: `Замовлення #${order.orderNumber} на суму ${totalAmount} ₴`, type: 'NEW_ORDER' },
        });
        return reply.status(201).send({ order });
    });
    // Get telegram user orders
    fastify.get('/orders', { preHandler: telegramAuth }, async (req) => {
        const orders = await database_1.prisma.order.findMany({
            where: { customerId: req.user.id },
            include: { items: { include: { product: { include: { images: { take: 1 } } } } } },
            orderBy: { createdAt: 'desc' },
        });
        return { orders };
    });
}
