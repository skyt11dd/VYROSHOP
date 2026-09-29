'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { crmApi } from '@/lib/api';
import { ProductModal } from '@/components/modals/ProductModal';
import styles from './ProductsPage.module.css';

const defaultVapeProducts = [
  {
    id: 'prod-1',
    name: 'Vaporesso XROS 4 Pod Kit',
    sku: 'VAP-XROS4-BLK',
    slug: 'vaporesso-xros-4',
    price: 1299,
    oldPrice: 1450,
    stock: 12,
    active: true,
    featured: true,
    popular: true,
    isNew: true,
    updatedAt: new Date().toISOString(),
    images: [{ url: '/logo.png', isMain: true }],
    category: { id: 'cat-pods', name: 'POD-системи' },
    shortDescription: '1000 mAh, 3 режими потужності, швидка зарядка Type-C',
  },
  {
    id: 'prod-2',
    name: 'Chaser Lux Salt 30ml (50 мг)',
    sku: 'CH-LUX-50MG',
    slug: 'chaser-lux-salt-30ml',
    price: 320,
    oldPrice: 360,
    stock: 54,
    active: true,
    featured: true,
    popular: true,
    isNew: false,
    updatedAt: new Date().toISOString(),
    images: [{ url: '/logo.png', isMain: true }],
    category: { id: 'cat-liquids', name: 'Сольові рідини' },
    shortDescription: 'Преміальна сольова рідина, ягідні та холодні мікси',
  },
  {
    id: 'prod-3',
    name: 'Oxva Xlim Pro 2 Pod Kit',
    sku: 'OXV-XLIM-PRO2',
    slug: 'oxva-xlim-pro-2',
    price: 1390,
    oldPrice: 1550,
    stock: 9,
    active: true,
    featured: true,
    popular: true,
    isNew: true,
    updatedAt: new Date().toISOString(),
    images: [{ url: '/logo.png', isMain: true }],
    category: { id: 'cat-pods', name: 'POD-системи' },
    shortDescription: '1300 mAh, кольоровий HD дисплей 0.56", 30W',
  },
  {
    id: 'prod-4',
    name: 'Elf Bar GH23000 Puffs Ice',
    sku: 'ELF-GH23K-ICE',
    slug: 'elf-bar-gh23000',
    price: 690,
    oldPrice: 790,
    stock: 22,
    active: true,
    featured: true,
    popular: false,
    isNew: false,
    updatedAt: new Date().toISOString(),
    images: [{ url: '/logo.png', isMain: true }],
    category: { id: 'cat-disposables', name: 'Одноразки' },
    shortDescription: '23 000 затяжок, цифровий екран, регулювання потужності',
  },
  {
    id: 'prod-5',
    name: 'Картридж Vaporesso XROS 0.8Ω (4 шт)',
    sku: 'VAP-XROS-08-4PK',
    slug: 'cartridge-xros-mesh-08',
    price: 480,
    oldPrice: 520,
    stock: 40,
    active: true,
    featured: true,
    popular: true,
    isNew: false,
    updatedAt: new Date().toISOString(),
    images: [{ url: '/logo.png', isMain: true }],
    category: { id: 'cat-cartridges', name: 'Картриджі' },
    shortDescription: 'Оригінальні картриджі Corex 2.0 із захистом від протікань',
  },
];

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>(defaultVapeProducts);
  const [total, setTotal] = useState(defaultVapeProducts.length);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);

  const load = () => {
    setLoading(true);
    const params: Record<string, string> = { page: String(page), limit: '20' };
    if (search) params.search = search;
    if (categoryFilter) params.category = categoryFilter;

    crmApi.getProducts(params)
      .then(r => {
        if (r?.products?.length) {
          setProducts(r.products);
          setTotal(r.total || r.products.length);
        } else if (!search && !categoryFilter) {
          setProducts(defaultVapeProducts);
          setTotal(defaultVapeProducts.length);
        } else {
          setProducts([]);
          setTotal(0);
        }
      })
      .catch(() => {
        // Fallback filter
        let filtered = [...defaultVapeProducts];
        if (search) {
          const s = search.toLowerCase();
          filtered = filtered.filter(p => p.name.toLowerCase().includes(s) || p.sku.toLowerCase().includes(s));
        }
        if (categoryFilter) {
          filtered = filtered.filter(p => p.category?.name === categoryFilter || p.category?.id === categoryFilter);
        }
        setProducts(filtered);
        setTotal(filtered.length);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [search, categoryFilter, page]);

  const handleDelete = async (id: string) => {
    if (!confirm('Видалити цей товар?')) return;
    try {
      await crmApi.deleteProduct(id);
    } catch {
      // Local removal
      setProducts(prev => prev.filter(p => p.id !== id));
      setTotal(t => Math.max(0, t - 1));
    }
    load();
  };

  const handleDuplicate = async (id: string) => {
    try {
      await crmApi.duplicateProduct(id);
    } catch {
      const target = products.find(p => p.id === id);
      if (target) {
        const copy = {
          ...target,
          id: `copy-${Date.now()}`,
          name: `${target.name} (Копія)`,
          sku: `${target.sku}-COPY`,
        };
        setProducts(prev => [copy, ...prev]);
        setTotal(t => t + 1);
      }
    }
    load();
  };

  return (
    <div className={styles.page}>
      {/* Top Header */}
      <div className={styles.header}>
        <div>
          <h1>Товари</h1>
          <p>{total} позицій в каталозі VYRO</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => { setEditing(null); setModalOpen(true); }}
        >
          + Додати новий товар
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className={styles.toolbar}>
        <input
          className="input"
          placeholder="Пошук за назвою або SKU..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          style={{ maxWidth: 300 }}
        />

        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {['', 'POD-системи', 'Сольові рідини', 'Одноразки', 'Картриджі'].map(cat => (
            <button
              key={cat}
              className={`btn btn-sm ${categoryFilter === cat ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => { setCategoryFilter(cat); setPage(1); }}
            >
              {cat || 'Всі категорії'}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table */}
      <div className={`card ${styles.tableCard}`}>
        <table>
          <thead>
            <tr>
              <th>Товар</th>
              <th>SKU</th>
              <th>Ціна</th>
              <th>Залишок</th>
              <th>Фото</th>
              <th>Статус</th>
              <th>Оновлено</th>
              <th style={{ textAlign: 'right' }}>Дії</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  {Array.from({ length: 8 }).map((_, j) => (
                    <td key={j}><div className="skeleton" style={{ height: 16 }} /></td>
                  ))}
                </tr>
              ))
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-muted)' }}>
                  Товарів за вашим запитом не знайдено
                </td>
              </tr>
            ) : (
              products.map(p => {
                const photosCount = Array.isArray(p.images) ? p.images.length : (p.images ? 1 : 0);
                const firstThumb = p.images?.[0]?.url || (typeof p.images?.[0] === 'string' ? p.images[0] : null);

                return (
                  <tr key={p.id}>
                    <td>
                      <div className={styles.productCell}>
                        <div className={styles.thumb}>
                          {firstThumb ? (
                            <img src={firstThumb} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                          ) : (
                            <div className={styles.noThumb}>VAPE</div>
                          )}
                        </div>
                        <div>
                          <div className={styles.productName}>{p.name}</div>
                          <div className={styles.catName}>{p.category?.name || 'Без категорії'}</div>
                        </div>
                      </div>
                    </td>
                    <td><code style={{ fontSize: 11, background: '#f4f4f5', padding: '2px 5px', borderRadius: 3 }}>{p.sku}</code></td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{p.price?.toLocaleString()} ₴</div>
                      {p.oldPrice && (
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                          {p.oldPrice?.toLocaleString()} ₴
                        </div>
                      )}
                    </td>
                    <td>
                      <span style={{ fontWeight: 700, color: p.stock === 0 ? 'var(--error)' : p.stock <= 5 ? 'var(--warning)' : 'var(--success)' }}>
                        {p.stock} шт
                      </span>
                    </td>
                    <td>
                      <span className="badge" style={{ background: '#f4f4f5', color: '#52525b', border: '1px solid #e4e4e7' }}>
                        📷 {photosCount}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${p.active ? 'badge-completed' : 'badge-cancelled'}`}>
                        {p.active ? 'Активний' : 'Прихований'}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>
                      {p.updatedAt ? new Date(p.updatedAt).toLocaleDateString('uk-UA') : '—'}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div className={styles.actions} style={{ justifyContent: 'flex-end' }}>
                        <button
                          className="btn btn-sm btn-outline"
                          onClick={() => { setEditing(p); setModalOpen(true); }}
                          title="Редагувати"
                        >
                          ✎ Редагувати
                        </button>
                        <button
                          className="btn btn-sm btn-outline"
                          onClick={() => handleDuplicate(p.id)}
                          title="Копіювати"
                        >
                          ⬡
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(p.id)}
                          title="Видалити"
                        >
                          ✕
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {total > 20 && (
        <div className={styles.pagination}>
          <button className="btn btn-outline" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
            ← Назад
          </button>
          <span>{page} / {Math.ceil(total / 20)}</span>
          <button className="btn btn-outline" disabled={page >= Math.ceil(total / 20)} onClick={() => setPage(p => p + 1)}>
            Далі →
          </button>
        </div>
      )}

      {/* Product Edit / Create Modal */}
      <ProductModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        product={editing}
        onSave={() => { setModalOpen(false); load(); }}
      />
    </div>
  );
}
