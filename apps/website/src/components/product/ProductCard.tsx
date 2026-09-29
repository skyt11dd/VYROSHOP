'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/contexts/CartContext';
import { ProductIllustration } from './ProductIllustration';
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
    images: { url: string; alt?: string }[];
    category?: { name: string };
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const [hovered, setHovered] = useState(false);

  const mainImage = product.images[0]?.url;
  const secondImage = product.images[1]?.url;
  const discount = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : null;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: mainImage,
      slug: product.slug,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <Link href={`/product/${product.slug}`} className={styles.card} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <div className={styles.imageWrap}>
        {mainImage && !mainImage.includes('/images/cat-') && !mainImage.includes('/images/hero-') ? (
          <Image
            src={hovered && secondImage && !secondImage.includes('/images/') ? secondImage : mainImage}
            alt={product.name}
            fill
            style={{ objectFit: 'contain', padding: '16px' }}
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        ) : (
          <div className={styles.illustrationWrap}>
            <ProductIllustration category={product.category?.name} name={product.name} />
          </div>
        )}
        <div className={styles.badges}>
          {product.isNew && <span className="badge badge-accent">Нове</span>}
          {discount && <span className={`badge ${styles.discount}`}>-{discount}%</span>}
          {product.stock === 0 && <span className={`badge ${styles.outOfStock}`}>Немає</span>}
        </div>
        <div className={`${styles.actions} ${hovered ? styles.visible : ''}`}>
          <button
            className={`btn btn-primary ${styles.addBtn}`}
            onClick={handleAdd}
            disabled={product.stock === 0}
          >
            {added ? '✓ Додано' : 'В кошик'}
          </button>
        </div>
      </div>
      <div className={styles.info}>
        {product.category && <span className={styles.category}>{product.category.name}</span>}
        <h3 className={styles.name}>{product.name}</h3>
        {product.shortDescription && <p className={styles.desc}>{product.shortDescription}</p>}
        <div className={styles.pricing}>
          <span className={styles.price}>{formatPrice(product.price)} ₴</span>
          {product.oldPrice && <span className={styles.oldPrice}>{formatPrice(product.oldPrice)} ₴</span>}
        </div>
      </div>
    </Link>
  );
}
