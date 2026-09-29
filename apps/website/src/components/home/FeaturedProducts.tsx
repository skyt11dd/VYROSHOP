'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ProductCard } from '@/components/product/ProductCard';

export const defaultFeaturedVapes = [
  {
    id: 'vaporesso-xros-4',
    name: 'Vaporesso XROS 4 Pod Kit (1000 mAh)',
    slug: 'vaporesso-xros-4',
    price: 1299,
    oldPrice: 1450,
    shortDescription: '1000 mAh · 3 режими потужності · швидка зарядка Type-C 30 хв',
    stock: 12,
    isNew: true,
    featured: true,
    images: [{ url: '/images/xros4.jpg', alt: 'Vaporesso XROS 4' }],
    category: { name: 'POD-системи', slug: 'pods' },
  },
  {
    id: 'chaser-lux-salt-30ml',
    name: 'Сольова рідина Chaser Lux Salt 30ml (50 мг)',
    slug: 'chaser-lux-salt-30ml',
    price: 320,
    oldPrice: 360,
    shortDescription: 'Преміальний сольовий нікотин · соковиті ягідні та холодні мікси',
    stock: 54,
    featured: true,
    images: [{ url: '/images/chaser-salt.jpg', alt: 'Chaser Lux Salt 30ml' }],
    category: { name: 'Сольові рідини', slug: 'liquids' },
  },
  {
    id: 'oxva-xlim-pro-2',
    name: 'Oxva Xlim Pro 2 Pod Kit (1300 mAh)',
    slug: 'oxva-xlim-pro-2',
    price: 1390,
    oldPrice: 1550,
    shortDescription: '1300 mAh · кольоровий HD-дисплей 0.56" · регулювання потужності до 30W',
    stock: 9,
    isNew: true,
    featured: true,
    images: [{ url: '/images/xlim-pro.jpg', alt: 'Oxva Xlim Pro 2' }],
    category: { name: 'POD-системи', slug: 'pods' },
  },
  {
    id: 'elf-bar-gh23000',
    name: 'Одноразка Elf Bar GH23000 Puffs Ice (23 000 тяг)',
    slug: 'elf-bar-gh23000',
    price: 690,
    oldPrice: 790,
    shortDescription: '23 000 затяжок · цифровий індикатор рідини та батареї · Type-C',
    stock: 22,
    featured: true,
    images: [{ url: '/images/elfbar-disposable.jpg', alt: 'Elf Bar GH23000' }],
    category: { name: 'Одноразки', slug: 'disposables' },
  },
  {
    id: 'lost-vape-ursa-nano-pro-2',
    name: 'Lost Vape Ursa Nano Pro 2 Kit (1000 mAh)',
    slug: 'lost-vape-ursa-nano-pro-2',
    price: 1190,
    oldPrice: 1320,
    shortDescription: '1000 mAh · металевий корпус із цинкового сплаву · швидка заправка',
    stock: 14,
    featured: true,
    images: [{ url: '/images/ursa-nano.jpg', alt: 'Lost Vape Ursa Nano Pro 2' }],
    category: { name: 'POD-системи', slug: 'pods' },
  },
  {
    id: 'cartridge-xros-mesh',
    name: 'Картриджі Vaporesso XROS 0.8Ω (упаковка 4 шт)',
    slug: 'cartridge-xros-mesh-08',
    price: 480,
    oldPrice: 520,
    shortDescription: 'Оригінальні картриджі Corex 2.0 із потрійним захистом від протікань',
    stock: 40,
    featured: true,
    images: [{ url: '/images/cartridge-pack.jpg', alt: 'Картриджі Vaporesso XROS' }],
    category: { name: 'Картриджі', slug: 'cartridges' },
  },
  {
    id: 'octobar-strong-salt',
    name: 'Сольова рідина Octobar Strong Salt 30ml',
    slug: 'octobar-strong-salt-30ml',
    price: 340,
    oldPrice: 380,
    shortDescription: 'Екстра-міцний нікотин 50 мг · насичені моно-смаки та освіжаючий холод',
    stock: 35,
    featured: true,
    images: [{ url: '/images/octobar-salt.jpg', alt: 'Octobar Strong Salt 30ml' }],
    category: { name: 'Сольові рідини', slug: 'liquids' },
  },
  {
    id: 'vozol-star-12000',
    name: 'Одноразка Vozol Star 12000 Puffs (12 000 тяг)',
    slug: 'vozol-star-12000',
    price: 590,
    oldPrice: 670,
    shortDescription: '12 000 затяжок · розумний екран заряду · м’який силіконовий захисний ковпачок',
    stock: 19,
    isNew: true,
    featured: true,
    images: [{ url: '/images/vozol-disposable.jpg', alt: 'Vozol Star 12000' }],
    category: { name: 'Одноразки', slug: 'disposables' },
  },
];

export function FeaturedProducts({ products }: { products?: any[] }) {
  const [activeTab, setActiveTab] = useState('all');
  const items = products && products.length > 0 ? products : defaultFeaturedVapes;

  const filtered = activeTab === 'all'
    ? items
    : items.filter(p => p.category?.name?.toLowerCase().includes(activeTab.toLowerCase()));

  return (
    <section className="section" style={{ background: '#ffffff', borderBottom: '1px solid var(--border)' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }} />
              <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#71717a' }}>
                Хіти продажу магазину
              </span>
            </div>
            <h2 style={{ fontSize: 'clamp(24px, 3.2vw, 34px)', fontWeight: 800, letterSpacing: '-0.025em', color: '#09090b', margin: 0 }}>
              Популярні вейп-товари
            </h2>
          </div>
          <Link href="/shop" className="btn btn-outline" style={{ fontSize: 13, padding: '9px 20px', fontWeight: 700, borderRadius: 8 }}>
            Весь каталог (300+ товарів) →
          </Link>
        </div>

        {/* Category Tabs */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '18px', marginBottom: '12px', scrollbarWidth: 'none' }}>
          {[
            { id: 'all', label: 'Всі товари' },
            { id: 'pod', label: 'POD-системи' },
            { id: 'рідин', label: 'Сольові рідини' },
            { id: 'однораз', label: 'Одноразки' },
            { id: 'картридж', label: 'Картриджі' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '8px 18px',
                borderRadius: '999px',
                fontSize: '13px',
                fontWeight: 700,
                border: activeTab === tab.id ? '1px solid #09090b' : '1px solid #e4e4e7',
                background: activeTab === tab.id ? '#09090b' : '#ffffff',
                color: activeTab === tab.id ? '#ffffff' : '#52525b',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="products-grid">
          {filtered.slice(0, 8).map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </section>
  );
}

export function NewArrivals({ products }: { products?: any[] }) {
  return null;
}

export function PopularProducts({ products }: { products?: any[] }) {
  return null;
}
