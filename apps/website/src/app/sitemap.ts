import { MetadataRoute } from 'next';
import { api } from '@/lib/api';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = 'https://vyro.store';

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, changeFrequency: 'daily', priority: 1 },
    { url: `${base}/shop`, changeFrequency: 'hourly', priority: 0.9 },
    { url: `${base}/about`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/contact`, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${base}/faq`, changeFrequency: 'monthly', priority: 0.4 },
  ];

  try {
    const { products } = await api.getProducts({ limit: '100' });
    const { categories } = await api.getCategories();

    const productRoutes: MetadataRoute.Sitemap = products.map((p: any) => ({
      url: `${base}/product/${p.slug}`,
      changeFrequency: 'daily' as const,
      priority: 0.8,
      lastModified: new Date(p.updatedAt),
    }));

    const categoryRoutes: MetadataRoute.Sitemap = categories.map((c: any) => ({
      url: `${base}/category/${c.slug}`,
      changeFrequency: 'daily' as const,
      priority: 0.7,
    }));

    return [...staticRoutes, ...productRoutes, ...categoryRoutes];
  } catch {
    return staticRoutes;
  }
}
