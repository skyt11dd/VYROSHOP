import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { api } from '@/lib/api';
import { ProductPageClient } from './ProductPageClient';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  try {
    const { product } = await api.getProduct(params.slug);
    return {
      title: product.name,
      description: product.shortDescription,
      openGraph: {
        title: product.name,
        description: product.shortDescription,
        images: product.images?.[0]?.url ? [product.images[0].url] : [],
      },
    };
  } catch {
    return { title: 'Товар не знайдено' };
  }
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  try {
    const { product, related } = await api.getProduct(params.slug);
    return <ProductPageClient product={product} related={related} />;
  } catch {
    notFound();
  }
}
