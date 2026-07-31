import { useState, useEffect } from 'react';
import './ServicesPage.css';

const API_BASE = 'http://localhost:3000/api/v1/customers';

function ServicesPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    email: '',
  });

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
  });

  const fetchCustomers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(API_BASE);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to load');
      setCustomers(data.customers || []);
    } catch (err) {
      setError(err.message);
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Create failed');
      alert(data.message);
      setForm({ username: '', password: '', firstName: '', lastName: '', email: '' });
      fetchCustomers();
    } catch (err) {
      alert(err.message);
    }
  };

  const startEdit = (customer) => {
    setEditingId(customer.id);
    setEditForm({
      firstName: customer.firstName || '',
      lastName: customer.lastName || '',
      email: customer.email || '',
      username: customer.username || '',
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Update failed');
      alert(data.message);
      setEditingId(null);
      fetchCustomers();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this customer?')) return;
    try {
      const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Delete failed');
      fetchCustomers();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="page services-page">
      <header className="page-header">
        <h1>Customer management</h1>
        <p>
          Register new customers, review account records, and keep contact details up to
          date. Connected to the BankUI customer API.
        </p>
      </header>

      <section className="section card">
        <h2 className="section-title">Register customer</h2>
        <p className="section-lead">
          Create a new customer profile. Username and password are required.
        </p>
        <form onSubmit={handleCreate} className="form-grid">
          <div className="form-grid cols-2">
            <div className="form-field">
              <label htmlFor="username">Username *</label>
              <input
                id="username"
                placeholder="jdoe"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                required
              />
            </div>
            <div className="form-field">
              <label htmlFor="password">Password *</label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>
            <div className="form-field">
              <label htmlFor="firstName">First name</label>
              <input
                id="firstName"
                placeholder="Jane"
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              />
            </div>
            <div className="form-field">
              <label htmlFor="lastName">Last name</label>
              <input
                id="lastName"
                placeholder="Doe"
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              />
            </div>
          </div>
          <div className="form-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="jane@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div>
            <button type="submit" className="btn btn-primary">
              Register customer
            </button>
          </div>
        </form>
      </section>

      <section className="section">
        <div className="section-row">
          <div>
            <h2 className="section-title">All customers</h2>
            <p className="section-lead">View and maintain existing customer records.</p>
          </div>
          <button type="button" className="btn btn-secondary btn-sm" onClick={fetchCustomers}>
            Refresh
          </button>
        </div>

        {loading && <div className="banner banner-info">Loading customers…</div>}
        {error && (
          <div className="banner banner-error">
            Error: {error}. Make sure the API is running at{' '}
            <code>http://localhost:3000</code>.
          </div>
        )}

        {!loading && !error && (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Username</th>
                  <th>First name</th>
                  <th>Last name</th>
                  <th>Email</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.length === 0 ? (
                  <tr className="empty-row">
                    <td colSpan="6">No customers found. Register one above to get started.</td>
                  </tr>
                ) : (
                  customers.map((c) => (
                    <tr key={c.id}>
                      <td className="id-cell">{c.id}</td>
                      <td>{c.username}</td>
                      <td>{c.firstName || '—'}</td>
                      <td>{c.lastName || '—'}</td>
                      <td>{c.email || '—'}</td>
                      <td>
                        <div className="btn-group">
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            onClick={() => startEdit(c)}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(c.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {editingId && (
        <section className="section card edit-panel">
          <div className="section-row">
            <h2 className="section-title">Edit customer</h2>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setEditingId(null)}
            >
              Cancel
            </button>
          </div>
          <form onSubmit={handleUpdate} className="form-grid">
            <div className="form-grid cols-2">
              <div className="form-field">
                <label htmlFor="edit-username">Username</label>
                <input
                  id="edit-username"
                  value={editForm.username}
                  onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                />
              </div>
              <div className="form-field">
                <label htmlFor="edit-email">Email</label>
                <input
                  id="edit-email"
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                />
              </div>
              <div className="form-field">
                <label htmlFor="edit-firstName">First name</label>
                <input
                  id="edit-firstName"
                  value={editForm.firstName}
                  onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                />
              </div>
              <div className="form-field">
                <label htmlFor="edit-lastName">Last name</label>
                <input
                  id="edit-lastName"
                  value={editForm.lastName}
                  onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                />
              </div>
            </div>
            <div className="btn-group">
              <button type="submit" className="btn btn-primary">
                Save changes
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setEditingId(null)}
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      )}
    </div>
  );
}

export default ServicesPage;
