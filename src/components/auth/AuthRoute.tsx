import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ChangePassword } from '../ChangePassword';

interface AuthRouteProps {
  children: React.ReactNode;
}

/**
 * Route guard that requires authentication.
 * Redirects to landing page with a return URL if not authenticated.
 * Shows password change screen for provisioned accounts.
 */
export function AuthRoute({ children }: AuthRouteProps) {
  const { user, loading, mustChangePassword, clearPasswordChangeFlag } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (!user) {
    // Redirect to landing page, preserving the intended destination
    return <Navigate to="/" state={{ from: location, showSignIn: true }} replace />;
  }

  // Provisioned accounts must change password before accessing content
  if (mustChangePassword) {
    return (
      <ChangePassword
        isRequired={true}
        onComplete={clearPasswordChangeFlag}
      />
    );
  }

  return <>{children}</>;
}
