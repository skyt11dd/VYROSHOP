'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
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

  // Form state
  const [form, setForm] = useState({
    name: '',
    slug: '',
    sku: '',
    description: '',
    shortDescription: '',
    price: '',
    oldPrice: '',
    stock: '0',
    categoryId: '',
    brandId: '',
    active: true,
    featured: false,
    popular: false,
    isNew: false,
  });

  // Multiple photos state
  const [images, setImages] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');

  // Specs state
  const [specs, setSpecs] = useState({
    battery: '',
    coil: '',
    capacity: '',
    nicotine: '',
    puffs: '',
  });

  // Quick category creation
  const [showAddCat, setShowAddCat] = useState(false);
  const [newCatName, setNewCatName] = useState('');

  const loadTaxonomies = () => {
    crmApi.getCategories()
      .then(r => {
        if (r?.categories?.length) {
          setCategories(r.categories);
        } else {
          setCategories([
            { id: 'cat-pods', name: 'POD-системи', slug: 'pods' },
            { id: 'cat-liquids', name: 'Сольові рідини', slug: 'liquids' },
            { id: 'cat-disposables', name: 'Одноразки', slug: 'disposables' },
            { id: 'cat-cartridges', name: 'Картриджі', slug: 'cartridges' },
          ]);
        }
      })
      .catch(() => {
        setCategories([
          { id: 'cat-pods', name: 'POD-системи', slug: 'pods' },
          { id: 'cat-liquids', name: 'Сольові рідини', slug: 'liquids' },
          { id: 'cat-disposables', name: 'Одноразки', slug: 'disposables' },
          { id: 'cat-cartridges', name: 'Картриджі', slug: 'cartridges' },
        ]);
      });

    crmApi.getBrands()
      .then(r => setBrands(r?.brands || []))
      .catch(() => setBrands([]));
  };

  useEffect(() => {
    loadTaxonomies();
  }, [open]);

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
        categoryId: product.categoryId || (product.category?.id || ''),
        brandId: product.brandId || '',
        active: product.active ?? true,
        featured: product.featured ?? false,
        popular: product.popular ?? false,
        isNew: product.isNew ?? false,
      });

      // Populate photos from product
      if (Array.isArray(product.images)) {
        setImages(product.images.map((img: any) => typeof img === 'string' ? img : img.url));
      } else {
        setImages([]);
      }
    } else {
      setForm({
        name: '',
        slug: '',
        sku: '',
        description: '',
        shortDescription: '',
        price: '',
        oldPrice: '',
        stock: '10',
        categoryId: categories[0]?.id || '',
        brandId: '',
        active: true,
        featured: false,
        popular: false,
        isNew: true,
      });
      setImages([]);
    }
  }, [product, open]);

  const autoSlug = (name: string) =>
    name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .trim()
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

  const handleAddPhoto = () => {
    const trimmed = newImageUrl.trim();
    if (!trimmed) return;
    setImages(prev => [...prev, trimmed]);
    setNewImageUrl('');
  };

  const handleRemovePhoto = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSetMainPhoto = (index: number) => {
    if (index === 0) return;
    setImages(prev => {
      const copy = [...prev];
      const [chosen] = copy.splice(index, 1);
      return [chosen, ...copy];
    });
  };

  const handleQuickAddCat = async () => {
    const trimmed = newCatName.trim();
    if (!trimmed) return;
    try {
      const created = await crmApi.createCategory({
        name: trimmed,
        slug: autoSlug(trimmed) || `cat-${Date.now()}`,
      });
      if (created?.category) {
        setCategories(prev => [...prev, created.category]);
        setForm(f => ({ ...f, categoryId: created.category.id }));
      }
    } catch {
      // Local fallback
      const fallbackCat = { id: `cat-${Date.now()}`, name: trimmed, slug: autoSlug(trimmed) };
      setCategories(prev => [...prev, fallbackCat]);
      setForm(f => ({ ...f, categoryId: fallbackCat.id }));
    }
    setNewCatName('');
    setShowAddCat(false);
  };

  const handleSave = async () => {
    if (!form.name || !form.price) {
      alert('Будь ласка, заповніть назву та ціну товару');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...form,
        sku: form.sku || `VYRO-${Date.now().toString().slice(-6)}`,
        slug: form.slug || autoSlug(form.name) || `vape-${Date.now()}`,
        price: parseFloat(form.price) || 0,
        oldPrice: form.oldPrice ? parseFloat(form.oldPrice) : undefined,
        stock: parseInt(form.stock) || 0,
        brandId: form.brandId || undefined,
        images: images.filter(Boolean),
      };

      if (product?.id) {
        await crmApi.updateProduct(product.id, payload);
      } else {
        await crmApi.createProduct(payload);
      }
      onSave();
      onClose();
    } catch (e: any) {
      alert(e.message || 'Помилка збереження');
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <h2>{product ? 'Редагувати товар' : 'Новий товар'}</h2>
          <button className="btn btn-ghost btn-icon" onClick={onClose} aria-label="Закрити">✕</button>
        </div>

        {/* Form Body */}
        <div className={styles.body}>
          {/* 1. Photos Section */}
          <div className={styles.section}>
            <h3>Фотографії товару ({images.length})</h3>
            
            <div className={styles.photoInputRow}>
              <input
                className="input"
                placeholder="Вставте URL зображення (наприклад: https://... або /logo.png)"
                value={newImageUrl}
                onChange={e => setNewImageUrl(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddPhoto(); } }}
              />
              <button type="button" className="btn btn-primary" onClick={handleAddPhoto} style={{ flexShrink: 0 }}>
                + Додати фото
              </button>
            </div>

            {/* Quick preset buttons */}
            <div className={styles.quickPhotosRow}>
              <span className={styles.quickLabel}>Зразки для вейп-шопу:</span>
              <button
                type="button"
                className={styles.quickBtn}
                onClick={() => setImages(prev => [...prev, '/logo.png'])}
              >
                + Фірмовий VYRO Logo
              </button>
              <button
                type="button"
                className={styles.quickBtn}
                onClick={() => setImages(prev => [...prev, 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=500&q=80'])}
              >
                + Е-рідина
              </button>
              <button
                type="button"
                className={styles.quickBtn}
                onClick={() => setImages(prev => [...prev, 'https://images.unsplash.com/photo-1534120247760-c44c3e4a62f1?w=500&q=80'])}
              >
                + Вейп пристрій
              </button>
            </div>

            {/* Photos Preview Grid */}
            {images.length > 0 && (
              <div className={styles.photoGrid}>
                {images.map((url, idx) => (
                  <div key={idx} className={styles.photoCard}>
                    {idx === 0 && <span className={styles.mainBadge}>Головне</span>}
                    <img src={url} alt={`Фото ${idx + 1}`} className={styles.photoThumb} />
                    <div className={styles.photoOverlay}>
                      {idx !== 0 && (
                        <button
                          type="button"
                          className={styles.photoActionBtn}
                          onClick={() => handleSetMainPhoto(idx)}
                        >
                          Зробити головним
                        </button>
                      )}
                      <button
                        type="button"
                        className={styles.photoDeleteBtn}
                        onClick={() => handleRemovePhoto(idx)}
                      >
                        Видалити
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 2. Main Info Section */}
          <div className={styles.section}>
            <h3>Основна інформація</h3>
            <div className={styles.grid2}>
              <div className={styles.field}>
                <label>Назва товару *</label>
                <input
                  className="input"
                  placeholder="напр. Vaporesso XROS 4 Pod Kit"
                  value={form.name}
                  onChange={e => setForm(f => ({
                    ...f,
                    name: e.target.value,
                    slug: f.slug || autoSlug(e.target.value),
                    sku: f.sku || `VYRO-${autoSlug(e.target.value).slice(0, 8).toUpperCase()}`,
                  }))}
                />
              </div>
              <div className={styles.field}>
                <label>Артикул (SKU) *</label>
                <input
                  className="input"
                  placeholder="напр. VAP-XROS4-01"
                  value={form.sku}
                  onChange={e => setForm(f => ({ ...f, sku: e.target.value }))}
                />
              </div>
            </div>

            <div className={styles.field}>
              <label>Slug (URL адреса)</label>
              <input
                className="input"
                placeholder="vaporesso-xros-4"
                value={form.slug}
                onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
              />
            </div>

            <div className={styles.field}>
              <label>Короткий опис (для списку товарів)</label>
              <input
                className="input"
                placeholder="напр. 1000 mAh, 3 режими потужності, швидка зарядка Type-C"
                value={form.shortDescription}
                onChange={e => setForm(f => ({ ...f, shortDescription: e.target.value }))}
              />
            </div>

            <div className={styles.field}>
              <label>Повний опис товару</label>
              <textarea
                className="input"
                rows={4}
                placeholder="Детальний опис товару, смаковий профіль, комплектація, сумісні картриджі..."
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              />
            </div>
          </div>

          {/* 3. Pricing & Stock */}
          <div className={styles.section}>
            <h3>Ціноутворення та наявність</h3>
            <div className={styles.grid3}>
              <div className={styles.field}>
                <label>Ціна (₴) *</label>
                <input
                  className="input"
                  type="number"
                  placeholder="1299"
                  value={form.price}
                  onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                />
              </div>
              <div className={styles.field}>
                <label>Стара ціна (₴)</label>
                <input
                  className="input"
                  type="number"
                  placeholder="1450"
                  value={form.oldPrice}
                  onChange={e => setForm(f => ({ ...f, oldPrice: e.target.value }))}
                />
              </div>
              <div className={styles.field}>
                <label>Кількість на складі (шт)</label>
                <input
                  className="input"
                  type="number"
                  min="0"
                  placeholder="20"
                  value={form.stock}
                  onChange={e => setForm(f => ({ ...f, stock: e.target.value }))}
                />
              </div>
            </div>
          </div>

          {/* 4. Category & Brand */}
          <div className={styles.section}>
            <h3>Категорія та бренд</h3>
            <div className={styles.grid2}>
              <div className={styles.field}>
                <label>Категорія *</label>
                {!showAddCat ? (
                  <div className={styles.catRow}>
                    <select
                      className="input"
                      value={form.categoryId}
                      onChange={e => setForm(f => ({ ...f, categoryId: e.target.value }))}
                    >
                      <option value="">— Оберіть категорію —</option>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <button
                      type="button"
                      className="btn btn-outline"
                      onClick={() => setShowAddCat(true)}
                      title="Створити нову категорію"
                    >
                      +
                    </button>
                  </div>
                ) : (
                  <div className={styles.catRow}>
                    <input
                      className="input"
                      placeholder="Назва нової категорії"
                      value={newCatName}
                      onChange={e => setNewCatName(e.target.value)}
                    />
                    <button type="button" className="btn btn-primary" onClick={handleQuickAddCat}>✓</button>
                    <button type="button" className="btn btn-ghost" onClick={() => setShowAddCat(false)}>✕</button>
                  </div>
                )}
              </div>

              <div className={styles.field}>
                <label>Бренд</label>
                <select
                  className="input"
                  value={form.brandId}
                  onChange={e => setForm(f => ({ ...f, brandId: e.target.value }))}
                >
                  <option value="">— Без бренду —</option>
                  {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                  <option value="brand-vaporesso">Vaporesso</option>
                  <option value="brand-voopoo">Voopoo</option>
                  <option value="brand-oxva">Oxva</option>
                  <option value="brand-elfbar">Elf Bar</option>
                  <option value="brand-chaser">Chaser</option>
                  <option value="brand-octobar">Octobar</option>
                </select>
              </div>
            </div>
          </div>

          {/* 5. Visibility Flags */}
          <div className={styles.section}>
            <h3>Параметри відображення на сайті</h3>
            <div className={styles.toggles}>
              <label className={styles.toggle}>
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={e => setForm(f => ({ ...f, active: e.target.checked }))}
                />
                <span>Активний товар</span>
              </label>
              <label className={styles.toggle}>
                <input
                  type="checkbox"
                  checked={form.isNew}
                  onChange={e => setForm(f => ({ ...f, isNew: e.target.checked }))}
                />
                <span>Новинка</span>
              </label>
              <label className={styles.toggle}>
                <input
                  type="checkbox"
                  checked={form.popular}
                  onChange={e => setForm(f => ({ ...f, popular: e.target.checked }))}
                />
                <span>Популярний</span>
              </label>
              <label className={styles.toggle}>
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))}
                />
                <span>На головній</span>
              </label>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className={styles.footer}>
          <button type="button" className="btn btn-outline" onClick={onClose}>
            Скасувати
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSave}
            disabled={saving || !form.name || !form.price}
          >
            {saving ? 'Збереження...' : (product ? 'Зберегти зміни' : 'Створити товар')}
          </button>
        </div>
      </div>
    </div>
  );
}
