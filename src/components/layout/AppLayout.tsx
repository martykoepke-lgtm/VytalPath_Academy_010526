import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { User, LogOut, Home, MessageSquare, type LucideIcon } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { StickyBanner } from '../StickyBanner';
import { SignIn } from '../SignIn';
import { SignUp } from '../SignUp';
import { ForgotPassword } from '../ForgotPassword';

type AuthModal = 'signIn' | 'signUp' | 'forgotPassword' | null;

type NavItem = {
  path: string;
  label: string;
  iconPath?: string;
  icon?: LucideIcon;
};

const navItems: NavItem[] = [
  { path: '/foundations', label: 'Foundations', iconPath: '/icons/courses-icon.png' },
  { path: '/insurance', label: 'Insurance', iconPath: '/icons/courses-icon.png' },
  { path: '/terminology', label: 'Terminology', iconPath: '/icons/terms-icon.png' },
  { path: '/workflows', label: 'Workflows', iconPath: '/icons/workflow-icon.png' },
  { path: '/practice', label: 'Practice', iconPath: '/icons/courses-icon.png' },
  { path: '/search', label: 'Search', iconPath: '/icons/search-icon.png' },
];

export function AppLayout() {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const [authModal, setAuthModal] = useState<AuthModal>(null);

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

        <div className="flex-1 py-4">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`w-full flex items-center gap-3 px-6 py-3 transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border-r-4 border-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {item.iconPath ? (
                  <img
                    src={item.iconPath}
                    alt={item.label}
                    className={`w-6 h-6 ${isActive ? '' : 'opacity-60'}`}
                  />
                ) : item.icon ? (
                  <item.icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                ) : null}
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-gray-200">
          {user ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
                <User className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-700 truncate">{user.email}</span>
              </div>
              <button
                onClick={() => signOut()}
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
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
        <div className="flex justify-around items-center h-16">
          <Link
            to="/"
            className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
              location.pathname === '/' ? 'text-blue-600' : 'text-gray-400'
            }`}
          >
            <Home className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">Home</span>
          </Link>
          {navItems.slice(0, 4).map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                  isActive ? 'text-blue-600' : 'text-gray-400'
                }`}
              >
                {item.iconPath ? (
                  <img
                    src={item.iconPath}
                    alt={item.label}
                    className={`w-6 h-6 mb-1 ${isActive ? '' : 'opacity-60'}`}
                  />
                ) : item.icon ? (
                  <item.icon className="w-6 h-6 mb-1" />
                ) : null}
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

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
