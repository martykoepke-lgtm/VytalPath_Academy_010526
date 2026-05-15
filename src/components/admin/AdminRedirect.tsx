import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { isSuperAdmin } from './AdminLogin';

/**
 * Smart redirect for the /admin/redirect URL.
 * - Admins → /admin (platform overview)
 * - Anyone else → /welcome (or /, if not signed in we go via /admin/login first)
 *
 * Under the single-tenant model (ADR-001), there is no org_admin role,
 * so this resolves purely by email match against the ADMIN_EMAILS list.
 */
export function AdminRedirect() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      navigate('/admin/login');
      return;
    }

    if (isSuperAdmin(user.email)) {
      navigate('/admin');
      return;
    }

    // Non-admin authenticated user — send to the standard welcome page
    navigate('/welcome');
  }, [user, authLoading, navigate]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
        <p className="text-gray-500">Redirecting...</p>
      </div>
    </div>
  );
}
