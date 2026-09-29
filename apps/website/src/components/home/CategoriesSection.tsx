import Link from 'next/link';
import Image from 'next/image';
import styles from './CategoriesSection.module.css';

export function CategoriesSection({ categories }: { categories: any[] }) {
  if (!categories.length) return null;
  return (
    <section className="section">
      <div className="container">
        <div className="section-heading">
          <h2>Популярні категорії</h2>
          <p>Знайдіть те, що шукаєте</p>
        </div>
        <div className={styles.grid}>
          {categories.slice(0, 8).map((cat) => (
            <Link key={cat.id} href={`/category/${cat.slug}`} className={styles.card}>
              <div className={styles.image}>
                {cat.image ? (
                  <Image src={cat.image} alt={cat.name} fill style={{ objectFit: 'cover' }} />
                ) : (
                  <div className={styles.placeholder}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M4 7h16M4 12h10M4 17h7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                  </div>
                )}
              </div>
              <div className={styles.info}>
                <span className={styles.name}>{cat.name}</span>
                <span className={styles.count}>{cat._count?.products || 0} товарів</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
