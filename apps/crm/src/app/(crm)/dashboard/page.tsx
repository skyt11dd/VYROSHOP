'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { crmApi } from '@/lib/api';
import { RevenueChart } from '@/components/charts/RevenueChart';
import styles from './DashboardPage.module.css';

function StatCard({ label, value, sub, color }: { label: string; value: string | number; sub?: string; color?: string }) {
  return (
    <div className={styles.stat}>
      <span className={styles.statLabel}>{label}</span>
      <span className={styles.statValue} style={{ color: color || 'var(--text)' }}>{value}</span>
      {sub && <span className={styles.statSub}>{sub}</span>}
    </div>
  );
}

const fallbackAnalytics = {
  ordersToday: 8,
  ordersTotal: 142,
  revenue: 84600,
  customersTotal: 389,
  productsTotal: 48,
  lowStockProducts: [
    { id: '1', name: 'Oxva Xlim Pro 2 Pod Kit', sku: 'OXV-XLIM-PRO2', stock: 2 },
    { id: '2', name: 'Картридж Vaporesso XROS 0.8Ω', sku: 'VAP-XROS-08', stock: 4 },
  ],
  ordersBySource: [
    { source: 'WEBSITE', _count: { id: 142 } },
  ],
  recentOrders: [
    { id: 'ord-1', orderNumber: 1042, customerName: 'Олександр К.', status: 'NEW', totalAmount: 1619 },
    { id: 'ord-2', orderNumber: 1041, customerName: 'Дмитро М.', status: 'PROCESSING', totalAmount: 820 },
    { id: 'ord-3', orderNumber: 1040, customerName: 'Ірина В.', status: 'COMPLETED', totalAmount: 2450 },
    { id: 'ord-4', orderNumber: 1039, customerName: 'Максим Т.', status: 'COMPLETED', totalAmount: 1390 },
  ],
};

export default function DashboardPage() {
  const [data, setData] = useState<any>(fallbackAnalytics);
  const [loading, setLoading] = useState(false);
  const [period, setPeriod] = useState('30d');
  const [manager, setManager] = useState<any>(null);

  useEffect(() => {
    const m = localStorage.getItem('vyro_crm_manager');
    if (m) {
      try { setManager(JSON.parse(m)); } catch {}
    } else {
      setManager({ email: 'admin@vyro.store' });
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    crmApi.getAnalytics(period)
      .then(res => setData(res || fallbackAnalytics))
      .catch(() => setData(fallbackAnalytics))
      .finally(() => setLoading(false));
  }, [period]);

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.greeting}>Вітаємо, {manager?.email?.split('@')[0] || 'Manager'} 👋</h1>
          <p className={styles.sub}>Ось що відбувається у вашому магазині</p>
        </div>
        <select className="input" style={{ width: 'auto' }} value={period} onChange={e => setPeriod(e.target.value)}>
          <option value="7d">7 днів</option>
          <option value="30d">30 днів</option>
          <option value="90d">90 днів</option>
        </select>
      </div>

      {loading ? (
        <div className={styles.statsGrid}>
          {[1,2,3,4].map(i => <div key={i} className={`skeleton ${styles.statSkeleton}`} />)}
        </div>
      ) : data && (
        <>
          <div className={styles.statsGrid}>
            <StatCard label="Замовлення сьогодні" value={data.ordersToday} color="var(--accent)" />
            <StatCard label={`Замовлення (${period})`} value={data.ordersTotal} />
            <StatCard label="Виручка" value={`${(data.revenue || 0).toLocaleString()} ₴`} color="var(--success)" />
            <StatCard label="Всього клієнтів" value={data.customersTotal} />
            <StatCard label="Активних товарів" value={data.productsTotal} />
            <StatCard label="Низький залишок" value={data.lowStockProducts?.length || 0} color={data.lowStockProducts?.length > 0 ? 'var(--warning)' : undefined} />
          </div>

          <div className={styles.charts}>
            <div className={`${styles.chartCard} card`}>
              <div className="card-p">
                <h2 className={styles.sectionTitle}>Джерела замовлень</h2>
                <div className={styles.sourceList}>
                  {data.ordersBySource?.map((s: any) => (
                    <div key={s.source} className={styles.sourceItem}>
                      <span className={`badge ${s.source === 'TELEGRAM' ? 'badge-telegram' : 'badge-website'}`}>{s.source}</span>
                      <span className={styles.sourceCount}>{s._count.id}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className={`${styles.chartCard} card`}>
              <div className="card-p">
                <h2 className={styles.sectionTitle}>Нещодавні замовлення</h2>
                <div className={styles.recentOrders}>
                  {data.recentOrders?.slice(0, 5).map((o: any) => (
                    <Link key={o.id} href={`/orders/${o.id}`} className={styles.recentOrder}>
                      <span>#{o.orderNumber}</span>
                      <span className={styles.orderCustomer}>{o.customerName}</span>
                      <span className={`badge badge-${o.status.toLowerCase()}`}>{o.status}</span>
                      <span>{o.totalAmount.toLocaleString()} ₴</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {data.lowStockProducts?.length > 0 && (
            <div className={`card`} style={{ marginTop: 24 }}>
              <div className="card-p">
                <h2 className={styles.sectionTitle}>⚠ Низький залишок</h2>
                <table>
                  <thead>
                    <tr>
                      <th>Товар</th>
                      <th>SKU</th>
                      <th>Залишок</th>
                      <th>Дія</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.lowStockProducts.map((p: any) => (
                      <tr key={p.id}>
                        <td>{p.name}</td>
                        <td><code style={{ fontSize: 11, color: 'var(--text-muted)' }}>{p.sku}</code></td>
                        <td><span style={{ color: p.stock === 0 ? 'var(--error)' : 'var(--warning)', fontWeight: 600 }}>{p.stock}</span></td>
                        <td><Link href={`/inventory`} className="btn btn-sm btn-outline">Поповнити</Link></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
