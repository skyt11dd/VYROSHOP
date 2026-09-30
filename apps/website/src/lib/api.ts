const isServer = typeof window === 'undefined';
let API_URL = process.env.NEXT_PUBLIC_API_URL || (isServer ? 'http://localhost:4000' : '');

// CRITICAL FIX: If running in the browser on a phone via Ngrok, but .env has localhost,
// we MUST force relative paths to use the Next.js proxy rewrite!
if (!isServer && API_URL.includes('localhost')) {
  API_URL = '';
}

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(err.error || `API error ${res.status}`);
  }
  return res.json();
}

export const api = {
  // Public
  getProducts: (params?: Record<string, string>) => {
    const q = params ? '?' + new URLSearchParams(params).toString() : '';
    return apiFetch<any>(`/api/public/products${q}`);
  },
  getProduct: (slug: string) => apiFetch<any>(`/api/public/products/${slug}`),
  getCategories: () => apiFetch<any>(`/api/public/categories`),
  getBrands: () => apiFetch<any>(`/api/public/brands`),
  search: (q: string) => apiFetch<any>(`/api/public/search?q=${encodeURIComponent(q)}`),

  // Auth
  login: (email: string, password: string) =>
    apiFetch<any>('/api/auth/customer/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  register: (data: any) =>
    apiFetch<any>('/api/auth/customer/register', { method: 'POST', body: JSON.stringify(data) }),
  telegramAuth: (data: { telegramId: string; firstName?: string; lastName?: string }) =>
    apiFetch<any>('/api/auth/customer/telegram-auth', { method: 'POST', body: JSON.stringify(data) }),

  // Customer (requires token)
  getProfile: (token: string) =>
    apiFetch<any>('/api/customer/profile', { headers: { Authorization: `Bearer ${token}` } }),
  getOrders: (token: string) =>
    apiFetch<any>('/api/customer/orders', { headers: { Authorization: `Bearer ${token}` } }),
  createOrder: (token: string, data: any) =>
    apiFetch<any>('/api/customer/orders', {
      method: 'POST', body: JSON.stringify(data),
      headers: { Authorization: `Bearer ${token}` },
    }),
  createGuestOrder: (data: any) =>
    apiFetch<any>('/api/customer/orders/guest', { method: 'POST', body: JSON.stringify(data) }),
  getFavorites: (token: string) =>
    apiFetch<any>('/api/customer/favorites', { headers: { Authorization: `Bearer ${token}` } }),
  addFavorite: (token: string, productId: string) =>
    apiFetch<any>(`/api/customer/favorites/${productId}`, {
      method: 'POST', headers: { Authorization: `Bearer ${token}` },
    }),
  removeFavorite: (token: string, productId: string) =>
    apiFetch<any>(`/api/customer/favorites/${productId}`, {
      method: 'DELETE', headers: { Authorization: `Bearer ${token}` },
    }),
};
