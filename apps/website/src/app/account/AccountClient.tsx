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

  const [address, setAddress] = useState<any>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ email: '', phone: '', city: '', street: '' });

  useEffect(() => {
    if (customer) {
      setTab('profile');
      setProfileForm(f => ({ ...f, email: customer.email || '', phone: customer.phone || '' }));
    }
  }, [customer]);

  useEffect(() => {
    if (token) {
      if (tab === 'orders') api.getOrders(token).then(r => setOrders(r.orders));
      if (tab === 'favorites') api.getFavorites(token).then(r => setFavorites(r.favorites));
      if (tab === 'profile') {
        api.getAddresses(token).then(r => {
          if (r.addresses && r.addresses.length > 0) {
            setAddress(r.addresses[0]);
            setProfileForm(f => ({ ...f, city: r.addresses[0].city || '', street: r.addresses[0].street || '' }));
          }
        });
      }
    }
  }, [tab, token]);

  const handleSaveProfile = async () => {
    if (!token) return;
    setLoading(true);
    try {
      // Update profile fields
      await api.updateProfile(token, { email: profileForm.email, phone: profileForm.phone });
      
      // Save or update address
      if (address?.id) {
        // Update existing address
        await api.updateAddress(token, address.id, { city: profileForm.city, street: profileForm.street, isDefault: true });
      } else {
        // Create new address
        await api.addAddress(token, { city: profileForm.city, street: profileForm.street, isDefault: true });
      }

      // Re-fetch profile to update context without re-login
      const res = await api.getProfile(token);
      setIsEditingProfile(false);
      window.location.reload();
    } catch (e: any) {
      alert('Помилка: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

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
            <button className="btn btn-ghost" style={{ width: '100%', marginTop: 12 }} onClick={() => setIsRegister(!isRegister)}>
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
        <div className={styles.profileHeaderCard}>
          <div className={styles.profileInfo}>
            <div className={styles.avatar}>
              {customer.firstName?.[0]}{customer.lastName?.[0]}
            </div>
            <div className={styles.profileText}>
              <h1>{customer.firstName} {customer.lastName}</h1>
              <p>Мій акаунт</p>
            </div>
          </div>
          <button className={styles.btnLogout} onClick={() => { logout(); router.push('/'); }}>Вийти з акаунта</button>
        </div>

        <div className={styles.layout}>
          <nav className={styles.tabs}>
            {(['profile', 'orders', 'favorites'] as Tab[]).map(t => (
              <button key={t} className={`${styles.tabBtn} ${tab === t ? styles.active : ''}`} onClick={() => setTab(t)}>
                {t === 'profile' ? 'Профіль' : t === 'orders' ? 'Замовлення' : 'Обране'}
              </button>
            ))}
          </nav>

          <div className={styles.content} key={tab}>
            {tab === 'profile' && (
              <div className={styles.section}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                  <h2 style={{ marginBottom: 0 }}>Мої дані</h2>
                  {!isEditingProfile ? (
                    <button className="btn btn-ghost" onClick={() => setIsEditingProfile(true)}>Редагувати</button>
                  ) : (
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn btn-ghost" onClick={() => setIsEditingProfile(false)}>Скасувати</button>
                      <button className="btn btn-primary" onClick={handleSaveProfile} disabled={loading}>Зберегти</button>
                    </div>
                  )}
                </div>
                
                {!isEditingProfile ? (
                  <div className={styles.editForm}>
                    <div className={styles.editRow}>
                      <label className={styles.editLabel}>Електронна пошта</label>
                      <div className={styles.editInput} style={{ padding: '4px 0', color: customer.email ? 'var(--text)' : 'var(--text-secondary)' }}>
                        {customer.email || 'Не вказано'}
                      </div>
                    </div>
                    <div className={styles.editRow}>
                      <label className={styles.editLabel}>Номер телефону</label>
                      <div className={styles.editInput} style={{ padding: '4px 0', color: customer.phone ? 'var(--text)' : 'var(--text-secondary)' }}>
                        {customer.phone || 'Не вказано'}
                      </div>
                    </div>
                    <div className={styles.editRow}>
                      <label className={styles.editLabel}>Місто доставки</label>
                      <div className={styles.editInput} style={{ padding: '4px 0', color: address?.city ? 'var(--text)' : 'var(--text-secondary)' }}>
                        {address?.city || 'Не вказано'}
                      </div>
                    </div>
                    <div className={styles.editRow}>
                      <label className={styles.editLabel}>Відділення / Поштомат (Нова Пошта)</label>
                      <div className={styles.editInput} style={{ padding: '4px 0', color: address?.street ? 'var(--text)' : 'var(--text-secondary)' }}>
                        {address?.street || 'Не вказано'}
                      </div>
                    </div>
                    <div className={styles.editRow}>
                      <label className={styles.editLabel}>Telegram ID</label>
                      <div className={styles.editInput} style={{ padding: '4px 0', fontFamily: 'monospace', color: customer.telegramId ? '#71717a' : 'var(--text-secondary)' }}>
                        {customer.telegramId ? `@${customer.telegramId}` : 'Не підв\'язано'}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className={styles.editForm}>
                    <div className={styles.editRow}>
                      <label className={styles.editLabel}>Електронна пошта</label>
                      <input className={styles.editInput} type="email" value={profileForm.email} onChange={e => setProfileForm(f => ({ ...f, email: e.target.value }))} placeholder="example@gmail.com" />
                    </div>
                    <div className={styles.editRow}>
                      <label className={styles.editLabel}>Номер телефону</label>
                      <input className={styles.editInput} type="tel" value={profileForm.phone} onChange={e => setProfileForm(f => ({ ...f, phone: e.target.value }))} placeholder="+380..." />
                    </div>
                    <div className={styles.editRow}>
                      <label className={styles.editLabel}>Місто доставки</label>
                      <input className={styles.editInput} type="text" value={profileForm.city} onChange={e => setProfileForm(f => ({ ...f, city: e.target.value }))} placeholder="Наприклад: Київ" />
                    </div>
                    <div className={styles.editRow}>
                      <label className={styles.editLabel}>Відділення / Поштомат (Нова Пошта)</label>
                      <input className={styles.editInput} type="text" value={profileForm.street} onChange={e => setProfileForm(f => ({ ...f, street: e.target.value }))} placeholder="Відділення №1" />
                    </div>
                  </div>
                )}
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
