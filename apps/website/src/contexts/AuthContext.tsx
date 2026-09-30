'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '@/lib/api';

interface AuthContextType {
  customer: any | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [customer, setCustomer] = useState<any | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleAuth = async () => {
      // 1. Try Telegram Auto-Login
      const tgUser = (window as any).Telegram?.WebApp?.initDataUnsafe?.user;
      if (tgUser && !localStorage.getItem('vyro_token')) {
        try {
          const res = await api.telegramAuth({
            telegramId: String(tgUser.id),
            firstName: tgUser.first_name,
            lastName: tgUser.last_name,
          });
          setToken(res.token);
          setCustomer(res.customer);
          localStorage.setItem('vyro_token', res.token);
          setIsLoading(false);
          return;
        } catch (e) {
          console.error('Telegram auth failed', e);
        }
      }

      // 2. Try Standard Token Auth
      const stored = localStorage.getItem('vyro_token');
      if (stored) {
        setToken(stored);
        api.getProfile(stored).then(r => setCustomer(r.customer)).catch(() => {
          localStorage.removeItem('vyro_token');
          setToken(null);
        }).finally(() => setIsLoading(false));
      } else {
        setIsLoading(false);
      }
    };

    handleAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.login(email, password);
    setToken(res.token);
    setCustomer(res.customer);
    localStorage.setItem('vyro_token', res.token);
  };

  const register = async (data: any) => {
    const res = await api.register(data);
    setToken(res.token);
    setCustomer(res.customer);
    localStorage.setItem('vyro_token', res.token);
  };

  const logout = () => {
    setToken(null);
    setCustomer(null);
    localStorage.removeItem('vyro_token');
  };

  return (
    <AuthContext.Provider value={{ customer, token, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
