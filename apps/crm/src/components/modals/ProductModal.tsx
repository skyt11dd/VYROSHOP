'use client';
import { useState, useEffect } from 'react';
import { crmApi } from '@/lib/api';
import styles from './ProductModal.module.css';

interface ProductModalProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  product?: any;
}

export function ProductModal({ open, onClose, onSave, product }: ProductModalProps) {
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '', slug: '', sku: '', description: '', shortDescription: '',
    price: '', oldPrice: '', stock: '0',
    categoryId: '', brandId: '',
    active: true, featured: false, popular: false, isNew: false,
  });

  useEffect(() => {
    crmApi.getCategories().then(r => setCategories(r.categories));
    crmApi.getBrands().then(r => setBrands(r.brands));
  }, []);

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || '',
        slug: product.slug || '',
        sku: product.sku || '',
        description: product.description || '',
        shortDescription: product.shortDescription || '',
        price: String(product.price || ''),
        oldPrice: String(product.oldPrice || ''),
        stock: String(product.stock || 0),
        categoryId: product.categoryId || '',
        brandId: product.brandId || '',
        active: product.active ?? true,
        featured: product.featured ?? false,
        popular: product.popular ?? false,
        isNew: product.isNew ?? false,
      });
    } else {
      setForm({ name: '', slug: '', sku: '', description: '', shortDescription: '', price: '', oldPrice: '', stock: '0', categoryId: '', brandId: '', active: true, featured: false, popular: false, isNew: false });
    }
  }, [product, open]);

  const autoSlug = (name: string) => name.toLowerCase().replace(/[^a-z0-9а-яёіїє]+/gi, '-').replace(/^-|-$/g, '');

  const handleSave = async () => {
    setSaving(true);
    try {
      const data = {
        ...form,
        price: parseFloat(form.price),
        oldPrice: form.oldPrice ? parseFloat(form.oldPrice) : undefined,
        stock: parseInt(form.stock),
        brandId: form.brandId || undefined,
      };
      if (product) {
        await crmApi.updateProduct(product.id, data);
      } else {
        await crmApi.createProduct(data);
      }
      onSave();
    } catch (e: any) {
      alert(e.message);
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>{product ? 'Редагувати товар' : 'Новий товар'}</h2>
          <button className="btn btn-ghost btn-icon" onClick={onClose}>✕</button>
        </div>
        <div className={styles.body}>
          <div className={styles.section}>
            <h3>Основна інформація</h3>
            <div className={styles.grid2}>
              <div className={styles.field}>
                <label>Назва *</label>
                <input className="input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value, slug: f.slug || autoSlug(e.target.value) }))} />
              </div>
              <div className={styles.field}>
                <label>Slug *</label>
                <input className="input" value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} />
              </div>
            </div>
            <div className={styles.field}>
              <label>SKU *</label>
              <input className="input" value={form.sku} onChange={e => setForm(f => ({ ...f, sku: e.target.value }))} />
            </div>
            <div className={styles.field}>
              <label>Короткий опис</label>
              <input className="input" value={form.shortDescription} onChange={e => setForm(f => ({ ...f, shortDescription: e.target.value }))} />
            </div>
            <div className={styles.field}>
              <label>Опис</label>
              <textarea className="input" rows={4} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
            </div>
          </div>

          <div className={styles.section}>
            <h3>Ціноутворення та залишок</h3>
            <div className={styles.grid3}>
              <div className={styles.field}>
                <label>Ціна *</label>
                <input className="input" type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} />
              </div>
              <div className={styles.field}>
                <label>Стара ціна</label>
                <input className="input" type="number" value={form.oldPrice} onChange={e => setForm(f => ({ ...f, oldPrice: e.target.value }))} />
              </div>
              <div className={styles.field}>
                <label>Залишок</label>
                <input className="input" type="number" min="0" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} />
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <h3>Категорія та бренд</h3>
            <div className={styles.grid2}>
              <div className={styles.field}>
                <label>Категорія *</label>
                <select className="input" value={form.categoryId} onChange={e => setForm(f => ({ ...f, categoryId: e.target.value }))}>
                  <option value="">— Оберіть —</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className={styles.field}>
                <label>Бренд</label>
                <select className="input" value={form.brandId} onChange={e => setForm(f => ({ ...f, brandId: e.target.value }))}>
                  <option value="">— Без бренду —</option>
                  {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <h3>Параметри видимості</h3>
            <div className={styles.toggles}>
              {(['active', 'featured', 'popular', 'isNew'] as const).map(key => (
                <label key={key} className={styles.toggle}>
                  <input type="checkbox" checked={form[key] as boolean} onChange={e => setForm(f => ({ ...f, [key]: e.target.checked }))} />
                  <span>{key === 'active' ? 'Активний' : key === 'featured' ? 'Рекомендований' : key === 'popular' ? 'Популярний' : 'Новинка'}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
        <div className={styles.footer}>
          <button className="btn btn-outline" onClick={onClose}>Скасувати</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving || !form.name || !form.sku || !form.price || !form.categoryId}>
            {saving ? 'Збереження...' : (product ? 'Оновити' : 'Створити')}
          </button>
        </div>
      </div>
    </div>
  );
}
