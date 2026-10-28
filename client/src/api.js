const BASE_URL = 'http://localhost:5000/api';

async function request(path, options = {}) {
  let response;
  const token = localStorage.getItem('studymate_token');
  try {
    response = await fetch(BASE_URL + path, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
      },
    });
  } catch {
    throw new Error('Cannot reach the server. Is the backend running?');
  }

  const body = await response.json().catch(() => null);
  if (!response.ok) {
    if (response.status === 401 && path !== '/auth/login' && path !== '/auth/register') {
      localStorage.removeItem('studymate_token');
      localStorage.removeItem('studymate_user');
      window.dispatchEvent(new Event('studymate:unauthorized'));
    }
    throw new Error(body?.message || 'Something went wrong');
  }
  return body?.data;
}

export const api = {
  register: (data) => request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  login: (data) => request('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  me: () => request('/auth/me'),

  getStats: () => request('/dashboard/stats'),
  getAssignments: () => request('/assignments'),
  createAssignment: (data) => request('/assignments', { method: 'POST', body: JSON.stringify(data) }),
  updateAssignment: (id, data) => request(`/assignments/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  updateAssignmentStatus: (id, status) => request(`/assignments/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  deleteAssignment: (id) => request(`/assignments/${id}`, { method: 'DELETE' }),
  getActivities: () => request('/activities'),
  createActivity: (data) => request('/activities', { method: 'POST', body: JSON.stringify(data) }),
  deleteActivity: (id) => request(`/activities/${id}`, { method: 'DELETE' }),
};
