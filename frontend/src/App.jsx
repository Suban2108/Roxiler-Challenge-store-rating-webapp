import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { ErrorBoundary } from '@/components/layout/ErrorBoundary';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import ChangePasswordPage from '@/pages/ChangePasswordPage';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminUsersPage from '@/pages/admin/AdminUsersPage';
import AdminStoresPage from '@/pages/admin/AdminStoresPage';
import CreateUserPage from '@/pages/admin/CreateUserPage';
import CreateStorePage from '@/pages/admin/CreateStorePage';
import UserDetailPage from '@/pages/admin/UserDetailPage';
import StoresPage from '@/pages/user/StoresPage';
import OwnerDashboard from '@/pages/owner/OwnerDashboard';
import { LoadingAnimation } from '@/components/LoadingAnimation';

function HomeRedirect() {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingAnimation />
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (user.role === 'admin') return <Navigate to="/admin" replace />;
  if (user.role === 'store_owner') return <Navigate to="/owner" replace />;
  return <Navigate to="/dashboard" replace />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomeRedirect />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route
        path="/change-password"
        element={
          <ProtectedRoute roles={['user', 'store_owner', 'admin']}>
            <ErrorBoundary>
              <ChangePasswordPage />
            </ErrorBoundary>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute roles={['admin']}>
            <ErrorBoundary>
              <AdminDashboard />
            </ErrorBoundary>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute roles={['admin']}>
            <ErrorBoundary>
              <AdminUsersPage />
            </ErrorBoundary>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users/new"
        element={
          <ProtectedRoute roles={['admin']}>
            <ErrorBoundary>
              <CreateUserPage />
            </ErrorBoundary>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users/:id"
        element={
          <ProtectedRoute roles={['admin']}>
            <ErrorBoundary>
              <UserDetailPage />
            </ErrorBoundary>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/stores"
        element={
          <ProtectedRoute roles={['admin']}>
            <ErrorBoundary>
              <AdminStoresPage />
            </ErrorBoundary>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/stores/new"
        element={
          <ProtectedRoute roles={['admin']}>
            <ErrorBoundary>
              <CreateStorePage />
            </ErrorBoundary>
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute roles={['user']}>
            <ErrorBoundary>
              <StoresPage />
            </ErrorBoundary>
          </ProtectedRoute>
        }
      />

      <Route
        path="/owner"
        element={
          <ProtectedRoute roles={['store_owner']}>
            <ErrorBoundary>
              <OwnerDashboard />
            </ErrorBoundary>
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}
