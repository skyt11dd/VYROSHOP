import { FastifyInstance } from 'fastify';
import { prisma } from '@vyro/database';

export async function publicRoutes(fastify: FastifyInstance) {
  // Products list
  fastify.get('/products', async (req, reply) => {
    const { category, brand, search, sort = 'featured', page = '1', limit = '20', featured, popular, isNew } = req.query as Record<string, string>;

    const BLOCKED_CATEGORIES = ['pods', 'disposables'];
    if (category && BLOCKED_CATEGORIES.includes(category)) {
      return { products: [], total: 0, page: 1, limit: parseInt(limit), pages: 0 };
    }

    const where: any = { 
      active: true,
      category: { slug: category ? category : { notIn: BLOCKED_CATEGORIES } }
    };
    
    if (brand) where.brand = { slug: brand };
    if (featured === 'true') where.featured = true;
    if (popular === 'true') where.popular = true;
    if (isNew === 'true') where.isNew = true;
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

    const orderBy: any = {};
    if (sort === 'price_asc') orderBy.price = 'asc';
    else if (sort === 'price_desc') orderBy.price = 'desc';
    else if (sort === 'newest') orderBy.createdAt = 'desc';
    else if (sort === 'popular') orderBy.popular = 'desc';
    else orderBy.featured = 'desc';

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    const [products, total] = await Promise.all([
      prisma.product.findMany({
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
      prisma.product.count({ where }),
    ]);

    return { products, total, page: pageNum, limit: limitNum, pages: Math.ceil(total / limitNum) };
  });

  // Single product by slug
  fastify.get('/products/:slug', async (req, reply) => {
    const { slug } = req.params as { slug: string };
    const { session } = req.query as { session?: string };

    const product = await prisma.product.findUnique({
      where: { slug, active: true },
      include: {
        images: { orderBy: { sortOrder: 'asc' } },
        category: true,
        brand: true,
        tags: true,
      },
    });

    const BLOCKED_CATEGORIES = ['pods', 'disposables'];
    if (!product || BLOCKED_CATEGORIES.includes(product.category.slug)) {
      return reply.status(404).send({ error: 'Product not found' });
    }

    // Track view
    await prisma.productView.create({ data: { productId: product.id, session: session || null } });

    // Related products
    const related = await prisma.product.findMany({
      where: { categoryId: product.categoryId, active: true, id: { not: product.id } },
      take: 8,
      include: { images: { orderBy: { sortOrder: 'asc' }, take: 1 }, category: true },
    });

    return { product, related };
  });

  // Categories
  fastify.get('/categories', async () => {
    const BLOCKED_CATEGORIES = ['pods', 'disposables'];
    const categories = await prisma.category.findMany({
      where: { active: true, slug: { notIn: BLOCKED_CATEGORIES } },
      orderBy: { sortOrder: 'asc' },
      include: { _count: { select: { products: { where: { active: true } } } } },
    });
    return { categories };
  });

  // Brands
  fastify.get('/brands', async () => {
    const brands = await prisma.brand.findMany({
      orderBy: { name: 'asc' },
      include: { _count: { select: { products: { where: { active: true } } } } },
    });
    return { brands };
  });

  // Search
  fastify.get('/search', async (req, reply) => {
    const { q, session } = req.query as { q?: string; session?: string };
    if (!q || q.length < 1) return { products: [], total: 0 };

    const BLOCKED_CATEGORIES = ['pods', 'disposables'];
    const products = await prisma.product.findMany({
      where: {
        active: true,
        category: { slug: { notIn: BLOCKED_CATEGORIES } },
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
    await prisma.searchHistory.create({
      data: { query: q, resultsCount: products.length, session: session || null },
    });

    return { products, total: products.length };
  });
}
