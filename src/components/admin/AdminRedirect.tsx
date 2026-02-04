import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { isSuperAdmin } from './AdminLogin';
import { supabase } from '../../lib/supabase';

/**
 * Smart redirect for admin users.
 * - Super admins → /admin (platform overview)
 * - Org admins → /admin/orgs/:slug (their org dashboard)
 * - Regular users → / (home)
 */
export function AdminRedirect() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function checkAndRedirect() {
      if (authLoading) return;

      if (!user) {
        navigate('/admin/login');
        return;
      }

      // Super admins go to platform overview
      if (isSuperAdmin(user.email)) {
        navigate('/admin');
        return;
      }

      // Check if user is an org admin
      try {
        const { data, error } = await supabase
          .from('org_members')
          .select(`
            role,
            organization:organizations(slug)
          `)
          .eq('user_id', user.id)
          .eq('role', 'admin')
          .limit(1)
          .single();

        if (!error && data?.organization) {
          // Redirect to their org dashboard
          const org = data.organization as { slug: string };
          navigate(`/admin/orgs/${org.slug}`);
          return;
        }
      } catch {
        // Not an org admin
      }

      // Regular user - go home
      navigate('/');
    }

    checkAndRedirect();
    setChecking(false);
  }, [user, authLoading, navigate]);

  if (authLoading || checking) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Redirecting...</p>
        </div>
      </div>
    );
  }

  return null;
}
