import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowRight, CheckCircle, Clock, Shield,
  Play, FileText, Sparkles, MessageCircle, Award, Brain,
  ChevronLeft, ChevronRight, ChevronDown, Monitor, GraduationCap, Users, BookOpen
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
    alt: 'Learning Progress Dashboard',
    label: 'Learning Progress',
    desc: 'Track your progress across 101 competency topics in 7 knowledge domains — see exactly where to focus next.',
  },
  {
    src: '/images/landing/cmaa-detail.png',
    alt: 'Competency Mapping with Lesson Links',
    label: 'Competency Mapping',
    desc: 'Every competency topic links directly to the lesson that covers it — so you know exactly where to study.',
  },
  {
    src: '/images/landing/certificate.png',
    alt: 'Certificate of Completion',
    label: 'Certificate of Completion',
    desc: 'Earn a professional certificate when you complete all lessons and pass every competency assessment.',
  },
];

const faqData = [
  {
    question: 'Do I need any healthcare experience?',
    answer: "No. That's exactly who this is for. We start with the basics and build up to real workflows. You'll finish with practical knowledge that employers are actually hiring for.",
  },
  {
    question: 'Is this accredited or certified?',
    answer: 'VytalPath Academy is a competency-based training program covering 101 knowledge areas across 7 domains. You earn a certificate of completion with a unique verification number. Many employers value demonstrated practical competency — and our curriculum maps to the same knowledge areas tested by organizations like AAMA and NHA.',
  },
  {
    question: 'Can I actually get a job with this?',
    answer: "We prepare you for medical receptionist, patient access representative, scheduling coordinator, and referral coordinator roles. The program includes a resume builder and mock interviews. We can't guarantee placement, but these are the skills hiring managers are looking for.",
  },
  {
    question: 'How long does it take?',
    answer: "About 10+ hours of content. Most people finish in 4-8 weeks going at their own pace. You have a full year of access, so there's no pressure.",
  },
  {
    question: '$327 seems like a lot. Is it worth it?',
    answer: 'Comparable programs cost $1,000+. Community college programs run $2,000-5,000. You get a full year of access, 80+ lessons, AI coaching, a hands-on EHR Practice Lab, 24 SOPs, and job readiness tools. Plus a 3-day full refund guarantee — try it risk-free.',
  },
  {
    question: "Can't I just learn this on YouTube?",
    answer: "YouTube can teach you what HIPAA is. It can't give you a simulated EHR to practice on, 24 SOPs to use on the job, AI-powered mock interviews, phone call simulations, competency tracking, or a certificate to show an employer.",
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
  const [openFaq, setOpenFaq] = useState<number | null>(null);
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

  return (
    <div className="min-h-screen bg-white">
      {/* Header/Nav */}
      <header className="glass border-b border-gray-200/50 shadow-apple-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-4">
          <div className="flex items-center justify-between">
            <img
              src="/vp-long-logo.png"
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

      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-10 pb-6 md:pt-16 md:pb-10">
          <div className="text-center mb-10">
            <p className="text-sm font-medium text-blue-600 uppercase tracking-wider mb-4">Healthcare Front Office Training</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-gray-900 mb-4 leading-tight">
              The training{' '}
              <span className="text-blue-600">nobody told you</span>
              {' '}existed.
            </h1>

            <p className="text-lg md:text-xl font-light text-gray-500 max-w-2xl mx-auto mb-8 leading-relaxed">
              Most people who want to work in healthcare have no idea that front office training programs exist.
              The few that do cost $1,000 or more. VytalPath Academy is $327 a year — and the only program with
              a built-in EHR Practice Lab.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-2">
              <button
                onClick={() => setAuthModal('signUp')}
                className="group px-8 py-3.5 text-lg font-medium text-white bg-gray-900 rounded-2xl hover:bg-gray-800 transition-all duration-300 shadow-apple hover:shadow-apple-lg flex items-center gap-2"
              >
                Start Learning — $327/year
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
              <button
                onClick={() => setShowCurriculum(true)}
                className="px-8 py-3.5 text-lg font-medium text-gray-700 border-2 border-gray-200 rounded-2xl hover:border-gray-300 hover:bg-gray-50 transition-all duration-300"
              >
                View Full Curriculum
              </button>
            </div>
            <p className="text-sm text-gray-400 font-light">3-day full refund guarantee · No hidden fees</p>
          </div>

          {/* Welcome Video */}
          <div className="max-w-4xl mx-auto mb-10">
            <div className="relative rounded-2xl overflow-hidden shadow-apple-lg border border-gray-200/50 bg-gray-900">
              <video
                ref={videoRef}
                controls
                poster="/vytalpath-logo.png"
                className="w-full aspect-video"
                preload="metadata"
              >
                <source src={`${VIDEO_BASE_URL}/welcome_landing2.mp4`} type="video/mp4" />
              </video>
            </div>
            <p className="text-center text-sm text-gray-400 mt-3 font-light">
              Meet your instructor — 20 years of healthcare experience, built into every lesson.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-5 gap-3 max-w-3xl mx-auto">
            {[
              { value: '9', label: 'Training Sections' },
              { value: '80+', label: 'Lessons' },
              { value: '18', label: 'Quizzes' },
              { value: '24', label: 'SOP Guides' },
              { value: '24/7', label: 'Adaptive AI' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white rounded-2xl p-4 text-center border border-gray-200/50 shadow-apple-sm">
                <div className="text-2xl font-semibold text-gray-900 mb-0.5">{stat.value}</div>
                <div className="text-xs font-light text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ PROBLEM ============ */}
      <section className="bg-white py-16 md:py-20">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-12">
            <p className="text-sm font-medium text-red-400/80 uppercase tracking-wider mb-3">The gap nobody's closing</p>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-gray-900 max-w-2xl mx-auto">
              Two sides of the same problem. Nobody's connecting them.
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-50/50 rounded-2xl p-8 border border-gray-200/50">
              <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center mb-4">
                <Shield className="w-5 h-5 text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">If you're a clinic manager...</h3>
              <p className="text-gray-500 leading-relaxed">
                You've interviewed someone you actually wanted to hire. Good attitude. Reliable. Ready to work.
                But you had to pass — because they didn't know the first thing about insurance verification, HIPAA,
                or how to navigate an EHR. The position stays open. Again.
              </p>
            </div>
            <div className="bg-gray-50/50 rounded-2xl p-8 border border-gray-200/50">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
                <Users className="w-5 h-5 text-blue-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">If you're looking for a healthcare career...</h3>
              <p className="text-gray-500 leading-relaxed">
                Nobody told you that front office training programs even exist. There's no clear path from
                "I want to work in healthcare" to "I'm qualified for this job." And the few programs out there?
                $1,000 or more. So you never apply — or you apply and get passed over.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ ORIGIN STORY ============ */}
      <section className="bg-gray-900 text-white py-16 md:py-20">
        <div className="max-w-3xl mx-auto px-6 sm:px-8 lg:px-12">
          <p className="text-sm font-medium text-blue-400 uppercase tracking-wider mb-4">Why we built this</p>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-8">
            20 years watching the same gap — from both sides.
          </h2>
          <div className="space-y-5 text-gray-300 leading-relaxed text-lg">
            <p>
              VytalPath Academy was built by a Clinical Informatics professional with two decades of hands-on
              healthcare experience — from ICU unit clerk to EHR analyst to ambulatory workflow optimization.
              And across all of it, the same problem kept showing up.
            </p>
            <p>
              Clinic managers would interview someone they actually wanted to hire — but they'd have to pass because
              the candidate had <span className="text-white font-medium">zero healthcare knowledge</span>. On the other
              side, those same candidates had no idea that front office training programs even existed. And the few that
              did cost $1,000+ and took months.
            </p>
            <p>
              So most people either never apply, or they apply and get passed over for someone with experience they
              never had a chance to get.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 mt-8 mb-8">
            <span className="flex items-center gap-1.5 text-sm text-blue-300 bg-white/5 px-4 py-2 rounded-full border border-white/10">
              Master's in Healthcare Administration
            </span>
            <span className="flex items-center gap-1.5 text-sm text-blue-300 bg-white/5 px-4 py-2 rounded-full border border-white/10">
              14 Years in Clinical Informatics
            </span>
            <span className="flex items-center gap-1.5 text-sm text-blue-300 bg-white/5 px-4 py-2 rounded-full border border-white/10">
              EHR Analyst & Workflow Expert
            </span>
          </div>
          <blockquote className="pl-6 border-l-2 border-blue-400 text-2xl md:text-3xl font-semibold leading-snug">
            I built VytalPath Academy to close that gap. It's the bridge that should have existed a long time ago.
          </blockquote>
        </div>
      </section>

      {/* ============ COMPETENCY BADGE ============ */}
      <section className="bg-gradient-to-r from-indigo-50 via-blue-50 to-indigo-50 py-10 md:py-14 border-y border-indigo-100">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-shrink-0">
              <div className="w-24 h-24 md:w-28 md:h-28 bg-white rounded-2xl shadow-apple border border-indigo-100 flex items-center justify-center">
                <div className="text-center">
                  <GraduationCap className="w-10 h-10 text-indigo-600 mx-auto mb-1" />
                  <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider leading-tight block">Competency<br/>Based</span>
                </div>
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-gray-900 mb-3">
                Comprehensive Competency-Based Curriculum
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Every lesson, quiz, and exercise in VytalPath Academy is mapped to <span className="font-medium text-gray-900">101 competency topics across 7 knowledge domains</span>. The curriculum covers the full scope of healthcare front office work — from insurance and compliance to EHR workflows and patient communication — with real-time progress tracking so you always know where you stand.
              </p>
              <div className="flex flex-wrap items-center gap-3 justify-center md:justify-start">
                <div className="flex items-center gap-2 text-sm text-indigo-700 bg-white px-4 py-2 rounded-full border border-indigo-100">
                  <Shield className="w-4 h-4" />
                  <span>101 Competency Topics</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-indigo-700 bg-white px-4 py-2 rounded-full border border-indigo-100">
                  <CheckCircle className="w-4 h-4" />
                  <span>7 Knowledge Domains</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-indigo-700 bg-white px-4 py-2 rounded-full border border-indigo-100">
                  <Monitor className="w-4 h-4" />
                  <span>Real-Time Progress Tracking</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ PLATFORM SHOWCASE ============ */}
      <section className="bg-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-gray-900 mb-3">
              See the Platform in Action
            </h2>
            <p className="text-lg font-light text-gray-500 max-w-2xl mx-auto">
              From EHR simulation to AI that adapts to your progress — real tools that meet you where you are
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="relative rounded-2xl overflow-hidden shadow-apple-lg border border-gray-200/50 bg-gray-50 mb-4">
              <img
                src={platformScreenshots[activeScreenshot].src}
                alt={platformScreenshots[activeScreenshot].alt}
                className="w-full object-cover"
                loading="lazy"
              />
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

            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">{platformScreenshots[activeScreenshot].label}</h3>
              <p className="text-sm text-gray-500 max-w-lg mx-auto">{platformScreenshots[activeScreenshot].desc}</p>
            </div>

            <div className="grid grid-cols-5 gap-3">
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
                  <img src={shot.src} alt={shot.alt} className="w-full aspect-video object-cover" loading="lazy" />
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

      {/* ============ HOW YOU'LL LEARN ============ */}
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
              { icon: MessageCircle, label: 'Adaptive AI', desc: 'Coaches you at every step' },
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

      {/* ============ WHAT YOU'LL LEARN ============ */}
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-semibold tracking-tight text-gray-900 mb-4">
              What You'll Learn
            </h2>
            <p className="text-xl font-light text-gray-500 max-w-2xl mx-auto">
              9 training sections covering every skill your front desk needs
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
                { icon: <IconLaw />, title: 'Medical Law & Compliance', badge: '18 lessons', desc: 'HIPAA essentials, PHI, patient rights, consent, EMTALA, fraud prevention, plus workplace safety, infection control, and administrative procedures.' },
                { icon: <IconInsurance />, title: 'Insurance & Billing', badge: '18 lessons', desc: 'Payer types, eligibility, reading insurance cards, copays, payment collection, ICD-10, CPT coding, referrals, and prior authorization.' },
                { icon: <IconWorkflows />, title: 'Front Office Workflows', badge: '10 lessons + 24 SOPs', desc: 'Registration, scheduling, check-in, check-out, administrative skills, cash handling, supply management, and 24 SOP guides.' },
                { icon: <IconLaw />, title: 'Patient Communication', badge: '7 lessons', desc: 'Communication styles, active listening, de-escalation, cultural competence, phone etiquette, and team communication.', isNew: true },
                { icon: <IconTerminology />, title: 'EHR & Practice Management', badge: '13 lessons', desc: 'PM vs EHR systems, encounter types, scheduling, phone encounters, duplicate prevention, telehealth, and patient portals.' },
                { icon: <IconTerminology />, title: 'Medical Terminology', badge: '5 lessons + flashcards', desc: 'Decode medical terms using prefixes, roots, and suffixes. Interactive flashcards for practice.' },
                { icon: <IconWorkflows />, title: 'EHR Practice Lab', badge: 'Simulation', desc: 'Hands-on practice in a simulated PM system with AI coaching — schedule, register, check-in, and manage a clinic day.' },
                { icon: <IconFoundations />, title: 'Job Readiness', badge: '6 tools', desc: 'AI-powered phone simulations, mock interviews, patient scenarios, resume builder, and readiness assessments.' },
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
                { title: 'Medications for Front Office', desc: 'Prescription handling, drug classes, DEA schedules, controlled substances' },
              ].map((item) => (
                <div key={item.title} className="bg-gray-50/50 rounded-2xl p-5 border border-dashed border-gray-200">
                  <h5 className="font-medium text-gray-700 text-sm mb-1">{item.title}</h5>
                  <p className="text-xs text-gray-400 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

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

      {/* ============ AI DIFFERENTIATOR ============ */}
      <section className="bg-gradient-to-b from-gray-50/50 to-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-sm font-medium text-blue-600 uppercase tracking-wider mb-3">What makes this different</p>
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-gray-900 mb-4">
                AI coaching built in —<br className="hidden sm:block" /> not bolted on.
              </h2>
              <p className="text-gray-500 leading-relaxed mb-3">
                Most online training programs are static. Watch a video. Take a quiz. You're on your own.
                VytalPath Academy is different — AI coaching is woven into the entire learning experience,
                adapting to your progress and meeting you where you are.
              </p>
              <p className="text-gray-500 leading-relaxed">
                It's not just self-paced learning. It's <span className="font-medium text-gray-900">guided</span> self-paced learning.
                A tutor, a practice partner, and an interview coach — for $327.
              </p>
            </div>
            <div className="bg-gray-900 rounded-2xl p-8 text-white relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-blue-500/10" />
              {[
                { title: 'While you study', desc: 'Explains concepts, answers questions, and connects ideas across lessons — available 24/7 on every page.' },
                { title: 'In the EHR Lab', desc: 'Coaches you through workflows as you practice — scheduling, check-in, charting — without doing the work for you.' },
                { title: 'When you need practice', desc: 'Generates questions targeting your weak areas and adapts difficulty based on your responses.' },
                { title: 'Before your first day', desc: 'Simulates real patient interactions and workplace scenarios so you build confidence with realistic practice.' },
              ].map((item, i) => (
                <div key={item.title} className={`flex items-start gap-4 py-4 relative ${i < 3 ? 'border-b border-white/10' : ''}`}>
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-400 mt-2 flex-shrink-0 shadow-[0_0_8px_rgba(96,165,250,0.4)]" />
                  <div>
                    <h4 className="font-semibold text-sm mb-1">{item.title}</h4>
                    <p className="text-sm text-white/60 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ SOUND BITE BANNER ============ */}
      <section className="bg-gray-900 py-14 md:py-16">
        <div className="max-w-3xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
          <blockquote className="text-2xl md:text-3xl font-semibold text-white leading-snug">
            "YouTube can teach you what HIPAA is. It can't give you a job."
          </blockquote>
        </div>
      </section>

      {/* ============ PRICING COMPARISON ============ */}
      <section id="pricing" className="bg-gray-50/50 py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-gray-900 mb-3">
              A fraction of what other programs charge.
            </h2>
            <p className="text-lg font-light text-gray-500">One price. Everything included. No upsells.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Community College */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200/50 opacity-60 text-center">
              <p className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3">Community College</p>
              <div className="text-4xl font-semibold text-gray-400 mb-1">$2,000+</div>
              <p className="text-sm text-gray-400 mb-6">per semester</p>
              <ul className="space-y-2 text-left text-sm text-gray-400">
                <li className="flex items-start gap-2.5"><span className="text-gray-300">—</span> Fixed class schedule</li>
                <li className="flex items-start gap-2.5"><span className="text-gray-300">—</span> Semester timeline</li>
                <li className="flex items-start gap-2.5"><span className="text-gray-300">—</span> Classroom-based</li>
                <li className="flex items-start gap-2.5"><span className="text-gray-300">—</span> General curriculum</li>
              </ul>
            </div>

            {/* VytalPath — Featured */}
            <div className="bg-white rounded-2xl p-6 border-2 border-blue-500 shadow-apple text-center relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold uppercase tracking-wider px-4 py-1 rounded-full">
                Best Value
              </div>
              <p className="text-sm font-medium text-gray-900 uppercase tracking-wider mb-3">VytalPath Academy</p>
              <div className="text-5xl font-semibold text-gray-900 mb-1">$327</div>
              <p className="text-sm text-gray-500 mb-6">per year — full access</p>
              <ul className="space-y-2.5 text-left text-sm text-gray-700 mb-6">
                {[
                  '80+ lessons, 18 quizzes',
                  'Built-in EHR Practice Lab',
                  'AI coaching throughout',
                  '24 job-ready SOPs',
                  'Phone & interview simulators',
                  'Resume builder + certificate',
                  '101 competency areas tracked',
                  '3-day full refund guarantee',
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => setAuthModal('signUp')}
                className="w-full py-3 px-4 text-white font-medium bg-gray-900 rounded-2xl hover:bg-gray-800 transition-all duration-300 shadow-apple-sm"
              >
                Start Training Today
              </button>
            </div>

            {/* Other Programs */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200/50 opacity-60 text-center">
              <p className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3">Other Online Programs</p>
              <div className="text-4xl font-semibold text-gray-400 mb-1">$1,000+</div>
              <p className="text-sm text-gray-400 mb-6">cohort-based</p>
              <ul className="space-y-2 text-left text-sm text-gray-400">
                <li className="flex items-start gap-2.5"><span className="text-gray-300">—</span> Set start dates</li>
                <li className="flex items-start gap-2.5"><span className="text-gray-300">—</span> No EHR practice lab</li>
                <li className="flex items-start gap-2.5"><span className="text-gray-300">—</span> No AI coaching</li>
                <li className="flex items-start gap-2.5"><span className="text-gray-300">—</span> Limited SOP library</li>
              </ul>
            </div>
          </div>

          <p className="text-center text-sm text-gray-400 mt-8">
            Training a team?{' '}
            <a href="mailto:hello@vytalpath.com?subject=VytalPath%20Academy%20Team%20Pricing" className="text-blue-600 hover:text-blue-700 transition-colors">
              Volume pricing from $121/seat
            </a>
          </p>
        </div>
      </section>

      {/* ============ WHO THIS IS FOR ============ */}
      <section className="bg-white py-16 md:py-20 border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-10">
            <p className="text-sm font-medium text-blue-600 uppercase tracking-wider mb-3">Who this is for</p>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-gray-900">
              Zero experience required.<br className="hidden sm:block" /> That's literally who this is for.
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: 'Career Changers',
                pain: '"I want a stable career but I don\'t know where to start and I can\'t afford to go back to school."',
                answer: 'Healthcare front office jobs are in demand, don\'t require a degree, and VytalPath teaches you everything you need for $327. Finish in a few weeks at your own pace.',
              },
              {
                title: 'Job Seekers',
                pain: '"I keep getting rejected because I don\'t have experience."',
                answer: 'VytalPath gives you the skills AND the proof. Practice on a real EHR simulation, learn the workflows, earn a certificate that shows employers you\'re ready.',
              },
              {
                title: 'Parents & Career Restarters',
                pain: '"I need something flexible that works around my family."',
                answer: '100% online, fully self-paced. Learn from your couch after the kids go to bed. AI coaching available 24/7. No commute. No set class times.',
              },
              {
                title: 'Clinic Managers',
                pain: '"New hires don\'t know basic workflows and it takes months to train them."',
                answer: 'Give your team standardized training before they start — or send candidates to VytalPath so they show up prepared, not just willing. Volume pricing available.',
              },
            ].map((card) => (
              <div key={card.title} className="bg-gray-50/50 rounded-2xl p-6 border border-gray-200/50">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{card.title}</h3>
                <p className="text-sm italic text-red-400/80 mb-3 leading-relaxed">{card.pain}</p>
                <p className="text-sm text-gray-500 leading-relaxed">{card.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section className="bg-gray-50/50 py-16 md:py-20 border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-gray-900">
              Before you ask.
            </h2>
          </div>
          <div className="space-y-2">
            {faqData.map((faq, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200/50 overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left"
                >
                  <span className="font-medium text-gray-900">{faq.question}</span>
                  <ChevronDown className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-200 ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5">
                    <p className="text-sm text-gray-500 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FREE GUIDE CTA ============ */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-16 md:py-20">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="bg-white rounded-2xl shadow-apple border border-gray-200/50 overflow-hidden">
            <div className="md:flex">
              <div className="md:w-2/5 bg-gradient-to-br from-blue-600 to-indigo-600 p-8 md:p-10 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center mb-4">
                  <BookOpen className="w-10 h-10 text-white" />
                </div>
                <div className="inline-block px-3 py-1 bg-white/20 backdrop-blur rounded-full text-xs font-semibold text-white uppercase tracking-wider mb-2">
                  Free Resource
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-white">
                  10 Essential Skills
                </h3>
              </div>
              <div className="md:w-3/5 p-8 md:p-10">
                <h4 className="text-xl font-semibold text-gray-900 mb-3">
                  Not sure where to start? We've mapped it out.
                </h4>
                <p className="text-gray-500 leading-relaxed mb-6">
                  Every healthcare front office role requires 10 core skills — from HIPAA compliance
                  to insurance verification to EHR navigation. Our free guide breaks down each skill
                  and shows exactly how VytalPath trains you for it.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    to="/skills"
                    className="flex-1 px-6 py-3 text-center font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:shadow-lg transition-all duration-300"
                  >
                    Get the Free Guide
                  </Link>
                  <button
                    onClick={() => setAuthModal('signUp')}
                    className="flex-1 px-6 py-3 text-center font-medium text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 transition-all duration-300"
                  >
                    Start Training Now
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-4">
                  No credit card required · Instant access
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FINAL CTA ============ */}
      <section className="bg-gray-900 py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
          <h3 className="text-3xl md:text-4xl font-semibold tracking-tight text-white mb-3">
            Prepared, not just educated.
          </h3>
          <p className="text-lg font-light text-gray-400 mb-8 leading-relaxed">
            $327 a year. AI coaching built in. EHR Practice Lab included. Zero experience required.
            The training that should have existed a long time ago — now it does.
          </p>
          <button
            onClick={() => setAuthModal('signUp')}
            className="px-8 py-4 text-lg font-medium text-gray-900 bg-white rounded-2xl hover:bg-gray-100 transition-all duration-300 shadow-apple hover:shadow-apple-lg"
          >
            Start Your Training Today
          </button>
          <p className="text-sm text-gray-500 mt-4">3-day full refund guarantee · No hidden fees</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center">
                <img
                  src="/vytalpath-logo.png"
                  alt="VytalPath Academy"
                  className="h-10 w-auto brightness-0 invert"
                />
              </div>
              <p className="text-sm text-center md:text-left font-light">
                Comprehensive healthcare front office training
              </p>
              <div className="flex items-center gap-6 text-sm">
                <a href="mailto:hello@vytalpath.com" className="hover:text-white transition-colors duration-300">Contact</a>
                <span className="text-gray-700">|</span>
                <span>&copy; 2026 VytalPath</span>
              </div>
            </div>

            <div className="border-t border-gray-800 pt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
              <Link to="/privacy" className="hover:text-white transition-colors duration-300">Privacy</Link>
              <Link to="/terms-of-service" className="hover:text-white transition-colors duration-300">Terms</Link>
              <Link to="/cookies" className="hover:text-white transition-colors duration-300">Cookies</Link>
              <Link to="/acceptable-use" className="hover:text-white transition-colors duration-300">Acceptable Use</Link>
              <Link to="/returns" className="hover:text-white transition-colors duration-300">Returns</Link>
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
          onSwitchToForgotPassword={() => setAuthModal('forgotPassword')}
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
