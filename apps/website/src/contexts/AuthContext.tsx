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
