'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProductCard } from '@/components/product/ProductCard';
import { api } from '@/lib/api';
import styles from './ShopPage.module.css';

const SORT_OPTIONS = [
  { value: 'featured', label: 'Рекомендовані' },
  { value: 'newest', label: 'Новинки' },
  { value: 'popular', label: 'Популярні' },
  { value: 'price_asc', label: 'Ціна ↑' },
  { value: 'price_desc', label: 'Ціна ↓' },
];

function ShopContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);

  const [sort, setSort] = useState(searchParams.get('sort') || 'featured');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [inStock, setInStock] = useState(false);

  const defaultShopVapes = [
    {
      id: 'vaporesso-xros-4',
      name: 'Vaporesso XROS 4 Pod Kit',
      slug: 'vaporesso-xros-4',
      price: 1299,
      oldPrice: 1450,
      shortDescription: '1000 mAh, регулювання затяжки, 3 режими потужності, швидка зарядка',
      stock: 12,
      isNew: true,
      images: [],
      category: { name: 'POD-системи' },
    },
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
      id: 'oxva-xlim-pro-2',
      name: 'Oxva Xlim Pro 2 Pod Kit',
      slug: 'oxva-xlim-pro-2',
      price: 1390,
      oldPrice: 1550,
      shortDescription: '1300 mAh, кольоровий HD дисплей 0.56", потужність до 30W',
      stock: 9,
      isNew: true,
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
      images: [],
      category: { name: 'Картриджі' },
    },
    {
      id: 'octobar-strong-salt',
      name: 'Octobar Strong Salt 30ml',
      slug: 'octobar-strong-salt-30ml',
      price: 340,
      oldPrice: 380,
      shortDescription: 'Міцний сольовий нікотин, екстра-холод та яскраві моно-смаки',
      stock: 35,
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
      images: [],
      category: { name: 'POD-системи' },
    },
  ];

  const defaultShopCats = [
    { id: '1', name: 'POD-системи', slug: 'pods', _count: { products: 36 } },
    { id: '2', name: 'Сольові рідини', slug: 'liquids', _count: { products: 140 } },
    { id: '3', name: 'Одноразки', slug: 'disposables', _count: { products: 52 } },
    { id: '4', name: 'Картриджі', slug: 'cartridges', _count: { products: 68 } },
  ];

  useEffect(() => {
    api.getCategories()
      .then(r => setCategories(r.categories?.length ? r.categories : defaultShopCats))
      .catch(() => setCategories(defaultShopCats));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params: Record<string, string> = { sort, page: String(page), limit: '20' };
    if (category) params.category = category;
    if (searchParams.get('featured')) params.featured = 'true';
    if (searchParams.get('popular')) params.popular = 'true';
    if (searchParams.get('isNew')) params.isNew = 'true';

    api.getProducts(params)
      .then(r => {
        if (r.products && r.products.length > 0) {
          setProducts(r.products);
          setTotal(r.total);
        } else {
          setProducts(defaultShopVapes);
          setTotal(defaultShopVapes.length);
        }
      })
      .catch(() => {
        setProducts(defaultShopVapes);
        setTotal(defaultShopVapes.length);
      })
      .finally(() => setLoading(false));
  }, [sort, category, page, searchParams]);

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.top}>
            <h1 className={styles.title}>Каталог вейп-шопу</h1>
            <p className={styles.subtitle}>{total} товарів в наявності</p>
          <div className={styles.controls}>
            <select className={`input ${styles.sortSelect}`} value={sort} onChange={e => { setSort(e.target.value); setPage(1); }}>
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <button className={`btn btn-outline ${styles.filterBtn}`} onClick={() => setFilterOpen(!filterOpen)}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 4h12M4 8h8M6 12h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
              Фільтри
            </button>
          </div>
        </div>

        <div className={styles.layout}>
          {/* Sidebar filters */}
          <aside className={`${styles.sidebar} ${filterOpen ? styles.open : ''}`}>
            <div className={styles.filterGroup}>
              <h3>Категорія</h3>
              <button className={`${styles.filterItem} ${!category ? styles.active : ''}`} onClick={() => setCategory('')}>Всі</button>
              {categories.map(c => (
                <button
                  key={c.id} className={`${styles.filterItem} ${category === c.slug ? styles.active : ''}`}
                  onClick={() => { setCategory(c.slug); setPage(1); }}
                >
                  {c.name}
                  <span className={styles.filterCount}>{c._count?.products}</span>
                </button>
              ))}
            </div>
            <div className={styles.filterGroup}>
              <h3>Наявність</h3>
              <label className={styles.checkbox}>
                <input type="checkbox" checked={inStock} onChange={e => setInStock(e.target.checked)} />
                Тільки в наявності
              </label>
            </div>
          </aside>

          {/* Products */}
          <div className={styles.main}>
            {loading ? (
              <div className="products-grid">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="skeleton" style={{ height: 340, borderRadius: 'var(--radius-lg)' }} />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className={styles.empty}>
                <p>Товарів не знайдено</p>
                <span>Спробуйте змінити фільтри</span>
              </div>
            ) : (
              <div className="products-grid">
                {products.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            )}

            {/* Pagination */}
            {total > 20 && (
              <div className={styles.pagination}>
                <button className="btn btn-outline" disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Назад</button>
                <span>{page} / {Math.ceil(total / 20)}</span>
                <button className="btn btn-outline" disabled={page >= Math.ceil(total / 20)} onClick={() => setPage(p => p + 1)}>Далі →</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="container" style={{ padding: '80px 0' }}><div className="skeleton" style={{ height: 400, borderRadius: 16 }} /></div>}>
      <ShopContent />
    </Suspense>
  );
}
