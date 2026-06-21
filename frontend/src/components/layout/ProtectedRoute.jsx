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

  // Redirect unauthorized roles to landing page
  if (roles.length && !roles.includes(user.role)) {
    return <Navigate to="/landing" replace />;
  }

  return children;
}