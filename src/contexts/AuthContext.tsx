import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

// Super admin emails - hardcoded for security
export const SUPER_ADMIN_EMAILS = [
  'mkoepkeci@gmail.com',
  'marty.koepke@practicalinformatics.org',
];

export function isSuperAdmin(email: string | undefined): boolean {
  if (!email) return false;
  return SUPER_ADMIN_EMAILS.includes(email.toLowerCase());
}

// Role types
export type UserRole = 'super_admin' | 'org_admin' | 'student' | null;

export interface UserRoleInfo {
  role: UserRole;
  orgId: string | null;
  orgSlug: string | null;
  orgName: string | null;
  isSelfRegistered: boolean;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signInWithGoogle: () => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  loading: boolean;
  // Role information
  roleInfo: UserRoleInfo;
  roleLoading: boolean;
  refreshRole: () => Promise<void>;
  // Password change requirement (for provisioned accounts)
  mustChangePassword: boolean;
  clearPasswordChangeFlag: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEFAULT_ROLE_INFO: UserRoleInfo = {
  role: null,
  orgId: null,
  orgSlug: null,
  orgName: null,
  isSelfRegistered: false,
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [roleInfo, setRoleInfo] = useState<UserRoleInfo>(DEFAULT_ROLE_INFO);
  const [roleLoading, setRoleLoading] = useState(false);
  const [mustChangePassword, setMustChangePassword] = useState(false);

  // Check if user needs to change password (provisioned accounts)
  const checkPasswordChangeRequired = (currentUser: User | null) => {
    if (!currentUser) {
      setMustChangePassword(false);
      return;
    }
    const mustChange = currentUser.user_metadata?.must_change_password === true;
    setMustChangePassword(mustChange);
  };

  const clearPasswordChangeFlag = () => {
    setMustChangePassword(false);
  };

  // Fetch and determine user role
  const fetchUserRole = async (currentUser: User | null) => {
    if (!currentUser) {
      setRoleInfo(DEFAULT_ROLE_INFO);
      return;
    }

    // Check if super admin first (hardcoded check)
    if (isSuperAdmin(currentUser.email)) {
      setRoleInfo({
        role: 'super_admin',
        orgId: null,
        orgSlug: null,
        orgName: null,
        isSelfRegistered: false,
      });
      return;
    }

    // Call ensure_user_membership RPC to get/create membership
    setRoleLoading(true);
    try {
      const { data, error } = await supabase.rpc('ensure_user_membership', {
        p_user_id: currentUser.id,
        p_user_email: currentUser.email,
      });

      if (error) {
        console.error('Error fetching user role:', error);
        // Fallback to student if RPC fails
        setRoleInfo({
          role: 'student',
          orgId: null,
          orgSlug: null,
          orgName: null,
          isSelfRegistered: true,
        });
        return;
      }

      if (data && data.length > 0) {
        const membership = data[0];
        setRoleInfo({
          role: membership.role === 'admin' ? 'org_admin' : 'student',
          orgId: membership.org_id,
          orgSlug: membership.org_slug,
          orgName: membership.org_name,
          isSelfRegistered: membership.is_self_registered,
        });
      } else {
        // No membership found - should not happen as ensure_user_membership creates one
        setRoleInfo({
          role: 'student',
          orgId: null,
          orgSlug: null,
          orgName: null,
          isSelfRegistered: true,
        });
      }
    } catch (err) {
      console.error('Error in fetchUserRole:', err);
      setRoleInfo({
        role: 'student',
        orgId: null,
        orgSlug: null,
        orgName: null,
        isSelfRegistered: true,
      });
    } finally {
      setRoleLoading(false);
    }
  };

  const refreshRole = async () => {
    await fetchUserRole(user);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      // Fetch role after auth loads
      fetchUserRole(session?.user ?? null);
      // Check if password change is required
      checkPasswordChangeRequired(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      // Fetch role on auth state change
      fetchUserRole(session?.user ?? null);
      // Check if password change is required
      checkPasswordChangeRequired(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
      },
    });
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    return { error };
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });
    return { error };
  };

  const value = {
    user,
    session,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    resetPassword,
    loading,
    roleInfo,
    roleLoading,
    refreshRole,
    mustChangePassword,
    clearPasswordChangeFlag,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
