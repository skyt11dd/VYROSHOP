import Link from 'next/link';
import Image from 'next/image';
import styles from './Hero.module.css';

export function Hero() {
  return (
    <section className={styles.hero}>
      <div className="container">
        <div className={styles.grid}>
          <div className={styles.left}>
            <div className={styles.badgeWrap}>
              <span className={styles.ageBadge}>18+</span>
              <span className={styles.badgeText}>Оригінальна вейп-продукція</span>
            </div>

            <h1 className={styles.title}>
              Преміальні POD-системи та рідини
            </h1>

            <p className={styles.subtitle}>
              Оригінальні пристрої, сольовий нікотин та змінні картриджі від провідних світових брендів. Швидка відправка в день замовлення.
            </p>

            <div className={styles.cta}>
              <Link href="/shop" className="btn btn-primary">
                Перейти до каталогу
              </Link>
              <Link href="/shop?category=pods" className="btn btn-outline">
                POD-системи
              </Link>
            </div>

            <div className={styles.infoRow}>
              <div className={styles.infoItem}>
                <span className={styles.infoTitle}>100% Оригінал</span>
                <span className={styles.infoDesc}>Захисні коди перевірки</span>
              </div>
              <div className={styles.infoDivider} />
              <div className={styles.infoItem}>
                <span className={styles.infoTitle}>Відправка щодня</span>
                <span className={styles.infoDesc}>Нова Пошта 1-2 дні</span>
              </div>
              <div className={styles.infoDivider} />
              <div className={styles.infoItem}>
                <span className={styles.infoTitle}>Тільки 18+</span>
                <span className={styles.infoDesc}>Відповідальний продаж</span>
              </div>
            </div>
          </div>

          <div className={styles.right}>
            <div className={styles.heroVisual}>
              <div className={styles.brandCard}>
                <div className={styles.cardTop}>
                  <span className={styles.cardTag}>VYRO FLAGSHIP</span>
                  <span className={styles.cardAvailability}>В наявності</span>
                </div>
                
                <div className={styles.logoDisplay}>
                  <Image
                    src="/logo.png"
                    alt="VYRO"
                    width={220}
                    height={54}
                    priority
                    className={styles.centerLogo}
                  />
                </div>

                <div className={styles.specsGrid}>
                  <div className={styles.specBox}>
                    <span className={styles.specVal}>1000 mAh</span>
                    <span className={styles.specLabel}>Акумулятор</span>
                  </div>
                  <div className={styles.specBox}>
                    <span className={styles.specVal}>Mesh 0.8Ω</span>
                    <span className={styles.specLabel}>Випарник</span>
                  </div>
                  <div className={styles.specBox}>
                    <span className={styles.specVal}>Type-C</span>
                    <span className={styles.specLabel}>Швидка зарядка</span>
                  </div>
                  <div className={styles.specBox}>
                    <span className={styles.specVal}>Top-Fill</span>
                    <span className={styles.specLabel}>Захист від протікань</span>
                  </div>
                </div>

                <div className={styles.cardBottom}>
                  <span className={styles.cardPrice}>від 890 ₴</span>
                  <Link href="/shop?category=pods" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: 13 }}>
                    Обрати пристрій →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
