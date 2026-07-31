import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { api } from '../../../api/api';
import ProfileEditForm from '../../../components/profile/ProfileEditForm.jsx';
import ChangePasswordForm from '../../../components/profile/ChangePasswordForm.jsx';
import '../../../components/profile/ProfileForms.css';
import './AdminDashboard.css';

function AdminDashboard() {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  // Own account profile
  const [adminProfile, setAdminProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [editingProfile, setEditingProfile] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');

  const loadCustomers = useCallback(async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const list = await api.getAllCustomers(); // always an array
      setCustomers(list);
    } catch (err) {
      setError(err.message || 'Could not load customers.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setProfileLoading(true);
      try {
        // Prefer full profile from API when available
        const data = await api.getCustomer(user.id);
        if (!cancelled) setAdminProfile(data);
      } catch {
        if (!cancelled) setAdminProfile(user);
      } finally {
        if (!cancelled) setProfileLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
    // Only re-load when account id changes (not after every local profile merge)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional: user.id
  }, [user?.id]);

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

  const handleProfileSave = async (payload) => {
    setSavingProfile(true);
    setProfileError('');
    setProfileSuccess('');
    try {
      const updated = await api.updateCustomer(user.id, payload);
      const next = { ...adminProfile, ...updated, ...payload };
      setAdminProfile(next);
      updateUser({
        username: next.username,
        email: next.email,
        firstName: next.firstName,
        lastName: next.lastName,
      });
      setProfileSuccess('Your account profile was updated.');
      setEditingProfile(false);
    } catch (err) {
      throw err;
    } finally {
      setSavingProfile(false);
    }
  };

  if (loading && customers.length === 0 && !error && profileLoading) {
    return (
      <div className="page">
        <div className="loading-block">
          <div className="spinner spinner-lg" aria-hidden="true" />
          <span>Loading admin dashboard…</span>
        </div>
      </div>
    );
  }

  const displayName = [adminProfile?.firstName, adminProfile?.lastName]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="page admin-dashboard">
      <div className="page-header admin-header">
        <div>
          <h1>Staff dashboard</h1>
          <p>
            Signed in as <strong>{user?.username}</strong>
          </p>
        </div>
        <div className="btn-group admin-actions">
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={loadCustomers}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner spinner-sm" aria-hidden="true" />
                Refreshing…
              </>
            ) : (
              'Refresh'
            )}
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

      {/* ── Own account (admin cannot edit other users' profiles) ── */}
      <section className="admin-account-section" aria-labelledby="admin-account-heading">
        <h2 id="admin-account-heading" className="section-title">
          My account
        </h2>
        <p className="admin-account-hint">
          Update your own staff profile and password. Customer records below are view/delete only.
        </p>

        {profileError && (
          <div className="banner banner-error" role="alert">
            {profileError}
          </div>
        )}
        {profileSuccess && !editingProfile && (
          <div className="banner banner-success" role="status">
            {profileSuccess}
          </div>
        )}

        {profileLoading ? (
          <div className="loading-block">
            <div className="spinner spinner-sm" aria-hidden="true" />
            <span>Loading your account…</span>
          </div>
        ) : (
          <div className="profile-forms-stack">
            <div className="card profile-form-card">
              <h3 className="card-title">Account details</h3>
              <p className="card-desc">
                {displayName || adminProfile?.username || 'Staff account'}
              </p>

              {editingProfile ? (
                <ProfileEditForm
                  initial={adminProfile}
                  onSubmit={handleProfileSave}
                  onCancel={() => {
                    setEditingProfile(false);
                    setProfileError('');
                  }}
                  loading={savingProfile}
                />
              ) : (
                <>
                  <dl className="profile-list">
                    <div className="profile-row">
                      <dt>Username</dt>
                      <dd>{adminProfile?.username ?? '—'}</dd>
                    </div>
                    <div className="profile-row">
                      <dt>Email</dt>
                      <dd>{adminProfile?.email ?? '—'}</dd>
                    </div>
                    <div className="profile-row">
                      <dt>Name</dt>
                      <dd>{displayName || '—'}</dd>
                    </div>
                    <div className="profile-row">
                      <dt>Account ID</dt>
                      <dd className="id-cell">{adminProfile?.id ?? user?.id ?? '—'}</dd>
                    </div>
                  </dl>
                  <div className="profile-view-actions">
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={() => {
                        setEditingProfile(true);
                        setProfileSuccess('');
                        setProfileError('');
                      }}
                    >
                      Edit my profile
                    </button>
                  </div>
                </>
              )}
            </div>

            <div className="card profile-form-card">
              <h3 className="card-title">Change password</h3>
              <p className="card-desc">
                Enter your current password and choose a new one. You must be signed in.
              </p>
              <ChangePasswordForm />
            </div>
          </div>
        )}
      </section>

      <div className="admin-stats-row">
        <div className="card admin-stats">
          <span className="admin-stats-label">Total customers</span>
          <strong className="admin-stats-value">{customers.length}</strong>
          <span className="admin-stats-hint">
            {loading ? 'Updating…' : 'Live from the API'}
          </span>
        </div>
      </div>

      <section className="admin-table-section">
        <div className="section-row">
          <h2 className="section-title">All customers</h2>
          {loading && customers.length > 0 && (
            <span className="admin-refresh-hint">
              <span className="spinner spinner-sm" aria-hidden="true" />
              Refreshing list…
            </span>
          )}
        </div>

        <div className={`table-wrap${loading && customers.length > 0 ? ' is-refreshing' : ''}`}>
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
                    <td className="username-cell">{c.username}</td>
                    <td>
                      {[c.firstName, c.lastName].filter(Boolean).join(' ') || '—'}
                    </td>
                    <td>{c.email || '—'}</td>
                    <td className="id-cell">{c.id}</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        disabled={deletingId === c.id || loading}
                        onClick={() => handleDelete(c.id, c.username)}
                      >
                        {deletingId === c.id ? (
                          <>
                            <span className="spinner spinner-sm" aria-hidden="true" />
                            Deleting…
                          </>
                        ) : (
                          'Delete'
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default AdminDashboard;
