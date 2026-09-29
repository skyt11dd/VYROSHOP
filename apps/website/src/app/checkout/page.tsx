'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { formatPrice } from '@/lib/format';
import styles from './CheckoutPage.module.css';

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const { customer, token } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [orderNum, setOrderNum] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    customerName: customer ? `${customer.firstName || ''} ${customer.lastName || ''}`.trim() : '',
    customerPhone: customer?.phone || '',
    customerCity: '',
    deliveryMethod: 'nova_poshta',
    comment: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!items.length) return;
    setLoading(true);
    try {
      const orderItems = items.map(i => ({ productId: i.productId, quantity: i.quantity }));
      let res;
      if (token) {
        res = await api.createOrder(token, { ...form, items: orderItems });
      } else {
        res = await api.createGuestOrder({ ...form, items: orderItems });
      }
      setOrderNum(res.order.orderNumber);
      clearCart();
      setStep('success');
    } catch (e: any) {
      alert(e.message || 'Помилка при оформленні замовлення');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'success') {
    return (
      <div className={styles.page}>
        <div className="container">
          <div className={styles.success}>
            <div className={styles.successIcon}>✓</div>
            <h1>Дякуємо!</h1>
            <p>Ваше замовлення <strong>#{orderNum}</strong> прийнято.</p>
            <p className={styles.note}>Менеджер зв'яжеться з вами найближчим часом.</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 24 }}>
              <button onClick={() => router.push('/shop')} className="btn btn-primary">Продовжити покупки</button>
              {token && <button onClick={() => router.push('/account/orders')} className="btn btn-outline">Мої замовлення</button>}
            </div>
          </div>
        </div>
      </div>
    );
  }

  useEffect(() => {
    if (!items.length) {
      router.push('/cart');
    }
  }, [items.length, router]);

  if (!items.length) {
    return null;
  }

  return (
    <div className={styles.page}>
      <div className="container">
        <h1 className={styles.title}>Оформлення замовлення</h1>
        <div className={styles.layout}>
          <form className={styles.form} onSubmit={handleSubmit}>
            <h2>Контактні дані</h2>
            <div className={styles.field}>
              <label className="label">Ім'я та прізвище *</label>
              <input className="input" required value={form.customerName} onChange={e => setForm(f => ({ ...f, customerName: e.target.value }))} placeholder="Іван Петренко" />
            </div>
            <div className={styles.field}>
              <label className="label">Телефон *</label>
              <input className="input" required type="tel" value={form.customerPhone} onChange={e => setForm(f => ({ ...f, customerPhone: e.target.value }))} placeholder="+380 XX XXX XXXX" />
            </div>
            <div className={styles.field}>
              <label className="label">Місто *</label>
              <input className="input" required value={form.customerCity} onChange={e => setForm(f => ({ ...f, customerCity: e.target.value }))} placeholder="Київ" />
            </div>
            <div className={styles.field}>
              <label className="label">Спосіб доставки</label>
              <select className="input" value={form.deliveryMethod} onChange={e => setForm(f => ({ ...f, deliveryMethod: e.target.value }))}>
                <option value="nova_poshta">Нова пошта</option>
                <option value="ukrposhta">Укрпошта</option>
                <option value="courier">Кур'єр</option>
                <option value="selfpickup">Самовивіз</option>
              </select>
            </div>
            <div className={styles.field}>
              <label className="label">Коментар</label>
              <textarea className="input" rows={3} value={form.comment} onChange={e => setForm(f => ({ ...f, comment: e.target.value }))} placeholder="Додаткова інформація до замовлення" />
            </div>
            <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: '100%', padding: '16px' }}>
              {loading ? 'Оформлення...' : 'Підтвердити замовлення'}
            </button>
          </form>

          <div className={styles.orderSummary}>
            <h2>Ваше замовлення</h2>
            <div className={styles.orderItems}>
              {items.map(item => (
                <div key={item.productId} className={styles.orderItem}>
                  <span>{item.name} × {item.quantity}</span>
                  <span>{formatPrice(item.price * item.quantity)} ₴</span>
                </div>
              ))}
            </div>
            <div className={styles.orderTotal}>
              <span>Загальна сума</span>
              <span>{formatPrice(total)} ₴</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
