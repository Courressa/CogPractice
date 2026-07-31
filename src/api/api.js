const API_BASE =
import.meta.env.VITE_API_BASE_URL ||
'https://8v95qzed38.execute-api.us-east-1.amazonaws.com/api/v1';

async function request(path, options = {}) {
const token = sessionStorage.getItem('token');

const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
};

const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
});

const data = await res.json().catch(() => ({}));

if (!res.ok) {
    const error = new Error(data.message || `Request failed (${res.status})`);
    error.status = res.status;
    throw error;
}

return data;
}

export const api = {
register: (body) =>
    request('/auth/register', {
        method: 'POST',
        body: JSON.stringify(body),
    }),

    customerLogin: (username, password) =>
        request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
    }),

    adminLogin: (username, password) =>
        request('/auth/admin/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
    }),

    getCustomer: (id) => request(`/customers/${id}`),
    getAllCustomers: () => request('/customers'),
    deleteCustomer: (id) =>
        request(`/customers/${id}`, { method: 'DELETE' }),
    updateCustomer: (id, body) =>
        request(`/customers/${id}`, {
        method: 'PUT',
        body: JSON.stringify(body),
    }),
};