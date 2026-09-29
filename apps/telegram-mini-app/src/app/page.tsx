'use client';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './HomePage.module.css';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function MiniAppHome() {
  const [user, setUser] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [featured, setFeatured] = useState<any[]>([]);
  const [newArrivals, setNewArrivals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const tg = (window as any).Telegram?.WebApp;
    if (tg) {
      tg.ready();
      tg.expand();
      setUser(tg.initDataUnsafe?.user);
    }

    Promise.all([
      fetch(`${API_URL}/api/public/categories`).then(r => r.json()),
      fetch(`${API_URL}/api/public/products?featured=true&limit=10`).then(r => r.json()),
      fetch(`${API_URL}/api/public/products?isNew=true&limit=10`).then(r => r.json()),
    ]).then(([cats, feat, nw]) => {
      setCategories(cats.categories || []);
      setFeatured(feat.products || []);
      setNewArrivals(nw.products || []);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div className={`page ${styles.page}`}>
      {/* Header */}
      <div className={styles.header}>
        <span className={styles.logo}>VYRO</span>
        <Link href="/cart" className={styles.cartBtn}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M2 2h2l2.5 10h7l2-7H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="9" cy="16" r="1" fill="currentColor"/>
            <circle cx="14" cy="16" r="1" fill="currentColor"/>
          </svg>
        </Link>
      </div>

      {/* Welcome */}
      {user && (
        <div className={styles.welcome}>
          <h1>Привіт, {user.first_name} 👋</h1>
          <p>Що сьогодні шукаємо?</p>
        </div>
      )}

      {/* Hero */}
      <div className={styles.hero}>
        <div className={styles.heroText}>
          <span className={styles.heroBadge}>VYRO Store</span>
          <h2>Преміальні товари</h2>
          <p>Широкий каталог, швидке замовлення</p>
          <Link href="/catalog" className="btn btn-primary" style={{ marginTop: 16 }}>Переглянути каталог</Link>
        </div>
      </div>

      {/* Categories */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Категорії</h2>
          <Link href="/catalog" className={styles.seeAll}>Всі →</Link>
        </div>
        <div className={styles.categoriesScroll}>
          {loading
            ? Array.from({ length: 5 }).map((_, i) => <div key={i} className={`skeleton ${styles.catSkeleton}`} />)
            : categories.map(c => (
              <Link key={c.id} href={`/catalog?category=${c.slug}`} className={styles.categoryChip}>
                <span>{c.name}</span>
              </Link>
            ))
          }
        </div>
      </div>

      {/* Featured products */}
      {(featured.length > 0 || loading) && (
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>Рекомендовані</h2>
            <Link href="/catalog?featured=true" className={styles.seeAll}>Всі →</Link>
          </div>
          <div className={styles.productsScroll}>
            {loading
              ? Array.from({ length: 4 }).map((_, i) => <div key={i} className={`skeleton ${styles.productSkeleton}`} />)
              : featured.map(p => <MiniProductCard key={p.id} product={p} />)
            }
          </div>
        </div>
      )}

      {/* New arrivals */}
      {(newArrivals.length > 0 || loading) && (
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>Новинки</h2>
            <Link href="/catalog?isNew=true" className={styles.seeAll}>Всі →</Link>
          </div>
          <div className={styles.productsScroll}>
            {loading
              ? Array.from({ length: 4 }).map((_, i) => <div key={i} className={`skeleton ${styles.productSkeleton}`} />)
              : newArrivals.map(p => <MiniProductCard key={p.id} product={p} />)
            }
          </div>
        </div>
      )}

      {/* Bottom nav */}
      <BottomNav active="home" />
    </div>
  );
}

function MiniProductCard({ product }: { product: any }) {
  return (
    <Link href={`/product/${product.slug}`} className={styles.productCard}>
      <div className={styles.productImage}>
        {product.images?.[0] ? (
          <Image src={product.images[0].url} alt={product.name} fill style={{ objectFit: 'cover' }} />
        ) : <div className={styles.noImg} />}
      </div>
      <div className={styles.productInfo}>
        <span className={styles.productName}>{product.name}</span>
        <span className={styles.productPrice}>{product.price.toLocaleString()} ₴</span>
      </div>
    </Link>
  );
}

export function BottomNav({ active }: { active: string }) {
  const items = [
    { href: '/', icon: '⌂', label: 'Головна', key: 'home' },
    { href: '/catalog', icon: '▦', label: 'Каталог', key: 'catalog' },
    { href: '/search', icon: '⌕', label: 'Пошук', key: 'search' },
    { href: '/favorites', icon: '♡', label: 'Обране', key: 'favorites' },
    { href: '/profile', icon: '👤', label: 'Профіль', key: 'profile' },
  ];

  return (
    <nav className={styles.bottomNav}>
      {items.map(item => (
        <Link key={item.key} href={item.href} className={`${styles.navItem} ${active === item.key ? styles.navActive : ''}`}>
          <span className={styles.navIcon}>{item.icon}</span>
          <span className={styles.navLabel}>{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}
