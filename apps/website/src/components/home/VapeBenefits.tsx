import styles from './VapeBenefits.module.css';

const benefits = [
  {
    num: '01',
    title: '100% Оригінальність',
    desc: 'Кожен пристрій, картридж та рідина мають офіційний скретч-код виробника для перевірки автентичності на сайті бренду. Жодних копій чи підробок.',
    tag: 'Сертифіковано',
  },
  {
    num: '02',
    title: 'Відправка день-у-день',
    desc: 'Замовлення, оформлені та підтверджені до 18:00, відправляються Новою Поштою у той самий день. Швидка доставка по всій Україні за 1–2 дні.',
    tag: 'Нова Пошта 24h',
  },
  {
    num: '03',
    title: 'Персональний підбір',
    desc: 'Наші експерти на зв’язку щодня: допоможемо обрати пристрій під ваш стиль тяги, розрахуємо оптимальну міцність сольового нікотину та підберемо картриджі.',
    tag: 'Підтримка 7 днів',
  },
];

export function VapeBenefits() {
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.header}>
          <div className={styles.headerBadge}>
            <span className={styles.badgeDot} />
            <span className={styles.badgeText}>ПРИНЦИПИ РОБОТИ VYRO</span>
          </div>
          <h2 className={styles.title}>Сервіс, на який можна покластися</h2>
          <p className={styles.subtitle}>
            Ми будуємо довгострокові відносини з клієнтами на основі чесності, оригінальної якості та швидкої логістики.
          </p>
        </div>

        <div className={styles.grid}>
          {benefits.map((b, i) => (
            <div key={i} className={styles.card}>
              <div className={styles.cardTop}>
                <span className={styles.cardNum}>{b.num}</span>
                <span className={styles.cardTag}>{b.tag}</span>
              </div>
              <h3 className={styles.cardTitle}>{b.title}</h3>
              <p className={styles.cardDesc}>{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
