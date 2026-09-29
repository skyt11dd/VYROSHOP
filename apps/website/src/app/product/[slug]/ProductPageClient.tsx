'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { ProductCard } from '@/components/product/ProductCard';
import { ProductIllustration } from '@/components/product/ProductIllustration';
import { formatPrice } from '@/lib/format';
import styles from './ProductPage.module.css';

export function ProductPageClient({ product, related }: { product: any; related: any[] }) {
  const [activeImage, setActiveImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  const handleAdd = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images?.[0]?.url,
      slug: product.slug,
    }, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const discount = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : null;

  return (
    <div className={styles.page}>
      {/* Breadcrumb */}
      <div className="container">
        <nav className={styles.breadcrumb}>
          <Link href="/">Головна</Link>
          <span>/</span>
          <Link href="/shop">Магазин</Link>
          {product.category && <>
            <span>/</span>
            <Link href={`/category/${product.category.slug}`}>{product.category.name}</Link>
          </>}
          <span>/</span>
          <span>{product.name}</span>
        </nav>

        <div className={styles.grid}>
          {/* Gallery */}
          <div className={styles.gallery}>
            <div className={styles.mainImage}>
              {product.images?.[activeImage]?.url && !product.images[activeImage].url.includes('/images/') ? (
                <Image src={product.images[activeImage].url} alt={product.name} fill style={{ objectFit: 'contain' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fafafa' }}>
                  <ProductIllustration category={product.category?.name} name={product.name} />
                </div>
              )}
              {discount && <span className={`badge badge-accent ${styles.discount}`}>-{discount}%</span>}
            </div>
            {product.images?.length > 1 && (
              <div className={styles.thumbs}>
                {product.images.map((img: any, i: number) => (
                  <button
                    key={i}
                    className={`${styles.thumb} ${i === activeImage ? styles.active : ''}`}
                    onClick={() => setActiveImage(i)}
                  >
                    <Image src={img.url} alt={`${product.name} ${i + 1}`} fill style={{ objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className={styles.info}>
            {product.category && <Link href={`/category/${product.category.slug}`} className={styles.catLink}>{product.category.name}</Link>}
            <h1 className={styles.name}>{product.name}</h1>
            {product.brand && <p className={styles.brand}>{product.brand.name}</p>}

            <div className={styles.pricing}>
              <span className={styles.price}>{formatPrice(product.price)} ₴</span>
              {product.oldPrice && <span className={styles.oldPrice}>{formatPrice(product.oldPrice)} ₴</span>}
            </div>

            <p className={styles.shortDesc}>{product.shortDescription}</p>

            <div className={styles.stock}>
              {product.stock > 5 ? (
                <span className={styles.inStock}>✓ В наявності</span>
              ) : product.stock > 0 ? (
                <span className={styles.lowStock}>⚠ Залишилось {product.stock} шт.</span>
              ) : (
                <span className={styles.outStock}>✕ Немає в наявності</span>
              )}
            </div>

            <div className={styles.buyRow}>
              <div className={styles.qty}>
                <button onClick={() => setQty(q => Math.max(1, q - 1))} className="btn btn-outline" style={{ padding: '8px 16px' }}>−</button>
                <span>{qty}</span>
                <button onClick={() => setQty(q => q + 1)} className="btn btn-outline" style={{ padding: '8px 16px' }}>+</button>
              </div>
              <button
                className="btn btn-primary"
                style={{ flex: 1 }}
                disabled={product.stock === 0}
                onClick={handleAdd}
              >
                {added ? '✓ Додано в кошик' : 'Додати в кошик'}
              </button>
            </div>

            {/* Tags */}
            {product.tags?.length > 0 && (
              <div className={styles.tags}>
                {product.tags.map((t: any) => (
                  <span key={t.id} className="badge badge-surface">{t.name}</span>
                ))}
              </div>
            )}

            <div className={styles.sku}>SKU: <span>{product.sku}</span></div>
          </div>
        </div>

        {/* Description tabs */}
        <div className={styles.tabs} style={{ marginTop: 60 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 20 }}>Опис</h2>
          <div className={styles.description} dangerouslySetInnerHTML={{ __html: product.description }} />
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div style={{ marginTop: 80 }}>
            <div className="section-heading">
              <h2>Схожі товари</h2>
            </div>
            <div className="products-grid">
              {related.slice(0, 4).map((p: any) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
