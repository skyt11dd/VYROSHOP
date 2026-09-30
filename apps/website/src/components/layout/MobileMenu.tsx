'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './MobileMenu.module.css';

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  navLinks: { href: string; label: string; disabled?: boolean }[];
}

export function MobileMenu({ open, onClose, navLinks }: MobileMenuProps) {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      <div className={`${styles.backdrop} ${open ? styles.open : ''}`} onClick={onClose} />
      <div className={`${styles.menu} ${open ? styles.open : ''}`}>
        <div className={styles.header}>
          <Image
            src="/logo.png"
            alt="VYRO"
            width={120}
            height={33}
            unoptimized
            style={{ width: '120px', height: '33px', objectFit: 'contain' }}
          />
          <button className="btn btn-ghost btn-icon" onClick={onClose} aria-label="Закрити">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
        <nav className={styles.nav}>
          {navLinks.map(l => 
            l.disabled ? (
              <span key={l.href} className={`${styles.link} ${styles.linkDisabled}`}>
                {l.label}
              </span>
            ) : (
              <Link key={l.href} href={l.href} className={styles.link} onClick={onClose}>{l.label}</Link>
            )
          )}
          <div className={styles.divider} />
          <Link href="/cart" className={styles.link} onClick={onClose}>Кошик</Link>
          <Link href="/account" className={styles.link} onClick={onClose}>Особистий кабінет</Link>
        </nav>
      </div>
    </>
  );
}
