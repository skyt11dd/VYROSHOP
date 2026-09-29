"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.publicRoutes = publicRoutes;
const database_1 = require("@vyro/database");
async function publicRoutes(fastify) {
    // Products list
    fastify.get('/products', async (req, reply) => {
        const { category, brand, search, sort = 'featured', page = '1', limit = '20', featured, popular, isNew } = req.query;
        const where = { active: true };
        if (category)
            where.category = { slug: category };
        if (brand)
            where.brand = { slug: brand };
        if (featured === 'true')
            where.featured = true;
        if (popular === 'true')
            where.popular = true;
        if (isNew === 'true')
            where.isNew = true;
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
                { sku: { contains: search, mode: 'insensitive' } },
                { shortDescription: { contains: search, mode: 'insensitive' } },
                { category: { name: { contains: search, mode: 'insensitive' } } },
                { brand: { name: { contains: search, mode: 'insensitive' } } },
                { tags: { some: { name: { contains: search, mode: 'insensitive' } } } },
            ];
        }
        const orderBy = {};
        if (sort === 'price_asc')
            orderBy.price = 'asc';
        else if (sort === 'price_desc')
            orderBy.price = 'desc';
        else if (sort === 'newest')
            orderBy.createdAt = 'desc';
        else if (sort === 'popular')
            orderBy.popular = 'desc';
        else
            orderBy.featured = 'desc';
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const [products, total] = await Promise.all([
            database_1.prisma.product.findMany({
                where,
                orderBy,
                skip: (pageNum - 1) * limitNum,
                take: limitNum,
                include: {
                    images: { orderBy: { sortOrder: 'asc' } },
                    category: true,
                    brand: true,
                    tags: true,
                },
            }),
            database_1.prisma.product.count({ where }),
        ]);
        return { products, total, page: pageNum, limit: limitNum, pages: Math.ceil(total / limitNum) };
    });
    // Single product by slug
    fastify.get('/products/:slug', async (req, reply) => {
        const { slug } = req.params;
        const { session } = req.query;
        const product = await database_1.prisma.product.findUnique({
            where: { slug, active: true },
            include: {
                images: { orderBy: { sortOrder: 'asc' } },
                category: true,
                brand: true,
                tags: true,
            },
        });
        if (!product)
            return reply.status(404).send({ error: 'Product not found' });
        // Track view
        await database_1.prisma.productView.create({ data: { productId: product.id, session: session || null } });
        // Related products
        const related = await database_1.prisma.product.findMany({
            where: { categoryId: product.categoryId, active: true, id: { not: product.id } },
            take: 8,
            include: { images: { orderBy: { sortOrder: 'asc' }, take: 1 }, category: true },
        });
        return { product, related };
    });
    // Categories
    fastify.get('/categories', async () => {
        const categories = await database_1.prisma.category.findMany({
            where: { active: true },
            orderBy: { sortOrder: 'asc' },
            include: { _count: { select: { products: { where: { active: true } } } } },
        });
        return { categories };
    });
    // Brands
    fastify.get('/brands', async () => {
        const brands = await database_1.prisma.brand.findMany({
            orderBy: { name: 'asc' },
            include: { _count: { select: { products: { where: { active: true } } } } },
        });
        return { brands };
    });
    // Search
    fastify.get('/search', async (req, reply) => {
        const { q, session } = req.query;
        if (!q || q.length < 1)
            return { products: [], total: 0 };
        const products = await database_1.prisma.product.findMany({
            where: {
                active: true,
                OR: [
                    { name: { contains: q, mode: 'insensitive' } },
                    { description: { contains: q, mode: 'insensitive' } },
                    { sku: { contains: q, mode: 'insensitive' } },
                    { category: { name: { contains: q, mode: 'insensitive' } } },
                    { brand: { name: { contains: q, mode: 'insensitive' } } },
                    { tags: { some: { name: { contains: q, mode: 'insensitive' } } } },
                ],
            },
            take: 20,
            include: { images: { orderBy: { sortOrder: 'asc' }, take: 1 }, category: true },
        });
        // Log search
        await database_1.prisma.searchHistory.create({
            data: { query: q, resultsCount: products.length, session: session || null },
        });
        return { products, total: products.length };
    });
}
