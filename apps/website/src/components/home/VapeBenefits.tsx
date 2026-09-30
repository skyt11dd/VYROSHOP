import styles from './VapeBenefits.module.css';

const benefits = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="m9 12 2 2 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: '100% Оригінальна продукція',
    desc: 'Захисні скретч-коди та офіційна перевірка виробника',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'Швидка відправка',
    desc: 'Замовлення до 17:00 відправляємо у той самий день',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'Підбір та консультація',
    desc: 'Допоможемо обрати пристрій, картриджі та улюблений смак',
  },
];

export function VapeBenefits() {
  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.grid}>
          {benefits.map((b, i) => (
            <div key={i} className={`${styles.item} animate-slide-up delay-${(i + 3) * 75}`}>
              <div className={styles.iconWrap}>{b.icon}</div>
              <div className={styles.info}>
                <h4 className={styles.title}>{b.title}</h4>
                <p className={styles.desc}>{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
