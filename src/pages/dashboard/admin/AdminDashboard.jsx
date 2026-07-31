import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { api } from '../../../api/api';
import './AdminDashboard.css';

function AdminDashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [customers, setCustomers] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);

    async function loadCustomers() {
        setLoading(true);
        setError('');
        try {
            const data = await api.getAllCustomers();
            setCustomers(Array.isArray(data) ? data : data.customers || []);
        } catch (err) {
            setError(err.message || 'Could not load customers.');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadCustomers();
    }, []);

    async function handleDelete(id, username) {
        if (!window.confirm(`Delete customer "${username}"? This cannot be undone.`)) {
            return;
        }
        setDeletingId(id);
        setError('');
        setSuccess('');
        try {
            await api.deleteCustomer(id);
            setCustomers((prev) => prev.filter((c) => c.id !== id));
            setSuccess(`Deleted ${username}.`);
        } catch (err) {
            setError(err.message || 'Delete failed.');
        } finally {
            setDeletingId(null);
        }
    }

    if (loading && customers.length === 0 && !error) {
        return (
            <div className="page">
                <div className="loading-block">
                <div className="spinner spinner-lg" aria-hidden="true" />
                <span>Loading admin dashboard…</span>
                </div>
            </div>
        );
    }

    return (
        <div className="page">
        <div className="page-header admin-header">
            <div>
            <h1>Staff dashboard</h1>
            <p>
                Signed in as <strong>{user?.username}</strong>
            </p>
            </div>
            <div className="btn-group">
            <button type="button" className="btn btn-secondary btn-sm" onClick={loadCustomers}>
                Refresh
            </button>
            <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => {
                logout();
                navigate('/');
                }}
            >
                Sign out
            </button>
            </div>
        </div>

        {error && (
            <div className="banner banner-error" role="alert">
            {error}
            </div>
        )}
        {success && (
            <div className="banner banner-success" role="status">
            {success}
            </div>
        )}

        <div className="card admin-stats">
            <div>
            <strong>{customers.length}</strong>
            <span>Customers</span>
            </div>
        </div>

        <h2 className="section-title">All customers</h2>
        <div className="table-wrap">
            <table className="data-table">
            <thead>
                <tr>
                <th>Username</th>
                <th>Name</th>
                <th>Email</th>
                <th>ID</th>
                <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {customers.length === 0 ? (
                <tr className="empty-row">
                    <td colSpan={5}>No customers found.</td>
                </tr>
                ) : (
                customers.map((c) => (
                    <tr key={c.id}>
                    <td>{c.username}</td>
                    <td>
                        {[c.firstName, c.lastName].filter(Boolean).join(' ') || '—'}
                    </td>
                    <td>{c.email || '—'}</td>
                    <td className="id-cell">{c.id}</td>
                    <td>
                        <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        disabled={deletingId === c.id}
                        onClick={() => handleDelete(c.id, c.username)}
                        >
                        {deletingId === c.id ? 'Deleting…' : 'Delete'}
                        </button>
                    </td>
                    </tr>
                ))
                )}
            </tbody>
            </table>
        </div>
        </div>
    );
}

export default AdminDashboard;