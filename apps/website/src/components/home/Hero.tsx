'use client';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Hero.module.css';

export function Hero() {
  return (
    <section className={styles.heroSection}>
      <div className="container">
        <div className={styles.banner}>
          {/* Background Atmospheric Visual */}
          <div className={styles.imageBackdrop}>
            <Image
              src="/images/hero-banner.jpg"
              alt="VYRO Vape Boutique"
              fill
              priority
              quality={90}
              className={styles.bgImage}
            />
            <div className={styles.overlay} />
          </div>

          {/* Banner Content */}
          <div className={styles.content}>
            <div className={styles.topBadges}>
              <span className={styles.ageBadge}>18+</span>
              <span className={styles.officialBadge}>ОФІЦІЙНИЙ ДИСТРИБ'ЮТОР</span>
              <span className={styles.deliveryBadge}>
                <span className={styles.truckIcon}>🚚</span> Безкоштовна доставка від 1 000 ₴
              </span>
            </div>

            <h1 className={styles.title}>
              Оригінальні POD-системи, <br />
              сольові рідини та картриджі
            </h1>

            <p className={styles.subtitle}>
              Преміальний вейп-простір VYRO. Швидка відправка Новою Поштою по всій Україні в день замовлення. Тільки перевірені бренди з офіційною гарантією автентичності.
            </p>

            <div className={styles.actions}>
              <Link href="/shop" className={styles.btnPrimary}>
                Перейти до каталогу →
              </Link>
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

            {/* In-Banner Trust Metrics */}
            <div className={styles.perksRow}>
              <div className={styles.perk}>
                <span className={styles.perkIcon}>🛡️</span>
                <div className={styles.perkText}>
                  <strong>100% Оригінал</strong>
                  <span>Захисні скретч-коди</span>
                </div>
              </div>

              <div className={styles.perkDivider} />

              <div className={styles.perk}>
                <span className={styles.perkIcon}>⚡</span>
                <div className={styles.perkText}>
                  <strong>Відправка щодня</strong>
                  <span>Замовлення до 18:00</span>
                </div>
              </div>

              <div className={styles.perkDivider} />

              <div className={styles.perk}>
                <span className={styles.perkIcon}>💬</span>
                <div className={styles.perkText}>
                  <strong>Підтримка 24/7</strong>
                  <span>Швидка допомога з вибором</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
