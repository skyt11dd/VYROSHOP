'use client';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Hero.module.css';

import { Zap, Droplets, Wind, Package } from 'lucide-react';

const categories = [
  {
    slug: 'pods',
    href: '/shop?category=pods',
    title: 'POD-системи',
    subtitle: 'Vaporesso • Voopoo • Oxva',
    icon: Zap,
    disabled: true,
  },
  {
    slug: 'disposables',
    href: '/shop?category=disposables',
    title: 'Одноразки',
    subtitle: 'Elf Bar • Lost Mary • Vozol',
    icon: Wind,
    disabled: true,
  },
  {
    slug: 'liquids',
    href: '/shop?category=liquids',
    title: 'Рідини',
    subtitle: 'Chaser • Octobar • Hype',
    icon: Droplets,
    disabled: false,
  },
  {
    slug: 'cartridges',
    href: '/shop?category=cartridges',
    title: 'Картриджі',
    subtitle: 'XROS • Ursa • XLIM • Boost',
    icon: Package,
    disabled: false,
  },
];

export function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.heroInner}>
        {/* Left — Main Banner */}
        <div className={`${styles.mainBanner} animate-scale-up`}>
          <div className={styles.bannerContent}>
            <h1 className={`${styles.headline} animate-slide-up delay-150`}>
              VYRO.<br />
              Твій стиль.
            </h1>

            <p className={`${styles.tagline} animate-slide-up delay-225`}>
              Оригінальні пристрої та преміальні рідини.
            </p>

            <div className={`${styles.bannerActions} animate-slide-up delay-300`}>
              <Link href="/shop" className={styles.btnShop}>
                Перейти до каталогу
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3.33 8h9.34M8.67 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>
          </div>
        </div>

        <div className={styles.catGrid}>
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            const staggerClass = `animate-slide-right delay-${(idx + 1) * 75}`;
            
            const cardContent = (
              <>
                <div className={styles.catIconWrap}>
                  <Icon size={26} strokeWidth={1.5} />
                </div>
                <div className={styles.catInfo}>
                  <div className={styles.catTitleRow}>
                    <span className={styles.catTitle}>{cat.title}</span>
                    {cat.disabled && <span className={styles.badgeSoon}>Скоро</span>}
                  </div>
                  <span className={styles.catSub}>{cat.subtitle}</span>
                </div>
                {!cat.disabled && (
                  <div className={styles.catArrow}>
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                      <path d="M3.33 8h9.34M8.67 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
              </>
            );

            if (cat.disabled) {
              return (
                <div key={cat.slug} className={`${styles.catCard} ${styles.disabled} ${staggerClass}`}>
                  {cardContent}
                </div>
              );
            }

            return (
              <Link key={cat.slug} href={cat.href} className={`${styles.catCard} ${staggerClass}`}>
                {cardContent}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
