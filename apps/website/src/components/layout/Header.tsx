'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { SearchModal } from '@/components/search/SearchModal';
import { MobileMenu } from '@/components/layout/MobileMenu';
import { formatPrice } from '@/lib/format';
import styles from './Header.module.css';

const categoriesNav = [
  { href: '/shop', label: '🔥 Всі товари' },
  { href: '/shop?category=pods', label: 'POD-системи' },
  { href: '/shop?category=liquids', label: 'Сольові рідини' },
  { href: '/shop?category=disposables', label: 'Одноразки' },
  { href: '/shop?category=cartridges', label: 'Картриджі та випарники' },
  { href: '/shop?popular=true', label: 'Топ продажів' },
  { href: '/shop?isNew=true', label: 'Новинки' },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { count, total } = useCart();
  const { customer } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
        {/* Top Announcement Bar */}
        <div className={styles.topBar}>
          <div className={`container ${styles.topBarInner}`}>
            <div className={styles.topBarLeft}>
              <span className={styles.topNotice}>
                🚚 Безкоштовна доставка від <strong>1 000 ₴</strong>
              </span>
              <span className={styles.dot}>•</span>
              <span className={styles.topNotice}>
                📦 Відправка Новою Поштою щодня до 18:00
              </span>
              <span className={styles.dot}>•</span>
              <span className={styles.topNotice}>
                🔞 18+ Тільки оригінал
              </span>
            </div>

            <div className={styles.topBarRight}>
              <a
                href="https://t.me/vyro_store"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.tgLink}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
                </svg>
                <span>Консультація в Telegram</span>
              </a>
              <span className={styles.workHours}>Пн–Нд: 10:00–21:00</span>
            </div>
          </div>
        </div>

        {/* Main Header Bar */}
        <div className={styles.mainBar}>
          <div className={`container ${styles.mainBarInner}`}>
            {/* Mobile menu button */}
            <button
              className={styles.menuBtn}
              onClick={() => setMobileOpen(true)}
              aria-label="Меню магазину"
            >
              <svg width="22" height="22" viewBox="0 0 20 20" fill="none">
                <path d="M2 5h16M2 10h16M2 15h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </button>

            {/* Official VYRO Logo */}
            <Link href="/" className={styles.logoLink} aria-label="Головна сторінка VYRO">
              <div className={styles.logoWrapper}>
                <Image
                  src="/logo.png"
                  alt="VYRO Vape Shop"
                  width={124}
                  height={34}
                  priority
                  unoptimized
                  className={styles.logoImg}
                />
              </div>
              <span className={styles.ageBadge}>18+</span>
            </Link>

            {/* Prominent Search Bar */}
            <div className={styles.searchBar} onClick={() => setSearchOpen(true)}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className={styles.searchIcon}>
                <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.6"/>
                <path d="M12.5 12.5L16 16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
              </svg>
              <span className={styles.searchPlaceholder}>
                Пошук: Vaporesso, OXVA, Chaser, сольові рідини, картриджі...
              </span>
              <kbd className={styles.searchKbd}>Ctrl+K</kbd>
            </div>

            {/* User Actions */}
            <div className={styles.actions}>
              <Link href="/favorites" className={styles.actionBtn} aria-label="Обрані товари">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
                <span className={styles.actionLabel}>Обране</span>
              </Link>

              <Link href="/cart" className={`${styles.actionBtn} ${styles.cartActionBtn}`} aria-label="Кошик">
                <div className={styles.cartIconWrapper}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                    <line x1="3" y1="6" x2="21" y2="6"/>
                    <path d="M16 10a4 4 0 0 1-8 0"/>
                  </svg>
                  {count > 0 && <span className={styles.cartCount}>{count > 99 ? '99+' : count}</span>}
                </div>
                <div className={styles.cartTextWrap}>
                  <span className={styles.cartTitle}>Кошик</span>
                  <span className={styles.cartTotal}>{total > 0 ? `${formatPrice(total)} ₴` : '0 ₴'}</span>
                </div>
              </Link>

              <Link href="/account" className={styles.actionBtn} aria-label="Особистий кабінет">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                <span className={styles.actionLabel}>{customer ? 'Кабінет' : 'Вхід'}</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Category Navigation Bar (Subnav) */}
        <div className={styles.subnavBar}>
          <div className={`container ${styles.subnavInner}`}>
            <nav className={styles.categoriesNav}>
              {categoriesNav.map((cat) => (
                <Link key={cat.href} href={cat.href} className={styles.catLink}>
                  {cat.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
      <MobileMenu
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        navLinks={categoriesNav}
      />
    </>
  );
}
