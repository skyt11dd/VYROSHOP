import styles from './BrandMarquee.module.css';

const brands = [
  'VAPORESSO',
  'VOOPOO',
  'OXVA',
  'GEEKVAPE',
  'LOST VAPE',
  'ELF BAR',
  'SMOK',
  'CHASER',
  'OCTOBAR',
  'VOZOL',
];

export function BrandMarquee() {
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.wrapper}>
          <span className={styles.title}>Трендові бренди:</span>
          <div className={styles.track}>
            <div className={styles.brandList}>
              {[...brands, ...brands].map((brand, i) => (
                <span key={i} className={styles.brandItem}>
                  {brand}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
