
const API_BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

const request = async (path, options = {}) => {
  const token = localStorage.getItem('taskflow_token');
  const response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options.headers } });
  const data = await response.json().catch(() => ({ message: 'Unable to connect to the server.' }));
  if (!response.ok) throw new Error(data.message || 'Request failed');
  return data;
};
export const api = {
  login: (body) => request('/api/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  register: (body) => request('/api/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  tasks: (params) => request(`/api/tasks?${new URLSearchParams(params)}`),
  createTask: (body) => request('/api/tasks', { method: 'POST', body: JSON.stringify(body) }),
  updateTask: (id, body) => request(`/api/tasks/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteTask: (id) => request(`/api/tasks/${id}`, { method: 'DELETE' }),
  completeTask: (id) => request(`/api/tasks/${id}/complete`, { method: 'PATCH' }),
  analytics: () => request('/api/analytics')
};
