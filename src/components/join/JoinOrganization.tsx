import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Users, Mail, Lock, Eye, EyeOff, CheckCircle, AlertCircle, ArrowRight, Building2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

interface InviteLinkInfo {
  id: string;
  code: string;
  label: string | null;
  organization: {
    id: string;
    name: string;
    slug: string;
  };
}

type AuthMode = 'login' | 'signup';

export function JoinOrganization() {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const { user, signIn, signUp } = useAuth();

  const [linkInfo, setLinkInfo] = useState<InviteLinkInfo | null>(null);
  const [linkError, setLinkError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [joined, setJoined] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);

  // Auth form state
  const [authMode, setAuthMode] = useState<AuthMode>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Validate invite link on mount
  useEffect(() => {
    async function validateLink() {
      if (!code) {
        setLinkError('No invite code provided');
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('org_invite_links')
          .select(`
            id,
            code,
            label,
            expires_at,
            max_uses,
            use_count,
            is_active,
            organization:organizations (
              id,
              name,
              slug
            )
          `)
          .eq('code', code)
          .eq('is_active', true)
          .single();

        if (error || !data) {
          setLinkError('Invalid or expired invite link');
          setLoading(false);
          return;
        }

        // Check expiration
        if (data.expires_at && new Date(data.expires_at) < new Date()) {
          setLinkError('This invite link has expired');
          setLoading(false);
          return;
        }

        // Check max uses
        if (data.max_uses && data.use_count >= data.max_uses) {
          setLinkError('This invite link has reached its maximum uses');
          setLoading(false);
          return;
        }

        const org = Array.isArray(data.organization) ? data.organization[0] : data.organization;

        setLinkInfo({
          id: data.id,
          code: data.code,
          label: data.label,
          organization: org
        });
        setLoading(false);
      } catch (err) {
        setLinkError('Failed to validate invite link');
        setLoading(false);
      }
    }

    validateLink();
  }, [code]);

  // Auto-join when user is authenticated
  useEffect(() => {
    if (user && linkInfo && !joined && !joining) {
      handleJoinOrganization();
    }
  }, [user, linkInfo]);

  async function handleJoinOrganization() {
    if (!user || !code) return;

    setJoining(true);
    setJoinError(null);

    try {
      const { data, error } = await supabase.rpc('use_invite_link', {
        invite_code: code,
        joining_user_id: user.id
      });

      if (error) {
        setJoinError(error.message);
        setJoining(false);
        return;
      }

      const result = data[0];
      if (!result.success && result.error_message !== 'Already a member of this organization') {
        setJoinError(result.error_message || 'Failed to join organization');
        setJoining(false);
        return;
      }

      setJoined(true);
      setJoining(false);
    } catch (err: any) {
      setJoinError(err.message || 'Failed to join organization');
      setJoining(false);
    }
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

        // After signup, Supabase may require email confirmation
        // For now, we'll try to auto-login
        const { error: signInError } = await signIn(email, password);
        if (signInError) {
          // If email confirmation is required
          setAuthError('Please check your email to confirm your account, then return to this page.');
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
      // The useEffect will handle joining after auth state updates
    } catch (err: any) {
      setAuthError(err.message || 'Authentication failed');
      setAuthLoading(false);
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Invalid Invite Link</h1>
          <p className="text-gray-600 mb-6">{linkError}</p>
          <Link
            to="/"
            className="inline-flex items-center justify-center px-6 py-3 text-white font-medium bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors"
          >
            Go to Academy
          </Link>
        </div>
      </div>
    );
  }

  // Successfully joined
  if (joined && linkInfo) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="max-w-md w-full text-center p-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome!</h1>
          <p className="text-gray-600 mb-2">
            You've successfully joined <strong>{linkInfo.organization.name}</strong>
          </p>
          <p className="text-gray-500 text-sm mb-6">
            You now have access to all training materials assigned to your organization.
          </p>
          <button
            onClick={() => navigate('/courses')}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 text-white font-medium bg-gradient-to-r from-blue-700 to-teal-600 rounded-lg hover:from-blue-800 hover:to-teal-700 transition-all"
          >
            Start Learning
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Joining organization...</p>
        </div>
      </div>
    );
  }

  // Show auth form if not logged in
  if (!user && linkInfo) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center py-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="p-8 bg-gradient-to-br from-blue-800 to-teal-600 text-center">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">Join {linkInfo.organization.name}</h1>
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

              {joinError && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{joinError}</p>
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
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    required
                  />
                </div>
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
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
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
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      required
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={authLoading}
                className="w-full py-3 px-4 text-white font-medium bg-gradient-to-r from-blue-700 to-teal-600 rounded-lg hover:from-blue-800 hover:to-teal-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                {authLoading ? (
                  'Please wait...'
                ) : (
                  <>
                    <Users className="w-5 h-5" />
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
                      className="text-teal-600 hover:text-teal-700 font-medium"
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
                      className="text-teal-600 hover:text-teal-700 font-medium"
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

  return null;
}
