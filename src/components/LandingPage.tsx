import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle, Clock } from 'lucide-react';
// Note: Custom icons defined below replace Shield, FileText, BookOpen, Zap, User, Building2
import { SignIn } from './SignIn';
import { SignUp } from './SignUp';
import { ForgotPassword } from './ForgotPassword';
import { CurriculumModal } from './CurriculumModal';
import { useAuth } from '../contexts/AuthContext';

// Custom stylized icons as SVG components - unified blue palette
const IconFoundations = () => (
  <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
    <rect x="4" y="20" width="40" height="24" rx="2" className="fill-blue-500"/>
    <rect x="8" y="8" width="32" height="16" rx="2" className="fill-blue-400"/>
    <rect x="14" y="4" width="20" height="8" rx="2" className="fill-blue-300"/>
    <circle cx="24" cy="32" r="6" className="fill-white/30"/>
    <path d="M21 32L23 34L27 30" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconLaw = () => (
  <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
    <circle cx="24" cy="24" r="20" className="fill-blue-500"/>
    <path d="M24 12V24L32 28" stroke="white" strokeWidth="3" strokeLinecap="round"/>
    <circle cx="24" cy="24" r="3" className="fill-white"/>
    <path d="M16 36L24 28L32 36" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconInsurance = () => (
  <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
    <rect x="6" y="10" width="36" height="28" rx="4" className="fill-blue-500"/>
    <rect x="10" y="16" width="16" height="10" rx="2" className="fill-blue-300"/>
    <rect x="10" y="30" width="28" height="4" rx="1" className="fill-white/30"/>
    <circle cx="36" cy="21" r="6" className="fill-blue-400"/>
    <path d="M33 21L35 23L39 19" stroke="white" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const IconTerminology = () => (
  <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
    <rect x="8" y="6" width="32" height="36" rx="3" className="fill-blue-500"/>
    <rect x="12" y="12" width="24" height="4" rx="1" className="fill-blue-300"/>
    <rect x="12" y="20" width="18" height="3" rx="1" className="fill-white/40"/>
    <rect x="12" y="26" width="22" height="3" rx="1" className="fill-white/40"/>
    <rect x="12" y="32" width="14" height="3" rx="1" className="fill-white/40"/>
    <circle cx="34" cy="34" r="8" className="fill-blue-400"/>
    <text x="34" y="38" textAnchor="middle" className="fill-white text-[10px] font-bold">Rx</text>
  </svg>
);

const IconWorkflows = () => (
  <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
    <rect x="4" y="8" width="18" height="14" rx="3" className="fill-blue-300"/>
    <rect x="26" y="8" width="18" height="14" rx="3" className="fill-blue-400"/>
    <rect x="4" y="26" width="18" height="14" rx="3" className="fill-blue-400"/>
    <rect x="26" y="26" width="18" height="14" rx="3" className="fill-blue-500"/>
    <path d="M22 15H26M22 33H26M13 22V26M35 22V26" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="13" cy="15" r="3" className="fill-white/50"/>
    <circle cx="35" cy="15" r="3" className="fill-white/50"/>
    <circle cx="13" cy="33" r="3" className="fill-white/50"/>
    <circle cx="35" cy="33" r="3" className="fill-white/50"/>
  </svg>
);

const IconUser = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
    <circle cx="12" cy="8" r="4" className="fill-current"/>
    <path d="M4 20C4 16.6863 7.58172 14 12 14C16.4183 14 20 16.6863 20 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const IconBuilding = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
    <rect x="3" y="6" width="18" height="15" rx="2" className="fill-current"/>
    <rect x="7" y="10" width="3" height="3" rx="0.5" className="fill-white/30"/>
    <rect x="14" y="10" width="3" height="3" rx="0.5" className="fill-white/30"/>
    <rect x="7" y="15" width="3" height="3" rx="0.5" className="fill-white/30"/>
    <rect x="14" y="15" width="3" height="3" rx="0.5" className="fill-white/30"/>
    <path d="M12 6V3M9 3H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);


type AuthModal = 'signIn' | 'signUp' | 'forgotPassword' | null;

interface LocationState {
  from?: { pathname: string };
  showSignIn?: boolean;
}

export function LandingPage() {
  const [authModal, setAuthModal] = useState<AuthModal>(null);
  const [showCurriculum, setShowCurriculum] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const state = location.state as LocationState | null;

  // Auto-show sign-in modal when redirected from protected route
  useEffect(() => {
    if (state?.showSignIn && !user) {
      setAuthModal('signIn');
    }
  }, [state, user]);

  // Redirect to intended destination after sign-in
  useEffect(() => {
    if (user) {
      if (state?.from) {
        navigate(state.from.pathname, { replace: true });
      } else {
        // User just signed in from landing page - take them to welcome
        navigate('/welcome', { replace: true });
      }
    }
  }, [user, state, navigate]);

  // Handle successful auth - navigate to content
  const handleAuthSuccess = () => {
    setAuthModal(null);
    if (state?.from) {
      navigate(state.from.pathname, { replace: true });
    } else {
      navigate('/welcome');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header/Nav */}
      <header className="glass border-b border-gray-200/50 shadow-apple-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-4">
          <div className="flex items-center justify-between">
            <img
              src="/vytalpath-logo.png"
              alt="VytalPath Academy"
              className="h-10 w-auto"
            />
            <div className="flex items-center gap-3">
              <button
                onClick={() => setAuthModal('signIn')}
                className="px-5 py-2.5 text-sm font-normal text-gray-700 hover:text-gray-900 transition-colors duration-300"
              >
                Sign In
              </button>
              <button
                onClick={() => setAuthModal('signUp')}
                className="px-6 py-2.5 text-sm font-medium text-white bg-gray-900 rounded-2xl hover:bg-gray-800 transition-all duration-300 shadow-apple-sm hover:shadow-apple"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-20 md:py-32">
          <div className="text-center">
            {/* Prominent Logo */}
            <div className="mb-8">
              <img
                src="/vytalpath-logo.png"
                alt="VytalPath Academy"
                className="h-28 md:h-36 lg:h-44 w-auto mx-auto"
              />
            </div>

            <div className="inline-block mb-8">
              <div className="flex items-center gap-2 bg-blue-50 text-blue-600 px-5 py-2.5 rounded-full text-sm font-medium border border-blue-100">
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                <span>Professional Healthcare Training</span>
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-gray-900 mb-6 leading-tight">
              Master Front Office Skills
              <span className="block text-blue-600 mt-2">
                for Healthcare
              </span>
            </h1>

            <p className="text-xl font-light text-gray-500 max-w-2xl mx-auto mb-12 leading-relaxed">
              Comprehensive training for medical receptionists, referral coordinators, and clinic staff. Learn insurance, terminology, workflows, and more.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => setAuthModal('signUp')}
                className="group px-8 py-4 text-lg font-medium text-white bg-gray-900 rounded-2xl hover:bg-gray-800 transition-all duration-300 shadow-apple hover:shadow-apple-lg flex items-center gap-2"
              >
                Start Learning Today
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
              <a
                href="#pricing"
                className="px-8 py-4 text-lg font-medium text-gray-700 border-2 border-gray-200 rounded-2xl hover:border-gray-300 hover:bg-gray-50 transition-all duration-300"
              >
                View Pricing
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mt-20">
              {[
                { value: '20+', label: 'Video Lessons' },
                { value: '24', label: 'SOP Guides' },
                { value: '5', label: 'Training Modules' },
                { value: '7+', label: 'Hours of Content' },
              ].map((stat) => (
                <div key={stat.label} className="bg-white rounded-2xl p-5 text-center border border-gray-200/50 shadow-apple">
                  <div className="text-3xl font-semibold text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-sm font-light text-gray-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="bg-gray-50/50 py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-semibold tracking-tight text-gray-900 mb-4">
              Choose Your Path
            </h2>
            <p className="text-xl font-light text-gray-500 max-w-2xl mx-auto">
              Invest in your career or train your entire team
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Individual Plan */}
            <div className="bg-white rounded-2xl p-8 shadow-apple border border-gray-200/50 hover-lift transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center text-white p-2.5">
                  <IconUser />
                </div>
                <div>
                  <h3 className="text-xl font-medium text-gray-900">Individual</h3>
                  <p className="text-sm text-gray-500">Self-paced learning</p>
                </div>
              </div>

              <div className="mb-6">
                <span className="text-4xl font-semibold text-gray-900">$327</span>
                <span className="text-gray-500 font-light">/year</span>
              </div>

              <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                Perfect for career changers, new hires, or anyone seeking professional development in healthcare administration.
              </p>

              <ul className="space-y-3 mb-8">
                {[
                  '5 modules now + new content weekly',
                  '20+ video lessons & 24 SOPs',
                  'Interactive quizzes & flashcards',
                  'Certificate of completion',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => setAuthModal('signUp')}
                className="w-full py-3.5 px-4 text-white font-medium bg-gray-900 rounded-2xl hover:bg-gray-800 transition-all duration-300 shadow-apple-sm hover:shadow-apple"
              >
                Get Started
              </button>
            </div>

            {/* Organization Plan */}
            <div className="bg-gray-900 rounded-2xl p-8 shadow-apple-lg text-white relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-white/15 text-white text-xs font-medium px-3 py-1 rounded-full">
                Save up to 70%
              </div>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-white/15 rounded-2xl flex items-center justify-center text-white p-2.5">
                  <IconBuilding />
                </div>
                <div>
                  <h3 className="text-xl font-medium">Organizations</h3>
                  <p className="text-sm text-gray-400">Train your team</p>
                </div>
              </div>

              <div className="mb-6">
                <span className="text-3xl font-semibold">Volume Pricing</span>
                <p className="text-gray-400 text-sm mt-1">As low as $99/seat/year</p>
              </div>

              <div className="bg-white/10 rounded-2xl p-5 mb-6 space-y-2.5 text-sm">
                {[
                  { seats: '1-5 seats', price: '$327/seat' },
                  { seats: '6-15 seats', price: '$199/seat' },
                  { seats: '16-50 seats', price: '$149/seat' },
                  { seats: '51+ seats', price: '$99/seat' },
                ].map((tier) => (
                  <div key={tier.seats} className="flex justify-between">
                    <span className="text-gray-300">{tier.seats}</span>
                    <span className="font-medium">{tier.price}</span>
                  </div>
                ))}
              </div>

              <ul className="space-y-3 mb-8 text-sm text-gray-300">
                {[
                  'Admin dashboard with progress tracking',
                  'Personalized student invite links',
                  'Team completion reports',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2.5">
                    <CheckCircle className="w-4 h-4 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>

              <a
                href="mailto:hello@vytalpath.com?subject=VytalPath%20Academy%20Team%20Pricing"
                className="w-full py-3.5 px-4 text-gray-900 font-medium bg-white rounded-2xl hover:bg-gray-100 transition-all duration-300 flex items-center justify-center gap-2 shadow-apple-sm"
              >
                Contact for Team Access
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Curriculum Preview */}
      <section className="bg-white py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-semibold tracking-tight text-gray-900 mb-4">
              What You'll Learn
            </h2>
            <p className="text-xl font-light text-gray-500 max-w-2xl mx-auto">
              5 modules available now, with new content added weekly
            </p>
          </div>

          {/* Available Now */}
          <div className="mb-16">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-blue-600 uppercase tracking-wider">Available Now</span>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: <IconFoundations />, title: 'Healthcare Foundations', badge: '3 lessons', desc: 'Understand acute vs. ambulatory care, the front office role, and how healthcare delivery works.' },
                { icon: <IconLaw />, title: 'Medical Law & Ethics', badge: '4 lessons', desc: 'Master HIPAA essentials, PHI protection, patient authorization, and consent requirements.' },
                { icon: <IconInsurance />, title: 'Insurance Training', badge: '9 lessons', desc: 'Learn payers, plan types, reading insurance cards, eligibility verification, and payment collection.' },
                { icon: <IconTerminology />, title: 'Medical Terminology', badge: '5 lessons + flashcards', desc: 'Decode medical terms using prefixes, roots, and suffixes. Interactive flashcards for practice.' },
                { icon: <IconWorkflows />, title: 'Front Office Workflows', badge: '24 SOPs', desc: 'Step-by-step procedures for check-in, scheduling, registration, and daily operations.' },
              ].map((module) => (
                <div key={module.title} className="bg-white rounded-2xl p-6 shadow-apple border border-gray-200/50 hover-lift transition-all duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl">
                      {module.icon}
                    </div>
                    <span className="text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">{module.badge}</span>
                  </div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">{module.title}</h4>
                  <p className="text-gray-500 text-sm leading-relaxed">{module.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Coming Soon */}
          <div>
            <div className="flex items-center gap-2 mb-8">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-400 uppercase tracking-wider">Coming Soon</span>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
              {[
                { title: 'Medications', desc: 'Prescription handling, drug classes, controlled substances' },
                { title: 'Referrals & Prior Auth', desc: 'Authorization workflows, tracking, appeals' },
                { title: 'Coding Basics', desc: 'ICD-10, CPT codes, reading EOBs' },
                { title: 'EHR Practice Lab', desc: 'Hands-on simulation with real EHR system', isNew: true },
                { title: 'Patient Communication', desc: 'Phone etiquette, difficult conversations' },
              ].map((item) => (
                <div key={item.title} className="bg-gray-50/50 rounded-2xl p-5 border border-dashed border-gray-200 relative">
                  {item.isNew && (
                    <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-[10px] font-medium px-2.5 py-0.5 rounded-full">NEW</div>
                  )}
                  <h5 className="font-medium text-gray-700 text-sm mb-1">{item.title}</h5>
                  <p className="text-xs text-gray-400 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* View Full Curriculum Link */}
          <div className="text-center mt-16">
            <button
              onClick={() => setShowCurriculum(true)}
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors duration-300"
            >
              View Full Curriculum Details
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-900 py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
          <h3 className="text-4xl font-semibold tracking-tight text-white mb-4">
            Ready to Advance Your Career?
          </h3>
          <p className="text-xl font-light text-gray-400 mb-10 leading-relaxed">
            Join thousands of healthcare professionals building their skills with VytalPath Academy
          </p>
          <button
            onClick={() => setAuthModal('signUp')}
            className="px-8 py-4 text-lg font-medium text-gray-900 bg-white rounded-2xl hover:bg-gray-100 transition-all duration-300 shadow-apple hover:shadow-apple-lg"
          >
            Start Your Training Today
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center">
              <img
                src="/vytalpath-logo.png"
                alt="VytalPath Academy"
                className="h-10 w-auto brightness-0 invert"
              />
            </div>
            <p className="text-sm text-center md:text-left font-light">
              Professional healthcare front office training
            </p>
            <div className="flex items-center gap-6 text-sm">
              <a href="mailto:hello@vytalpath.com" className="hover:text-white transition-colors duration-300">Contact</a>
              <span className="text-gray-700">|</span>
              <span>&copy; 2026 VytalPath</span>
            </div>
          </div>
        </div>
      </footer>

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

      {/* Curriculum Modal */}
      <CurriculumModal isOpen={showCurriculum} onClose={() => setShowCurriculum(false)} />
    </div>
  );
}
