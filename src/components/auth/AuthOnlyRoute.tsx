import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface AuthOnlyRouteProps {
  children: React.ReactNode;
}

/**
 * Route guard that requires authentication only (no subscription check).
 * Used for pages like Account that need to work even with expired subscriptions.
 */
export function AuthOnlyRoute({ children }: AuthOnlyRouteProps) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" state={{ from: location, showSignIn: true }} replace />;
  }

  return <>{children}</>;
}
