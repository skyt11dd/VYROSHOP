'use client';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Hero.module.css';

export function Hero() {
  return (
    <section className={styles.hero}>
      <div className="container">
        {/* Main Promo Grid */}
        <div className={styles.promoGrid}>
          {/* Main Hero Banner: Vaporesso XROS 4 */}
          <div className={styles.mainBanner}>
            <div className={styles.mainContent}>
              <div className={styles.badgeRow}>
                <span className={styles.saleBadge}>🔥 ХІТ ПРОДАЖІВ 2026</span>
                <span className={styles.guaranteeBadge}>100% Оригінал</span>
              </div>

              <h1 className={styles.title}>
                Vaporesso XROS 4 <br className={styles.breakOnDesktop} />& XROS Pro
              </h1>

              <p className={styles.subtitle}>
                Оновлені картриджі Corex 2.0 із захистом від протікань, акумулятор 1000 mAh, регулювання затяжки та надшвидка зарядка Type-C за 30 хв.
              </p>

              <div className={styles.priceRow}>
                <div className={styles.pricing}>
                  <span className={styles.currentPrice}>від 990 ₴</span>
                  <span className={styles.oldPrice}>1 190 ₴</span>
                </div>
                <span className={styles.discountBadge}>-17% знижка</span>
              </div>

              <div className={styles.ctaRow}>
                <Link href="/product/vaporesso-xros-4" className={styles.btnPrimary}>
                  Купити зі знижкою →
                </Link>
                <Link href="/shop?category=pods" className={styles.btnSecondary}>
                  Всі POD-системи
                </Link>
              </div>

              <div className={styles.features}>
                <span className={styles.featureItem}>✓ Скретч-код перевірки</span>
                <span className={styles.featureItem}>✓ Відправка сьогодні</span>
                <span className={styles.featureItem}>✓ Гарантія якості</span>
              </div>
            </div>

            <div className={styles.mainImageWrapper}>
              <div className={styles.imageStage}>
                <Image
                  src="/images/xros4.jpg"
                  alt="Vaporesso XROS 4 Pod Kit"
                  fill
                  priority
                  className={styles.bannerImage}
                  sizes="(max-width: 1024px) 100vw, 45vw"
                />
                <div className={styles.deviceSticker}>
                  <span className={styles.stickerTitle}>Vaporesso XROS 4</span>
                  <span className={styles.stickerDesc}>Оригінальний комплект</span>
                </div>
              </div>
            </div>
          </div>

          {/* Side Promo Column: 2 Deals */}
          <div className={styles.sideStack}>
            {/* Promo 1: Сольові рідини */}
            <Link href="/shop?category=liquids" className={styles.sideCard}>
              <div className={styles.sideContent}>
                <span className={styles.sideTag}>ТОП РІДИНИ</span>
                <h3 className={styles.sideTitle}>Chaser Lux & Octobar Salt</h3>
                <p className={styles.sideDesc}>50+ яскравих холодних та фруктових смаків</p>
                <div className={styles.sideBottom}>
                  <span className={styles.sidePrice}>від 180 ₴</span>
                  <span className={styles.sideBtn}>Обрати смак →</span>
                </div>
              </div>
              <div className={styles.sideImageWrapper}>
                <Image
                  src="/images/chaser-salt.jpg"
                  alt="Сольові рідини Chaser"
                  fill
                  className={styles.sideImage}
                  sizes="(max-width: 1024px) 30vw, 15vw"
                />
              </div>
            </Link>

            {/* Promo 2: Одноразки */}
            <Link href="/shop?category=disposables" className={styles.sideCard}>
              <div className={styles.sideContent}>
                <span className={styles.sideTag}>ДО 23 000 ЗАТЯЖОК</span>
                <h3 className={styles.sideTitle}>Elf Bar GH23000 & Vozol</h3>
                <p className={styles.sideDesc}>З цифровим дисплеєм залишку заряду та рідини</p>
                <div className={styles.sideBottom}>
                  <span className={styles.sidePrice}>від 590 ₴</span>
                  <span className={styles.sideBtn}>Переглянути →</span>
                </div>
              </div>
              <div className={styles.sideImageWrapper}>
                <Image
                  src="/images/elfbar-disposable.jpg"
                  alt="Одноразки Elf Bar"
                  fill
                  className={styles.sideImage}
                  sizes="(max-width: 1024px) 30vw, 15vw"
                />
              </div>
            </Link>
          </div>
        </div>

        {/* Real Vape Shop Trust Strip */}
        <div className={styles.trustStrip}>
          <div className={styles.trustItem}>
            <div className={styles.trustIconWrap}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                <path d="m9 12 2 2 4-4"/>
              </svg>
            </div>
            <div>
              <strong className={styles.trustTitle}>100% Оригінальна продукція</strong>
              <span className={styles.trustDesc}>Скретч-коди перевірки на кожній пачці</span>
            </div>
          </div>

          <div className={styles.trustDivider} />

          <div className={styles.trustItem}>
            <div className={styles.trustIconWrap}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
              </svg>
            </div>
            <div>
              <strong className={styles.trustTitle}>Відправка Новою Поштою щодня</strong>
              <span className={styles.trustDesc}>Замовлення до 18:00 їдуть сьогодні</span>
            </div>
          </div>

          <div className={styles.trustDivider} />

          <div className={styles.trustItem}>
            <div className={styles.trustIconWrap}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                <line x1="1" y1="10" x2="23" y2="10"/>
              </svg>
            </div>
            <div>
              <strong className={styles.trustTitle}>Оплата при отриманні</strong>
              <span className={styles.trustDesc}>Післяплата або онлайн без комісій</span>
            </div>
          </div>

          <div className={styles.trustDivider} />

          <div className={styles.trustItem}>
            <div className={styles.trustIconWrap}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>
            <div>
              <strong className={styles.trustTitle}>Суворо для повнолітніх (18+)</strong>
              <span className={styles.trustDesc}>Відповідальний офіційний продаж</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
