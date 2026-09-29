import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { api } from '@/lib/api';
import { ProductCard } from '@/components/product/ProductCard';

const fallbackCategories: Record<string, any> = {
  pods: {
    id: 'pods',
    name: 'POD-системи',
    slug: 'pods',
    description: 'Оригінальні багаторазові pod-системи від топових світових брендів: Vaporesso, Voopoo, Oxva, Geekvape.',
  },
  liquids: {
    id: 'liquids',
    name: 'Сольові рідини',
    slug: 'liquids',
    description: 'Преміальні сольові рідини для pod-систем із міцністю 25 мг та 50 мг.',
  },
  disposables: {
    id: 'disposables',
    name: 'Одноразки',
    slug: 'disposables',
    description: 'Трендові одноразові електронні сигарети від 5000 до 25000 затяжок.',
  },
  cartridges: {
    id: 'cartridges',
    name: 'Картриджі та випарники',
    slug: 'cartridges',
    description: 'Оригінальні змінні картриджі та випарники на сітці для всіх популярних pod-систем.',
  },
};

const fallbackProductsByCategory: Record<string, any[]> = {
  pods: [
    {
      id: 'vaporesso-xros-4',
      name: 'Vaporesso XROS 4 Pod Kit',
      slug: 'vaporesso-xros-4',
      price: 1299,
      oldPrice: 1450,
      shortDescription: '1000 mAh, 3 режими потужності, швидка зарядка',
      stock: 12,
      isNew: true,
      images: [],
      category: { name: 'POD-системи' },
    },
    {
      id: 'oxva-xlim-pro-2',
      name: 'Oxva Xlim Pro 2 Pod Kit',
      slug: 'oxva-xlim-pro-2',
      price: 1390,
      oldPrice: 1550,
      shortDescription: '1300 mAh, кольоровий HD дисплей 0.56"',
      stock: 9,
      isNew: true,
      images: [],
      category: { name: 'POD-системи' },
    },
    {
      id: 'voopoo-argus-g2',
      name: 'Voopoo Argus G2 Kit 1000mAh',
      slug: 'voopoo-argus-g2',
      price: 1250,
      oldPrice: 1390,
      shortDescription: '0.96" TFT екран, 30W, плавне регулювання тяги',
      stock: 14,
      images: [],
      category: { name: 'POD-системи' },
    },
    {
      id: 'lost-vape-ursa-nano-pro-2',
      name: 'Lost Vape Ursa Nano Pro 2 Kit',
      slug: 'lost-vape-ursa-nano-pro-2',
      price: 1190,
      oldPrice: 1320,
      shortDescription: '1000 mAh, 30W, металевий корпус',
      stock: 11,
      isNew: true,
      images: [],
      category: { name: 'POD-системи' },
    },
  ],
  liquids: [
    {
      id: 'chaser-lux-salt-30ml',
      name: 'Chaser Lux Salt 30ml (50 мг)',
      slug: 'chaser-lux-salt-30ml',
      price: 320,
      oldPrice: 360,
      shortDescription: 'Преміальна сольова рідина, ягідні та холодні мікси',
      stock: 54,
      images: [],
      category: { name: 'Сольові рідини' },
    },
    {
      id: 'octobar-strong-salt',
      name: 'Octobar Strong Salt 30ml',
      slug: 'octobar-strong-salt-30ml',
      price: 340,
      oldPrice: 380,
      shortDescription: 'Міцний сольовий нікотин, екстра-холод',
      stock: 35,
      images: [],
      category: { name: 'Сольові рідини' },
    },
  ],
  disposables: [
    {
      id: 'elf-bar-gh23000',
      name: 'Elf Bar GH23000 Puffs Ice',
      slug: 'elf-bar-gh23000',
      price: 690,
      oldPrice: 790,
      shortDescription: '23 000 затяжок, цифровий екран, регулювання потужності',
      stock: 22,
      images: [],
      category: { name: 'Одноразки' },
    },
  ],
  cartridges: [
    {
      id: 'cartridge-xros-mesh',
      name: 'Картридж Vaporesso XROS 0.8Ω (пачка 4 шт)',
      slug: 'cartridge-xros-mesh-08',
      price: 480,
      oldPrice: 520,
      shortDescription: 'Оригінальні картриджі Corex 2.0 із захистом від протікань',
      stock: 40,
      images: [],
      category: { name: 'Картриджі' },
    },
  ],
};

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const resolvedParams = await params;
  try {
    const { categories } = await api.getCategories();
    const cat = categories.find((c: any) => c.slug === resolvedParams.slug);
    if (cat) return { title: `${cat.name} — VYRO Vape Shop`, description: cat.description };
  } catch {}
  const fallback = fallbackCategories[resolvedParams.slug];
  if (fallback) {
    return { title: `${fallback.name} — VYRO Vape Shop`, description: fallback.description };
  }
  return { title: 'Категорія — VYRO Vape Shop' };
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const resolvedParams = await params;
  const [categoriesData, productsData] = await Promise.allSettled([
    api.getCategories(),
    api.getProducts({ category: resolvedParams.slug, limit: '40' }),
  ]);

  const categories = categoriesData.status === 'fulfilled' ? categoriesData.value?.categories || [] : [];
  let category = categories.find((c: any) => c.slug === resolvedParams.slug);
  if (!category) {
    category = fallbackCategories[resolvedParams.slug];
  }
  if (!category) notFound();

  let products = productsData.status === 'fulfilled' ? productsData.value?.products || [] : [];
  if (products.length === 0 && fallbackProductsByCategory[resolvedParams.slug]) {
    products = fallbackProductsByCategory[resolvedParams.slug];
  }

  return (
    <div style={{ paddingTop: 'calc(var(--header-height) + 40px)', paddingBottom: 80 }}>
      <div className="container">
        <div style={{ marginBottom: 40 }}>
          <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--accent)', marginBottom: 8, display: 'block' }}>
            Категорія
          </span>
          <h1 style={{ fontSize: 36, fontWeight: 800, color: '#ffffff' }}>{category.name}</h1>
          {category.description && <p style={{ color: 'var(--text-secondary)', marginTop: 8, maxWidth: 640 }}>{category.description}</p>}
          <p style={{ color: 'var(--accent)', fontSize: 13, fontWeight: 600, marginTop: 8 }}>{products.length} товарів в наявності</p>
        </div>
        {products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-secondary)' }}>В цій категорії поки немає товарів</div>
        ) : (
          <div className="products-grid">
            {products.map((p: any) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}
