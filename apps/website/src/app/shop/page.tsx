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



  useEffect(() => {
    api.getCategories()
      .then(r => setCategories(r.categories || []))
      .catch(() => setCategories([]));
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
        setProducts(r.products || []);
        setTotal(r.total || 0);
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
