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
      await api.updateProfile(token, { email: profileForm.email, phone: profileForm.phone });
      
      if (address?.id) {
        await api.updateAddress(token, address.id, { city: profileForm.city, street: profileForm.street, isDefault: true });
      } else {
        await api.addAddress(token, { city: profileForm.city, street: profileForm.street, isDefault: true });
      }

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

  // ── Auth Screen ──────────────────────────
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

  // ── Profile Data Rows ─────────────────────
  const profileRows = [
    { label: 'Ел. пошта', value: customer.email },
    { label: 'Телефон', value: customer.phone },
    { label: 'Місто', value: address?.city },
    { label: 'Нова Пошта', value: address?.street },
    { label: 'Telegram', value: customer.telegramId ? `@${customer.telegramId}` : null },
  ];

  // ── Main Profile ──────────────────────────
  return (
    <div className={styles.page}>
      <div className="container" style={{ maxWidth: 560 }}>

        {/* ── Profile Header ── */}
        <div className={styles.profileHeader}>
          <div className={styles.avatar}>
            {customer.firstName?.[0]?.toUpperCase()}{customer.lastName?.[0]?.toUpperCase()}
          </div>
          <div className={styles.profileMeta}>
            <h1>{customer.firstName} {customer.lastName}</h1>
            <p>Особистий кабінет</p>
          </div>
          <button className={styles.btnLogout} onClick={() => { logout(); router.push('/'); }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M7 17H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h3M13 14l4-4m0 0l-4-4m4 4H7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>

        {/* ── Tabs ── */}
        <nav className={styles.tabs}>
          {(['profile', 'orders', 'favorites'] as Tab[]).map(t => (
            <button key={t} className={`${styles.tabBtn} ${tab === t ? styles.active : ''}`} onClick={() => setTab(t)}>
              {t === 'profile' ? 'Профіль' : t === 'orders' ? 'Замовлення' : 'Обране'}
            </button>
          ))}
        </nav>

        {/* ── Content ── */}
        <div className={styles.content} key={tab}>

          {/* ── Profile Tab ── */}
          {tab === 'profile' && (
            <>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionTitle}>Мої дані</span>
                {!isEditingProfile ? (
                  <button className={styles.btnEdit} onClick={() => setIsEditingProfile(true)}>Редагувати</button>
                ) : (
                  <div className={styles.editActions}>
                    <button className={styles.btnCancel} onClick={() => setIsEditingProfile(false)}>Скасувати</button>
                    <button className={styles.btnSave} onClick={handleSaveProfile} disabled={loading}>
                      {loading ? '...' : 'Зберегти'}
                    </button>
                  </div>
                )}
              </div>

              {!isEditingProfile ? (
                <div className={styles.dataCard}>
                  {profileRows.map((row, i) => (
                    <div className={styles.dataRow} key={i}>
                      <span className={styles.dataLabel}>{row.label}</span>
                      <span className={`${styles.dataValue} ${row.value ? styles.dataValueFilled : ''}`}>
                        {row.value || 'Не вказано'}
                      </span>
                    </div>
                  ))}
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
            </>
          )}

          {/* ── Orders Tab ── */}
          {tab === 'orders' && (
            <>
              {orders.length === 0 ? (
                <div className={styles.emptyState}>
                  <div className={styles.emptyIcon}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2" stroke="#a1a1aa" strokeWidth="1.5" strokeLinecap="round"/></svg>
                  </div>
                  <p className={styles.emptyText}>Замовлень поки немає</p>
                </div>
              ) : (
                orders.map(o => (
                  <div key={o.id} className={styles.orderCard}>
                    <div className={styles.orderHeader}>
                      <span>#{o.orderNumber}</span>
                      <span className={styles.statusBadge}>{o.status}</span>
                    </div>
                    <p style={{ color: '#a1a1aa', fontSize: 13 }}>{new Date(o.createdAt).toLocaleDateString('uk-UA')}</p>
                    <div className={styles.orderTotal}>Сума: <strong style={{ color: '#09090b' }}>{formatPrice(o.totalAmount)} ₴</strong></div>
                  </div>
                ))
              )}
            </>
          )}

          {/* ── Favorites Tab ── */}
          {tab === 'favorites' && (
            <>
              {favorites.length === 0 ? (
                <div className={styles.emptyState}>
                  <div className={styles.emptyIcon}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 21S4 15 4 8.5A4.5 4.5 0 0 1 12 5a4.5 4.5 0 0 1 8 3.5C20 15 12 21 12 21z" stroke="#a1a1aa" strokeWidth="1.5"/></svg>
                  </div>
                  <p className={styles.emptyText}>Список обраного порожній</p>
                </div>
              ) : (
                <div className="products-grid">
                  {favorites.map(f => f.product && (
                    <div key={f.id} style={{ background: '#fff', border: '1px solid #f0f0f2', borderRadius: 16, padding: 16 }}>
                      {f.product.name}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

        </div>
      </div>
    </div>
  );
}
