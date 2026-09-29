import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { api } from '@/lib/api';
import { ProductPageClient } from './ProductPageClient';

const fallbackProducts: Record<string, any> = {
  'vaporesso-xros-4': {
    id: 'vaporesso-xros-4',
    name: 'Vaporesso XROS 4 Pod Kit',
    slug: 'vaporesso-xros-4',
    price: 1299,
    oldPrice: 1450,
    shortDescription: '1000 mAh, 3 режими потужності, швидка зарядка 2A Type-C, регулювання затяжки',
    description: 'Оновлена версія легендарного поду Vaporesso XROS 4 з технологією нагріву COREX 2.0. Пристрій отримав потужну батарею 1000 мАг, три режими роботи та металевий корпус преміум-класу.',
    stock: 12,
    images: [],
    category: { name: 'POD-системи', slug: 'pods' },
  },
  'chaser-lux-salt-30ml': {
    id: 'chaser-lux-salt-30ml',
    name: 'Chaser Lux Salt 30ml (50 мг)',
    slug: 'chaser-lux-salt-30ml',
    price: 320,
    oldPrice: 360,
    shortDescription: 'Преміальна сольова рідина, ягідні та холодні освіжаючі смаки',
    description: 'Лінійка Lux від українського бренду Chaser — це соковиті мікси на м\'якому сольовому нікотині найвищого ступеня очищення.',
    stock: 54,
    images: [],
    category: { name: 'Сольові рідини', slug: 'liquids' },
  },
  'oxva-xlim-pro-2': {
    id: 'oxva-xlim-pro-2',
    name: 'Oxva Xlim Pro 2 Pod Kit',
    slug: 'oxva-xlim-pro-2',
    price: 1390,
    oldPrice: 1550,
    shortDescription: '1300 mAh, кольоровий HD дисплей 0.56", потужність до 30W',
    description: 'Флагманська под-система Oxva Xlim Pro 2 з ультра-чітким TFT екраном, рекордною ємністю акумулятора 1300 mAh та бездоганною передачею смаку.',
    stock: 9,
    images: [],
    category: { name: 'POD-системи', slug: 'pods' },
  },
  'elf-bar-gh23000': {
    id: 'elf-bar-gh23000',
    name: 'Elf Bar GH23000 Puffs Ice',
    slug: 'elf-bar-gh23000',
    price: 690,
    oldPrice: 790,
    shortDescription: '23 000 затяжок, цифровий екран, регулювання потужності та обдуву',
    description: 'Потужна одноразка нового покоління з трьома режимами паріння (Boost, Norm, Soft) та інформативним цифровим дисплеєм заряду і залишку рідини.',
    stock: 22,
    images: [],
    category: { name: 'Одноразки', slug: 'disposables' },
  },
  'voopoo-argus-g2': {
    id: 'voopoo-argus-g2',
    name: 'Voopoo Argus G2 Kit 1000mAh',
    slug: 'voopoo-argus-g2',
    price: 1250,
    oldPrice: 1390,
    shortDescription: '0.96" TFT екран, 30W, плавне регулювання тяги, картриджі Top Fill',
    description: 'Сучасна pod-система Argus G2 від Voopoo з анімаціями на екрані, тривалим терміном служби картриджів та чудовою автономністю.',
    stock: 14,
    images: [],
    category: { name: 'POD-системи', slug: 'pods' },
  },
  'cartridge-xros-mesh-08': {
    id: 'cartridge-xros-mesh-08',
    name: 'Картридж Vaporesso XROS 0.8Ω (пачка 4 шт)',
    slug: 'cartridge-xros-mesh-08',
    price: 480,
    oldPrice: 520,
    shortDescription: 'Оригінальні картриджі Corex 2.0 із захистом від протікань SSS',
    description: 'Фірмові змінні картриджі Vaporesso на сітці з технологією COREX 2.0, що забезпечують насичений смак та захист від протікань.',
    stock: 40,
    images: [],
    category: { name: 'Картриджі', slug: 'cartridges' },
  },
  'octobar-strong-salt-30ml': {
    id: 'octobar-strong-salt-30ml',
    name: 'Octobar Strong Salt 30ml',
    slug: 'octobar-strong-salt-30ml',
    price: 340,
    oldPrice: 380,
    shortDescription: 'Міцний сольовий нікотин, екстра-холод та яскраві моно-смаки',
    description: 'Популярна сольова рідина Octobar Strong з яскравими насиченими смаками та міцним ударом по горлу.',
    stock: 35,
    images: [],
    category: { name: 'Сольові рідини', slug: 'liquids' },
  },
  'lost-vape-ursa-nano-pro-2': {
    id: 'lost-vape-ursa-nano-pro-2',
    name: 'Lost Vape Ursa Nano Pro 2 Kit',
    slug: 'lost-vape-ursa-nano-pro-2',
    price: 1190,
    oldPrice: 1320,
    shortDescription: '1000 mAh, 30W, стильний металевий корпус із дисплеєм',
    description: 'Елегантна под-система Ursa Nano Pro 2 з вбудованим екраном, чіпсетом Quest 2.0 та регулюванням обдуву.',
    stock: 11,
    images: [],
    category: { name: 'POD-системи', slug: 'pods' },
  },
};

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const resolvedParams = await params;
  try {
    const { product } = await api.getProduct(resolvedParams.slug);
    return {
      title: `${product.name} — VYRO Vape Shop`,
      description: product.shortDescription,
    };
  } catch {
    const fallback = fallbackProducts[resolvedParams.slug];
    if (fallback) {
      return {
        title: `${fallback.name} — VYRO Vape Shop`,
        description: fallback.shortDescription,
      };
    }
    return { title: 'Товар — VYRO Vape Shop' };
  }
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const resolvedParams = await params;
  try {
    const { product, related } = await api.getProduct(resolvedParams.slug);
    return <ProductPageClient product={product} related={related || []} />;
  } catch {
    const fallback = fallbackProducts[resolvedParams.slug];
    if (fallback) {
      const related = Object.values(fallbackProducts)
        .filter(p => p.slug !== fallback.slug)
        .slice(0, 4);
      return <ProductPageClient product={fallback} related={related} />;
    }
    notFound();
  }
}
