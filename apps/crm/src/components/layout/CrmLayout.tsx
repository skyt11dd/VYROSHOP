'use client';
import { ReactNode, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import styles from './CrmLayout.module.css';

const nav = [
  { section: '', items: [{ href: '/dashboard', icon: '⬛', label: 'Dashboard' }] },
  {
    section: 'Каталог',
    items: [
      { href: '/products', icon: '📦', label: 'Товари' },
      { href: '/categories', icon: '📁', label: 'Категорії' },
      { href: '/brands', icon: '🏷', label: 'Бренди' },
      { href: '/inventory', icon: '🗄', label: 'Залишки' },
    ]
  },
  {
    section: 'Продажі',
    items: [
      { href: '/orders', icon: '🧾', label: 'Замовлення' },
      { href: '/customers', icon: '👥', label: 'Клієнти' },
    ]
  },
  {
    section: 'Система',
    items: [
      { href: '/analytics', icon: '📊', label: 'Аналітика' },
      { href: '/notifications', icon: '🔔', label: 'Сповіщення' },
      { href: '/managers', icon: '👤', label: 'Менеджери' },
      { href: '/audit-log', icon: '📋', label: 'Audit Log' },
      { href: '/settings', icon: '⚙️', label: 'Налаштування' },
    ]
  },
];

export function CrmLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [manager, setManager] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('vyro_crm_token');
    if (!token) { router.push('/login'); return; }
    const m = localStorage.getItem('vyro_crm_manager');
    if (m) setManager(JSON.parse(m));
  }, [router]);

  const logout = () => {
    localStorage.removeItem('vyro_crm_token');
    localStorage.removeItem('vyro_crm_manager');
    router.push('/login');
  };

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <Link href="/dashboard" className={styles.logo}>VYRO</Link>
          <span className={styles.crmLabel}>CRM</span>
        </div>
        <nav className={styles.nav}>
          {nav.map(group => (
            <div key={group.section} className={styles.group}>
              {group.section && <span className={styles.groupLabel}>{group.section}</span>}
              {group.items.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`${styles.navItem} ${pathname === item.href ? styles.active : ''}`}
                >
                  <span className={styles.navIcon}>{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </div>
          ))}
        </nav>
        <div className={styles.sidebarBottom}>
          {manager && (
            <div className={styles.managerInfo}>
              <div className={styles.avatar}>{manager.email?.[0]?.toUpperCase()}</div>
              <div className={styles.managerDetails}>
                <span className={styles.managerEmail}>{manager.email}</span>
                <span className={styles.managerRole}>{manager.role}</span>
              </div>
            </div>
          )}
          <button onClick={logout} className="btn btn-ghost btn-sm" style={{ width: '100%', justifyContent: 'flex-start' }}>
            → Вийти
          </button>
        </div>
      </aside>
      <main className={styles.main}>
        <div className={styles.content}>{children}</div>
      </main>
    </div>
  );
}
