import { Link } from 'react-router-dom';
import { User, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function StickyBanner() {
  const { user } = useAuth();

  return (
    <div className="sticky top-0 z-40 glass border-b border-gray-200/50 shadow-apple-sm">
      <div className="px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          {/* Left: user email */}
          <div className="flex items-center gap-2 min-w-0">
            {user && (
              <>
                <User className="w-4 h-4 text-gray-500 shrink-0" />
                <span className="text-sm text-gray-600 truncate">{user.email}</span>
              </>
            )}
          </div>

          {/* Center: logo */}
          <img
            src="/vp-long-logo.png"
            alt="VytalPath Academy"
            className="h-10 w-auto shrink-0"
          />

          {/* Right: Account link */}
          <div className="flex items-center">
            {user && (
              <Link
                to="/account"
                className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 transition-colors"
              >
                <Settings className="w-4 h-4" />
                Account
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
