'use client';
import { useEffect, useState } from 'react';
import { crmApi } from '@/lib/api';

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    crmApi.getCustomers({ search, page: String(page), limit: '20' })
      .then(r => { setCustomers(r.customers); setTotal(r.total); })
      .finally(() => setLoading(false));
  }, [search, page]);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800 }}>Клієнти</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>{total} клієнтів</p>
        </div>
      </div>
      <div style={{ marginBottom: 16 }}>
        <input className="input" placeholder="Пошук по імені, email, телефону..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} style={{ maxWidth: 320 }} />
      </div>
      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Клієнт</th>
              <th>Телефон</th>
              <th>Telegram</th>
              <th>Замовлень</th>
              <th>Сума</th>
              <th>Реєстрація</th>
              <th>Активність</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: 8 }).map((_, i) => <tr key={i}>{Array.from({ length: 7 }).map((_, j) => <td key={j}><div className="skeleton" style={{ height: 14 }} /></td>)}</tr>)
              : customers.map(c => (
                <tr key={c.id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{c.firstName} {c.lastName}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{c.email}</div>
                  </td>
                  <td style={{ fontSize: 13 }}>{c.phone || '—'}</td>
                  <td style={{ fontSize: 13 }}>{c.telegramId ? `@tg:${c.telegramId}` : '—'}</td>
                  <td><strong>{c.ordersCount}</strong></td>
                  <td><strong>{(c.totalSpent || 0).toLocaleString()} ₴</strong></td>
                  <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{new Date(c.createdAt).toLocaleDateString('uk-UA')}</td>
                  <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{new Date(c.lastActivityAt).toLocaleDateString('uk-UA')}</td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
      {total > 20 && (
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 20, alignItems: 'center' }}>
          <button className="btn btn-outline" disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Назад</button>
          <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{page} / {Math.ceil(total / 20)}</span>
          <button className="btn btn-outline" disabled={page >= Math.ceil(total / 20)} onClick={() => setPage(p => p + 1)}>Далі →</button>
        </div>
      )}
    </div>
  );
}
