'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { formatPrice } from '@/lib/format';
import styles from './AccountPage.module.css';

type Tab = 'profile' | 'orders' | 'favorites' | 'login';

export default function AccountClient() {
  const { customer, token, login, register, logout } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>(customer ? 'profile' : 'login');
  const [orders, setOrders] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [regForm, setRegForm] = useState({ email: '', password: '', firstName: '', lastName: '', phone: '' });
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (customer) setTab('profile');
  }, [customer]);

  useEffect(() => {
    if (token && tab === 'orders') api.getOrders(token).then(r => setOrders(r.orders));
    if (token && tab === 'favorites') api.getFavorites(token).then(r => setFavorites(r.favorites));
  }, [tab, token]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(loginForm.email, loginForm.password);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(regForm);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!customer) {
    return (
      <div className={styles.page}>
        <div className="container">
          <div className={styles.authCard}>
            <h1>{isRegister ? 'Реєстрація' : 'Вхід'}</h1>
            {error && <div className={styles.error}>{error}</div>}
            {!isRegister ? (
              <form onSubmit={handleLogin} className={styles.form}>
                <div className={styles.field}>
                  <label className="label">Email</label>
                  <input className="input" type="email" required value={loginForm.email} onChange={e => setLoginForm(f => ({ ...f, email: e.target.value }))} />
                </div>
                <div className={styles.field}>
                  <label className="label">Пароль</label>
                  <input className="input" type="password" required value={loginForm.password} onChange={e => setLoginForm(f => ({ ...f, password: e.target.value }))} />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                  {loading ? 'Входимо...' : 'Увійти'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegister} className={styles.form}>
                <div className={styles.row2}>
                  <div className={styles.field}>
                    <label className="label">Ім'я</label>
                    <input className="input" value={regForm.firstName} onChange={e => setRegForm(f => ({ ...f, firstName: e.target.value }))} />
                  </div>
                  <div className={styles.field}>
                    <label className="label">Прізвище</label>
                    <input className="input" value={regForm.lastName} onChange={e => setRegForm(f => ({ ...f, lastName: e.target.value }))} />
                  </div>
                </div>
                <div className={styles.field}>
                  <label className="label">Email *</label>
                  <input className="input" type="email" required value={regForm.email} onChange={e => setRegForm(f => ({ ...f, email: e.target.value }))} />
                </div>
                <div className={styles.field}>
                  <label className="label">Телефон</label>
                  <input className="input" type="tel" value={regForm.phone} onChange={e => setRegForm(f => ({ ...f, phone: e.target.value }))} />
                </div>
                <div className={styles.field}>
                  <label className="label">Пароль *</label>
                  <input className="input" type="password" required value={regForm.password} onChange={e => setRegForm(f => ({ ...f, password: e.target.value }))} />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                  {loading ? 'Реєструємось...' : 'Зареєструватися'}
                </button>
              </form>
            )}
            <button className="btn btn-ghost" style={{ width: '100%' }} onClick={() => setIsRegister(!isRegister)}>
              {isRegister ? 'Вже є акаунт? Увійти' : 'Немає акаунту? Зареєструватися'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.header}>
          <div>
            <h1>Мій акаунт</h1>
            <p style={{ color: 'var(--text-secondary)' }}>
              {customer.firstName} {customer.lastName}
            </p>
          </div>
          <button className="btn btn-outline" onClick={() => { logout(); router.push('/'); }}>Вийти</button>
        </div>

        <div className={styles.layout}>
          <nav className={styles.tabs}>
            {(['profile', 'orders', 'favorites'] as Tab[]).map(t => (
              <button key={t} className={`${styles.tabBtn} ${tab === t ? styles.active : ''}`} onClick={() => setTab(t)}>
                {t === 'profile' ? 'Профіль' : t === 'orders' ? 'Замовлення' : 'Обране'}
              </button>
            ))}
          </nav>

          <div className={styles.content}>
            {tab === 'profile' && (
              <div className={styles.section}>
                <h2>Профіль</h2>
                <div className={styles.profileGrid}>
                  <div className={styles.field}>
                    <label className="label">Email</label>
                    <div className={styles.value}>{customer.email || '—'}</div>
                  </div>
                  <div className={styles.field}>
                    <label className="label">Телефон</label>
                    <div className={styles.value}>{customer.phone || '—'}</div>
                  </div>
                </div>
              </div>
            )}

            {tab === 'orders' && (
              <div className={styles.section}>
                <h2>Мої замовлення</h2>
                {orders.length === 0 ? (
                  <p style={{ color: 'var(--text-secondary)' }}>Замовлень поки немає</p>
                ) : (
                  orders.map(o => (
                    <div key={o.id} className={styles.orderCard}>
                      <div className={styles.orderHeader}>
                        <span>Замовлення #{o.orderNumber}</span>
                        <span className={`badge ${styles.statusBadge}`}>{o.status}</span>
                      </div>
                      <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{new Date(o.createdAt).toLocaleDateString('uk-UA')}</p>
                      <div className={styles.orderTotal}>Сума: <strong>{formatPrice(o.totalAmount)} ₴</strong></div>
                    </div>
                  ))
                )}
              </div>
            )}

            {tab === 'favorites' && (
              <div className={styles.section}>
                <h2>Обране</h2>
                {favorites.length === 0 ? (
                  <p style={{ color: 'var(--text-secondary)' }}>Список обраного порожній</p>
                ) : (
                  <div className="products-grid">
                    {favorites.map(f => f.product && <div key={f.id} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 16 }}>{f.product.name}</div>)}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
