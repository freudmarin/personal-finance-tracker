
import { API_BASE_URL } from './config';

// Helper to get access token from localStorage
function getAccessToken() {
  return localStorage.getItem('accessToken');
}

// Helper to get refresh token from localStorage
function getRefreshToken() {
  return localStorage.getItem('refreshToken');
}

// Helper to refresh token
async function refreshToken() {
  console.log('🔄 Refreshing token...');
  const refreshToken = getRefreshToken();
  if (!refreshToken) throw new Error('No refresh token');
  const res = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken })
  });
  if (!res.ok) throw new Error('Refresh failed');
  const data = await res.json();
  localStorage.setItem('accessToken', data.accessToken);
  if (data.refreshToken) localStorage.setItem('refreshToken', data.refreshToken);
  if (data.user) localStorage.setItem('user', JSON.stringify(data.user));
  return data.accessToken;
}

// Helper to attach Authorization header
function withAuth(headers = {}) {
  const token = getAccessToken();
  return token ? { ...headers, Authorization: `Bearer ${token}` } : headers;
}


// Helper to handle 401 and retry with refresh
async function fetchWithAuthRetry(url, options = {}) {
  console.log('📡 API Request:', url);
  let res = await fetch(url, options);
  console.log('📥 Response status:', res.status);
  if (res.status === 401) {
    console.log('🔒 401 Unauthorized - attempting token refresh...');
    try {
      const newToken = await refreshToken();
      console.log('✅ Token refreshed successfully, retrying original request...');
      const newHeaders = { ...options.headers, Authorization: `Bearer ${newToken}` };
      res = await fetch(url, { ...options, headers: newHeaders });
      console.log('📥 Retry response status:', res.status);
    } catch (err) {
      console.error('❌ Token refresh failed:', err);
      throw new Error('Unauthorized');
    }
  }
  return res;
}

// Category API
export async function fetchCategories() {
  const res = await fetchWithAuthRetry(`${API_BASE_URL}/api/categories`, {
    headers: withAuth(),
  });
  if (!res.ok) throw new Error('Failed to fetch categories');
  return res.json();
}

export async function addCategory(category) {
  const res = await fetchWithAuthRetry(`${API_BASE_URL}/api/categories`, {
    method: 'POST',
    headers: withAuth({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(category),
  });
  if (!res.ok) {
    if (res.status === 409) {
      throw new Error('Category already exists (409)');
    }
    let msg = 'Failed to add category';
    try {
      const data = await res.json();
      if (data && data.message) msg = data.message;
    } catch {}
    throw new Error(msg);
  }
  return res.json();
}

export async function updateCategory(id, category) {
  const res = await fetchWithAuthRetry(`${API_BASE_URL}/api/categories/${id}`, {
    method: 'PUT',
    headers: withAuth({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(category),
  });
  if (!res.ok) {
    if (res.status === 409) {
      throw new Error('Category already exists (409)');
    }
    let msg = 'Failed to add category';
    try {
      const data = await res.json();
      if (data && data.message) msg = data.message;
    } catch {}
    throw new Error(msg);
  }
  return res.json();
}

export async function deleteCategory(id) {
  const res = await fetchWithAuthRetry(`${API_BASE_URL}/api/categories/${id}`, {
    method: 'DELETE',
    headers: withAuth(),
  });
  if (!res.ok) throw new Error('Failed to delete category');
  return res.text();
}

export async function getCategory(id) {
  const res = await fetchWithAuthRetry(`${API_BASE_URL}/api/categories/${id}`, {
    headers: withAuth(),
  });
  if (!res.ok) throw new Error('Failed to fetch category');
  return res.json();
}

// Fetch transactions, optionally filtered by type ('income', 'expense', or undefined)
export async function fetchTransactions({ type } = {}) {
  let url = `${API_BASE_URL}/api/transactions`;
  if (type && type !== 'all') {
    url += `?type=${encodeURIComponent(type)}`;
  }
  const res = await fetchWithAuthRetry(url, {
    headers: withAuth(),
  });
  if (!res.ok) throw new Error('Failed to fetch transactions');
  return res.json();
}

export async function addTransaction(transaction) {
  const res = await fetchWithAuthRetry(`${API_BASE_URL}/api/transactions`, {
    method: 'POST',
    headers: withAuth({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(transaction),
  });
  if (!res.ok) throw new Error('Failed to add transaction');
  return res.json();
}

export async function updateTransaction(id, transaction) {
  const res = await fetchWithAuthRetry(`${API_BASE_URL}/api/transactions/${id}`, {
    method: 'PUT',
    headers: withAuth({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(transaction),
  });
  if (!res.ok) throw new Error('Failed to update transaction');
  return res.json();
}

export async function deleteTransaction(id) {
  const res = await fetchWithAuthRetry(`${API_BASE_URL}/api/transactions/${id}`, {
    method: 'DELETE',
    headers: withAuth(),
  });
  if (!res.ok) throw new Error('Failed to delete transaction');
  return res.text();
}

export async function getTransaction(id) {
  const res = await fetchWithAuthRetry(`${API_BASE_URL}/api/transactions/${id}`, {
    headers: withAuth(),
  });
  if (!res.ok) throw new Error('Failed to fetch transaction');
  return res.json();
}
