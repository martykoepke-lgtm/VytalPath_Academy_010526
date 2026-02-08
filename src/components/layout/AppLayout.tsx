import { useState, useMemo } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { User, LogOut, Shield } from 'lucide-react';
import { useAuth, isSuperAdmin } from '../../contexts/AuthContext';
import { StickyBanner } from '../StickyBanner';
import { SignIn } from '../SignIn';
import { SignUp } from '../SignUp';
import { ForgotPassword } from '../ForgotPassword';
import { RoleBasedSidebar, MobileBottomNav } from './RoleBasedSidebar';
import AiTutorButton from '../ai-tutor/AiTutorButton';
import ChatPanel from '../ai-tutor/ChatPanel';
import { aiTutorThemes } from '../ai-tutor/themes';
import type { SectionContext } from '../../types/ai-tutor';

type AuthModal = 'signIn' | 'signUp' | 'forgotPassword' | null;

// Map URL paths to section context for the AI tutor
const sectionMap: Record<string, { sectionId: string; sectionName: string }> = {
  '/foundations': { sectionId: 'foundations', sectionName: 'Foundations of Healthcare' },
  '/medical-law-ethics': { sectionId: 'compliance', sectionName: 'Medical Law & Ethics' },
  '/insurance': { sectionId: 'insurance', sectionName: 'Insurance & Billing' },
  '/workflows': { sectionId: 'workflows', sectionName: 'Front Office Workflows' },
  '/terminology': { sectionId: 'terminology', sectionName: 'Medical Terminology' },
  '/practice': { sectionId: 'practice', sectionName: 'Practice & Review' },
  '/ehr-lab': { sectionId: 'ehr-lab', sectionName: 'EHR Practice Lab' },
  '/communication': { sectionId: 'communication', sectionName: 'Patient Communication' },
  '/ehr-fundamentals': { sectionId: 'ehr-fundamentals', sectionName: 'EHR & Practice Management' },
};

export function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, session, signOut } = useAuth();
  const [authModal, setAuthModal] = useState<AuthModal>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Determine current section from URL for AI tutor context
  const currentSection = useMemo(() => {
    const match = Object.entries(sectionMap).find(([path]) =>
      location.pathname.startsWith(path)
    );
    return match ? match[1] : null;
  }, [location.pathname]);

  const sectionContext: SectionContext = useMemo(() => ({
    sectionId: currentSection?.sectionId || 'foundations',
    sectionName: currentSection?.sectionName || 'VytalPath Academy',
  }), [currentSection]);

  // Use blue theme for all sections (unified design)
  const chatTheme = aiTutorThemes[sectionContext.sectionId] || aiTutorThemes.foundations;

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
    <div className="min-h-screen bg-gray-50/50">
      {/* Desktop Sidebar */}
      <nav className="hidden md:flex md:flex-col md:fixed md:left-0 md:top-0 md:h-screen md:w-64 glass md:border-r md:border-gray-200/50 shadow-apple z-50">
        <Link
          to="/"
          className="w-full py-5 px-6 border-b border-gray-200/50 hover:bg-gray-50/50 transition-all duration-300 flex items-center justify-center"
        >
          <img
            src="/vp-checkmark.png"
            alt="VytalPath Academy"
            className="h-14 w-auto"
          />
        </Link>

        <RoleBasedSidebar className="flex-1" />

        <div className="p-4 border-t border-gray-200/50">
          {user ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2 px-3 py-2 bg-gray-50/80 rounded-2xl">
                <User className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-700 truncate">{user.email}</span>
              </div>
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-2xl transition-all duration-300"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={() => setAuthModal('signIn')}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 shadow-apple-sm hover:shadow-apple transition-all duration-300"
            >
              <User className="w-4 h-4" />
              Sign In
            </button>
          )}
        </div>
      </nav>

      {/* Mobile Top Header */}
      <header className="md:hidden sticky top-0 z-40 glass border-b border-gray-200/50 shadow-apple-sm">
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
        <div className="px-6 sm:px-8 lg:px-12 py-10">
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

      {/* Global AI Tutor - floating button + slide-in panel */}
      {session && (
        <>
          <AiTutorButton
            onClick={() => setIsChatOpen(true)}
            isVisible={!isChatOpen}
            theme={chatTheme}
          />
          <ChatPanel
            isOpen={isChatOpen}
            onClose={() => setIsChatOpen(false)}
            theme={chatTheme}
            sectionContext={sectionContext}
          />
        </>
      )}
    </div>
  );
}
