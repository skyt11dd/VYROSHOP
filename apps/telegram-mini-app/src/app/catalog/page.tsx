'use client';
import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { BottomNav } from '../page';
import styles from './CatalogPage.module.css';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

function CatalogContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || '');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const tg = (window as any).Telegram?.WebApp;
    if (tg) tg.ready();

    fetch(`${API_URL}/api/public/categories`)
      .then(r => r.json())
      .then(d => setCategories(d.categories || []));
  }, []);

  useEffect(() => {
    setLoading(true);
    let url = `${API_URL}/api/public/products?limit=50`;
    if (activeCategory) url += `&category=${activeCategory}`;
    fetch(url)
      .then(r => r.json())
      .then(d => setProducts(d.products || []))
      .finally(() => setLoading(false));
  }, [activeCategory]);

  return (
    <div className={`page ${styles.page}`}>
      <div className={styles.header}>
        <h1>Каталог</h1>
      </div>

      <div className={styles.categories}>
        <button
          className={`${styles.catBtn} ${!activeCategory ? styles.catActive : ''}`}
          onClick={() => setActiveCategory('')}
        >
          Всі
        </button>
        {categories.map(c => (
          <button
            key={c.id}
            className={`${styles.catBtn} ${activeCategory === c.slug ? styles.catActive : ''}`}
            onClick={() => setActiveCategory(c.slug)}
          >
            {c.name}
          </button>
        ))}
      </div>

      <div className={styles.productsGrid}>
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => <div key={i} className={`skeleton ${styles.skeletonCard}`} />)
        ) : products.length === 0 ? (
          <div className={styles.empty}>Товарів не знайдено</div>
        ) : (
          products.map(p => (
            <Link key={p.id} href={`/product/${p.slug}`} className={styles.productCard}>
              <div className={styles.image}>
                {p.images?.[0] ? <Image src={p.images[0].url} alt={p.name} fill style={{ objectFit: 'cover' }} /> : <div className={styles.noImg} />}
                {p.stock === 0 && <span className={styles.outOfStock}>Немає</span>}
              </div>
              <div className={styles.info}>
                <span className={styles.name}>{p.name}</span>
                <span className={styles.price}>{p.price.toLocaleString()} ₴</span>
              </div>
            </Link>
          ))
        )}
      </div>

      <BottomNav active="catalog" />
    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense fallback={<div className="page" />}>
      <CatalogContent />
    </Suspense>
  );
}
