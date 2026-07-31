import { useState } from 'react';
import { api } from '../../api/api.js';

/**
 * Change password for the currently authenticated user.
 * PATCH /auth/password with { currentPassword, newPassword }.
 */
function ChangePasswordForm({ onSuccess }) {
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const { currentPassword, newPassword, confirmNewPassword } = form;

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setError('All password fields are required.');
      return;
    }
    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setError('New passwords do not match.');
      return;
    }
    if (newPassword === currentPassword) {
      setError('New password must be different from your current password.');
      return;
    }

    setLoading(true);
    try {
      await api.changePassword(currentPassword, newPassword);
      setForm({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
      setSuccess('Password updated successfully.');
      onSuccess?.();
    } catch (err) {
      setError(err.message || 'Could not change password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="form-grid" onSubmit={handleSubmit} noValidate>
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

      <div className="form-field">
        <label htmlFor="currentPassword">Current password</label>
        <input
          id="currentPassword"
          name="currentPassword"
          type="password"
          value={form.currentPassword}
          onChange={handleChange}
          required
          autoComplete="current-password"
          disabled={loading}
        />
      </div>

      <div className="form-field">
        <label htmlFor="newPassword">New password</label>
        <input
          id="newPassword"
          name="newPassword"
          type="password"
          value={form.newPassword}
          onChange={handleChange}
          required
          autoComplete="new-password"
          minLength={8}
          disabled={loading}
        />
        <span className="hint">At least 8 characters</span>
      </div>

      <div className="form-field">
        <label htmlFor="confirmNewPassword">Confirm new password</label>
        <input
          id="confirmNewPassword"
          name="confirmNewPassword"
          type="password"
          value={form.confirmNewPassword}
          onChange={handleChange}
          required
          autoComplete="new-password"
          minLength={8}
          disabled={loading}
        />
      </div>

      <div className="profile-form-actions">
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? (
            <>
              <span className="spinner spinner-sm" aria-hidden="true" />
              Updating…
            </>
          ) : (
            'Update password'
          )}
        </button>
      </div>
    </form>
  );
}

export default ChangePasswordForm;
