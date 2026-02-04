import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { User, LogOut, Shield } from 'lucide-react';
import { useAuth, isSuperAdmin } from '../../contexts/AuthContext';
import { StickyBanner } from '../StickyBanner';
import { SignIn } from '../SignIn';
import { SignUp } from '../SignUp';
import { ForgotPassword } from '../ForgotPassword';
import { RoleBasedSidebar, MobileBottomNav } from './RoleBasedSidebar';

type AuthModal = 'signIn' | 'signUp' | 'forgotPassword' | null;

export function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [authModal, setAuthModal] = useState<AuthModal>(null);

  const handleSignOut = async () => {
    await signOut();
    navigate('/', { replace: true });
  };

  // Don't show navigation on landing page
  const isLandingPage = location.pathname === '/';

  if (isLandingPage) {
    return <Outlet />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Desktop Sidebar */}
      <nav className="hidden md:flex md:flex-col md:fixed md:left-0 md:top-0 md:h-screen md:w-64 md:bg-white md:shadow-lg md:border-r md:border-gray-200 z-50">
        <Link
          to="/"
          className="w-full py-4 px-6 border-b border-gray-200 hover:bg-gray-50 transition-colors flex items-center justify-center"
        >
          <img
            src="/vp-checkmark.png"
            alt="VytalPath Academy"
            className="h-14 w-auto"
          />
        </Link>

        <RoleBasedSidebar className="flex-1" />

        <div className="p-4 border-t border-gray-200">
          {user ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
                <User className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-700 truncate">{user.email}</span>
              </div>
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={() => setAuthModal('signIn')}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <User className="w-4 h-4" />
              Sign In
            </button>
          )}
        </div>
      </nav>

      {/* Mobile Top Header */}
      <header className="md:hidden sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <Link to="/" className="flex items-center justify-center px-4 py-3">
          <img
            src="/vp-long-logo.png"
            alt="VytalPath Academy"
            className="h-10 w-auto"
          />
        </Link>
      </header>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />

      {/* Banner */}
      <div className="md:ml-64">
        <StickyBanner />
      </div>

      {/* Main Content */}
      <main className="md:ml-64 pb-20 md:pb-0">
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          <Outlet />
        </div>
      </main>

      {/* Auth Modals */}
      {authModal === 'signIn' && (
        <SignIn
          onClose={() => setAuthModal(null)}
          onSwitchToSignUp={() => setAuthModal('signUp')}
          onSwitchToForgotPassword={() => setAuthModal('forgotPassword')}
        />
      )}
      {authModal === 'signUp' && (
        <SignUp
          onClose={() => setAuthModal(null)}
          onSwitchToSignIn={() => setAuthModal('signIn')}
        />
      )}
      {authModal === 'forgotPassword' && (
        <ForgotPassword
          onClose={() => setAuthModal(null)}
          onSwitchToSignIn={() => setAuthModal('signIn')}
        />
      )}
    </div>
  );
}
