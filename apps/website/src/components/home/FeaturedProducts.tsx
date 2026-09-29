import Link from 'next/link';
import { ProductCard } from '@/components/product/ProductCard';

const defaultFeaturedVapes = [
  {
    id: 'vaporesso-xros-4',
    name: 'Vaporesso XROS 4 Pod Kit',
    slug: 'vaporesso-xros-4',
    price: 1299,
    oldPrice: 1450,
    shortDescription: '1000 mAh, 3 режими потужності, швидка зарядка Type-C',
    stock: 12,
    isNew: true,
    featured: true,
    images: [],
    category: { name: 'POD-системи' },
  },
  {
    id: 'chaser-lux-salt-30ml',
    name: 'Chaser Lux Salt 30ml (50 мг)',
    slug: 'chaser-lux-salt-30ml',
    price: 320,
    oldPrice: 360,
    shortDescription: 'Преміальна сольова рідина, ягідні та холодні смаки',
    stock: 54,
    featured: true,
    images: [],
    category: { name: 'Сольові рідини' },
  },
  {
    id: 'oxva-xlim-pro-2',
    name: 'Oxva Xlim Pro 2 Pod Kit',
    slug: 'oxva-xlim-pro-2',
    price: 1390,
    oldPrice: 1550,
    shortDescription: '1300 mAh, кольоровий HD дисплей 0.56", потужність до 30W',
    stock: 9,
    isNew: true,
    featured: true,
    images: [],
    category: { name: 'POD-системи' },
  },
  {
    id: 'elf-bar-gh23000',
    name: 'Elf Bar GH23000 Puffs Ice',
    slug: 'elf-bar-gh23000',
    price: 690,
    oldPrice: 790,
    shortDescription: '23 000 затяжок, цифровий екран, регулювання потужності',
    stock: 22,
    featured: true,
    images: [],
    category: { name: 'Одноразки' },
  },
  {
    id: 'voopoo-argus-g2',
    name: 'Voopoo Argus G2 Kit 1000mAh',
    slug: 'voopoo-argus-g2',
    price: 1250,
    oldPrice: 1390,
    shortDescription: '0.96" TFT екран, 30W, плавне регулювання тяги',
    stock: 14,
    featured: true,
    images: [],
    category: { name: 'POD-системи' },
  },
  {
    id: 'cartridge-xros-mesh',
    name: 'Картридж Vaporesso XROS 0.8Ω (пачка 4 шт)',
    slug: 'cartridge-xros-mesh-08',
    price: 480,
    oldPrice: 520,
    shortDescription: 'Оригінальні картриджі Corex 2.0 із захистом від протікань',
    stock: 40,
    featured: true,
    images: [],
    category: { name: 'Картриджі' },
  },
  {
    id: 'octobar-strong-salt',
    name: 'Octobar Strong Salt 30ml',
    slug: 'octobar-strong-salt-30ml',
    price: 340,
    oldPrice: 380,
    shortDescription: 'Міцний сольовий нікотин, екстра-холод та яскраві смаки',
    stock: 35,
    featured: true,
    images: [],
    category: { name: 'Сольові рідини' },
  },
  {
    id: 'lost-vape-ursa-nano-pro-2',
    name: 'Lost Vape Ursa Nano Pro 2 Kit',
    slug: 'lost-vape-ursa-nano-pro-2',
    price: 1190,
    oldPrice: 1320,
    shortDescription: '1000 mAh, 30W, стильний металевий корпус',
    stock: 11,
    isNew: true,
    featured: true,
    images: [],
    category: { name: 'POD-системи' },
  },
];

export function FeaturedProducts({ products }: { products?: any[] }) {
  const items = products && products.length > 0 ? products : defaultFeaturedVapes;

  return (
    <section className="section" style={{ background: '#ffffff', borderBottom: '1px solid var(--border)' }}>
      <div className="container">
        <div className="section-heading" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px' }}>
          <div>
            <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 4, display: 'block' }}>
              Топ асортименту
            </span>
            <h2>Популярні товари</h2>
          </div>
          <Link href="/shop" className="btn btn-outline" style={{ fontSize: 13, padding: '8px 16px' }}>
            Весь каталог →
          </Link>
        </div>
        <div className="products-grid">
          {items.slice(0, 8).map(p => <ProductCard key={p.id} product={p} />)}
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
