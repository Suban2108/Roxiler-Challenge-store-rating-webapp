import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { LoadingAnimation } from '@/components/LoadingAnimation';

export function ProtectedRoute({ children, roles = [] }) {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingAnimation />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (roles.length && !roles.includes(user.role)) {
    const redirect =
      user.role === 'admin' ? '/admin' : user.role === 'store_owner' ? '/owner' : '/dashboard';
    return <Navigate to={redirect} replace />;
  }

  return children;
}
