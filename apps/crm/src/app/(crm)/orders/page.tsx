'use client';
import { useEffect, useState } from 'react';
import { crmApi } from '@/lib/api';
import styles from './OrdersPage.module.css';

const STATUS_OPTIONS = ['', 'NEW', 'PROCESSING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'];
const STATUS_LABELS: Record<string, string> = {
  NEW: 'Нове', PROCESSING: 'В обробці', CONFIRMED: 'Підтверджено', COMPLETED: 'Виконано', CANCELLED: 'Скасовано',
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [source, setSource] = useState('');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<any>(null);

  const load = () => {
    setLoading(true);
    const params: Record<string, string> = { page: String(page), limit: '20' };
    if (status) params.status = status;
    if (source) params.source = source;
    crmApi.getOrders(params).then(r => { setOrders(r.orders); setTotal(r.total); }).finally(() => setLoading(false));
  };

  useEffect(load, [status, source, page]);

  const updateStatus = async (id: string, newStatus: string) => {
    await crmApi.updateOrder(id, { status: newStatus });
    load();
    if (selected?.id === id) setSelected((prev: any) => ({ ...prev, status: newStatus }));
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1>Замовлення</h1>
          <p>{total} замовлень</p>
        </div>
      </div>

      <div className={styles.filters}>
        <select className="input" value={status} onChange={e => { setStatus(e.target.value); setPage(1); }} style={{ width: 'auto' }}>
          <option value="">Всі статуси</option>
          {STATUS_OPTIONS.filter(Boolean).map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
        </select>
        <select className="input" value={source} onChange={e => { setSource(e.target.value); setPage(1); }} style={{ width: 'auto' }}>
          <option value="">Всі джерела</option>
          <option value="WEBSITE">Website</option>
          <option value="TELEGRAM">Telegram</option>
        </select>
      </div>

      <div className={`card ${styles.tableCard}`}>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Клієнт</th>
              <th>Дата</th>
              <th>Джерело</th>
              <th>Сума</th>
              <th>Статус</th>
              <th>Дія</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: 8 }).map((_, i) => <tr key={i}>{Array.from({ length: 7 }).map((_, j) => <td key={j}><div className="skeleton" style={{ height: 14 }} /></td>)}</tr>)
              : orders.map(o => (
                <tr key={o.id} onClick={() => setSelected(o)} style={{ cursor: 'pointer' }}>
                  <td><strong>#{o.orderNumber}</strong></td>
                  <td>
                    <div>{o.customerName}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{o.customerPhone}</div>
                  </td>
                  <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{new Date(o.createdAt).toLocaleString('uk-UA', { dateStyle: 'short', timeStyle: 'short' })}</td>
                  <td><span className={`badge badge-${o.source.toLowerCase()}`}>{o.source}</span></td>
                  <td><strong>{o.totalAmount.toLocaleString()} ₴</strong></td>
                  <td><span className={`badge badge-${o.status.toLowerCase()}`}>{STATUS_LABELS[o.status]}</span></td>
                  <td onClick={e => e.stopPropagation()}>
                    <select
                      className="input" style={{ width: 'auto', padding: '5px 10px', fontSize: 12 }}
                      value={o.status}
                      onChange={e => updateStatus(o.id, e.target.value)}
                    >
                      {STATUS_OPTIONS.filter(Boolean).map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                    </select>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>

      {total > 20 && (
        <div className={styles.pagination}>
          <button className="btn btn-outline" disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Назад</button>
          <span>{page} / {Math.ceil(total / 20)}</span>
          <button className="btn btn-outline" disabled={page >= Math.ceil(total / 20)} onClick={() => setPage(p => p + 1)}>Далі →</button>
        </div>
      )}

      {/* Order detail drawer */}
      {selected && (
        <div className={styles.drawer} onClick={() => setSelected(null)}>
          <div className={styles.drawerContent} onClick={e => e.stopPropagation()}>
            <div className={styles.drawerHeader}>
              <h2>Замовлення #{selected.orderNumber}</h2>
              <button className="btn btn-ghost btn-icon" onClick={() => setSelected(null)}>✕</button>
            </div>
            <div className={styles.drawerBody}>
              <div className={styles.drawerSection}>
                <h3>Клієнт</h3>
                <p>{selected.customerName}</p>
                <p>{selected.customerPhone}</p>
                <p>{selected.customerCity}</p>
              </div>
              <div className={styles.drawerSection}>
                <h3>Товари</h3>
                {selected.items?.map((item: any) => (
                  <div key={item.id} className={styles.drawerItem}>
                    <span>{item.product?.name}</span>
                    <span>×{item.quantity}</span>
                    <span>{(item.price * item.quantity).toLocaleString()} ₴</span>
                  </div>
                ))}
              </div>
              {selected.comment && (
                <div className={styles.drawerSection}>
                  <h3>Коментар</h3>
                  <p style={{ color: 'var(--text-secondary)' }}>{selected.comment}</p>
                </div>
              )}
              <div className={styles.drawerTotal}>
                <span>Загальна сума</span>
                <strong>{selected.totalAmount?.toLocaleString()} ₴</strong>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
