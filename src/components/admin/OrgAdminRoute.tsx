import { useState, useEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useAuth, isSuperAdmin } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

interface OrgAdminRouteProps {
  children: React.ReactNode;
}

/**
 * Route guard for org-specific admin pages.
 * Allows access if:
 * 1. User is a super admin (can access all orgs), OR
 * 2. User is an admin of the specific organization
 */
export function OrgAdminRoute({ children }: OrgAdminRouteProps) {
  const { user, loading: authLoading } = useAuth();
  const { orgSlug } = useParams<{ orgSlug: string }>();
  const [isOrgAdmin, setIsOrgAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkOrgAdmin() {
      if (!user || !orgSlug) {
        setIsOrgAdmin(false);
        setLoading(false);
        return;
      }

      // Super admins can access any org
      if (isSuperAdmin(user.email)) {
        setIsOrgAdmin(true);
        setLoading(false);
        return;
      }

      // Check if user is an admin of this specific org using RPC (bypasses RLS issues)
      try {
        const { data: isAdmin, error } = await supabase.rpc('check_org_admin', {
          p_org_slug: orgSlug
        });

        if (error) {
          console.error('Error checking org admin:', error);
          setIsOrgAdmin(false);
        } else {
          setIsOrgAdmin(isAdmin === true);
        }
      } catch (err) {
        console.error('Error checking org admin:', err);
        setIsOrgAdmin(false);
      }
      setLoading(false);
    }

    if (!authLoading) {
      checkOrgAdmin();
    }
  }, [user, orgSlug, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  // Super admin always has access - check directly in render to avoid race conditions
  if (isSuperAdmin(user.email)) {
    return <>{children}</>;
  }

  if (!isOrgAdmin) {
    return (
      <div className="max-w-md mx-auto text-center py-12">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">🚫</span>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h2>
        <p className="text-gray-600 mb-4">
          You don't have admin access to this organization.
        </p>
        <a
          href="/"
          className="text-teal-600 hover:text-teal-700 font-medium"
        >
          Return to Academy
        </a>
      </div>
    );
  }

  return <>{children}</>;
}
