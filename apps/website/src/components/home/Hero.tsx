'use client';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Hero.module.css';

export function Hero() {
  const scrollToCategories = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById('categories');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className={styles.hero}>
      <div className="container">
        <div className={styles.grid}>
          {/* Left Column: Bold Typography & Brand Intro */}
          <div className={styles.left}>
            <div className={styles.badgeWrap}>
              <span className={styles.statusDot} />
              <span className={styles.badgeText}>VYRO VAPE SPACE · ОФІЦІЙНИЙ МАГАЗИН · 18+</span>
            </div>

            <h1 className={styles.title}>
              Нова культура <br />
              <span className={styles.titleAccent}>вейпінгу в Україні.</span>
            </h1>

            <p className={styles.subtitle}>
              Преміальні POD-системи, перевірені сольові рідини та оригінальні розхідники від провідних світових брендів. Бездоганна якість, чесний сервіс та швидка доставка Новою Поштою.
            </p>

            <div className={styles.ctaGroup}>
              <a href="#categories" onClick={scrollToCategories} className={styles.btnPrimary}>
                <span>Обрати категорію</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 6l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
              <a
                href="https://t.me/vyro_store"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.btnSecondary}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
                </svg>
                <span>Консультація в Telegram</span>
              </a>
            </div>

            {/* Quick Guarantees */}
            <div className={styles.trustRow}>
              <div className={styles.trustItem}>
                <div className={styles.trustDot} />
                <span>100% Оригінал (захисні коди)</span>
              </div>
              <div className={styles.trustDivider} />
              <div className={styles.trustItem}>
                <div className={styles.trustDot} />
                <span>Відправка щодня до 18:00</span>
              </div>
              <div className={styles.trustDivider} />
              <div className={styles.trustItem}>
                <div className={styles.trustDot} />
                <span>Суворо для повнолітніх 18+</span>
              </div>
            </div>
          </div>

          {/* Right Column: Luxury Brand Showcase Card */}
          <div className={styles.right}>
            <div className={styles.brandCard}>
              <div className={styles.cardHeader}>
                <span className={styles.cardBadge}>VYRO OFFICIAL</span>
                <span className={styles.cardStatus}>
                  <span className={styles.pulseDot} />
                  Магазин онлайн
                </span>
              </div>

              <div className={styles.cardCenter}>
                <div className={styles.logoStage}>
                  <Image
                    src="/logo.png"
                    alt="VYRO Official"
                    width={180}
                    height={50}
                    priority
                    unoptimized
                    className={styles.centerLogo}
                  />
                </div>
                <p className={styles.cardSlogan}>
                  Автентичні пристрої, сольові рідини та аксесуари найвищого ґатунку.
                </p>
              </div>

              <div className={styles.statsGrid}>
                <div className={styles.statBox}>
                  <span className={styles.statNumber}>100%</span>
                  <span className={styles.statLabel}>Оригінал</span>
                </div>
                <div className={styles.statBox}>
                  <span className={styles.statNumber}>24/7</span>
                  <span className={styles.statLabel}>Підтримка</span>
                </div>
                <div className={styles.statBox}>
                  <span className={styles.statNumber}>1-2 дні</span>
                  <span className={styles.statLabel}>Доставка</span>
                </div>
              </div>

              <div className={styles.cardFooter}>
                <a href="#categories" onClick={scrollToCategories} className={styles.cardBtn}>
                  Каталог категорій →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
