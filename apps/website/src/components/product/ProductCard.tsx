'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/contexts/CartContext';
import { formatPrice } from '@/lib/format';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    oldPrice?: number;
    shortDescription?: string;
    stock: number;
    isNew?: boolean;
    featured?: boolean;
    popular?: boolean;
    images?: { url: string; alt?: string }[];
    category?: { name: string; slug?: string };
  };
}

export function getCardImage(product: ProductCardProps['product']): string {
  const directUrl = product.images?.[0]?.url;
  if (directUrl && !directUrl.includes('/images/cat-') && !directUrl.includes('/images/hero-')) {
    return directUrl;
  }
  const txt = `${product.name || ''} ${product.category?.name || ''}`.toLowerCase();
  if (txt.includes('xros') || txt.includes('vaporesso')) return '/images/xros4.jpg';
  if (txt.includes('xlim') || txt.includes('oxva')) return '/images/xlim-pro.jpg';
  if (txt.includes('ursa') || txt.includes('lost vape') || txt.includes('argus') || txt.includes('voopoo')) return '/images/ursa-nano.jpg';
  if (txt.includes('chaser')) return '/images/chaser-salt.jpg';
  if (txt.includes('octobar') || txt.includes('рідин') || txt.includes('liquid') || txt.includes('salt')) return '/images/octobar-salt.jpg';
  if (txt.includes('elf') || txt.includes('elfbar')) return '/images/elfbar-disposable.jpg';
  if (txt.includes('vozol') || txt.includes('однораз') || txt.includes('disposable')) return '/images/vozol-disposable.jpg';
  if (txt.includes('картридж') || txt.includes('cartridge') || txt.includes('випар')) return '/images/cartridge-pack.jpg';
  return '/images/xros4.jpg';
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const imageUrl = getCardImage(product);
  const discount = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : null;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: imageUrl,
      slug: product.slug,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  return (
    <Link href={`/product/${product.slug}`} className={styles.card}>
      <div className={styles.imageWrap}>
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className={styles.image}
        />

        <div className={styles.badges}>
          {product.isNew && <span className={styles.badgeNew}>ХІТ</span>}
          {discount && <span className={styles.badgeDiscount}>-{discount}%</span>}
        </div>

        <div className={styles.stockBadge}>
          <span className={styles.stockDot} />
          <span>{product.stock > 0 ? 'В наявності' : 'Очікується'}</span>
        </div>
      </div>

      <div className={styles.info}>
        {product.category?.name && (
          <span className={styles.category}>{product.category.name}</span>
        )}
        <h3 className={styles.name} title={product.name}>{product.name}</h3>
        {product.shortDescription && (
          <p className={styles.desc}>{product.shortDescription}</p>
        )}

        <div className={styles.footerRow}>
          <div className={styles.pricing}>
            <span className={styles.price}>{formatPrice(product.price)} ₴</span>
            {product.oldPrice && (
              <span className={styles.oldPrice}>{formatPrice(product.oldPrice)} ₴</span>
            )}
          </div>

          <button
            type="button"
            className={`${styles.buyBtn} ${added ? styles.buyBtnAdded : ''}`}
            onClick={handleAdd}
            disabled={product.stock === 0}
            aria-label="Купити"
          >
            {added ? (
              <>
                <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8.5l3.5 3.5 6.5-7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>У кошику</span>
              </>
            ) : (
              <>
                <svg width="13" height="13" viewBox="0 0 18 18" fill="none">
                  <path d="M2 2h2l2.5 9h7l2-6H5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="8" cy="14.5" r="1.2" fill="currentColor"/>
                  <circle cx="13" cy="14.5" r="1.2" fill="currentColor"/>
                </svg>
                <span>Купити</span>
              </>
            )}
          </button>
        </div>
      </div>
    </Link>
  );
}
