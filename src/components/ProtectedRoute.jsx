import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Protects a route.
 * - requireAdmin: only staff (isAdmin === true)
 * - requireCustomer: only non-admin customers
 */
function ProtectedRoute({ children, requireAdmin = false, requireCustomer = false }) {
    const { user, loading, isAuthenticated } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
        <div className="page">
            <div className="loading-block">
            <div className="spinner spinner-lg" aria-hidden="true" />
            <span>Loading…</span>
            </div>
        </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    if (requireAdmin && !user?.isAdmin) {
        return <Navigate to="/dashboard" replace />;
    }

    if (requireCustomer && user?.isAdmin) {
        return <Navigate to="/admin/dashboard" replace />;
    }

    return children;
}

export default ProtectedRoute;