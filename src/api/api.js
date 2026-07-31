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
        error.data = data;
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

    /** Returns the user object (unwraps { user }) */
    getCustomer: async (id) => {
        const data = await request(`/customers/${id}`);
        return data.user ?? data;
    },

    /** Returns an array (unwraps { customers }) */
    getAllCustomers: async () => {
        try {
            const data = await request('/customers');
            if (Array.isArray(data)) return data;
            if (Array.isArray(data.customers)) return data.customers;
            return [];
        } catch (err) {
        // Backend returns 404 when there are zero customers
        if (err.status === 404) return [];
            throw err;
        }
    },

    deleteCustomer: (id) =>
        request(`/customers/${id}`, { method: 'DELETE' }),

    updateCustomer: async (id, body) => {
        const data = await request(`/customers/${id}`, {
            method: 'PUT',
            body: JSON.stringify(body),
        });
        return data.user ?? data;
    },

    /** Authenticated user changes their own password */
    changePassword: (currentPassword, newPassword) =>
        request('/auth/password', {
            method: 'PATCH',
            body: JSON.stringify({ currentPassword, newPassword }),
        }),
};