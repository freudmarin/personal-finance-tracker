
import { API_BASE_URL } from './config';
// Generate or retrieve a persistent client ID for this browser/account
const CLIENT_ID_KEY = 'expense_tracker_client_id';
function getClientId() {
  let id = localStorage.getItem(CLIENT_ID_KEY);
  if (!id) {
    id = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2) + Date.now();
    localStorage.setItem(CLIENT_ID_KEY, id);
  }
  return id;
}


function withClientId(headers = {}) {
  return { ...headers, 'X-Client-Id': getClientId() };
}

// Category API
export async function fetchCategories() {
  const res = await fetch(`${API_BASE_URL}/api/categories`, {
    headers: withClientId(),
  });
  if (!res.ok) throw new Error('Failed to fetch categories');
  return res.json();
}

export async function addCategory(category) {
  const res = await fetch(`${API_BASE_URL}/api/categories`, {
    method: 'POST',
    headers: withClientId({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(category),
  });
  if (!res.ok) throw new Error('Failed to add category');
  return res.json();
}

export async function updateCategory(id, category) {
  const res = await fetch(`${API_BASE_URL}/api/categories/${id}`, {
    method: 'PUT',
    headers: withClientId({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(category),
  });
  if (!res.ok) throw new Error('Failed to update category');
  return res.json();
}

export async function deleteCategory(id) {
  const res = await fetch(`${API_BASE_URL}/api/categories/${id}`, {
    method: 'DELETE',
    headers: withClientId(),
  });
  if (!res.ok) throw new Error('Failed to delete category');
  return res.text();
}

export async function getCategory(id) {
  const res = await fetch(`${API_BASE_URL}/api/categories/${id}`, {
    headers: withClientId(),
  });
  if (!res.ok) throw new Error('Failed to fetch category');
  return res.json();
}


export async function fetchExpenses() {
  const res = await fetch(`${API_BASE_URL}/api/expenses`, {
    headers: withClientId(),
  });
  if (!res.ok) throw new Error('Failed to fetch expenses');
  return res.json();
}


export async function addExpense(expense) {
  const res = await fetch(`${API_BASE_URL}/api/expenses`, {
    method: 'POST',
    headers: withClientId({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(expense),
  });
  if (!res.ok) throw new Error('Failed to add expense');
  return res.json();
}


export async function updateExpense(id, expense) {
  const res = await fetch(`${API_BASE_URL}/api/expenses/${id}`, {
    method: 'PUT',
    headers: withClientId({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(expense),
  });
  if (!res.ok) throw new Error('Failed to update expense');
  return res.json();
}


export async function deleteExpense(id) {
  const res = await fetch(`${API_BASE_URL}/api/expenses/${id}`, {
    method: 'DELETE',
    headers: withClientId(),
  });
  if (!res.ok) throw new Error('Failed to delete expense');
  return res.text();
}


export async function getExpense(id) {
  const res = await fetch(`${API_BASE_URL}/api/expenses/${id}`, {
    headers: withClientId(),
  });
  if (!res.ok) throw new Error('Failed to fetch expense');
  return res.json();
}
