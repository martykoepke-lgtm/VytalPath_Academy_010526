import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  BookOpen, Search, GraduationCap, FileText, ArrowRight, CheckCircle,
  Users, Clock, Zap, Building2, User, Shield, BarChart3, Award
} from 'lucide-react';
import { SignIn } from './SignIn';
import { SignUp } from './SignUp';
import { ForgotPassword } from './ForgotPassword';
import { useAuth } from '../contexts/AuthContext';

interface LandingPageProps {
  onEnter: () => void;
}

type AuthModal = 'signIn' | 'signUp' | 'forgotPassword' | null;

interface LocationState {
  from?: { pathname: string };
  showSignIn?: boolean;
}

export function LandingPage({ onEnter }: LandingPageProps) {
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
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <img
              src="/vytalpath-logo.png"
              alt="VytalPath Academy"
              className="h-12 w-auto"
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

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center mb-12">
          <div className="inline-block mb-6">
            <div className="flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
              <Award className="w-4 h-4" />
              <span>Professional Healthcare Training</span>
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Master Healthcare
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Front Office Skills
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Comprehensive training for medical receptionists, referral coordinators, and clinic staff.
            Learn insurance, terminology, workflows, and EHR skills.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => setAuthModal('signUp')}
              className="group px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              Start Learning Today
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <a
              href="#pricing"
              className="px-8 py-4 text-lg font-semibold text-gray-700 bg-white border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-all"
            >
              View Pricing
            </a>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mt-16">
          <div className="bg-white rounded-xl p-6 shadow-md text-center border border-gray-100">
            <div className="text-3xl font-bold text-blue-600 mb-1">40+</div>
            <div className="text-sm text-gray-600">Video Lessons</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md text-center border border-gray-100">
            <div className="text-3xl font-bold text-indigo-600 mb-1">24</div>
            <div className="text-sm text-gray-600">SOP Guides</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md text-center border border-gray-100">
            <div className="text-3xl font-bold text-blue-700 mb-1">10</div>
            <div className="text-sm text-gray-600">Training Modules</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md text-center border border-gray-100">
            <div className="text-3xl font-bold text-indigo-700 mb-1">7+</div>
            <div className="text-sm text-gray-600">Hours of Content</div>
          </div>
        </div>
      </section>

      {/* Who Is This For Section */}
      <section className="bg-white py-20 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Who Is This For?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Whether you're just starting out or looking to upskill your team
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Individual Learners */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border-2 border-blue-200">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                  <User className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Individual Learners</h3>
                  <p className="text-gray-600">Self-paced professional development</p>
                </div>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">New to healthcare administration</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Career changers entering healthcare</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Front office staff seeking advancement</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Pre-employment training seekers</span>
                </li>
              </ul>
              <button
                onClick={() => setAuthModal('signUp')}
                className="w-full py-3 px-4 text-white font-medium bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center justify-center gap-2"
              >
                <User className="w-5 h-5" />
                Sign Up as Individual
              </button>
            </div>

            {/* Organizations */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-8 border-2 border-emerald-200">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-xl flex items-center justify-center">
                  <Building2 className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Organizations</h3>
                  <p className="text-gray-600">Train your entire team</p>
                </div>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Medical clinics onboarding new staff</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Healthcare staffing agencies</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Hospital systems with multiple locations</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Track progress across your team</span>
                </li>
              </ul>
              <a
                href="#org-pricing"
                className="w-full py-3 px-4 text-white font-medium bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all flex items-center justify-center gap-2"
              >
                <Building2 className="w-5 h-5" />
                View Team Pricing
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Curriculum Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Complete Training Curriculum
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            10 comprehensive modules covering everything from HIPAA to EHR systems
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <h4 className="text-lg font-bold text-gray-900 mb-2">Foundations</h4>
            <p className="text-gray-600 text-sm mb-3">HIPAA, PHI, medical law & ethics fundamentals</p>
            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">7 lessons</span>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-indigo-600" />
            </div>
            <h4 className="text-lg font-bold text-gray-900 mb-2">Insurance</h4>
            <p className="text-gray-600 text-sm mb-3">Payers, plans, eligibility, copays, deductibles</p>
            <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded">9 lessons</span>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
              <BookOpen className="w-6 h-6 text-purple-600" />
            </div>
            <h4 className="text-lg font-bold text-gray-900 mb-2">Terminology</h4>
            <p className="text-gray-600 text-sm mb-3">Medical prefixes, roots, suffixes, abbreviations</p>
            <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded">5 lessons + flashcards</span>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-emerald-600" />
            </div>
            <h4 className="text-lg font-bold text-gray-900 mb-2">Workflows</h4>
            <p className="text-gray-600 text-sm mb-3">24 step-by-step SOPs for daily operations</p>
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded">24 SOPs</span>
          </div>
        </div>

        <div className="text-center mt-10">
          <p className="text-gray-500 mb-4">Plus: Medications, Referrals & Prior Auth, Coding Basics, EHR Practice Lab, Patient Communication, Telehealth</p>
          <button
            onClick={onEnter}
            className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-2"
          >
            Preview Full Curriculum
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="bg-gray-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Invest in your career or your team
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Individual Plan */}
            <div className="bg-white rounded-2xl p-8 shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <User className="w-8 h-8 text-blue-600" />
                <h3 className="text-2xl font-bold text-gray-900">Individual</h3>
              </div>
              <div className="mb-6">
                <span className="text-5xl font-bold text-gray-900">$327</span>
                <span className="text-gray-600">/year</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-gray-700">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  Full access to all 10 modules
                </li>
                <li className="flex items-center gap-3 text-gray-700">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  40+ video lessons
                </li>
                <li className="flex items-center gap-3 text-gray-700">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  24 SOP workflow guides
                </li>
                <li className="flex items-center gap-3 text-gray-700">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  Interactive flashcards & quizzes
                </li>
                <li className="flex items-center gap-3 text-gray-700">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  Certificate of completion
                </li>
              </ul>
              <button
                onClick={() => setAuthModal('signUp')}
                className="w-full py-4 px-6 text-white font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all"
              >
                Get Started
              </button>
            </div>

            {/* Organization Plan */}
            <div id="org-pricing" className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl p-8 shadow-xl text-white">
              <div className="flex items-center gap-3 mb-4">
                <Building2 className="w-8 h-8 text-white" />
                <h3 className="text-2xl font-bold">Organizations</h3>
              </div>
              <div className="mb-6">
                <span className="text-3xl font-bold">Volume Pricing</span>
                <p className="text-emerald-100 mt-1">Save up to 63% per seat</p>
              </div>
              <div className="bg-white/10 rounded-xl p-4 mb-6 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>1-5 seats</span>
                  <span className="font-semibold">$327/seat/year</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>6-15 seats</span>
                  <span className="font-semibold">$199/seat/year</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>16-50 seats</span>
                  <span className="font-semibold">$149/seat/year</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>51+ seats</span>
                  <span className="font-semibold">$99/seat/year</span>
                </div>
              </div>
              <ul className="space-y-3 mb-8 text-emerald-50">
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5" />
                  Admin dashboard with progress tracking
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5" />
                  Personalized student invite links
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5" />
                  Team completion reports
                </li>
              </ul>
              <a
                href="mailto:hello@vytalpath.com?subject=VytalPath%20Academy%20Team%20Pricing"
                className="w-full py-4 px-6 text-emerald-700 font-semibold bg-white rounded-xl hover:bg-emerald-50 transition-all flex items-center justify-center gap-2"
              >
                Contact for Team Access
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
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
