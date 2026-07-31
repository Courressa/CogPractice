import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext.jsx';
import { api } from '../../../api/api.js';
import ProfileEditForm from '../../../components/profile/ProfileEditForm.jsx';
import ChangePasswordForm from '../../../components/profile/ChangePasswordForm.jsx';
import '../../../components/profile/ProfileForms.css';
import './CustomerDashboard.css';

function getInitials(profile) {
  const first = profile?.firstName?.trim()?.[0] || '';
  const last = profile?.lastName?.trim()?.[0] || '';
  if (first || last) return `${first}${last}`.toUpperCase();
  return (profile?.username?.[0] || '?').toUpperCase();
}

function CustomerDashboard() {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

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
    // Only re-load when account id changes (not after every local profile merge)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional: user.id
  }, [user?.id]);

  const handleProfileSave = async (payload) => {
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const updated = await api.updateCustomer(user.id, payload);
      const next = { ...profile, ...updated, ...payload };
      setProfile(next);
      updateUser({
        username: next.username,
        email: next.email,
        firstName: next.firstName,
        lastName: next.lastName,
      });
      setSuccess('Profile updated successfully.');
      setEditing(false);
    } catch (err) {
      throw err; // ProfileEditForm shows the error
    } finally {
      setSaving(false);
    }
  };

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

  const displayName = [profile?.firstName, profile?.lastName].filter(Boolean).join(' ');

  return (
    <div className="page customer-dashboard">
      <div className="page-header customer-header">
        <div>
          <h1>Welcome{profile?.firstName ? `, ${profile.firstName}` : ''}</h1>
          <p>Your customer profile and account details</p>
        </div>
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

      {error && (
        <div className="banner banner-error" role="alert">
          {error}
        </div>
      )}
      {success && !editing && (
        <div className="banner banner-success" role="status">
          {success}
        </div>
      )}

      <div className="profile-forms-stack">
        <div className="card profile-card profile-form-card">
          <div className="profile-top">
            <div className="profile-avatar" aria-hidden="true">
              {getInitials(profile)}
            </div>
            <div className="profile-top-text">
              <h2 className="card-title">Account details</h2>
              <p className="profile-subtitle">
                {displayName || profile?.username || 'Customer account'}
              </p>
            </div>
          </div>

          {editing ? (
            <ProfileEditForm
              initial={profile}
              onSubmit={handleProfileSave}
              onCancel={() => {
                setEditing(false);
                setError('');
              }}
              loading={saving}
            />
          ) : (
            <>
              <dl className="profile-list">
                <div className="profile-row">
                  <dt>Username</dt>
                  <dd>{profile?.username ?? '—'}</dd>
                </div>
                <div className="profile-row">
                  <dt>Email</dt>
                  <dd>{profile?.email ?? '—'}</dd>
                </div>
                <div className="profile-row">
                  <dt>Name</dt>
                  <dd>{displayName || '—'}</dd>
                </div>
                <div className="profile-row">
                  <dt>Customer ID</dt>
                  <dd className="id-cell">{profile?.id ?? '—'}</dd>
                </div>
              </dl>
              <div className="profile-view-actions">
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => {
                    setEditing(true);
                    setSuccess('');
                    setError('');
                  }}
                >
                  Edit profile
                </button>
              </div>
            </>
          )}
        </div>

        <div className="card profile-form-card">
          <h2 className="card-title">Change password</h2>
          <p className="card-desc">
            Enter your current password and choose a new one. You must be signed in.
          </p>
          <ChangePasswordForm />
        </div>
      </div>
    </div>
  );
}

export default CustomerDashboard;
