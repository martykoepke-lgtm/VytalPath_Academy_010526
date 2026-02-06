import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { ChangePassword } from '../ChangePassword';

interface AuthRouteProps {
  children: React.ReactNode;
}

/**
 * Route guard that requires authentication AND active subscription.
 * Redirects to landing page with a return URL if not authenticated.
 * Redirects to pricing page if no active subscription.
 * Shows password change screen for provisioned accounts.
 */
export function AuthRoute({ children }: AuthRouteProps) {
  const { user, loading: authLoading, mustChangePassword, clearPasswordChangeFlag } = useAuth();
  const { hasAccess, loading: subLoading } = useSubscription();
  const location = useLocation();

  // Show loading while checking auth and subscription
  if (authLoading || subLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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

  // Check for active subscription
  if (!hasAccess) {
    // Redirect to pricing page if no subscription
    return <Navigate to="/pricing" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
