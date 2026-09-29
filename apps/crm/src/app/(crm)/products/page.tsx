'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { crmApi } from '@/lib/api';
import { ProductModal } from '@/components/modals/ProductModal';
import styles from './ProductsPage.module.css';

const statusColors: Record<string, string> = {
  true: 'badge-new',
  false: 'badge-cancelled',
};

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);

  const load = () => {
    setLoading(true);
    crmApi.getProducts({ search, page: String(page), limit: '20' })
      .then(r => { setProducts(r.products); setTotal(r.total); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [search, page]);

  const handleDelete = async (id: string) => {
    if (!confirm('Видалити товар?')) return;
    await crmApi.deleteProduct(id);
    load();
  };

  const handleDuplicate = async (id: string) => {
    await crmApi.duplicateProduct(id);
    load();
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1>Товари</h1>
          <p>{total} товарів</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setEditing(null); setModalOpen(true); }}>
          + Додати товар
        </button>
      </div>

      <div className={styles.toolbar}>
        <input
          className="input"
          placeholder="Пошук товарів або SKU..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          style={{ maxWidth: 320 }}
        />
      </div>

      <div className={`card ${styles.tableCard}`}>
        <table>
          <thead>
            <tr>
              <th>Товар</th>
              <th>SKU</th>
              <th>Ціна</th>
              <th>Залишок</th>
              <th>Статус</th>
              <th>Оновлено</th>
              <th>Дії</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <tr key={i}>
                  {Array.from({ length: 7 }).map((_, j) => (
                    <td key={j}><div className="skeleton" style={{ height: 16 }} /></td>
                  ))}
                </tr>
              ))
            ) : products.map(p => (
              <tr key={p.id}>
                <td>
                  <div className={styles.productCell}>
                    <div className={styles.thumb}>
                      {p.images?.[0] ? (
                        <Image src={p.images[0].url} alt={p.name} fill style={{ objectFit: 'cover' }} />
                      ) : <div className={styles.noThumb} />}
                    </div>
                    <div>
                      <div className={styles.productName}>{p.name}</div>
                      <div className={styles.catName}>{p.category?.name}</div>
                    </div>
                  </div>
                </td>
                <td><code style={{ fontSize: 11 }}>{p.sku}</code></td>
                <td>
                  <div>{p.price.toLocaleString()} ₴</div>
                  {p.oldPrice && <div style={{ fontSize: 11, color: 'var(--text-muted)', textDecoration: 'line-through' }}>{p.oldPrice.toLocaleString()} ₴</div>}
                </td>
                <td>
                  <span style={{ fontWeight: 600, color: p.stock === 0 ? 'var(--error)' : p.stock <= 5 ? 'var(--warning)' : 'var(--success)' }}>
                    {p.stock}
                  </span>
                </td>
                <td><span className={`badge ${p.active ? 'badge-completed' : 'badge-cancelled'}`}>{p.active ? 'Активний' : 'Неактивний'}</span></td>
                <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>{new Date(p.updatedAt).toLocaleDateString('uk-UA')}</td>
                <td>
                  <div className={styles.actions}>
                    <button className="btn btn-sm btn-outline" onClick={() => { setEditing(p); setModalOpen(true); }}>✎</button>
                    <button className="btn btn-sm btn-outline" onClick={() => handleDuplicate(p.id)}>⬡</button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(p.id)}>✕</button>
                  </div>
                </td>
              </tr>
            ))}
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

      <ProductModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        product={editing}
        onSave={() => { setModalOpen(false); load(); }}
      />
    </div>
  );
}
