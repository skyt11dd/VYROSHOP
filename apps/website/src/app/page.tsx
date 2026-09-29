import type { Metadata } from 'next';
import { Hero } from '@/components/home/Hero';
import { BrandMarquee } from '@/components/home/BrandMarquee';
import { VapeBenefits } from '@/components/home/VapeBenefits';

export const metadata: Metadata = {
  title: 'VYRO — Офіційний Вейп Шоп | POD-системи, Рідини, Одноразки',
  description: 'Преміальний вейп-шоп VYRO. Оригінальні POD-системи, сольові рідини, одноразки та картриджі з швидкою доставкою по Україні. 18+',
};

export const revalidate = 60;

export default async function HomePage() {
  return (
    <>
      <Hero />
      <BrandMarquee />
      <VapeBenefits />
    </>
  );
}
