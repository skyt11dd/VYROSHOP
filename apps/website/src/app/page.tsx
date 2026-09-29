import type { Metadata } from 'next';
import { api } from '@/lib/api';
import { Hero } from '@/components/home/Hero';
import { CategoriesSection } from '@/components/home/CategoriesSection';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { BrandMarquee } from '@/components/home/BrandMarquee';
import { VapeBenefits } from '@/components/home/VapeBenefits';

export const metadata: Metadata = {
  title: 'VYRO — Офіційний Вейп Шоп | POD-системи, Рідини, Одноразки',
  description: 'Преміальний вейп-шоп VYRO. Оригінальні POD-системи, сольові рідини, одноразки та картриджі з швидкою доставкою по Україні. 18+',
};

export const revalidate = 60;

export default async function HomePage() {
  const [categoriesData, featuredData] = await Promise.allSettled([
    api.getCategories(),
    api.getProducts({ featured: 'true', limit: '8' }),
  ]);

  const categories = categoriesData.status === 'fulfilled' ? categoriesData.value?.categories || [] : [];
  const featured = featuredData.status === 'fulfilled' ? featuredData.value?.products || [] : [];

  return (
    <>
      <Hero />
      <CategoriesSection categories={categories} />
      <FeaturedProducts products={featured} />
      <BrandMarquee />
      <VapeBenefits />
    </>
  );
}
