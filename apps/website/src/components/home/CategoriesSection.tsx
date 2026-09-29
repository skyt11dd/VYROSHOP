import Link from 'next/link';
import Image from 'next/image';
import styles from './CategoriesSection.module.css';

const categoriesList = [
  {
    slug: 'pods',
    title: 'POD-системи',
    tag: '36 моделей',
    price: 'від 590 ₴',
    desc: 'Vaporesso, OXVA, Voopoo, Lost Vape',
    image: '/images/xlim-pro.jpg',
  },
  {
    slug: 'liquids',
    title: 'Сольові рідини',
    tag: '140+ смаків',
    price: 'від 180 ₴',
    desc: 'Chaser, Octobar, Hype, Flavorlab, 25-50 мг',
    image: '/images/chaser-salt.jpg',
  },
  {
    slug: 'disposables',
    title: 'Одноразки',
    tag: 'до 25 000 тяг',
    price: 'від 290 ₴',
    desc: 'Elf Bar, Lost Mary, Vozol, HQD з екранами',
    image: '/images/elfbar-disposable.jpg',
  },
  {
    slug: 'cartridges',
    title: 'Картриджі та випарники',
    tag: 'Оригінал',
    price: 'від 120 ₴',
    desc: 'Оригінальні картриджі Corex 2.0, Ursa, Xlim',
    image: '/images/cartridge-pack.jpg',
  },
];

export function CategoriesSection({ categories }: { categories?: any[] }) {
  return (
    <section className="section" style={{ background: '#f9f9fb', borderBottom: '1px solid var(--border)' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#71717a', marginBottom: '6px', display: 'block' }}>
              Каталог продукції
            </span>
            <h2 style={{ fontSize: 'clamp(24px, 3.2vw, 34px)', fontWeight: 800, letterSpacing: '-0.025em', color: '#09090b', margin: 0 }}>
              Основні категорії
            </h2>
          </div>
          <Link href="/shop" className="btn btn-outline" style={{ fontSize: 13, padding: '9px 18px', fontWeight: 700, borderRadius: 8 }}>
            Всі категорії →
          </Link>
        </div>

        <div className={styles.grid}>
          {categoriesList.map((cat) => (
            <Link key={cat.slug} href={`/shop?category=${cat.slug}`} className={styles.card}>
              <div className={styles.imageBox}>
                <Image
                  src={cat.image}
                  alt={cat.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className={styles.image}
                />
                <span className={styles.tagBadge}>{cat.tag}</span>
              </div>
              <div className={styles.body}>
                <div className={styles.titleRow}>
                  <h3 className={styles.title}>{cat.title}</h3>
                  <span className={styles.price}>{cat.price}</span>
                </div>
                <p className={styles.desc}>{cat.desc}</p>
                <div className={styles.linkText}>
                  <span>Перейти до каталогу</span>
                  <span className={styles.arrow}>→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
