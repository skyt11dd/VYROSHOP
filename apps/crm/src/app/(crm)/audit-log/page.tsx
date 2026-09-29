'use client';
import { useEffect, useState } from 'react';
import { crmApi } from '@/lib/api';

export default function AuditLogPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    crmApi.getAuditLog({ page: String(page) })
      .then(r => { setLogs(r.logs); setTotal(r.total); })
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800 }}>Audit Log</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>{total} записів</p>
      </div>
      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Час</th>
              <th>Користувач</th>
              <th>Дія</th>
              <th>Обʼєкт</th>
              <th>ID</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: 10 }).map((_, i) => <tr key={i}>{Array.from({ length: 5 }).map((_, j) => <td key={j}><div className="skeleton" style={{ height: 14 }} /></td>)}</tr>)
              : logs.map(l => (
                <tr key={l.id}>
                  <td style={{ fontSize: 12, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{new Date(l.createdAt).toLocaleString('uk-UA')}</td>
                  <td style={{ fontSize: 12 }}>{l.user}</td>
                  <td><code style={{ fontSize: 11, background: 'var(--surface-2)', padding: '2px 8px', borderRadius: 4 }}>{l.action}</code></td>
                  <td style={{ fontSize: 13 }}>{l.entity}</td>
                  <td style={{ fontSize: 11, color: 'var(--text-muted)', maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis' }}>{l.entityId}</td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
      {total > 50 && (
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 20, alignItems: 'center' }}>
          <button className="btn btn-outline" disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Назад</button>
          <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{page} / {Math.ceil(total / 50)}</span>
          <button className="btn btn-outline" disabled={page >= Math.ceil(total / 50)} onClick={() => setPage(p => p + 1)}>Далі →</button>
        </div>
      )}
    </div>
  );
}
