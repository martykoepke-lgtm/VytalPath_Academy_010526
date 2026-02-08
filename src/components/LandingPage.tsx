import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowRight, CheckCircle, Clock, Shield,
  Play, FileText, Sparkles, MessageCircle, Award, Brain,
  ChevronLeft, ChevronRight, Monitor, GraduationCap
} from 'lucide-react';
import { SignIn } from './SignIn';
import { SignUp } from './SignUp';
import { ForgotPassword } from './ForgotPassword';
import { CurriculumModal } from './CurriculumModal';
import { useAuth } from '../contexts/AuthContext';

const VIDEO_BASE_URL = 'https://vwieorhlcapeeamvltqa.supabase.co/storage/v1/object/public/videos';

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

// Platform screenshots for showcase
const platformScreenshots = [
  {
    src: '/images/landing/ehr-lab.png',
    alt: 'EHR Practice Lab — Provider Schedule',
    label: 'EHR Practice Lab',
    desc: 'Manage a clinic schedule, check in patients, and navigate encounters in a hands-on simulation.',
  },
  {
    src: '/images/landing/phone-sim.png',
    alt: 'Phone Call Simulator',
    label: 'Phone Call Simulator',
    desc: 'Practice handling real patient calls with AI-powered scenarios that react to your responses.',
  },
  {
    src: '/images/landing/cmaa-dashboard.png',
    alt: 'CMAA Exam Readiness Dashboard',
    label: 'CMAA Exam Readiness',
    desc: 'Track your progress against all 101 NHA CMAA knowledge statements across 7 exam domains.',
  },
  {
    src: '/images/landing/cmaa-detail.png',
    alt: 'CMAA Knowledge Statements with Lesson Links',
    label: 'Competency Mapping',
    desc: 'Every knowledge statement links directly to the lesson that covers it — so you know exactly where to study.',
  },
];

type AuthModal = 'signIn' | 'signUp' | 'forgotPassword' | null;

interface LocationState {
  from?: { pathname: string };
  showSignIn?: boolean;
}

export function LandingPage() {
  const [authModal, setAuthModal] = useState<AuthModal>(null);
  const [showCurriculum, setShowCurriculum] = useState(false);
  const [activeScreenshot, setActiveScreenshot] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const state = location.state as LocationState | null;
  const videoRef = useRef<HTMLVideoElement>(null);

  // Auto-show sign-in modal when redirected from protected route
  useEffect(() => {
    if (state?.showSignIn && !user) {
      setAuthModal('signIn');
    }
  }, [state, user]);

  // Redirect to intended destination after sign-in (only when redirected from a protected route)
  useEffect(() => {
    if (user && state?.from) {
      navigate(state.from.pathname, { replace: true });
    }
  }, [user, state, navigate]);

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
              {user ? (
                <>
                  <Link
                    to="/welcome"
                    className="px-6 py-2.5 text-sm font-medium text-white bg-gray-900 rounded-2xl hover:bg-gray-800 transition-all duration-300 shadow-apple-sm hover:shadow-apple"
                  >
                    Go to Dashboard
                  </Link>
                </>
              ) : (
                <>
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
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section — Video + Headline */}
      <section className="relative overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-10 pb-6 md:pt-16 md:pb-10">
          {/* Headline */}
          <div className="text-center mb-10">
            <div className="mb-6">
              <img
                src="/vytalpath-logo.png"
                alt="VytalPath Academy"
                className="h-28 md:h-36 w-auto mx-auto"
              />
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-gray-900 mb-4 leading-tight">
              How do you get a healthcare job
              <span className="block text-blue-600 mt-1">
                with no experience?
              </span>
            </h1>

            <p className="text-lg md:text-xl font-light text-gray-500 max-w-2xl mx-auto mb-8 leading-relaxed">
              You get trained. VytalPath Academy is the only platform purpose-built for healthcare front office roles — insurance, HIPAA, workflows, EHR simulation, and more. Job-ready in weeks, not months.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
              <button
                onClick={() => setAuthModal('signUp')}
                className="group px-8 py-3.5 text-lg font-medium text-white bg-gray-900 rounded-2xl hover:bg-gray-800 transition-all duration-300 shadow-apple hover:shadow-apple-lg flex items-center gap-2"
              >
                Start Learning Today
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
              <a
                href="#pricing"
                className="px-8 py-3.5 text-lg font-medium text-gray-700 border-2 border-gray-200 rounded-2xl hover:border-gray-300 hover:bg-gray-50 transition-all duration-300"
              >
                View Pricing
              </a>
            </div>
          </div>

          {/* Welcome Video — Prominent */}
          <div className="max-w-4xl mx-auto mb-10">
            <div className="relative rounded-2xl overflow-hidden shadow-apple-lg border border-gray-200/50 bg-gray-900">
              <video
                ref={videoRef}
                controls
                poster="/vytalpath-logo.png"
                className="w-full aspect-video"
                preload="metadata"
              >
                <source src={`${VIDEO_BASE_URL}/welcome_landing_page.mp4`} type="video/mp4" />
              </video>
            </div>
            <p className="text-center text-sm text-gray-400 mt-3 font-light">
              Meet your instructor — 20 years of healthcare experience, built into every lesson.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-5 gap-3 max-w-3xl mx-auto">
            {[
              { value: '8', label: 'Training Sections' },
              { value: '40+', label: 'Lessons' },
              { value: '8', label: 'Quizzes' },
              { value: '24', label: 'SOP Guides' },
              { value: '24/7', label: 'AI Tutor' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white rounded-2xl p-4 text-center border border-gray-200/50 shadow-apple-sm">
                <div className="text-2xl font-semibold text-gray-900 mb-0.5">{stat.value}</div>
                <div className="text-xs font-light text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CMAA Alignment Section */}
      <section className="bg-gradient-to-r from-indigo-50 via-blue-50 to-indigo-50 py-10 md:py-14 border-y border-indigo-100">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Badge */}
            <div className="flex-shrink-0">
              <div className="w-24 h-24 md:w-28 md:h-28 bg-white rounded-2xl shadow-apple border border-indigo-100 flex items-center justify-center">
                <div className="text-center">
                  <GraduationCap className="w-10 h-10 text-indigo-600 mx-auto mb-1" />
                  <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider leading-tight block">CMAA<br/>Aligned</span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-gray-900 mb-3">
                Built to CMAA Certification Standards
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Every lesson, quiz, and exercise in VytalPath Academy is designed to align with the <span className="font-medium text-gray-900">NHA Certified Medical Administrative Assistant (CMAA)</span> exam content outline. While this platform is not a certified training program, the curriculum is purpose-built to cover all 101 knowledge statements across all 7 exam domains — giving you the strongest possible foundation for certification success.
              </p>
              <div className="flex flex-wrap items-center gap-3 justify-center md:justify-start">
                <div className="flex items-center gap-2 text-sm text-indigo-700 bg-white px-4 py-2 rounded-full border border-indigo-100">
                  <Shield className="w-4 h-4" />
                  <span>101 Knowledge Statements Mapped</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-indigo-700 bg-white px-4 py-2 rounded-full border border-indigo-100">
                  <CheckCircle className="w-4 h-4" />
                  <span>7 Exam Domains Covered</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-indigo-700 bg-white px-4 py-2 rounded-full border border-indigo-100">
                  <Monitor className="w-4 h-4" />
                  <span>Real-Time Readiness Tracking</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Experience Showcase */}
      <section className="bg-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-gray-900 mb-3">
              See the Platform in Action
            </h2>
            <p className="text-lg font-light text-gray-500 max-w-2xl mx-auto">
              Real tools you'll use every day — from EHR simulation to AI-powered practice scenarios
            </p>
          </div>

          {/* Screenshot Carousel */}
          <div className="max-w-5xl mx-auto">
            {/* Main Image */}
            <div className="relative rounded-2xl overflow-hidden shadow-apple-lg border border-gray-200/50 bg-gray-50 mb-4">
              <img
                src={platformScreenshots[activeScreenshot].src}
                alt={platformScreenshots[activeScreenshot].alt}
                className="w-full object-cover"
              />
              {/* Nav arrows */}
              <button
                onClick={() => setActiveScreenshot((prev) => (prev - 1 + platformScreenshots.length) % platformScreenshots.length)}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-700" />
              </button>
              <button
                onClick={() => setActiveScreenshot((prev) => (prev + 1) % platformScreenshots.length)}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-gray-700" />
              </button>
            </div>

            {/* Caption */}
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">{platformScreenshots[activeScreenshot].label}</h3>
              <p className="text-sm text-gray-500 max-w-lg mx-auto">{platformScreenshots[activeScreenshot].desc}</p>
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-3">
              {platformScreenshots.map((shot, i) => (
                <button
                  key={shot.label}
                  onClick={() => setActiveScreenshot(i)}
                  className={`rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                    i === activeScreenshot
                      ? 'border-blue-500 shadow-apple ring-2 ring-blue-200'
                      : 'border-gray-200 hover:border-gray-300 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={shot.src} alt={shot.alt} className="w-full aspect-video object-cover" />
                  <div className="px-2 py-1.5 bg-white">
                    <span className={`text-[11px] font-medium ${i === activeScreenshot ? 'text-blue-600' : 'text-gray-500'}`}>
                      {shot.label}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How You'll Learn */}
      <section className="bg-gray-50/50 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-gray-900 mb-3">
              How You'll Learn
            </h2>
            <p className="text-lg font-light text-gray-500 max-w-xl mx-auto">
              Every topic combines multiple formats to help you understand, practice, and retain
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-5xl mx-auto">
            {[
              { icon: Play, label: 'Video Lessons', desc: 'Expert-led walkthroughs' },
              { icon: FileText, label: 'SOPs & Guides', desc: '24 step-by-step references' },
              { icon: Brain, label: 'EHR Simulation', desc: 'Hands-on PM practice' },
              { icon: Sparkles, label: 'Exercises', desc: 'Quizzes, flashcards & more' },
              { icon: MessageCircle, label: 'AI Tutor', desc: 'Ask anything, anytime' },
              { icon: Award, label: 'Job Readiness', desc: 'Interview & resume prep' },
            ].map((mode) => (
              <div key={mode.label} className="bg-white rounded-2xl p-5 text-center border border-gray-200/50 shadow-apple-sm hover-lift transition-all duration-300">
                <div className="w-10 h-10 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <mode.icon className="w-5 h-5 text-blue-600" />
                </div>
                <h4 className="text-sm font-medium text-gray-900 mb-0.5">{mode.label}</h4>
                <p className="text-xs text-gray-400">{mode.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What You'll Learn — Curriculum */}
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-semibold tracking-tight text-gray-900 mb-4">
              What You'll Learn
            </h2>
            <p className="text-xl font-light text-gray-500 max-w-2xl mx-auto">
              8 training sections covering every skill your front desk needs
            </p>
          </div>

          {/* Available Now */}
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-blue-600 uppercase tracking-wider">Available Now</span>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: <IconFoundations />, title: 'Healthcare Foundations', badge: '3 lessons', desc: 'Understand acute vs. ambulatory care, the front office role, and how healthcare delivery works.' },
                { icon: <IconLaw />, title: 'Medical Law & Compliance', badge: '9 lessons', desc: 'HIPAA essentials, PHI protection, patient rights, authorization, consent, EMTALA, and fraud prevention.' },
                { icon: <IconInsurance />, title: 'Insurance & Billing', badge: '7 lessons', desc: 'Payer types, plan types, reading insurance cards, eligibility verification, copays, and payment collection.' },
                { icon: <IconWorkflows />, title: 'Front Office Workflows', badge: '4 lessons + 24 SOPs', desc: 'Registration, scheduling, check-in, check-out, and step-by-step guides for daily operations.' },
                { icon: <IconTerminology />, title: 'EHR & Practice Management', badge: '9 lessons', desc: 'PM vs EHR systems, encounter types, scheduling methods, phone encounters, and duplicate prevention.', isNew: true },
                { icon: <IconTerminology />, title: 'Medical Terminology', badge: '5 lessons + flashcards', desc: 'Decode medical terms using prefixes, roots, and suffixes. Interactive flashcards for practice.' },
                { icon: <IconWorkflows />, title: 'EHR Practice Lab', badge: 'Simulation', desc: 'Hands-on practice in a simulated PM system — schedule, register, check-in, and manage a clinic day.', isNew: true },
                { icon: <IconFoundations />, title: 'Job Readiness', badge: '6 tools', desc: 'Phone simulations, mock interviews, resume builder, insurance hotline practice, and readiness assessments.' },
              ].map((module) => (
                <div key={module.title} className="bg-white rounded-2xl p-6 shadow-apple border border-gray-200/50 hover-lift transition-all duration-300 relative">
                  {'isNew' in module && module.isNew && (
                    <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-[10px] font-medium px-2.5 py-0.5 rounded-full">NEW</div>
                  )}
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
            <div className="flex items-center gap-2 mb-6">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-400 uppercase tracking-wider">Coming Soon</span>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { title: 'Medications', desc: 'Prescription handling, drug classes, controlled substances' },
                { title: 'Referrals & Prior Auth', desc: 'Authorization workflows, tracking, appeals' },
                { title: 'Coding Basics', desc: 'ICD-10, CPT codes, reading EOBs' },
                { title: 'Patient Communication', desc: 'Phone etiquette, difficult conversations' },
              ].map((item) => (
                <div key={item.title} className="bg-gray-50/50 rounded-2xl p-5 border border-dashed border-gray-200">
                  <h5 className="font-medium text-gray-700 text-sm mb-1">{item.title}</h5>
                  <p className="text-xs text-gray-400 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* View Full Curriculum Link */}
          <div className="text-center mt-10">
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

      {/* Pricing Section */}
      <section id="pricing" className="bg-gray-50/50 py-16 md:py-20">
        <div className="max-w-xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="bg-white rounded-2xl p-8 shadow-apple border border-gray-200/50 text-center">
            <h2 className="text-2xl font-semibold tracking-tight text-gray-900 mb-1">
              Full Access
            </h2>
            <p className="text-sm text-gray-500 mb-6">Everything you need to become job-ready</p>

            <div className="mb-6">
              <span className="text-5xl font-semibold text-gray-900">$327</span>
              <span className="text-gray-400 font-light text-lg">/year</span>
            </div>

            <ul className="space-y-2.5 mb-8 text-left max-w-xs mx-auto">
              {[
                'All 8 training sections',
                '40+ lessons, 8 quizzes & 24 SOPs',
                'Hands-on EHR Practice Lab',
                'CMAA exam readiness tracking',
                'Job readiness tools & mock interviews',
                'AI study assistant on every page',
                'New content added regularly',
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

            <p className="text-xs text-gray-400 mt-4">
              Training a team?{' '}
              <a href="mailto:hello@vytalpath.com?subject=VytalPath%20Academy%20Team%20Pricing" className="text-blue-600 hover:text-blue-700 transition-colors">
                Contact us for volume pricing
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* Founder Credibility Bar */}
      <section className="bg-white py-12 md:py-16 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
          <p className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">Created by</p>
          <h3 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-3">
            20 Years of Healthcare Experience,<br className="hidden sm:block" /> Built Into Every Lesson
          </h3>
          <p className="text-gray-500 leading-relaxed max-w-2xl mx-auto mb-6">
            VytalPath Academy was built by a Clinical Informatics professional with two decades of hands-on healthcare experience — from ICU unit clerk to EHR analyst to ambulatory workflow optimization. This curriculum reflects real-world knowledge from someone who has configured EHR systems, trained clinic staff, and helped health systems improve every day.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1.5 bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
              <GraduationCap className="w-4 h-4 text-gray-400" />
              Master's in Healthcare Administration
            </span>
            <span className="flex items-center gap-1.5 bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
              <Monitor className="w-4 h-4 text-gray-400" />
              14 Years in Clinical Informatics
            </span>
            <span className="flex items-center gap-1.5 bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
              <Award className="w-4 h-4 text-gray-400" />
              EHR Analyst & Workflow Expert
            </span>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-900 py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
          <h3 className="text-3xl md:text-4xl font-semibold tracking-tight text-white mb-3">
            Ready to Start Your Healthcare Career?
          </h3>
          <p className="text-lg font-light text-gray-400 mb-8 leading-relaxed">
            Get the foundation that opens doors — the same knowledge that launched a 20-year career
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
              Professional healthcare front office training — aligned with CMAA certification standards
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
