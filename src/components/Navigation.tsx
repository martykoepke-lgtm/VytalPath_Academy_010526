import { User, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export type NavigationView = 'home' | 'terms' | 'sops' | 'search' | 'academy' | 'terminology' | 'training' | 'interactive';

interface NavigationProps {
  currentView: NavigationView;
  onNavigate: (view: NavigationView) => void;
  onAuthClick: () => void;
  onGoHome: () => void;
}

type NavItem = {
  id: NavigationView;
  label: string;
  iconPath: string;
};

export function Navigation({ currentView, onNavigate, onAuthClick, onGoHome }: NavigationProps) {
  const { user, signOut } = useAuth();
  const navItems: NavItem[] = [
    { id: 'training', label: 'Video Training', iconPath: '/icons/courses-icon.png' },
    { id: 'interactive', label: 'Practice', iconPath: '/icons/courses-icon.png' },
    { id: 'academy', label: 'Clinic Basics', iconPath: '/icons/courses-icon.png' },
    { id: 'sops', label: 'Common Workflows', iconPath: '/icons/workflow-icon.png' },
    { id: 'terms', label: 'Terms in Healthcare', iconPath: '/icons/terms-icon.png' },
    { id: 'terminology', label: 'Medical Terminology', iconPath: '/icons/terms-icon.png' },
    { id: 'search', label: 'Search', iconPath: '/icons/search-icon.png' },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <nav className="hidden md:flex md:flex-col md:fixed md:left-0 md:top-0 md:h-screen md:w-64 md:bg-white md:shadow-lg md:border-r md:border-gray-200 z-50">
        <button
          onClick={onGoHome}
          className="w-full py-4 px-6 border-b border-gray-200 hover:bg-gray-50 transition-colors flex items-center justify-center"
        >
          <img
            src="/vp-checkmark.png"
            alt="VytalPath Academy"
            className="h-14 w-auto"
          />
        </button>

        <div className="flex-1 py-4">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-6 py-3 text-left transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border-r-4 border-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <img
                  src={item.iconPath}
                  alt={item.label}
                  className={`w-6 h-6 ${isActive ? '' : 'opacity-60'}`}
                />
                <span className="font-medium">{item.label}</span>
              </button>
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
              onClick={onAuthClick}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
            >
              <User className="w-4 h-4" />
              Sign In
            </button>
          )}
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
        <div className="flex justify-around items-center h-16">
          {navItems.slice(0, 5).map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                  isActive ? 'text-blue-700' : 'text-gray-400'
                }`}
              >
                <img
                  src={item.iconPath}
                  alt={item.label}
                  className={`w-6 h-6 mb-1 ${isActive ? '' : 'opacity-60'}`}
                />
                <span className={`text-xs font-medium ${isActive ? 'text-blue-700' : 'text-gray-500'}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
