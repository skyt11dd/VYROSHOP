import Link from 'next/link';
import styles from './CategoriesSection.module.css';

const categoriesList = [
  {
    num: '01',
    slug: 'pods',
    title: 'POD-системи',
    tag: 'Багаторазові девайси',
    desc: 'Оригінальні пристрої брендів Vaporesso, OXVA, Voopoo, Lost Vape, Geekvape.',
    specs: ['Швидка зарядка Type-C', 'Регулювання затяжки', 'Захист від протікань'],
  },
  {
    num: '02',
    slug: 'liquids',
    title: 'Сольові рідини',
    tag: 'Salt нікотин 25–50 мг',
    desc: 'Топові мікси від Chaser, Octobar, Hype, Alchemist, Flavorlab з насиченим смаком.',
    specs: ['Ягідні та холодні мікси', 'М’який нікотин', 'Оригінальні компоненти'],
  },
  {
    num: '03',
    slug: 'disposables',
    title: 'Одноразки',
    tag: 'Автономні пристрої',
    desc: 'Elf Bar, Lost Mary, Vozol, HQD — новітні серії до 25 000 затяжок з дисплеями.',
    specs: ['Без обслуговування', 'Індикатор рідини', 'Максимальна кількість тяг'],
  },
  {
    num: '04',
    slug: 'cartridges',
    title: 'Картриджі та випарники',
    tag: 'Фірмові розхідники',
    desc: 'Оригінальні картриджі Corex 2.0, Ursa, Xlim з різним опором для вашого девайса.',
    specs: ['Сітка Mesh Coil', 'Чиста передача смаку', 'Гарантована герметичність'],
  },
];

export function CategoriesSection({ categories }: { categories?: any[] }) {
  return (
    <section id="categories" className={styles.section}>
      <div className="container">
        {/* Section Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <span className={styles.sectionTag}>НАВІГАЦІЯ ПО МАГАЗИНУ</span>
            <h2 className={styles.sectionTitle}>Основні напрямки</h2>
          </div>
          <p className={styles.headerDesc}>
            Оберіть необхідний розділ для швидкого підбору оригінальних девайсів, рідин чи змінних елементів.
          </p>
        </div>

        {/* Categories Grid */}
        <div className={styles.grid}>
          {categoriesList.map((cat) => (
            <Link key={cat.slug} href={`/shop?category=${cat.slug}`} className={styles.card}>
              <div className={styles.cardTop}>
                <span className={styles.num}>{cat.num}</span>
                <span className={styles.badge}>{cat.tag}</span>
              </div>

              <div className={styles.cardBody}>
                <h3 className={styles.cardTitle}>{cat.title}</h3>
                <p className={styles.cardDesc}>{cat.desc}</p>

                <ul className={styles.specsList}>
                  {cat.specs.map((s, idx) => (
                    <li key={idx} className={styles.specItem}>
                      <span className={styles.specCheck}>✓</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className={styles.cardFooter}>
                <span className={styles.footerLink}>Переглянути каталог</span>
                <span className={styles.arrowIcon}>→</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
