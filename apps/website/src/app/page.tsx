import type { Metadata } from 'next';
import { api } from '@/lib/api';
import { Hero } from '@/components/home/Hero';
import { CategoriesSection } from '@/components/home/CategoriesSection';
import { BrandMarquee } from '@/components/home/BrandMarquee';
import { VapeBenefits } from '@/components/home/VapeBenefits';
import { TelegramConcierge } from '@/components/home/TelegramConcierge';

export const metadata: Metadata = {
  title: 'VYRO — Офіційний Вейп Шоп | POD-системи, Рідини, Одноразки',
  description: 'Преміальний вейп-шоп VYRO. Оригінальні POD-системи, сольові рідини, одноразки та картриджі з швидкою доставкою по Україні. 18+',
};

export const revalidate = 60;

export default async function HomePage() {
  const categoriesData = await api.getCategories().catch(() => ({ categories: [] }));
  const categories = categoriesData?.categories || [];

  return (
    <>
      <Hero />
      <CategoriesSection categories={categories} />
      <BrandMarquee />
      <VapeBenefits />
      <TelegramConcierge />
    </>
  );
}
