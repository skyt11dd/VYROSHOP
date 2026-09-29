'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
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

const defaultShopCats = [
  { id: '1', name: 'POD-системи', slug: 'pods' },
  { id: '2', name: 'Сольові рідини', slug: 'liquids' },
  { id: '3', name: 'Одноразки', slug: 'disposables' },
  { id: '4', name: 'Картриджі та випарники', slug: 'cartridges' },
];

function ShopContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>(defaultShopCats);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);

  const [sort, setSort] = useState(searchParams.get('sort') || 'featured');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [inStock, setInStock] = useState(false);

  useEffect(() => {
    api.getCategories()
      .then(r => {
        if (r.categories && r.categories.length > 0) {
          setCategories(r.categories);
        }
      })
      .catch(() => {});
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
          setTotal(r.total || r.products.length);
        } else {
          setProducts([]);
          setTotal(0);
        }
      })
      .catch(() => {
        setProducts([]);
        setTotal(0);
      })
      .finally(() => setLoading(false));
  }, [sort, category, page, searchParams]);

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.top}>
          <div>
            <h1 className={styles.title}>Каталог магазину</h1>
            <p className={styles.subtitle}>
              {total > 0 ? `${total} товарів в наявності` : 'Офіційна продукція провідних світових брендів'}
            </p>
          </div>
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
              <h3>Розділи</h3>
              <button className={`${styles.filterItem} ${!category ? styles.active : ''}`} onClick={() => setCategory('')}>Всі розділи</button>
              {categories.map(c => (
                <button
                  key={c.id} className={`${styles.filterItem} ${category === c.slug ? styles.active : ''}`}
                  onClick={() => { setCategory(c.slug); setPage(1); }}
                >
                  {c.name}
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

            <div style={{ marginTop: 24, padding: 16, background: '#f4f4f6', borderRadius: 12, border: '1px solid #e5e5e8' }}>
              <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: '#71717a', display: 'block', marginBottom: 4 }}>
                Консьєрж-сервіс
              </span>
              <p style={{ fontSize: 12, color: '#3f3f46', lineHeight: 1.4, marginBottom: 12 }}>
                Шукаєте певний пристрій або рідину? Напишіть нам у Telegram.
              </p>
              <a
                href="https://t.me/vyro_store"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-sm"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                Telegram підтримка
              </a>
            </div>
          </aside>

          {/* Products or Empty Catalog State */}
          <div className={styles.main}>
            {loading ? (
              <div className="products-grid">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="skeleton" style={{ height: 280, borderRadius: 'var(--radius-lg)' }} />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div style={{
                background: '#ffffff',
                border: '1px solid #e4e4e7',
                borderRadius: 20,
                padding: '56px 24px',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                maxWidth: 600,
                margin: '0 auto',
              }}>
                <div style={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  background: '#f4f4f6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 16,
                  color: '#0a0a0a',
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                    <line x1="12" y1="22.08" x2="12" y2="12"/>
                  </svg>
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: '#0a0a0a', marginBottom: 8, letterSpacing: '-0.02em' }}>
                  Каталог оновлюється
                </h3>
                <p style={{ fontSize: 14, color: '#71717a', lineHeight: 1.6, maxWidth: 440, marginBottom: 24 }}>
                  Ми формуємо свіжі надходження оригінальних девайсів та рідин. Щоб дізнатися наявність або зробити замовлення вже зараз — зв’яжіться з нами в Telegram.
                </p>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
                  <a
                    href="https://t.me/vyro_store"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                    style={{ padding: '12px 24px', fontWeight: 700 }}
                  >
                    Замовити в Telegram →
                  </a>
                  <Link href="/" className="btn btn-outline" style={{ padding: '12px 20px', fontWeight: 700 }}>
                    На головну
                  </Link>
                </div>
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
