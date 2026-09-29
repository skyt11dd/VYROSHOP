import type { Metadata } from 'next';
import { api } from '@/lib/api';
import { Hero } from '@/components/home/Hero';
import { CategoriesSection } from '@/components/home/CategoriesSection';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { NewArrivals } from '@/components/home/NewArrivals';
import { PopularProducts } from '@/components/home/PopularProducts';
import { PromoBanner } from '@/components/home/PromoBanner';
import { BrandStory } from '@/components/home/BrandStory';
import { FaqSection } from '@/components/home/FaqSection';

export const metadata: Metadata = {
  title: 'VYRO — Сучасний інтернет-магазин',
  description: 'Відкрийте новий погляд на покупки разом з VYRO. Преміальний асортимент, швидка доставка по Україні.',
};

export const revalidate = 60;

export default async function HomePage() {
  const [categoriesData, featuredData, newData, popularData] = await Promise.allSettled([
    api.getCategories(),
    api.getProducts({ featured: 'true', limit: '8' }),
    api.getProducts({ isNew: 'true', limit: '8' }),
    api.getProducts({ popular: 'true', limit: '8' }),
  ]);

  const categories = categoriesData.status === 'fulfilled' ? categoriesData.value.categories : [];
  const featured = featuredData.status === 'fulfilled' ? featuredData.value.products : [];
  const newArrivals = newData.status === 'fulfilled' ? newData.value.products : [];
  const popular = popularData.status === 'fulfilled' ? popularData.value.products : [];

  return (
    <>
      <Hero />
      <CategoriesSection categories={categories} />
      <FeaturedProducts products={featured} />
      <PromoBanner />
      <NewArrivals products={newArrivals} />
      <PopularProducts products={popular} />
      <BrandStory />
      <FaqSection />
    </>
  );
}
