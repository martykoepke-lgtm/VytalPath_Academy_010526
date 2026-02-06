import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle, Clock } from 'lucide-react';
// Note: Custom icons defined below replace Shield, FileText, BookOpen, Zap, User, Building2
import { SignIn } from './SignIn';
import { SignUp } from './SignUp';
import { ForgotPassword } from './ForgotPassword';
import { useAuth } from '../contexts/AuthContext';

// Custom stylized icons as SVG components
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
    <circle cx="24" cy="24" r="20" className="fill-rose-500"/>
    <path d="M24 12V24L32 28" stroke="white" strokeWidth="3" strokeLinecap="round"/>
    <circle cx="24" cy="24" r="3" className="fill-white"/>
    <path d="M16 36L24 28L32 36" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconInsurance = () => (
  <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
    <rect x="6" y="10" width="36" height="28" rx="4" className="fill-indigo-500"/>
    <rect x="10" y="16" width="16" height="10" rx="2" className="fill-indigo-300"/>
    <rect x="10" y="30" width="28" height="4" rx="1" className="fill-white/30"/>
    <circle cx="36" cy="21" r="6" className="fill-indigo-400"/>
    <path d="M33 21L35 23L39 19" stroke="white" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const IconTerminology = () => (
  <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
    <rect x="8" y="6" width="32" height="36" rx="3" className="fill-purple-500"/>
    <rect x="12" y="12" width="24" height="4" rx="1" className="fill-purple-300"/>
    <rect x="12" y="20" width="18" height="3" rx="1" className="fill-white/40"/>
    <rect x="12" y="26" width="22" height="3" rx="1" className="fill-white/40"/>
    <rect x="12" y="32" width="14" height="3" rx="1" className="fill-white/40"/>
    <circle cx="34" cy="34" r="8" className="fill-purple-400"/>
    <text x="34" y="38" textAnchor="middle" className="fill-white text-[10px] font-bold">Rx</text>
  </svg>
);

const IconWorkflows = () => (
  <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
    <rect x="4" y="8" width="18" height="14" rx="3" className="fill-emerald-400"/>
    <rect x="26" y="8" width="18" height="14" rx="3" className="fill-emerald-500"/>
    <rect x="4" y="26" width="18" height="14" rx="3" className="fill-emerald-500"/>
    <rect x="26" y="26" width="18" height="14" rx="3" className="fill-emerald-600"/>
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
        // User just signed in from landing page - take them to content
        navigate('/foundations', { replace: true });
      }
    }
  }, [user, state, navigate]);

  // Handle successful auth - navigate to content
  const handleAuthSuccess = () => {
    setAuthModal(null);
    if (state?.from) {
      navigate(state.from.pathname, { replace: true });
    } else {
      navigate('/foundations');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header/Nav */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <img
              src="/vytalpath-logo.png"
              alt="VytalPath Academy"
              className="h-10 w-auto"
            />
            <div className="flex items-center gap-3">
              <button
                onClick={() => setAuthModal('signIn')}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => setAuthModal('signUp')}
                className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Brand Forward */}
      <section className="relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="text-center">
            {/* Prominent Logo */}
            <div className="mb-8">
              <img
                src="/vytalpath-logo.png"
                alt="VytalPath Academy"
                className="h-20 md:h-24 w-auto mx-auto brightness-0 invert drop-shadow-lg"
              />
            </div>

            <div className="inline-block mb-6">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium border border-white/20">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span>Professional Healthcare Training</span>
              </div>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Master Front Office Skills
              <span className="block text-blue-200 mt-2">
                for Healthcare
              </span>
            </h1>

            <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-10">
              Comprehensive training for medical receptionists, referral coordinators, and clinic staff. Learn insurance, terminology, workflows, and more.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => setAuthModal('signUp')}
                className="group px-8 py-4 text-lg font-semibold text-blue-700 bg-white rounded-xl hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                Start Learning Today
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <a
                href="#pricing"
                className="px-8 py-4 text-lg font-semibold text-white border-2 border-white/30 rounded-xl hover:bg-white/10 transition-all"
              >
                View Pricing
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mt-16">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/10">
                <div className="text-3xl font-bold text-white mb-1">20+</div>
                <div className="text-sm text-blue-200">Video Lessons</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/10">
                <div className="text-3xl font-bold text-white mb-1">24</div>
                <div className="text-sm text-blue-200">SOP Guides</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/10">
                <div className="text-3xl font-bold text-white mb-1">5</div>
                <div className="text-sm text-blue-200">Training Modules</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/10">
                <div className="text-3xl font-bold text-white mb-1">7+</div>
                <div className="text-sm text-blue-200">Hours of Content</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="bg-white py-20 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Choose Your Path
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Invest in your career or train your entire team
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Individual Plan */}
            <div className="bg-white rounded-2xl p-8 shadow-xl border-2 border-gray-100 hover:border-blue-200 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white p-2.5">
                  <IconUser />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Individual</h3>
                  <p className="text-sm text-gray-500">Self-paced learning</p>
                </div>
              </div>

              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">$327</span>
                <span className="text-gray-600">/year</span>
              </div>

              <p className="text-sm text-gray-600 mb-4">
                Perfect for career changers, new hires, or anyone seeking professional development in healthcare administration.
              </p>

              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  5 modules now + new content weekly
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  20+ video lessons & 24 SOPs
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  Interactive quizzes & flashcards
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  Certificate of completion
                </li>
              </ul>

              <button
                onClick={() => setAuthModal('signUp')}
                className="w-full py-3 px-4 text-white font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all"
              >
                Get Started
              </button>
            </div>

            {/* Organization Plan */}
            <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl p-8 shadow-xl text-white relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full">
                Save up to 70%
              </div>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-white p-2.5">
                  <IconBuilding />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Organizations</h3>
                  <p className="text-sm text-emerald-100">Train your team</p>
                </div>
              </div>

              <div className="mb-6">
                <span className="text-3xl font-bold">Volume Pricing</span>
                <p className="text-emerald-100 text-sm mt-1">As low as $99/seat/year</p>
              </div>

              <div className="bg-white/10 rounded-xl p-4 mb-6 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>1-5 seats</span>
                  <span className="font-semibold">$327/seat</span>
                </div>
                <div className="flex justify-between">
                  <span>6-15 seats</span>
                  <span className="font-semibold">$199/seat</span>
                </div>
                <div className="flex justify-between">
                  <span>16-50 seats</span>
                  <span className="font-semibold">$149/seat</span>
                </div>
                <div className="flex justify-between">
                  <span>51+ seats</span>
                  <span className="font-semibold">$99/seat</span>
                </div>
              </div>

              <ul className="space-y-2 mb-6 text-sm text-emerald-50">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  Admin dashboard with progress tracking
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  Personalized student invite links
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  Team completion reports
                </li>
              </ul>

              <a
                href="mailto:hello@vytalpath.com?subject=VytalPath%20Academy%20Team%20Pricing"
                className="w-full py-3 px-4 text-emerald-700 font-semibold bg-white rounded-xl hover:bg-emerald-50 transition-all flex items-center justify-center gap-2"
              >
                Contact for Team Access
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Curriculum Preview */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What You'll Learn
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              5 modules available now, with new content added weekly
            </p>
          </div>

          {/* Available Now */}
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-green-700 uppercase tracking-wide">Available Now</span>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Module 1: Foundations */}
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-12 h-12 rounded-lg">
                    <IconFoundations />
                  </div>
                  <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">3 lessons</span>
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">Healthcare Foundations</h4>
                <p className="text-gray-600 text-sm">Understand acute vs. ambulatory care, the front office role, and how healthcare delivery works.</p>
              </div>

              {/* Module 2: Medical Law & Ethics */}
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-12 h-12 rounded-lg">
                    <IconLaw />
                  </div>
                  <span className="text-xs font-medium text-rose-600 bg-rose-50 px-2 py-1 rounded">4 lessons</span>
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">Medical Law & Ethics</h4>
                <p className="text-gray-600 text-sm">Master HIPAA essentials, PHI protection, patient authorization, and consent requirements.</p>
              </div>

              {/* Module 3: Insurance */}
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-12 h-12 rounded-lg">
                    <IconInsurance />
                  </div>
                  <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded">9 lessons</span>
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">Insurance Training</h4>
                <p className="text-gray-600 text-sm">Learn payers, plan types, reading insurance cards, eligibility verification, and payment collection.</p>
              </div>

              {/* Module 4: Terminology */}
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-12 h-12 rounded-lg">
                    <IconTerminology />
                  </div>
                  <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded">5 lessons + flashcards</span>
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">Medical Terminology</h4>
                <p className="text-gray-600 text-sm">Decode medical terms using prefixes, roots, and suffixes. Interactive flashcards for practice.</p>
              </div>

              {/* Module 5: Workflows */}
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-12 h-12 rounded-lg">
                    <IconWorkflows />
                  </div>
                  <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded">24 SOPs</span>
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">Front Office Workflows</h4>
                <p className="text-gray-600 text-sm">Step-by-step procedures for check-in, scheduling, registration, and daily operations.</p>
              </div>
            </div>
          </div>

          {/* Coming Soon */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Clock className="w-4 h-4 text-amber-600" />
              <span className="text-sm font-semibold text-amber-700 uppercase tracking-wide">Coming Soon</span>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="bg-white/60 rounded-lg p-4 border border-dashed border-gray-300">
                <h5 className="font-semibold text-gray-700 text-sm mb-1">Medications</h5>
                <p className="text-xs text-gray-500">Prescription handling, drug classes, controlled substances</p>
              </div>
              <div className="bg-white/60 rounded-lg p-4 border border-dashed border-gray-300">
                <h5 className="font-semibold text-gray-700 text-sm mb-1">Referrals & Prior Auth</h5>
                <p className="text-xs text-gray-500">Authorization workflows, tracking, appeals</p>
              </div>
              <div className="bg-white/60 rounded-lg p-4 border border-dashed border-gray-300">
                <h5 className="font-semibold text-gray-700 text-sm mb-1">Coding Basics</h5>
                <p className="text-xs text-gray-500">ICD-10, CPT codes, reading EOBs</p>
              </div>
              <div className="bg-white/60 rounded-lg p-4 border border-dashed border-gray-300 relative">
                <div className="absolute -top-2 -right-2 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">NEW</div>
                <h5 className="font-semibold text-gray-700 text-sm mb-1">EHR Practice Lab</h5>
                <p className="text-xs text-gray-500">Hands-on simulation with real EHR system</p>
              </div>
              <div className="bg-white/60 rounded-lg p-4 border border-dashed border-gray-300">
                <h5 className="font-semibold text-gray-700 text-sm mb-1">Patient Communication</h5>
                <p className="text-xs text-gray-500">Phone etiquette, difficult conversations</p>
              </div>
            </div>
          </div>

          {/* View Full Curriculum Link */}
          <div className="text-center mt-12">
            <Link
              to="/curriculum"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              View Full Curriculum Details
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-4xl font-bold text-white mb-4">
            Ready to Advance Your Career?
          </h3>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of healthcare professionals building their skills with VytalPath Academy
          </p>
          <button
            onClick={() => setAuthModal('signUp')}
            className="px-8 py-4 text-lg font-semibold text-blue-700 bg-white rounded-xl hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl"
          >
            Start Your Training Today
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center">
              <img
                src="/vytalpath-logo.png"
                alt="VytalPath Academy"
                className="h-10 w-auto brightness-0 invert"
              />
            </div>
            <p className="text-sm text-center md:text-left">
              Professional healthcare front office training
            </p>
            <div className="flex items-center gap-6 text-sm">
              <a href="mailto:hello@vytalpath.com" className="hover:text-white transition-colors">Contact</a>
              <span className="text-gray-600">|</span>
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
    </div>
  );
}
