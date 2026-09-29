import Link from 'next/link';
import styles from './PromoBanner.module.css';

export function PromoBanner() {
  return (
    <section className={styles.banner}>
      <div className="container">
        <div className={styles.inner}>
          <div className={styles.glow} />
          <div className={styles.content}>
            <span className={styles.tag}>Спеціальна пропозиція</span>
            <h2>Зареєструйся та отримай знижку</h2>
            <p>Зробіть перше замовлення та отримайте ексклюзивну знижку від VYRO. Лише для нових клієнтів.</p>
            <Link href="/account/register" className="btn btn-primary">Зареєструватись</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export function BrandStory() {
  return (
    <section className="section">
      <div className="container">
        <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
          <span style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--accent)', marginBottom: 16, display: 'block' }}>Про VYRO</span>
          <h2 style={{ fontSize: 'clamp(28px,4vw,44px)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 20 }}>Ми створили магазин майбутнього</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 16, lineHeight: 1.8 }}>
            VYRO — це не просто інтернет-магазин. Це нова платформа для покупок, де технологія та стиль поєднуються.
            Ми пропонуємо преміальний асортимент товарів, швидку доставку та найкращий сервіс.
          </p>
        </div>
      </div>
    </section>
  );
}

export function FaqSection() {
  const faqs = [
    { q: 'Як оформити замовлення?', a: 'Додайте товари в кошик, перейдіть до оформлення та заповніть форму. Менеджер зв\'яжеться з вами найближчим часом.' },
    { q: 'Як швидко доставляють замовлення?', a: 'Ми відправляємо замовлення протягом 1-2 робочих днів. Доставка по Україні займає 1-3 дні.' },
    { q: 'Чи можна повернути товар?', a: 'Так, ми приймаємо повернення протягом 14 днів з моменту отримання товару.' },
    { q: 'Як відслідковувати замовлення?', a: 'Після відправки ви отримаєте трек-номер на контактний номер або через ваш акаунт.' },
    { q: 'Чи є Telegram магазин?', a: 'Так! Напишіть нашому боту @VYROBot — він відкриє наш повноцінний магазин прямо в Telegram.' },
  ];

  return (
    <section className="section">
      <div className="container">
        <div className="section-heading" style={{ textAlign: 'center' }}>
          <h2>Часті питання</h2>
          <p>Відповіді на найпопулярніші запитання</p>
        </div>
        <div style={{ maxWidth: 700, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {faqs.map((f, i) => (
            <details key={i} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
              <summary style={{ padding: '18px 20px', fontWeight: 600, cursor: 'pointer', fontSize: 15, listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {f.q}
                <span style={{ fontSize: 20, color: 'var(--accent)', transition: 'transform 0.2s' }}>+</span>
              </summary>
              <p style={{ padding: '0 20px 18px', color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.7 }}>{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
