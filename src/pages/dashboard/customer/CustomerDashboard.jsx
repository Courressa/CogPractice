import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext.jsx';
import { api } from '../../../api/api.js';
import './CustomerDashboard.css';

function CustomerDashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        (async () => {
        try {
            const data = await api.getCustomer(user.id);
            if (!cancelled) setProfile(data);
        } catch (err) {
            if (!cancelled) {
                setError(err.message || 'Could not load profile.');
                setProfile(user); // fallback to JWT payload
            }
        } finally {
            if (!cancelled) setLoading(false);
        }
        })();

        return () => {
        cancelled = true;
        };
    }, [user]);

    if (loading) {
        return (
        <div className="page">
            <div className="loading-block">
            <div className="spinner spinner-lg" aria-hidden="true" />
            <span>Loading your profile…</span>
            </div>
        </div>
        );
    }

    return (
        <div className="page">
        <div className="page-header">
            <h1>Welcome{profile?.firstName ? `, ${profile.firstName}` : ''}</h1>
            <p>Your customer profile</p>
        </div>

        {error && (
            <div className="banner banner-error" role="alert">
            {error}
            </div>
        )}

        <div className="card profile-card">
            <h2 className="card-title">Account details</h2>
            <dl className="profile-list">
            <div>
                <dt>Username</dt>
                <dd>{profile?.username ?? '—'}</dd>
            </div>
            <div>
                <dt>Email</dt>
                <dd>{profile?.email ?? '—'}</dd>
            </div>
            <div>
                <dt>Name</dt>
                <dd>
                {[profile?.firstName, profile?.lastName].filter(Boolean).join(' ') || '—'}
                </dd>
            </div>
            <div>
                <dt>Customer ID</dt>
                <dd className="id-cell">{profile?.id ?? '—'}</dd>
            </div>
            </dl>
            <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
                logout();
                navigate('/');
            }}
            >
            Sign out
            </button>
        </div>
        </div>
    );
}

export default CustomerDashboard;