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
          <div className={styles.bannerBg}>
            <Image
              src="/images/hero-banner.jpg"
              alt="VYRO Vape"
              fill
              priority
              quality={85}
              className={styles.bannerImg}
            />
            <div className={styles.bannerOverlay} />
          </div>

          <div className={styles.bannerContent}>
            <div className={styles.badges}>
              <span className={styles.badge18}>18+</span>
              <span className={styles.badgeOfficial}>Офіційний дистриб'ютор</span>
            </div>

            <h1 className={styles.headline}>
              Преміальний<br />
              вейп-простір
            </h1>

            <p className={styles.tagline}>
              Оригінальні POD-системи, сольові рідини та одноразки з доставкою по Україні
            </p>

            <div className={styles.bannerActions}>
              <Link href="/shop" className={styles.btnShop}>
                Каталог
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3.33 8h9.34M8.67 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
              <a
                href="https://t.me/vyro_store"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.btnTg}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
                </svg>
                Telegram
              </a>
            </div>

            <div className={styles.trustBar}>
              <div className={styles.trustItem}>
                <span className={styles.trustIcon}>🛡️</span>
                <span>Скретч-код перевірки</span>
              </div>
              <div className={styles.trustDot} />
              <div className={styles.trustItem}>
                <span className={styles.trustIcon}>⚡</span>
                <span>Відправка в день замовлення</span>
              </div>
              <div className={styles.trustDot} />
              <div className={styles.trustItem}>
                <span className={styles.trustIcon}>🚚</span>
                <span>Безкоштовно від 1000₴</span>
              </div>
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
