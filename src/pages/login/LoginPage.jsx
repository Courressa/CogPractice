import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../api/api.js';
import { useAuth } from '../../context/AuthContext.jsx';

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [role, setRole] = useState('customer'); // UI only — never sent to API
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const u = username.trim();
    const p = password;

    if (!u || !p) {
      setError('Username and password are required.');
      return;
    }

    setLoading(true);
    try {
      const data =
        role === 'customer'
          ? await api.customerLogin(u, p)
          : await api.adminLogin(u, p);

      login(data.token, data.user);

      if (data.user?.isAdmin) {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page auth-page">
      <div className="auth-card card">
        <div className="auth-brand" aria-hidden="true">
          <span className="auth-brand-mark">B</span>
        </div>

        <div className="page-header">
          <h1>Sign in</h1>
          <p>Access your BankUI account securely.</p>
        </div>

        <div className="role-toggle" role="tablist" aria-label="Login type">
          <button
            type="button"
            role="tab"
            aria-selected={role === 'customer'}
            className={role === 'customer' ? 'role-btn active' : 'role-btn'}
            onClick={() => {
              setRole('customer');
              setError('');
            }}
          >
            Customer
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={role === 'staff'}
            className={role === 'staff' ? 'role-btn active' : 'role-btn'}
            onClick={() => {
              setRole('staff');
              setError('');
            }}
          >
            Staff
          </button>
        </div>

        {error && (
          <div className="banner banner-error" role="alert">
            {error}
          </div>
        )}

        <form className="form-grid" onSubmit={handleSubmit} noValidate>
          <div className="form-field">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError('');
              }}
              required
              autoComplete="username"
              placeholder="Enter your username"
            />
          </div>

          <div className="form-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              required
              autoComplete="current-password"
              placeholder="••••••••"
            />
          </div>

          <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner spinner-sm" aria-hidden="true" />
                Signing in…
              </>
            ) : role === 'staff' ? (
              'Staff sign in'
            ) : (
              'Sign in'
            )}
          </button>
        </form>

        {role === 'customer' && (
          <p className="auth-switch">
            New customer? <Link to="/register">Create an account</Link>
          </p>
        )}
      </div>
    </div>
  );
}

export default LoginPage;
