'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { SearchModal } from '@/components/search/SearchModal';
import { MobileMenu } from '@/components/layout/MobileMenu';
import styles from './Header.module.css';

const navLinks = [
  { href: '/shop', label: 'Каталог', disabled: false },
  { href: '/shop?category=pods', label: 'POD-системи', disabled: true },
  { href: '/shop?category=disposables', label: 'Одноразки', disabled: true },
  { href: '/shop?category=liquids', label: 'Рідини', disabled: false },
  { href: '/shop?category=cartridges', label: 'Картриджі', disabled: false },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { count } = useCart();
  const { customer } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header className={`${styles.header} ${scrolled ? styles.scrolled : ''} animate-fade-in`}>
        <div className={`container ${styles.inner}`}>
          {/* Mobile menu toggle */}
          <button className={`${styles.menuBtn} btn btn-ghost btn-icon`} onClick={() => setMobileOpen(true)} aria-label="Меню">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M2 5h16M2 10h16M2 15h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>

          {/* Logo with VYRO Pod device */}
          <Link href="/" className={styles.logoLink} aria-label="Головна VYRO Vape">
            <div className={styles.logoWrapper}>
              <Image
                src="/logo.png"
                alt="VYRO Vape Shop"
                width={116}
                height={32}
                priority
                unoptimized
                className={styles.logoImg}
              />
              <span className={styles.ageBadge}>18+</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className={styles.nav}>
            {navLinks.map(l => 
              l.disabled ? (
                <span key={l.href} className={`${styles.navLink} ${styles.navLinkDisabled}`}>
                  {l.label}
                </span>
              ) : (
                <Link key={l.href} href={l.href} className={styles.navLink}>
                  {l.label}
                </Link>
              )
            )}
          </nav>

          {/* Actions */}
          <div className={styles.actions}>
            <button className="btn btn-ghost btn-icon" onClick={() => setSearchOpen(true)} aria-label="Пошук">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M12.5 12.5L16 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
            <Link href="/favorites" className="btn btn-ghost btn-icon" aria-label="Обране">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M9 15.5S2 11 2 6.5a4 4 0 0 1 7-2.6A4 4 0 0 1 16 6.5C16 11 9 15.5 9 15.5z" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
            </Link>
            <Link href="/cart" className={`btn btn-ghost btn-icon ${styles.cartBtn}`} aria-label="Кошик">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M2 2h2l2.5 9h7l2-6H5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="8" cy="14.5" r="1" fill="currentColor"/>
                <circle cx="13" cy="14.5" r="1" fill="currentColor"/>
              </svg>
              {count > 0 && <span className={styles.badge}>{count > 99 ? '99+' : count}</span>}
            </Link>
            <Link href="/account" className="btn btn-ghost btn-icon" aria-label="Акаунт">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <circle cx="9" cy="6" r="3.5" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M2 16c0-3.3 3.1-6 7-6s7 2.7 7 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </Link>
          </div>
        </div>
      </header>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} navLinks={navLinks} />
    </>
  );
}
