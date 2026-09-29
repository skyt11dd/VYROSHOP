import Link from 'next/link';
import Image from 'next/image';
import styles from './Footer.module.css';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        {/* 18+ Warning Bar */}
        <div style={{
          borderBottom: '1px solid var(--border)',
          paddingBottom: '20px',
          marginBottom: '32px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          color: '#52525b',
          fontSize: '12px',
          lineHeight: '1.5',
        }}>
          <span style={{
            background: '#f4f4f5',
            border: '1px solid #e4e4e7',
            padding: '2px 6px',
            borderRadius: '4px',
            fontWeight: 700,
            fontSize: '11px',
            color: '#09090b',
            flexShrink: 0,
          }}>18+</span>
          <span>УВАГА: Вейп-продукція та сольові рідини містять нікотин, який викликає залежність. Продаж здійснюється виключно особам, які досягли 18 років.</span>
        </div>

        <div className={styles.grid}>
          <div className={styles.brand}>
            <Link href="/" className={styles.logo}>
              <Image
                src="/logo.png"
                alt="VYRO"
                width={120}
                height={33}
                unoptimized
                style={{ width: '120px', height: '33px', objectFit: 'contain' }}
              />
            </Link>
            <p className={styles.tagline}>
              Преміальний вейп-шоп. Тільки оригінальні POD-системи, топові сольові рідини та фірмові розхідники.
            </p>
            <div className={styles.socials}>
              <a href="https://t.me" target="_blank" rel="noopener noreferrer" aria-label="Telegram" className={styles.social}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.833.941z"/>
                </svg>
              </a>
              <a href="#" aria-label="Instagram" className={styles.social}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>
          </div>

          <div className={styles.col}>
            <h4>Каталог</h4>
            <Link href="/shop">Всі товари</Link>
            <Link href="/shop?category=pods">POD-системи</Link>
            <Link href="/shop?category=liquids">Сольові рідини</Link>
            <Link href="/shop?category=disposables">Одноразки</Link>
            <Link href="/shop?category=cartridges">Картриджі</Link>
          </div>

          <div className={styles.col}>
            <h4>Покупцям</h4>
            <Link href="/about">Про VYRO</Link>
            <Link href="/contact">Контакти</Link>
            <Link href="/faq">Питання та відповіді</Link>
            <Link href="/account/orders">Статус замовлення</Link>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>&copy; {new Date().getFullYear()} VYRO Vape Shop. Всі права захищені.</p>
          <div className={styles.legal}>
            <a href="#">Політика конфіденційності</a>
            <a href="#">Умови продажу 18+</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
