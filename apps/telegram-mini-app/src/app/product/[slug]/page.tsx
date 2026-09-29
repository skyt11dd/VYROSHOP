'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import styles from './ProductPage.module.css';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function ProductPage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const tg = (window as any).Telegram?.WebApp;
    if (tg) {
      tg.ready();
      tg.BackButton.show();
      tg.BackButton.onClick(() => router.back());
    }
    return () => {
      if (tg) tg.BackButton.hide();
    };
  }, [router]);

  useEffect(() => {
    fetch(`${API_URL}/api/public/products/${params.slug}`)
      .then(r => r.json())
      .then(d => setProduct(d.product))
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [params.slug]);

  const handleAdd = () => {
    const tg = (window as any).Telegram?.WebApp;
    if (tg) {
      tg.HapticFeedback.impactOccurred('medium');
      // In a real app we'd save to local storage or API for cart
      tg.showAlert('Додано в кошик!');
    }
  };

  if (loading) return <div className={styles.loading}><div className="skeleton" style={{ width: '100%', height: '100vh' }} /></div>;
  if (!product) return <div className={styles.empty}>Товар не знайдено</div>;

  return (
    <div className={`page ${styles.page}`}>
      <div className={styles.gallery}>
        <div className={styles.mainImage}>
          {product.images?.[activeImage] ? (
            <Image src={product.images[activeImage].url} alt={product.name} fill style={{ objectFit: 'contain' }} />
          ) : <div className={styles.noImg} />}
        </div>
        {product.images?.length > 1 && (
          <div className={styles.thumbs}>
            {product.images.map((img: any, i: number) => (
              <button key={i} className={`${styles.thumb} ${i === activeImage ? styles.activeThumb : ''}`} onClick={() => setActiveImage(i)}>
                <Image src={img.url} alt="" fill style={{ objectFit: 'cover' }} />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className={styles.info}>
        {product.category && <span className={styles.cat}>{product.category.name}</span>}
        <h1 className={styles.name}>{product.name}</h1>
        <div className={styles.priceRow}>
          <span className={styles.price}>{product.price.toLocaleString()} ₴</span>
          {product.oldPrice && <span className={styles.oldPrice}>{product.oldPrice.toLocaleString()} ₴</span>}
        </div>
        
        {product.stock > 0 ? (
          <span className={styles.inStock}>В наявності</span>
        ) : (
          <span className={styles.outStock}>Немає в наявності</span>
        )}

        <div className={styles.desc}>{product.shortDescription}</div>

        <div className={styles.fullDesc} dangerouslySetInnerHTML={{ __html: product.description }} />
      </div>

      <div className={styles.bottomBar}>
        <button className="btn btn-primary" onClick={handleAdd} disabled={product.stock === 0}>
          {product.stock === 0 ? 'Немає в наявності' : 'В кошик'}
        </button>
      </div>
    </div>
  );
}
