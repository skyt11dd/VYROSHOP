import styles from './BrandMarquee.module.css';

const brands = [
  'VAPORESSO',
  'OXVA',
  'VOOPOO',
  'LOST VAPE',
  'ELF BAR',
  'CHASER LAB',
  'OCTOBAR',
  'GEEKVAPE',
  'SMOK',
  'VOZOL',
  'FLAVORLAB',
  'HYPE JUICE',
];

export function BrandMarquee() {
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.wrapper}>
          <div className={styles.labelGroup}>
            <span className={styles.dot} />
            <span className={styles.title}>Оригінальні бренди:</span>
          </div>

          <div className={styles.track}>
            {brands.map((brand, i) => (
              <span key={i} className={styles.brandBadge}>
                {brand}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
