'use client';
import { useState, useEffect } from 'react';
import { crmApi } from '@/lib/api';

const defaultVapeCategories = [
  { id: 'cat-pods', name: 'POD-системи', slug: 'pods', description: 'Багаторазові POD-системи провідних брендів', _count: { products: 36 } },
  { id: 'cat-liquids', name: 'Сольові рідини', slug: 'liquids', description: 'Преміальні сольові рідини 25 мг / 50 мг', _count: { products: 140 } },
  { id: 'cat-disposables', name: 'Одноразки', slug: 'disposables', description: 'Одноразові електронні сигарети до 25 000 затяжок', _count: { products: 52 } },
  { id: 'cat-cartridges', name: 'Картриджі', slug: 'cartridges', description: 'Змінні випарники та картриджі для POD-систем', _count: { products: 68 } },
];

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>(defaultVapeCategories);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);

  const [form, setForm] = useState({ name: '', slug: '', description: '' });

  const load = () => {
    setLoading(true);
    crmApi.getCategories()
      .then(r => {
        if (r?.categories?.length) {
          setCategories(r.categories);
        } else {
          setCategories(defaultVapeCategories);
        }
      })
      .catch(() => setCategories(defaultVapeCategories))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const autoSlug = (name: string) =>
    name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .trim()
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

  const openNew = () => {
    setEditing(null);
    setForm({ name: '', slug: '', description: '' });
    setModalOpen(true);
  };

  const openEdit = (cat: any) => {
    setEditing(cat);
    setForm({
      name: cat.name || '',
      slug: cat.slug || '',
      description: cat.description || '',
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.name) return;
    const slug = form.slug || autoSlug(form.name) || `cat-${Date.now()}`;

    try {
      if (editing?.id) {
        await crmApi.updateCategory(editing.id, { ...form, slug });
      } else {
        await crmApi.createCategory({ ...form, slug });
      }
    } catch {
      // Local fallback
      if (editing?.id) {
        setCategories(prev => prev.map(c => c.id === editing.id ? { ...c, ...form, slug } : c));
      } else {
        setCategories(prev => [...prev, { id: `cat-${Date.now()}`, ...form, slug, _count: { products: 0 } }]);
      }
    }
    setModalOpen(false);
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Видалити цю категорію?')) return;
    try {
      await crmApi.deleteCategory(id);
    } catch {
      setCategories(prev => prev.filter(c => c.id !== id));
    }
    load();
  };

  return (
    <div style={{ padding: '0 0 40px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800 }}>Категорії товарів</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 4 }}>
            Керування структурою та розділами вейп-шопу VYRO
          </p>
        </div>
        <button className="btn btn-primary" onClick={openNew}>
          + Додати категорію
        </button>
      </div>

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Назва категорії</th>
              <th>Slug</th>
              <th>Опис</th>
              <th>Товарів</th>
              <th style={{ textAlign: 'right' }}>Дії</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(c => (
              <tr key={c.id}>
                <td>
                  <span style={{ fontWeight: 600, fontSize: 14 }}>{c.name}</span>
                </td>
                <td>
                  <code style={{ fontSize: 11, background: '#f4f4f5', padding: '2px 6px', borderRadius: 4 }}>
                    {c.slug}
                  </code>
                </td>
                <td style={{ color: 'var(--text-secondary)', fontSize: 13, maxWidth: 300 }}>
                  {c.description || '—'}
                </td>
                <td>
                  <span className="badge badge-website">
                    {c._count?.products ?? 0} шт
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                    <button className="btn btn-sm btn-outline" onClick={() => openEdit(c)}>
                      ✎ Редагувати
                    </button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(c.id)}>
                      ✕
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 3000,
            background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
          onClick={() => setModalOpen(false)}
        >
          <div
            style={{
              width: 480, background: '#ffffff', borderRadius: 12,
              padding: 24, boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            }}
            onClick={e => e.stopPropagation()}
          >
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>
              {editing ? 'Редагувати категорію' : 'Нова категорія'}
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>
                  Назва категорії *
                </label>
                <input
                  className="input"
                  placeholder="напр. Сольові рідини"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value, slug: f.slug || autoSlug(e.target.value) }))}
                />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>
                  Slug (URL)
                </label>
                <input
                  className="input"
                  placeholder="liquids"
                  value={form.slug}
                  onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
                />
              </div>

              <div>
                <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>
                  Опис
                </label>
                <textarea
                  className="input"
                  rows={3}
                  placeholder="Короткий опис категорії..."
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 24 }}>
              <button className="btn btn-outline" onClick={() => setModalOpen(false)}>
                Скасувати
              </button>
              <button className="btn btn-primary" onClick={handleSave} disabled={!form.name}>
                {editing ? 'Зберегти' : 'Створити'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
