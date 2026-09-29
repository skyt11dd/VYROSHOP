'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { crmApi } from '@/lib/api';
import styles from './LoginPage.module.css';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await crmApi.login(email, password);
      localStorage.setItem('vyro_crm_token', res.token);
      localStorage.setItem('vyro_crm_manager', JSON.stringify(res.manager));
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Невірні дані для входу');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logo}>VYRO CRM</div>
        <h1 className={styles.title}>Вхід до системи</h1>
        <p className={styles.sub}>Тільки для авторизованих менеджерів</p>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>Email</label>
            <input className="input" type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@vyro.store" autoComplete="email" />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Пароль</label>
            <input className="input" type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" autoComplete="current-password" />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px' }} disabled={loading}>
            {loading ? 'Вхід...' : 'Увійти'}
          </button>
        </form>
      </div>
    </div>
  );
}
