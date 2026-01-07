import { BookOpen, FileText, Search, GraduationCap, User, LogOut, MessageSquare, Video } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export type NavigationView = 'home' | 'terms' | 'sops' | 'search' | 'academy' | 'terminology' | 'training';

interface NavigationProps {
  currentView: NavigationView;
  onNavigate: (view: NavigationView) => void;
  onAuthClick: () => void;
  onGoHome: () => void;
}

export function Navigation({ currentView, onNavigate, onAuthClick, onGoHome }: NavigationProps) {
  const { user, signOut } = useAuth();
  const navItems = [
    { id: 'training' as const, label: 'Video Training', icon: Video },
    { id: 'academy' as const, label: 'Clinic Basics', icon: GraduationCap },
    { id: 'sops' as const, label: 'Common Workflows', icon: FileText },
    { id: 'terms' as const, label: 'Terms in Healthcare', icon: BookOpen },
    { id: 'terminology' as const, label: 'Medical Terminology', icon: MessageSquare },
    { id: 'search' as const, label: 'Search', icon: Search },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <nav className="hidden md:flex md:flex-col md:fixed md:left-0 md:top-0 md:h-screen md:w-64 md:bg-white md:shadow-lg md:border-r md:border-gray-200 z-50">
        <button
          onClick={onGoHome}
          className="w-full p-6 border-b border-gray-200 hover:bg-gray-50 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-teal-600" />
            <div>
              <h1 className="text-lg font-bold text-gray-900">VytalPath Academy</h1>
              <p className="text-xs text-gray-500">Reference & Training</p>
            </div>
          </div>
        </button>

        <div className="flex-1 py-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-6 py-3 text-left transition-colors ${
                  isActive
                    ? 'bg-teal-50 text-teal-700 border-r-4 border-teal-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-teal-600' : 'text-gray-400'}`} />
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
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
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
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                  isActive ? 'text-teal-600' : 'text-gray-400'
                }`}
              >
                <Icon className={`w-6 h-6 mb-1 ${isActive ? 'text-teal-600' : 'text-gray-400'}`} />
                <span className={`text-xs font-medium ${isActive ? 'text-teal-600' : 'text-gray-500'}`}>
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
