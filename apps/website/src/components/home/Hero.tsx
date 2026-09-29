'use client';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Hero.module.css';

const categories = [
  {
    slug: 'pods',
    href: '/shop?category=pods',
    title: 'POD-системи',
    subtitle: 'Vaporesso • Voopoo • Oxva',
    image: '/images/xros4.jpg',
    imageAlt: 'POD-системи',
  },
  {
    slug: 'liquids',
    href: '/shop?category=liquids',
    title: 'Сольові рідини',
    subtitle: 'Chaser • Octobar • Hype',
    image: '/images/chaser-salt.jpg',
    imageAlt: 'Сольові рідини',
  },
  {
    slug: 'disposables',
    href: '/shop?category=disposables',
    title: 'Одноразки',
    subtitle: 'Elf Bar • Lost Mary • Vozol',
    image: '/images/elfbar-disposable.jpg',
    imageAlt: 'Одноразові сигарети',
  },
  {
    slug: 'cartridges',
    href: '/shop?category=cartridges',
    title: 'Картриджі',
    subtitle: 'XROS • Ursa • XLIM • Boost',
    image: '/images/cartridge-pack.jpg',
    imageAlt: 'Картриджі та випарники',
  },
];

export function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.heroInner}>
        {/* Left — Main Banner */}
        <div className={styles.mainBanner}>
          <div className={styles.bannerContent}>
            <h1 className={styles.headline}>
              VYRO.<br />
              Твій стиль.
            </h1>

            <p className={styles.tagline}>
              Оригінальні пристрої та преміальні рідини.
            </p>

            <div className={styles.bannerActions}>
              <Link href="/shop" className={styles.btnShop}>
                Перейти до каталогу
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3.33 8h9.34M8.67 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* Right — Category Grid */}
        <div className={styles.catGrid}>
          {categories.map((cat) => (
            <Link key={cat.slug} href={cat.href} className={styles.catCard}>
              <div className={styles.catImgWrap}>
                <Image
                  src={cat.image}
                  alt={cat.imageAlt}
                  width={120}
                  height={120}
                  className={styles.catImg}
                />
              </div>
              <div className={styles.catInfo}>
                <span className={styles.catTitle}>{cat.title}</span>
                <span className={styles.catSub}>{cat.subtitle}</span>
              </div>
              <div className={styles.catArrow}>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M3.33 8h9.34M8.67 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
