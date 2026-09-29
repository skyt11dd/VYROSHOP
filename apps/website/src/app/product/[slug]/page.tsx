import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { api } from '@/lib/api';
import { ProductPageClient } from './ProductPageClient';



export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const resolvedParams = await params;
  try {
    const { product } = await api.getProduct(resolvedParams.slug);
    return {
      title: `${product.name} — VYRO Vape Shop`,
      description: product.shortDescription,
    };
  } catch {
    return { title: 'Товар — VYRO Vape Shop' };
  }
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const resolvedParams = await params;
  try {
    const { product, related } = await api.getProduct(resolvedParams.slug);
    return <ProductPageClient product={product} related={related || []} />;
  } catch {
    notFound();
  }
}
