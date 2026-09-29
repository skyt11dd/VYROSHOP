import Link from 'next/link';
import styles from './CategoriesSection.module.css';

const categoriesList = [
  {
    slug: 'pods',
    title: 'POD-системи',
    tag: 'Багаторазові',
    desc: 'Vaporesso, Voopoo, Oxva, Geekvape, Lost Vape',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="7" y="7" width="10" height="15" rx="3" />
        <path d="M10 7V4a2 2 0 0 1 4 0v3" />
        <line x1="12" y1="12" x2="12" y2="15" />
      </svg>
    ),
  },
  {
    slug: 'liquids',
    title: 'Сольові рідини',
    tag: 'Salt 25/50 мг',
    desc: 'Chaser, Octobar, Hype, Alchemist, Marvellous',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 2h4" />
        <path d="M12 2v4" />
        <rect x="6" y="6" width="12" height="16" rx="3" />
        <path d="M12 11c-1.5 1.5-1.5 3 0 4.5s1.5-3 0-4.5z" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    slug: 'disposables',
    title: 'Одноразки',
    tag: 'Топ пристрої',
    desc: 'Elf Bar, Lost Mary, Vozol, HQD до 25 000 тяг',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="8" y="2" width="8" height="20" rx="4" />
        <circle cx="12" cy="18" r="1.5" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    slug: 'cartridges',
    title: 'Картриджі та випарники',
    tag: 'Розхідники',
    desc: 'Оригінальні картриджі до всіх популярних пристроїв',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="6" y="3" width="12" height="18" rx="2" />
        <line x1="6" y1="9" x2="18" y2="9" />
        <circle cx="12" cy="15" r="2" />
      </svg>
    ),
  },
];

export function CategoriesSection({ categories }: { categories?: any[] }) {
  return (
    <section className="section" style={{ background: '#f8f8fa', borderBottom: '1px solid var(--border)' }}>
      <div className="container">
        <div className="section-heading" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 4, display: 'block' }}>
              Каталог
            </span>
            <h2>Основні категорії</h2>
          </div>
          <Link href="/shop" className="btn btn-outline" style={{ fontSize: 13, padding: '8px 16px' }}>
            Всі категорії →
          </Link>
        </div>

        <div className={styles.grid}>
          {categoriesList.map((cat) => (
            <Link key={cat.slug} href={`/shop?category=${cat.slug}`} className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.iconBox}>{cat.icon}</div>
                <span className={styles.badge}>{cat.tag}</span>
              </div>
              <div className={styles.cardBody}>
                <h3 className={styles.title}>{cat.title}</h3>
                <p className={styles.desc}>{cat.desc}</p>
              </div>
              <div className={styles.cardFooter}>
                <span className={styles.linkText}>Перейти</span>
                <span className={styles.arrow}>→</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
