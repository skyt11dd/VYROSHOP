import Link from 'next/link';
import styles from './Footer.module.css';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.grid}>
          <div className={styles.brand}>
            <Link href="/" className={styles.logo}>VYRO</Link>
            <p className={styles.tagline}>Сучасний інтернет-магазин. Обирай. Порівнюй. Замовляй.</p>
            <div className={styles.socials}>
              <a href="#" aria-label="Telegram" className={styles.social}>
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
            <h4>Магазин</h4>
            <Link href="/shop">Всі товари</Link>
            <Link href="/shop?isNew=true">Новинки</Link>
            <Link href="/shop?popular=true">Популярне</Link>
            <Link href="/shop?featured=true">Рекомендовані</Link>
          </div>

          <div className={styles.col}>
            <h4>Компанія</h4>
            <Link href="/about">Про нас</Link>
            <Link href="/contact">Контакти</Link>
            <Link href="/faq">FAQ</Link>
          </div>

          <div className={styles.col}>
            <h4>Підтримка</h4>
            <Link href="/faq">Часті питання</Link>
            <Link href="/contact">Зв'язатись</Link>
            <Link href="/account/orders">Статус замовлення</Link>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>&copy; {new Date().getFullYear()} VYRO. Всі права захищені.</p>
          <div className={styles.legal}>
            <a href="#">Політика конфіденційності</a>
            <a href="#">Умови використання</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
