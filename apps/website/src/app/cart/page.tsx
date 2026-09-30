'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { formatPrice } from '@/lib/format';
import styles from './CartPage.module.css';

export default function CartPage() {
  const { items, total, updateQty, removeItem, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className={styles.page}>
        <div className="container">
          <div className={`${styles.empty} animate-slide-up delay-75`}>
            <div className={styles.emptyIcon}>🛒</div>
            <h1>Кошик порожній</h1>
            <p>Додайте товари з нашого магазину</p>
            <Link href="/shop" className="btn btn-primary">Перейти до магазину</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={`${styles.header} animate-slide-up delay-75`}>
          <h1>Кошик</h1>
          <button className="btn btn-ghost" onClick={clearCart}>Очистити</button>
        </div>

        <div className={styles.layout}>
          <div className={`${styles.items} animate-slide-up delay-150`}>
            {items.map(item => (
              <div key={item.productId} className={styles.item}>
                <div className={styles.image}>
                  {item.image ? <Image src={item.image} alt={item.name} fill style={{ objectFit: 'cover' }} /> : <div className={styles.noImg} />}
                </div>
                <div className={styles.info}>
                  <Link href={`/product/${item.slug}`} className={styles.name}>{item.name}</Link>
                  <span className={styles.unitPrice}>{formatPrice(item.price)} ₴ / шт.</span>
                </div>
                <div className={styles.qty}>
                  <button className="btn btn-outline" style={{ padding: '6px 14px' }} onClick={() => updateQty(item.productId, item.quantity - 1)}>−</button>
                  <span>{item.quantity}</span>
                  <button className="btn btn-outline" style={{ padding: '6px 14px' }} onClick={() => updateQty(item.productId, item.quantity + 1)}>+</button>
                </div>
                <div className={styles.itemTotal}>
                  <span>{formatPrice(item.price * item.quantity)} ₴</span>
                  <button className={styles.remove} onClick={() => removeItem(item.productId)}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className={`${styles.summary} animate-slide-up delay-300`}>
            <h2>Підсумок</h2>
            <div className={styles.summaryRow}>
              <span>Проміжна сума</span>
              <span>{formatPrice(total)} ₴</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Доставка</span>
              <span>За тарифами перевізника</span>
            </div>
            <div className={`${styles.summaryRow} ${styles.totalRow}`}>
              <span>Загальна сума</span>
              <span>{formatPrice(total)} ₴</span>
            </div>
            <Link href="/checkout" className="btn btn-primary" style={{ width: '100%', marginTop: 20 }}>
              Оформити замовлення
            </Link>
            <Link href="/shop" className="btn btn-ghost" style={{ width: '100%' }}>← Продовжити покупки</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
