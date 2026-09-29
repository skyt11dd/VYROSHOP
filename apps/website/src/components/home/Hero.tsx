import Link from 'next/link';
import Image from 'next/image';
import styles from './Hero.module.css';

export function Hero() {
  return (
    <section className={styles.hero}>
      <div className="container">
        <div className={styles.grid}>
          {/* Left Editorial Content */}
          <div className={styles.left}>
            <div className={styles.badgeWrap}>
              <span className={styles.ageBadge}>18+</span>
              <span className={styles.badgeText}>Оригінальна вейп-продукція · Тільки перевірені бренди</span>
            </div>

            <h1 className={styles.title}>
              Преміальні POD-системи та сольові рідини
            </h1>

            <p className={styles.subtitle}>
              Оригінальні пристрої, перевірені сольові мікси та фірмові змінні картриджі від світових виробників. Швидка відправка в день замовлення по всій Україні.
            </p>

            <div className={styles.cta}>
              <Link href="/shop" className={styles.ctaPrimary}>
                Перейти до каталогу →
              </Link>
              <Link href="/shop?category=pods" className={styles.ctaOutline}>
                POD-системи
              </Link>
            </div>

            <div className={styles.infoRow}>
              <div className={styles.infoItem}>
                <svg className={styles.infoIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  <path d="m9 12 2 2 4-4"/>
                </svg>
                <div className={styles.infoText}>
                  <span className={styles.infoTitle}>100% Оригінал</span>
                  <span className={styles.infoDesc}>Захисні коди перевірки</span>
                </div>
              </div>

              <div className={styles.infoDivider} />

              <div className={styles.infoItem}>
                <svg className={styles.infoIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                </svg>
                <div className={styles.infoText}>
                  <span className={styles.infoTitle}>Відправка щодня</span>
                  <span className={styles.infoDesc}>Нова Пошта 1-2 дні</span>
                </div>
              </div>

              <div className={styles.infoDivider} />

              <div className={styles.infoItem}>
                <svg className={styles.infoIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <div className={styles.infoText}>
                  <span className={styles.infoTitle}>Тільки 18+</span>
                  <span className={styles.infoDesc}>Відповідальний продаж</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Luxury Onyx Card */}
          <div className={styles.right}>
            <div className={styles.heroVisual}>
              <div className={styles.brandCard}>
                <div className={styles.cardTop}>
                  <span className={styles.cardTag}>VYRO FLAGSHIP 2026</span>
                  <span className={styles.cardAvailability}>В наявності</span>
                </div>

                <div className={styles.showcaseStage}>
                  <div className={styles.deviceWrapper}>
                    {/* High Precision Signature VYRO Pod Silhouette */}
                    <svg width="68" height="144" viewBox="0 0 68 144" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <linearGradient id="podBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#2c2c30" />
                          <stop offset="50%" stopColor="#18181b" />
                          <stop offset="100%" stopColor="#0d0d0f" />
                        </linearGradient>
                        <linearGradient id="podCartGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#52525b" stopOpacity="0.8" />
                          <stop offset="100%" stopColor="#27272a" stopOpacity="0.9" />
                        </linearGradient>
                        <filter id="ledGlow" x="-50%" y="-50%" width="200%" height="200%">
                          <feGaussianBlur stdDeviation="3" result="blur" />
                          <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                          </feMerge>
                        </filter>
                      </defs>

                      {/* Translucent Pod Cartridge */}
                      <path d="M21 12C21 4 27 0 34 0C41 0 47 4 47 12V34H21V12Z" fill="url(#podCartGrad)" />
                      <line x1="26" y1="18" x2="42" y2="18" stroke="#a1a1aa" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
                      
                      {/* Metal/Alloy Device Body */}
                      <rect x="15" y="34" width="38" height="106" rx="7" fill="url(#podBodyGrad)" stroke="#3f3f46" strokeWidth="1" />

                      {/* Signature glowing vertical LED slit */}
                      <rect x="32.5" y="58" width="3" height="20" rx="1.5" fill="#ffffff" filter="url(#ledGlow)" />

                      {/* Minimal VYRO wordmark outline */}
                      <rect x="29" y="124" width="10" height="2.5" rx="1" fill="#71717a" opacity="0.8" />
                    </svg>
                  </div>
                </div>

                <div className={styles.specsGrid}>
                  <div className={styles.specBox}>
                    <span className={styles.specVal}>1000 mAh</span>
                    <span className={styles.specLabel}>Акумулятор</span>
                  </div>
                  <div className={styles.specBox}>
                    <span className={styles.specVal}>Mesh 0.8Ω</span>
                    <span className={styles.specLabel}>Corex 2.0</span>
                  </div>
                  <div className={styles.specBox}>
                    <span className={styles.specVal}>Type-C 30m</span>
                    <span className={styles.specLabel}>Швидка зарядка</span>
                  </div>
                  <div className={styles.specBox}>
                    <span className={styles.specVal}>Top-Fill</span>
                    <span className={styles.specLabel}>Без протікань</span>
                  </div>
                </div>

                <div className={styles.cardBottom}>
                  <div>
                    <span className={styles.priceLabel}>Оригінальний комплект</span>
                    <span className={styles.cardPrice}>від 890 ₴</span>
                  </div>
                  <Link href="/shop?category=pods" className={styles.orderBtn}>
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
