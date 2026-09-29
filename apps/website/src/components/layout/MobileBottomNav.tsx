'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { SearchModal } from '@/components/search/SearchModal';
import styles from './MobileBottomNav.module.css';

export function MobileBottomNav() {
  const pathname = usePathname();
  const { count } = useCart();
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <nav className={styles.bottomNav} aria-label="Мобільна навігація">
        {/* 1. Home */}
        <Link
          href="/"
          className={`${styles.navItem} ${pathname === '/' ? styles.active : ''}`}
          aria-label="Головна"
        >
          <div className={styles.iconWrap}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
          </div>
          <span>Головна</span>
        </Link>

        {/* 2. Shop / Catalog */}
        <Link
          href="/shop"
          className={`${styles.navItem} ${pathname?.startsWith('/shop') || pathname?.startsWith('/category') ? styles.active : ''}`}
          aria-label="Каталог"
        >
          <div className={styles.iconWrap}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect width="7" height="7" x="3" y="3" rx="1"/>
              <rect width="7" height="7" x="14" y="3" rx="1"/>
              <rect width="7" height="7" x="14" y="14" rx="1"/>
              <rect width="7" height="7" x="3" y="14" rx="1"/>
            </svg>
          </div>
          <span>Каталог</span>
        </Link>

        {/* 3. Search */}
        <button
          type="button"
          className={styles.navItem}
          onClick={() => setSearchOpen(true)}
          aria-label="Пошук"
        >
          <div className={styles.iconWrap}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.3-4.3"/>
            </svg>
          </div>
          <span>Пошук</span>
        </button>

        {/* 4. Cart */}
        <Link
          href="/cart"
          className={`${styles.navItem} ${pathname === '/cart' ? styles.active : ''}`}
          aria-label="Кошик"
        >
          <div className={styles.iconWrap}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
              <path d="M3 6h18"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            {count > 0 && <span className={styles.badge}>{count > 99 ? '99+' : count}</span>}
          </div>
          <span>Кошик</span>
        </Link>

        {/* 5. Account */}
        <Link
          href="/account"
          className={`${styles.navItem} ${pathname?.startsWith('/account') ? styles.active : ''}`}
          aria-label="Акаунт"
        >
          <div className={styles.iconWrap}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="5"/>
              <path d="M20 21a8 8 0 0 0-16 0"/>
            </svg>
          </div>
          <span>Профіль</span>
        </Link>
      </nav>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
