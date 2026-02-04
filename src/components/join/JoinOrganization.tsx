import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Users, Mail, Lock, Eye, EyeOff, CheckCircle, AlertCircle, ArrowRight, Building2, Shield, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

interface InvitationInfo {
  id: string;
  org_id: string;
  org_name: string;
  org_slug: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  role: 'admin' | 'student';
  is_valid: boolean;
  error_message: string | null;
}

type AuthMode = 'login' | 'signup';

export function JoinOrganization() {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const { user, signIn, signUp, signOut, refreshRole } = useAuth();

  const [invitation, setInvitation] = useState<InvitationInfo | null>(null);
  const [linkError, setLinkError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [joined, setJoined] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);
  const [showAuthForm, setShowAuthForm] = useState(false);

  // Auth form state
  const [authMode, setAuthMode] = useState<AuthMode>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Validate invitation on mount
  useEffect(() => {
    async function validateInvitation() {
      if (!code) {
        setLinkError('No invite code provided');
        setLoading(false);
        return;
      }

      try {
        // Use the new get_invitation RPC function
        const { data, error } = await supabase.rpc('get_invitation', {
          p_token: code
        });

        if (error) {
          console.error('Error fetching invitation:', error);
          setLinkError('Failed to validate invitation');
          setLoading(false);
          return;
        }

        if (!data || data.length === 0) {
          setLinkError('Invalid invitation link');
          setLoading(false);
          return;
        }

        const inv = data[0];

        if (!inv.is_valid) {
          setLinkError(inv.error_message || 'Invalid invitation');
          setLoading(false);
          return;
        }

        setInvitation({
          id: inv.id,
          org_id: inv.org_id,
          org_name: inv.org_name,
          org_slug: inv.org_slug,
          email: inv.email,
          first_name: inv.first_name,
          last_name: inv.last_name,
          role: inv.role as 'admin' | 'student',
          is_valid: inv.is_valid,
          error_message: inv.error_message
        });

        // Pre-fill email if invitation is email-specific
        if (inv.email) {
          setEmail(inv.email);
        }

        setLoading(false);
      } catch (err) {
        console.error('Error validating invitation:', err);
        setLinkError('Failed to validate invitation');
        setLoading(false);
      }
    }

    validateInvitation();
  }, [code]);

  // Auto-join when user logs in and invitation exists
  useEffect(() => {
    if (user && invitation && !joined && !joining && !showAuthForm) {
      // Check if email-specific invitation matches logged-in user
      if (invitation.email && invitation.email.toLowerCase() !== user.email?.toLowerCase()) {
        setJoinError(`This invitation was sent to ${invitation.email}. Please sign in with that email address.`);
        return;
      }
      handleJoinOrganization();
    }
  }, [user, invitation]);

  async function handleJoinOrganization() {
    if (!user || !code) return;

    setJoining(true);
    setJoinError(null);

    try {
      const { data, error } = await supabase.rpc('accept_invitation', {
        p_token: code
      });

      if (error) {
        setJoinError(error.message);
        setJoining(false);
        return;
      }

      const result = data[0];
      if (!result.success) {
        setJoinError(result.error_message || 'Failed to join organization');
        setJoining(false);
        return;
      }

      // Refresh role info in context
      await refreshRole();

      setJoined(true);
      setJoining(false);
    } catch (err: any) {
      setJoinError(err.message || 'Failed to join organization');
      setJoining(false);
    }
  }

  async function handleSignOutAndSwitch() {
    await signOut();
    setShowAuthForm(true);
    setJoinError(null);
  }

  async function handleAuthSubmit(e: React.FormEvent) {
    e.preventDefault();
    setAuthError(null);
    setAuthLoading(true);

    try {
      if (authMode === 'signup') {
        if (password !== confirmPassword) {
          setAuthError('Passwords do not match');
          setAuthLoading(false);
          return;
        }

        if (password.length < 6) {
          setAuthError('Password must be at least 6 characters');
          setAuthLoading(false);
          return;
        }

        const { error } = await signUp(email, password);
        if (error) {
          setAuthError(error.message);
          setAuthLoading(false);
          return;
        }

        // Try to sign in after signup
        const { error: signInError } = await signIn(email, password);
        if (signInError) {
          setAuthError('Account created! Please check your email to confirm, then return to this page.');
          setAuthLoading(false);
          return;
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          setAuthError(error.message);
          setAuthLoading(false);
          return;
        }
      }

      setAuthLoading(false);
      setShowAuthForm(false);
    } catch (err: any) {
      setAuthError(err.message || 'Authentication failed');
      setAuthLoading(false);
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Invalid link
  if (linkError) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="max-w-md w-full text-center p-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Invalid Invitation</h1>
          <p className="text-gray-600 mb-6">{linkError}</p>
          <Link
            to="/"
            className="inline-flex items-center justify-center px-6 py-3 text-white font-medium bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Academy
          </Link>
        </div>
      </div>
    );
  }

  // Successfully joined
  if (joined && invitation) {
    const isAdmin = invitation.role === 'admin';

    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="max-w-md w-full text-center p-8">
          <div className={`w-16 h-16 ${isAdmin ? 'bg-blue-100' : 'bg-green-100'} rounded-full flex items-center justify-center mx-auto mb-4`}>
            {isAdmin ? (
              <Shield className="w-8 h-8 text-blue-600" />
            ) : (
              <CheckCircle className="w-8 h-8 text-green-500" />
            )}
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {isAdmin ? 'Admin Access Granted!' : 'Welcome!'}
          </h1>
          <p className="text-gray-600 mb-2">
            You've joined <strong>{invitation.org_name}</strong>
            {isAdmin && <span className="text-blue-600 font-medium"> as an administrator</span>}
          </p>
          <p className="text-sm text-gray-500 mb-6">
            {isAdmin
              ? 'You can now manage students and view their progress.'
              : 'You now have access to all training materials.'}
          </p>
          <button
            onClick={() => navigate(isAdmin ? `/admin/orgs/${invitation.org_slug}` : '/foundations')}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 text-white font-medium bg-gradient-to-r from-blue-700 to-blue-600 rounded-lg hover:from-blue-800 hover:to-blue-700 transition-all"
          >
            {isAdmin ? 'Go to Admin Dashboard' : 'Start Learning'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // Joining in progress
  if (joining) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Joining organization...</p>
        </div>
      </div>
    );
  }

  if (!invitation) return null;

  const isAdmin = invitation.role === 'admin';
  const inviteName = invitation.first_name || invitation.last_name
    ? `${invitation.first_name || ''} ${invitation.last_name || ''}`.trim()
    : null;

  // Show auth form if not logged in OR if user chose to switch accounts
  if (!user || showAuthForm) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center py-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className={`p-8 ${isAdmin ? 'bg-gradient-to-br from-blue-800 to-blue-600' : 'bg-gradient-to-br from-blue-800 to-teal-600'} text-center`}>
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                {isAdmin ? (
                  <Shield className="w-8 h-8 text-white" />
                ) : (
                  <Building2 className="w-8 h-8 text-white" />
                )}
              </div>
              <h1 className="text-2xl font-bold text-white">
                {isAdmin ? 'Admin Invite' : 'Join'} {invitation.org_name}
              </h1>
              {isAdmin && (
                <p className="text-blue-200 mt-2 text-sm font-medium">
                  You're being invited as an administrator
                </p>
              )}
              {inviteName && (
                <p className="text-white/90 mt-2">
                  This invite is for: <strong>{inviteName}</strong>
                </p>
              )}
              {invitation.email && (
                <p className="text-white/80 mt-1 text-sm">
                  For: {invitation.email}
                </p>
              )}
              <p className="text-blue-100 mt-1">
                {authMode === 'signup' ? 'Create your account to get started' : 'Sign in to continue'}
              </p>
            </div>

            {/* Auth Form */}
            <form onSubmit={handleAuthSubmit} className="p-8 space-y-6">
              {authError && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{authError}</p>
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      invitation.email ? 'bg-gray-50' : ''
                    }`}
                    required
                    readOnly={!!invitation.email}
                  />
                </div>
                {invitation.email && (
                  <p className="text-xs text-gray-500 mt-1">
                    This invitation is for this specific email address
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={authMode === 'signup' ? 'Create a password' : 'Enter your password'}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {authMode === 'signup' && (
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your password"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={authLoading}
                className={`w-full py-3 px-4 text-white font-medium rounded-lg disabled:opacity-50 transition-all flex items-center justify-center gap-2 ${
                  isAdmin
                    ? 'bg-blue-700 hover:bg-blue-800'
                    : 'bg-gradient-to-r from-blue-700 to-teal-600 hover:from-blue-800 hover:to-teal-700'
                }`}
              >
                {authLoading ? (
                  'Please wait...'
                ) : (
                  <>
                    {isAdmin ? <Shield className="w-5 h-5" /> : <Users className="w-5 h-5" />}
                    {authMode === 'signup' ? 'Create Account & Join' : 'Sign In & Join'}
                  </>
                )}
              </button>
            </form>

            {/* Toggle auth mode */}
            <div className="px-8 pb-8 text-center">
              <p className="text-sm text-gray-600">
                {authMode === 'signup' ? (
                  <>
                    Already have an account?{' '}
                    <button
                      onClick={() => {
                        setAuthMode('login');
                        setAuthError(null);
                      }}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Sign in
                    </button>
                  </>
                ) : (
                  <>
                    Don't have an account?{' '}
                    <button
                      onClick={() => {
                        setAuthMode('signup');
                        setAuthError(null);
                      }}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Create one
                    </button>
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // User is logged in - show confirmation before joining (or error if wrong email)
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className={`p-8 ${isAdmin ? 'bg-gradient-to-br from-blue-800 to-blue-600' : 'bg-gradient-to-br from-blue-800 to-teal-600'} text-center`}>
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              {isAdmin ? (
                <Shield className="w-8 h-8 text-white" />
              ) : (
                <Building2 className="w-8 h-8 text-white" />
              )}
            </div>
            <h1 className="text-2xl font-bold text-white">
              {isAdmin ? 'Admin Invite' : 'Join'} {invitation.org_name}
            </h1>
            {isAdmin && (
              <p className="text-blue-200 mt-2 text-sm font-medium">
                You're being invited as an administrator
              </p>
            )}
            {inviteName && (
              <p className="text-white/80 mt-2 text-sm">
                This invite was created for: {inviteName}
              </p>
            )}
          </div>

          {/* Confirmation */}
          <div className="p-8">
            {joinError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{joinError}</p>
              </div>
            )}

            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">You're signed in as:</p>
              <p className="font-medium text-gray-900">{user.email}</p>
            </div>

            <button
              onClick={handleJoinOrganization}
              disabled={joining}
              className={`w-full py-3 px-4 text-white font-medium rounded-lg disabled:opacity-50 transition-all flex items-center justify-center gap-2 mb-4 ${
                isAdmin
                  ? 'bg-blue-700 hover:bg-blue-800'
                  : 'bg-gradient-to-r from-blue-700 to-teal-600 hover:from-blue-800 hover:to-teal-700'
              }`}
            >
              {joining ? (
                'Joining...'
              ) : (
                <>
                  {isAdmin ? <Shield className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
                  {isAdmin ? 'Join as Admin' : 'Join Organization'}
                </>
              )}
            </button>

            <button
              onClick={handleSignOutAndSwitch}
              className="w-full py-3 px-4 text-gray-700 font-medium bg-gray-100 rounded-lg hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
            >
              <LogOut className="w-5 h-5" />
              Sign in as different user
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
