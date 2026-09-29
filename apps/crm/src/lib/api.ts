const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('vyro_crm_token');
}

async function crmFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const token = getToken();
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options?.headers || {}),
    },
  });
  if (!res.ok) {
    if (res.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('vyro_crm_token');
        window.location.href = '/login';
      }
    }
    const err = await res.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(err.error || `API error ${res.status}`);
  }
  return res.json();
}

export const crmApi = {
  login: (email: string, password: string) =>
    crmFetch<any>('/api/auth/manager/login', { method: 'POST', body: JSON.stringify({ email, password }) }),

  getMe: () => crmFetch<any>('/api/auth/manager/me'),

  // Analytics
  getAnalytics: (period?: string) => crmFetch<any>(`/api/crm/analytics?period=${period || '30d'}`),

  // Products
  getProducts: (params?: Record<string, string>) => {
    const q = params ? '?' + new URLSearchParams(params).toString() : '';
    return crmFetch<any>(`/api/crm/products${q}`);
  },
  createProduct: (data: any) => crmFetch<any>('/api/crm/products', { method: 'POST', body: JSON.stringify(data) }),
  updateProduct: (id: string, data: any) => crmFetch<any>(`/api/crm/products/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteProduct: (id: string) => crmFetch<any>(`/api/crm/products/${id}`, { method: 'DELETE' }),
  duplicateProduct: (id: string) => crmFetch<any>(`/api/crm/products/${id}/duplicate`, { method: 'POST' }),

  // Categories
  getCategories: () => crmFetch<any>('/api/crm/categories'),
  createCategory: (data: any) => crmFetch<any>('/api/crm/categories', { method: 'POST', body: JSON.stringify(data) }),
  updateCategory: (id: string, data: any) => crmFetch<any>(`/api/crm/categories/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteCategory: (id: string) => crmFetch<any>(`/api/crm/categories/${id}`, { method: 'DELETE' }),

  // Brands
  getBrands: () => crmFetch<any>('/api/crm/brands'),
  createBrand: (data: any) => crmFetch<any>('/api/crm/brands', { method: 'POST', body: JSON.stringify(data) }),
  updateBrand: (id: string, data: any) => crmFetch<any>(`/api/crm/brands/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteBrand: (id: string) => crmFetch<any>(`/api/crm/brands/${id}`, { method: 'DELETE' }),

  // Orders
  getOrders: (params?: Record<string, string>) => {
    const q = params ? '?' + new URLSearchParams(params).toString() : '';
    return crmFetch<any>(`/api/crm/orders${q}`);
  },
  getOrder: (id: string) => crmFetch<any>(`/api/crm/orders/${id}`),
  updateOrder: (id: string, data: any) => crmFetch<any>(`/api/crm/orders/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),

  // Customers
  getCustomers: (params?: Record<string, string>) => {
    const q = params ? '?' + new URLSearchParams(params).toString() : '';
    return crmFetch<any>(`/api/crm/customers${q}`);
  },
  getCustomer: (id: string) => crmFetch<any>(`/api/crm/customers/${id}`),

  // Managers
  getManagers: () => crmFetch<any>('/api/crm/managers'),
  createManager: (data: any) => crmFetch<any>('/api/crm/managers', { method: 'POST', body: JSON.stringify(data) }),
  updateManager: (id: string, data: any) => crmFetch<any>(`/api/crm/managers/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteManager: (id: string) => crmFetch<any>(`/api/crm/managers/${id}`, { method: 'DELETE' }),

  // Inventory
  getInventory: (params?: Record<string, string>) => {
    const q = params ? '?' + new URLSearchParams(params).toString() : '';
    return crmFetch<any>(`/api/crm/inventory${q}`);
  },
  updateStock: (id: string, stock: number) => crmFetch<any>(`/api/crm/inventory/${id}`, { method: 'PATCH', body: JSON.stringify({ stock }) }),

  // Notifications
  getNotifications: () => crmFetch<any>('/api/crm/notifications'),
  markRead: (id: string) => crmFetch<any>(`/api/crm/notifications/${id}/read`, { method: 'PATCH' }),

  // Audit Log
  getAuditLog: (params?: Record<string, string>) => {
    const q = params ? '?' + new URLSearchParams(params).toString() : '';
    return crmFetch<any>(`/api/crm/audit-log${q}`);
  },

  // Search analytics
  getSearchAnalytics: () => crmFetch<any>('/api/crm/search-analytics'),
};
