import { useState } from 'react';

/**
 * Editable account profile fields (own account only).
 * Parent handles API call via onSubmit(payload).
 */
function ProfileEditForm({
  initial = {},
  onSubmit,
  onCancel,
  loading = false,
  submitLabel = 'Save changes',
}) {
  const [form, setForm] = useState({
    username: initial.username ?? '',
    email: initial.email ?? '',
    firstName: initial.firstName ?? '',
    lastName: initial.lastName ?? '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const username = form.username.trim();
    const email = form.email.trim();
    const firstName = form.firstName.trim();
    const lastName = form.lastName.trim();

    if (!username || !email || !firstName || !lastName) {
      setError('All fields are required.');
      return;
    }
    if (username.length < 4 || username.length > 20) {
      setError('Username must be 4–20 characters.');
      return;
    }

    try {
      await onSubmit({ username, email, firstName, lastName });
    } catch (err) {
      setError(err.message || 'Could not update profile.');
    }
  };

  return (
    <form className="form-grid" onSubmit={handleSubmit} noValidate>
      {error && (
        <div className="banner banner-error" role="alert">
          {error}
        </div>
      )}

      <div className="form-grid cols-2">
        <div className="form-field">
          <label htmlFor="profile-firstName">First name</label>
          <input
            id="profile-firstName"
            name="firstName"
            type="text"
            value={form.firstName}
            onChange={handleChange}
            required
            autoComplete="given-name"
            disabled={loading}
          />
        </div>
        <div className="form-field">
          <label htmlFor="profile-lastName">Last name</label>
          <input
            id="profile-lastName"
            name="lastName"
            type="text"
            value={form.lastName}
            onChange={handleChange}
            required
            autoComplete="family-name"
            disabled={loading}
          />
        </div>
      </div>

      <div className="form-field">
        <label htmlFor="profile-username">Username</label>
        <input
          id="profile-username"
          name="username"
          type="text"
          value={form.username}
          onChange={handleChange}
          required
          autoComplete="username"
          minLength={4}
          maxLength={20}
          disabled={loading}
        />
        <span className="hint">4–20 characters · letters, numbers, underscores</span>
      </div>

      <div className="form-field">
        <label htmlFor="profile-email">Email</label>
        <input
          id="profile-email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
          autoComplete="email"
          disabled={loading}
        />
      </div>

      <div className="profile-form-actions">
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? (
            <>
              <span className="spinner spinner-sm" aria-hidden="true" />
              Saving…
            </>
          ) : (
            submitLabel
          )}
        </button>
        {onCancel && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default ProfileEditForm;
