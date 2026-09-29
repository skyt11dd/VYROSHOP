"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.crmRoutes = crmRoutes;
const database_1 = require("@vyro/database");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const slugify_1 = __importDefault(require("slugify"));
const websocket_1 = require("../websocket");
async function requireManager(req, reply) {
    try {
        await req.jwtVerify();
        const user = req.user;
        if (!['ADMIN', 'MANAGER'].includes(user.role))
            return reply.status(403).send({ error: 'Forbidden' });
    }
    catch {
        return reply.status(401).send({ error: 'Unauthorized' });
    }
}
async function requireAdmin(req, reply) {
    try {
        await req.jwtVerify();
        const user = req.user;
        if (user.role !== 'ADMIN')
            return reply.status(403).send({ error: 'Admin only' });
    }
    catch {
        return reply.status(401).send({ error: 'Unauthorized' });
    }
}
async function crmRoutes(fastify) {
    // ===== PRODUCTS =====
    fastify.get('/products', { preHandler: requireManager }, async (req) => {
        const { search, category, page = '1', limit = '20' } = req.query;
        const where = {};
        if (search)
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { sku: { contains: search, mode: 'insensitive' } },
            ];
        if (category)
            where.categoryId = category;
        const pageNum = parseInt(page), limitNum = parseInt(limit);
        const [products, total] = await Promise.all([
            database_1.prisma.product.findMany({
                where, skip: (pageNum - 1) * limitNum, take: limitNum,
                include: { images: { orderBy: { sortOrder: 'asc' } }, category: true, brand: true },
                orderBy: { createdAt: 'desc' },
            }),
            database_1.prisma.product.count({ where }),
        ]);
        return { products, total, page: pageNum, limit: limitNum };
    });
    fastify.post('/products', { preHandler: requireManager }, async (req, reply) => {
        const user = req.user;
        const data = req.body;
        const slug = data.slug || (0, slugify_1.default)(data.name, { lower: true, strict: true });
        const product = await database_1.prisma.product.create({
            data: {
                name: data.name, slug, sku: data.sku,
                description: data.description, shortDescription: data.shortDescription,
                price: data.price, oldPrice: data.oldPrice,
                stock: data.stock || 0, active: data.active ?? true,
                featured: data.featured ?? false, popular: data.popular ?? false, isNew: data.isNew ?? false,
                categoryId: data.categoryId, brandId: data.brandId || null,
            },
        });
        await database_1.prisma.auditLog.create({
            data: { user: user.id, action: 'PRODUCT_CREATED', entity: 'Product', entityId: product.id, newValue: JSON.stringify(product) },
        });
        (0, websocket_1.broadcastToManagers)({ type: 'PRODUCT_CREATED', product });
        return reply.status(201).send({ product });
    });
    fastify.patch('/products/:id', { preHandler: requireManager }, async (req, reply) => {
        const { id } = req.params;
        const user = req.user;
        const data = req.body;
        const old = await database_1.prisma.product.findUnique({ where: { id } });
        if (!old)
            return reply.status(404).send({ error: 'Product not found' });
        const product = await database_1.prisma.product.update({ where: { id }, data });
        await database_1.prisma.auditLog.create({
            data: { user: user.id, action: 'PRODUCT_UPDATED', entity: 'Product', entityId: id, oldValue: JSON.stringify(old), newValue: JSON.stringify(data) },
        });
        (0, websocket_1.broadcastToManagers)({ type: 'PRODUCT_UPDATED', product });
        return { product };
    });
    fastify.delete('/products/:id', { preHandler: requireAdmin }, async (req, reply) => {
        const { id } = req.params;
        const user = req.user;
        await database_1.prisma.product.delete({ where: { id } });
        await database_1.prisma.auditLog.create({
            data: { user: user.id, action: 'PRODUCT_DELETED', entity: 'Product', entityId: id },
        });
        return { success: true };
    });
    // Duplicate product
    fastify.post('/products/:id/duplicate', { preHandler: requireManager }, async (req, reply) => {
        const { id } = req.params;
        const original = await database_1.prisma.product.findUnique({ where: { id }, include: { images: true, tags: true } });
        if (!original)
            return reply.status(404).send({ error: 'Not found' });
        const { id: _id, createdAt, updatedAt, slug, sku, images, tags, ...rest } = original;
        const newProduct = await database_1.prisma.product.create({
            data: {
                ...rest,
                name: `${original.name} (копія)`,
                slug: `${slug}-copy-${Date.now()}`,
                sku: `${sku}-COPY-${Date.now()}`,
                active: false,
                images: images?.length
                    ? {
                        create: images.map((img) => ({
                            url: img.url,
                            alt: img.alt,
                            sortOrder: img.sortOrder,
                            isMain: img.isMain,
                        })),
                    }
                    : undefined,
                tags: tags?.length
                    ? {
                        connect: tags.map((tag) => ({ id: tag.id })),
                    }
                    : undefined,
            },
        });
        return reply.status(201).send({ product: newProduct });
    });
    // ===== CATEGORIES =====
    fastify.get('/categories', { preHandler: requireManager }, async () => {
        const categories = await database_1.prisma.category.findMany({
            orderBy: { sortOrder: 'asc' },
            include: { _count: { select: { products: true } } },
        });
        return { categories };
    });
    fastify.post('/categories', { preHandler: requireManager }, async (req, reply) => {
        const data = req.body;
        const slug = data.slug || (0, slugify_1.default)(data.name, { lower: true, strict: true });
        const category = await database_1.prisma.category.create({ data: { ...data, slug } });
        return reply.status(201).send({ category });
    });
    fastify.patch('/categories/:id', { preHandler: requireManager }, async (req) => {
        const { id } = req.params;
        const category = await database_1.prisma.category.update({ where: { id }, data: req.body });
        return { category };
    });
    fastify.delete('/categories/:id', { preHandler: requireAdmin }, async (req) => {
        const { id } = req.params;
        await database_1.prisma.category.delete({ where: { id } });
        return { success: true };
    });
    // ===== BRANDS =====
    fastify.get('/brands', { preHandler: requireManager }, async () => {
        const brands = await database_1.prisma.brand.findMany({ orderBy: { name: 'asc' }, include: { _count: { select: { products: true } } } });
        return { brands };
    });
    fastify.post('/brands', { preHandler: requireManager }, async (req, reply) => {
        const data = req.body;
        const slug = data.slug || (0, slugify_1.default)(data.name, { lower: true, strict: true });
        const brand = await database_1.prisma.brand.create({ data: { ...data, slug } });
        return reply.status(201).send({ brand });
    });
    fastify.patch('/brands/:id', { preHandler: requireManager }, async (req) => {
        const { id } = req.params;
        const brand = await database_1.prisma.brand.update({ where: { id }, data: req.body });
        return { brand };
    });
    fastify.delete('/brands/:id', { preHandler: requireAdmin }, async (req) => {
        const { id } = req.params;
        await database_1.prisma.brand.delete({ where: { id } });
        return { success: true };
    });
    // ===== ORDERS =====
    fastify.get('/orders', { preHandler: requireManager }, async (req) => {
        const { status, source, page = '1', limit = '20' } = req.query;
        const where = {};
        if (status)
            where.status = status;
        if (source)
            where.source = source;
        const pageNum = parseInt(page), limitNum = parseInt(limit);
        const [orders, total] = await Promise.all([
            database_1.prisma.order.findMany({
                where, skip: (pageNum - 1) * limitNum, take: limitNum,
                include: { customer: true, items: { include: { product: { include: { images: { take: 1 } } } } } },
                orderBy: { createdAt: 'desc' },
            }),
            database_1.prisma.order.count({ where }),
        ]);
        return { orders, total, page: pageNum, limit: limitNum };
    });
    fastify.get('/orders/:id', { preHandler: requireManager }, async (req, reply) => {
        const { id } = req.params;
        const order = await database_1.prisma.order.findUnique({
            where: { id },
            include: { customer: true, items: { include: { product: { include: { images: { take: 1 } } } } } },
        });
        if (!order)
            return reply.status(404).send({ error: 'Not found' });
        return { order };
    });
    fastify.patch('/orders/:id', { preHandler: requireManager }, async (req, reply) => {
        const { id } = req.params;
        const user = req.user;
        const data = req.body;
        const old = await database_1.prisma.order.findUnique({ where: { id } });
        const order = await database_1.prisma.order.update({ where: { id }, data });
        await database_1.prisma.auditLog.create({
            data: { user: user.id, action: 'ORDER_UPDATED', entity: 'Order', entityId: id, oldValue: JSON.stringify({ status: old?.status }), newValue: JSON.stringify({ status: data.status }) },
        });
        (0, websocket_1.broadcastToManagers)({ type: 'ORDER_UPDATED', order });
        return { order };
    });
    // ===== CUSTOMERS =====
    fastify.get('/customers', { preHandler: requireManager }, async (req) => {
        const { search, page = '1', limit = '20' } = req.query;
        const where = {};
        if (search)
            where.OR = [
                { firstName: { contains: search, mode: 'insensitive' } },
                { lastName: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
                { phone: { contains: search, mode: 'insensitive' } },
            ];
        const pageNum = parseInt(page), limitNum = parseInt(limit);
        const [customers, total] = await Promise.all([
            database_1.prisma.customer.findMany({ where, skip: (pageNum - 1) * limitNum, take: limitNum, orderBy: { createdAt: 'desc' } }),
            database_1.prisma.customer.count({ where }),
        ]);
        return { customers, total, page: pageNum, limit: limitNum };
    });
    fastify.get('/customers/:id', { preHandler: requireManager }, async (req, reply) => {
        const { id } = req.params;
        const customer = await database_1.prisma.customer.findUnique({
            where: { id },
            include: { orders: { orderBy: { createdAt: 'desc' } }, favorites: { include: { product: { include: { images: { take: 1 } } } } } },
        });
        if (!customer)
            return reply.status(404).send({ error: 'Not found' });
        return { customer };
    });
    // ===== MANAGERS =====
    fastify.get('/managers', { preHandler: requireAdmin }, async () => {
        const managers = await database_1.prisma.user.findMany({ select: { id: true, email: true, role: true, createdAt: true } });
        return { managers };
    });
    fastify.post('/managers', { preHandler: requireAdmin }, async (req, reply) => {
        const { email, password, role } = req.body;
        const hashed = await bcryptjs_1.default.hash(password, 12);
        const manager = await database_1.prisma.user.create({ data: { email, password: hashed, role: role || 'MANAGER' } });
        return reply.status(201).send({ manager: { id: manager.id, email: manager.email, role: manager.role } });
    });
    fastify.patch('/managers/:id', { preHandler: requireAdmin }, async (req, reply) => {
        const { id } = req.params;
        const data = req.body;
        if (data.password)
            data.password = await bcryptjs_1.default.hash(data.password, 12);
        const manager = await database_1.prisma.user.update({ where: { id }, data });
        return { manager: { id: manager.id, email: manager.email, role: manager.role } };
    });
    fastify.delete('/managers/:id', { preHandler: requireAdmin }, async (req) => {
        const { id } = req.params;
        await database_1.prisma.user.delete({ where: { id } });
        return { success: true };
    });
    // ===== ANALYTICS =====
    fastify.get('/analytics', { preHandler: requireManager }, async (req) => {
        const { period = '30d' } = req.query;
        const days = period === '7d' ? 7 : period === '30d' ? 30 : period === '90d' ? 90 : 30;
        const since = new Date(Date.now() - days * 86400000);
        const [ordersToday, ordersTotal, customersTotal, productsTotal, revenueResult, lowStockProducts, ordersBySource, recentOrders] = await Promise.all([
            database_1.prisma.order.count({ where: { createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) } } }),
            database_1.prisma.order.count({ where: { createdAt: { gte: since } } }),
            database_1.prisma.customer.count(),
            database_1.prisma.product.count({ where: { active: true } }),
            database_1.prisma.order.aggregate({ _sum: { totalAmount: true }, where: { status: { not: 'CANCELLED' }, createdAt: { gte: since } } }),
            database_1.prisma.product.findMany({ where: { stock: { lte: 5 }, active: true }, take: 10, include: { images: { take: 1 } } }),
            database_1.prisma.order.groupBy({ by: ['source'], _count: { id: true }, where: { createdAt: { gte: since } } }),
            database_1.prisma.order.findMany({ take: 10, orderBy: { createdAt: 'desc' }, include: { customer: true } }),
        ]);
        return {
            ordersToday, ordersTotal,
            customersTotal, productsTotal,
            revenue: revenueResult._sum.totalAmount || 0,
            lowStockProducts, ordersBySource, recentOrders,
        };
    });
    // ===== INVENTORY =====
    fastify.get('/inventory', { preHandler: requireManager }, async (req) => {
        const { status } = req.query;
        const where = { active: true };
        if (status === 'in_stock')
            where.stock = { gt: 5 };
        else if (status === 'low')
            where.stock = { gt: 0, lte: 5 };
        else if (status === 'out')
            where.stock = 0;
        const products = await database_1.prisma.product.findMany({
            where, orderBy: { stock: 'asc' },
            include: { category: true, images: { take: 1 } },
        });
        return { products };
    });
    fastify.patch('/inventory/:id', { preHandler: requireManager }, async (req) => {
        const { id } = req.params;
        const { stock } = req.body;
        const product = await database_1.prisma.product.update({ where: { id }, data: { stock } });
        (0, websocket_1.broadcastToManagers)({ type: 'INVENTORY_UPDATED', productId: id, stock });
        return { product };
    });
    // ===== NOTIFICATIONS =====
    fastify.get('/notifications', { preHandler: requireManager }, async () => {
        const notifications = await database_1.prisma.notification.findMany({ orderBy: { createdAt: 'desc' }, take: 50 });
        return { notifications };
    });
    fastify.patch('/notifications/:id/read', { preHandler: requireManager }, async (req) => {
        const { id } = req.params;
        await database_1.prisma.notification.update({ where: { id }, data: { read: true } });
        return { success: true };
    });
    // ===== AUDIT LOG =====
    fastify.get('/audit-log', { preHandler: requireAdmin }, async (req) => {
        const { page = '1', limit = '50' } = req.query;
        const pageNum = parseInt(page), limitNum = parseInt(limit);
        const [logs, total] = await Promise.all([
            database_1.prisma.auditLog.findMany({ skip: (pageNum - 1) * limitNum, take: limitNum, orderBy: { createdAt: 'desc' } }),
            database_1.prisma.auditLog.count(),
        ]);
        return { logs, total, page: pageNum };
    });
    // ===== SEARCH ANALYTICS =====
    fastify.get('/search-analytics', { preHandler: requireManager }, async () => {
        const topSearches = await database_1.prisma.searchHistory.groupBy({
            by: ['query'], _count: { id: true }, orderBy: { _count: { id: 'desc' } }, take: 20,
        });
        const noResults = await database_1.prisma.searchHistory.findMany({
            where: { resultsCount: 0 }, orderBy: { createdAt: 'desc' }, take: 20,
        });
        return { topSearches, noResults };
    });
}
