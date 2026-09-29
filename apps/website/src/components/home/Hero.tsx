'use client';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Hero.module.css';

interface CategoryTile {
  slug: string;
  href: string;
  title: string;
  tag: string;
  desc: string;
  brands: string;
  image: string;
  imageAlt: string;
}

const categoryTiles: CategoryTile[] = [
  {
    slug: 'pods',
    href: '/shop?category=pods',
    title: 'POD-системи',
    tag: 'Багаторазові',
    desc: 'Компактні пристрої зі змінними картриджами',
    brands: 'Vaporesso • Voopoo • Oxva • Lost Vape',
    image: '/images/xros4.jpg',
    imageAlt: 'POD-системи VYRO',
  },
  {
    slug: 'liquids',
    href: '/shop?category=liquids',
    title: 'Сольові рідини',
    tag: 'Salt 25/50 мг',
    desc: 'Преміальні сольові мікси та насичені смаки',
    brands: 'Chaser • Octobar • Hype • Alchemist',
    image: '/images/chaser-salt.jpg',
    imageAlt: 'Сольові рідини VYRO',
  },
  {
    slug: 'disposables',
    href: '/shop?category=disposables',
    title: 'Одноразки',
    tag: 'До 25 000 тяг',
    desc: 'Готові девайси з швидкою зарядкою Type-C',
    brands: 'Elf Bar • Lost Mary • Vozol • HQD',
    image: '/images/elfbar-disposable.jpg',
    imageAlt: 'Одноразові електронні сигарети',
  },
  {
    slug: 'cartridges',
    href: '/shop?category=cartridges',
    title: 'Картриджі',
    tag: 'Розхідники',
    desc: 'Оригінальні баки, картриджі та випаровувачі',
    brands: 'XROS • Ursa Nano • XLIM • Boost',
    image: '/images/cartridge-pack.jpg',
    imageAlt: 'Картриджі та випарники VYRO',
  },
];

export function Hero() {
  return (
    <section className={styles.heroSection}>
      <div className="container">
        {/* Top Info Bar */}
        <div className={styles.topInfoBar}>
          <div className={styles.leftChips}>
            <span className={styles.badge18}>18+</span>
            <span className={styles.distributorText}>Офіційний вейп-шоп VYRO</span>
            <span className={styles.dividerDot}>•</span>
            <span className={styles.deliveryChip}>
              🚚 Безкоштовна доставка від 1 000 ₴
            </span>
          </div>
          <div className={styles.rightLinks}>
            <a
              href="https://t.me/vyro_store"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.tgLink}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
              </svg>
              <span>Підбір в Telegram</span>
            </a>
          </div>
        </div>

        {/* Section Header */}
        <div className={styles.headerRow}>
          <div>
            <h1 className={styles.mainTitle}>Каталог продукції</h1>
            <p className={styles.subTitle}>
              Оберіть категорію товарів для швидкого переходу до каталогу
            </p>
          </div>
          <Link href="/shop" className={styles.allCatalogBtn}>
            Всі товари →
          </Link>
        </div>

        {/* Large Category Tiles Grid */}
        <div className={styles.tilesGrid}>
          {categoryTiles.map((tile) => (
            <Link key={tile.slug} href={tile.href} className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={styles.cardTag}>{tile.tag}</span>
                <span className={styles.arrowIcon}>↗</span>
              </div>

              <div className={styles.imageWrapper}>
                <Image
                  src={tile.image}
                  alt={tile.imageAlt}
                  width={200}
                  height={200}
                  priority
                  className={styles.cardImg}
                />
              </div>

              <div className={styles.cardContent}>
                <h2 className={styles.cardTitle}>{tile.title}</h2>
                <p className={styles.cardDesc}>{tile.desc}</p>
                <div className={styles.brandsRow}>{tile.brands}</div>

                <div className={styles.cardAction}>
                  <span>В каталог</span>
                  <span className={styles.actionArrow}>→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
