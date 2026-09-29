import styles from './Hero.module.css';
import Link from 'next/link';

export function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.bg}>
        <div className={styles.grad1} />
        <div className={styles.grad2} />
        <div className={styles.grid} />
      </div>
      <div className={`container ${styles.content}`}>
        <div className={styles.left}>
          <span className={styles.eyebrow}>⬛ VYRO Store</span>
          <h1 className={styles.title}>
            <span>НОВИЙ ПОГЛЯД</span>
            <span className={styles.accent}>НА ПОКУПКИ</span>
          </h1>
          <p className={styles.subtitle}>
            Обирай.<br />
            Порівнюй.<br />
            Замовляй.
          </p>
          <div className={styles.cta}>
            <Link href="/shop" className="btn btn-primary">Перейти до магазину</Link>
            <Link href="/shop?isNew=true" className="btn btn-outline">Новинки</Link>
          </div>
          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statNum}>10K+</span>
              <span className={styles.statLabel}>Товарів</span>
            </div>
            <div className={styles.statDiv} />
            <div className={styles.stat}>
              <span className={styles.statNum}>50K+</span>
              <span className={styles.statLabel}>Замовлень</span>
            </div>
            <div className={styles.statDiv} />
            <div className={styles.stat}>
              <span className={styles.statNum}>4.9★</span>
              <span className={styles.statLabel}>Рейтинг</span>
            </div>
          </div>
        </div>
        <div className={styles.right}>
          <div className={styles.floatingCard}>
            <div className={styles.cardInner}>
              <div className={styles.cardGlow} />
              <div className={styles.productMock}>
                <div className={styles.mockImg} />
                <div className={styles.mockInfo}>
                  <div className={styles.mockTitle} />
                  <div className={styles.mockPrice} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
