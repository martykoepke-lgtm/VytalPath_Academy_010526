import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowRight, CheckCircle, Shield,
  FileText,
  ChevronDown, Monitor, GraduationCap, Users,
  Minus, Stethoscope, ClipboardList, DollarSign, BookA, Briefcase
} from 'lucide-react';
import { SignIn } from './SignIn';
import { SignUp } from './SignUp';
import { ForgotPassword } from './ForgotPassword';
import { CurriculumModal } from './CurriculumModal';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription } from '../contexts/SubscriptionContext';

const VIDEO_BASE_URL = 'https://vwieorhlcapeeamvltqa.supabase.co/storage/v1/object/public/videos';

const faqData = [
  {
    question: 'How long does it take to complete?',
    answer: "VytalPath Academy includes 10+ hours of content across 80+ lessons. Most learners finish in 4–8 weeks, but you have a full year of access — learn at your own pace.",
  },
  {
    question: 'Do I need any prerequisites or experience?',
    answer: "No. VytalPath Academy is designed for beginners with no healthcare experience. We start with the fundamentals and build from there.",
  },
  {
    question: 'Is this a certification program?',
    answer: "No — VytalPath Academy is an educational platform, not a certification or accredited program. You'll learn practical concepts and workflows used in healthcare front office settings. What you do with that knowledge is up to you.",
  },
  {
    question: 'Is $327 the only price?',
    answer: "Yes — $327 for a full year of access. No subscription, no recurring charges, no hidden fees. Other programs cost $1,000–$5,000. VytalPath gives you a full year of learning content, hands-on practice, and simulations for a fraction of that — and you have 3 days to request a full refund if it's not right for you.",
  },
  {
    question: "What's the refund policy?",
    answer: "Full refund within 3 days of enrollment, no questions asked. We want you to feel confident this is the right investment.",
  },
  {
    question: 'Is this just videos and PDFs?',
    answer: "No. VytalPath includes 80+ lessons, 18 quizzes, 24 procedure guides — and a built-in EHR Practice Lab where you practice real workflows in a simulated system with AI coaching. You're not just watching — you're doing.",
  },
  {
    question: 'Who is this designed for?',
    answer: "Anyone curious about healthcare front office work — career changers, people exploring healthcare, or current staff who want to deepen their understanding. VytalPath covers HIPAA, insurance, EHR systems, medical terminology, scheduling, and patient communication through hands-on learning.",
  },
  {
    question: 'What if I get stuck or have questions?',
    answer: "The AI study assistant is available 24/7 on every page — it explains concepts, answers questions, and coaches you through the EHR Practice Lab in real time. You're never learning alone.",
  },
  {
    question: 'Can I access this on mobile?',
    answer: "Yes. VytalPath Academy works on desktop, tablet, and mobile. Learn wherever and whenever works for you.",
  },
  {
    question: 'Do you offer volume pricing for teams?',
    answer: "Yes. Clinic managers and office administrators can enroll multiple staff members at volume pricing — as low as $121/seat. Contact us for team pricing details.",
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
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { hasAccess, loading: subscriptionLoading } = useSubscription();
  const state = location.state as LocationState | null;
  const videoRef = useRef<HTMLVideoElement>(null);

  // Auto-show sign-in modal when redirected from a protected route
  useEffect(() => {
    if (state?.showSignIn && !user) {
      setAuthModal('signIn');
    }
  }, [state, user]);

  // Single source of truth for "where should a signed-in visitor go?"
  // The landing page is for unauthenticated visitors only — once a user is
  // signed in we route them away based on subscription state.
  useEffect(() => {
    if (!user || subscriptionLoading) return;
    if (state?.from) {
      navigate(state.from.pathname, { replace: true });
      return;
    }
    navigate(hasAccess ? '/welcome' : '/pricing', { replace: true });
  }, [user, hasAccess, subscriptionLoading, state, navigate]);

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
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-gray-900 mb-4 leading-tight">
              Learn Healthcare Front Office Skills{' '}
              <span className="text-blue-600">At Your Own Pace</span>
            </h1>

            <p className="text-lg md:text-xl font-light text-gray-500 max-w-2xl mx-auto mb-6 leading-relaxed">
              Understand HIPAA, insurance billing, EHR systems, and medical office workflows through hands-on learning — no classroom required.
            </p>

            {/* Proof stats as bullets */}
            <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-gray-500 mb-8">
              {[
                '80+ lessons across 9 healthcare topic areas',
                'Built-in EHR Practice Lab — actually practice real workflows',
                '$327 for a full year of access (other programs charge $1,000+)',
                'Complete at your own pace — full year of access',
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>

            <div className="flex flex-col items-center gap-3 mb-4">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => setAuthModal('signUp')}
                  className="group px-8 py-3.5 text-lg font-medium text-white bg-gray-900 rounded-2xl hover:bg-gray-800 transition-all duration-300 shadow-apple hover:shadow-apple-lg flex items-center gap-2"
                >
                  Get Started — $327
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </div>
              <p className="text-sm text-gray-500">One-time payment · Full year of access · 3-day money-back guarantee</p>
              <button
                onClick={() => setShowCurriculum(true)}
                className="px-8 py-3.5 text-lg font-medium text-gray-700 border-2 border-gray-200 rounded-2xl hover:border-gray-300 hover:bg-gray-50 transition-all duration-300"
              >
                View Full Curriculum
              </button>
            </div>

            {/* Trust signals */}
            <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
              <span className="flex items-center gap-1.5 text-xs text-gray-400">
                <Briefcase className="w-3.5 h-3.5" /> Practice Tools & Simulations
              </span>
              <span className="flex items-center gap-1.5 text-xs text-gray-400">
                <GraduationCap className="w-3.5 h-3.5" /> Learn from 20+ Years Healthcare Experience
              </span>
              <span className="flex items-center gap-1.5 text-xs text-gray-400">
                <Shield className="w-3.5 h-3.5" /> No Prerequisites Required
              </span>
            </div>
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
                <source src={`${VIDEO_BASE_URL}/WelcometoVPfinal.mp4`} type="video/mp4" />
              </video>
            </div>
            <p className="text-center text-sm text-gray-400 mt-3 font-light">
              Meet your instructor — 20 years of healthcare experience, built into every lesson.
            </p>
          </div>
        </div>
      </section>

      {/* ============ PROBLEM ============ */}
      <section className="bg-white py-16 md:py-20">
        <div className="max-w-3xl mx-auto px-6 sm:px-8 lg:px-12">
          <p className="text-sm font-medium text-red-400/80 uppercase tracking-wider mb-3 text-center">The real barrier</p>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-gray-900 text-center mb-8">
            You're Curious About Healthcare Work, But Don't Know Where to Start
          </h2>
          <div className="space-y-5 text-gray-500 leading-relaxed text-lg">
            <p>
              You're interested in healthcare front office work — but you don't know what the job actually involves.
              What does HIPAA mean in practice? How does insurance verification work? What happens in an EHR system?
              These aren't things you can learn from a job posting.
            </p>
            <p>
              Most educational programs in this space cost $1,000 to $5,000, require rigid classroom schedules,
              and take months to complete. If you just want to explore the subject and learn how things work,
              that's a big commitment.
            </p>
            <p>
              You're organized, you care about helping people, and you learn fast. You just need a way to explore
              these topics at your own pace — without the cost and time commitment of a formal program.
            </p>
            <p className="font-medium text-gray-900">
              That's exactly why we built VytalPath Academy.
            </p>
          </div>
        </div>
      </section>

      {/* ============ THE GUIDE ============ */}
      <section className="bg-gray-900 text-white py-16 md:py-20">
        <div className="max-w-3xl mx-auto px-6 sm:px-8 lg:px-12">
          {/* Visual pullquote */}
          <blockquote className="text-2xl md:text-3xl font-semibold leading-snug mb-10 pl-6 border-l-2 border-blue-400">
            "I didn't know where to start — until I learned what healthcare front office work actually involves."
          </blockquote>

          <p className="text-sm font-medium text-blue-400 uppercase tracking-wider mb-4">Why we built this</p>
          <div className="space-y-5 text-gray-300 leading-relaxed text-lg">
            <p>
              I know exactly what it's like to be locked out. Twenty years ago, I had a bachelor's degree but couldn't get
              hired anywhere in healthcare. No one would take a chance on me because I didn't know HIPAA, insurance billing,
              medical terminology, or how clinical workflows actually worked.
            </p>
            <p>
              I found a few courses that gave me a working foundation — just enough to understand the language, the systems,
              and the workflows. That got me my first job as a unit clerk in an ICU extension.
            </p>
            <p>
              From there, everything changed. I earned a Master's in Healthcare Administration. I worked as an EHR analyst
              during the industry-wide transition to electronic ordering. I spent 14 years in Clinical Informatics helping
              health systems optimize workflows. Over 15 years, I've worked with 2,500 clinics — running learning academies,
              building training content, and partnering with clinic leadership to help staff adopt new systems and improve processes.
            </p>
            <p>
              When my wife Lori — a clinic manager — asked me to build a learning platform for people curious about
              healthcare front office work, I said yes. But I refused to build another course full of boring videos and PDFs
              that don't actually help people understand this work.
            </p>
            <p>
              Real learning requires hands-on practice and coaching. So I spent months building AI agents that coach learners
              through the material, answer questions in real time, and provide the interactive experience people actually need
              to master this work.
            </p>
            <p>
              I built VytalPath Academy because I know what that foundation did for me, and I want to give more people the same
              opportunity to learn. <span className="text-white font-medium">Understanding how healthcare front office operations
              work starts with the right knowledge.</span> VytalPath makes that accessible.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 mt-8">
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
        </div>
      </section>

      {/* ============ WHAT YOU GET ============ */}
      <section className="bg-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-semibold tracking-tight text-gray-900 mb-4">
              Everything You Need to Understand Healthcare Front Office Work
            </h2>
            <p className="text-xl font-light text-gray-500 max-w-2xl mx-auto">
              Nine topic areas covering the day-to-day of healthcare front office operations
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Shield,
                title: 'HIPAA & Compliance Mastery',
                outcome: "Understand patient privacy laws, confidentiality standards, and compliance requirements — the foundation of every healthcare setting.",
              },
              {
                icon: DollarSign,
                title: 'Insurance Billing & Verification',
                outcome: 'Understand insurance types, authorization processes, claims, and billing workflows — the concepts behind every front office insurance interaction.',
              },
              {
                icon: BookA,
                title: 'Medical Terminology',
                outcome: 'Learn body systems, common diagnoses, procedures, and abbreviations — the language you\'ll hear in any healthcare setting.',
              },
              {
                icon: Monitor,
                title: 'EHR Systems & Documentation',
                outcome: "Explore how electronic health records work, understand clinical workflows, and see how patient interactions are documented in real healthcare settings.",
              },
              {
                icon: ClipboardList,
                title: 'Scheduling & Patient Communication',
                outcome: 'Handle the phone calls, the conflicts, the chaos. Master appointment scheduling, patient check-in/check-out, insurance verification calls, and professional communication under pressure.',
              },
              {
                icon: Stethoscope,
                title: 'EHR Practice Lab (AI-Powered)',
                outcome: "Actually practice real workflows — not just watch videos. Use our built-in simulated EHR system to practice scheduling, documentation, patient registration, and troubleshooting with AI coaching in real time.",
                highlight: true,
              },
              {
                icon: FileText,
                title: '24 Procedure Guides',
                outcome: 'Step-by-step instructions you can reference on the job. Guides for patient registration, insurance verification, scheduling protocols, HIPAA compliance procedures, and more.',
              },
              {
                icon: Briefcase,
                title: 'Practice Tools & Simulations',
                outcome: 'Go beyond lessons — practice phone calls, insurance verification, and daily scenarios with AI-powered simulations that adapt to your responses.',
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className={`bg-white rounded-2xl p-6 border hover-lift transition-all duration-300 relative ${
                  'highlight' in feature && feature.highlight
                    ? 'border-blue-300 shadow-apple ring-1 ring-blue-100'
                    : 'border-gray-200/50 shadow-apple'
                }`}
              >
                {'highlight' in feature && feature.highlight && (
                  <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-[10px] font-medium px-2.5 py-0.5 rounded-full">
                    KEY DIFFERENTIATOR
                  </div>
                )}
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">{feature.title}</h4>
                <p className="text-gray-500 text-sm leading-relaxed">{feature.outcome}</p>
              </div>
            ))}
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

      {/* ============ PLATFORM SHOWCASE ============ */}
      <section className="bg-gray-50/50 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-gray-900 mb-3">
              See the Platform in Action
            </h2>
            <p className="text-lg font-light text-gray-500 max-w-2xl mx-auto">
              From EHR simulation to AI that adapts to your progress — real tools that meet you where you are
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative rounded-2xl overflow-hidden shadow-apple-lg border border-gray-200/50 bg-gray-900" style={{ paddingBottom: '62.5%' }}>
              <iframe
                src="https://www.loom.com/embed/7e9b7d1c3f8341209c8de85c8ba09daf"
                frameBorder="0"
                allowFullScreen
                className="absolute top-0 left-0 w-full h-full"
                title="VytalPath Academy Platform Tour"
              />
            </div>
            <p className="text-center text-sm text-gray-400 mt-3 font-light">
              Take a guided tour of VytalPath Academy — see the lessons, EHR Practice Lab, and AI coaching in action.
            </p>
          </div>
        </div>
      </section>

      {/* ============ KEY DIFFERENTIATOR ============ */}
      <section className="bg-white py-16 md:py-20">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-gray-900 mb-3">
              The Only Platform Where You Actually Practice Healthcare Workflows
            </h2>
            <p className="text-lg font-light text-gray-500 max-w-2xl mx-auto">
              Watching videos isn't the same as doing. Hands-on practice builds real understanding.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Other Programs */}
            <div className="bg-gray-50/50 rounded-2xl p-8 border border-gray-200/50">
              <p className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-6">Other Programs</p>
              <ul className="space-y-4">
                {[
                  'Watch videos',
                  'Read PDFs',
                  'Take multiple-choice quizzes',
                  'Hope you remember it all',
                  'No hands-on EHR practice',
                  'No AI coaching or adaptive learning',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-gray-400">
                    <Minus className="w-4 h-4 flex-shrink-0 mt-1" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* VytalPath */}
            <div className="bg-white rounded-2xl p-8 border-2 border-blue-500 shadow-apple relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold uppercase tracking-wider px-4 py-1 rounded-full">
                VytalPath Academy
              </div>
              <p className="text-sm font-medium text-gray-900 uppercase tracking-wider mb-6 mt-2">What You Get</p>
              <ul className="space-y-4">
                {[
                  'Built-in EHR Practice Lab',
                  'Practice real workflows in a simulated system',
                  'Get AI coaching in real time',
                  'Answer questions, troubleshoot problems, build muscle memory',
                  'Build real understanding through hands-on practice',
                  '80+ lessons, 18 quizzes, 24 procedure guides',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-gray-700">
                    <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-1" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ============ LEARN BY DOING ============ */}
      <section className="bg-gray-900 py-14 md:py-16">
        <div className="max-w-3xl mx-auto px-6 sm:px-8 lg:px-12">
          <h3 className="text-2xl md:text-3xl font-semibold text-white mb-4 text-center">
            Learn By Doing — Not Just Watching
          </h3>
          <div className="space-y-4 text-gray-300 leading-relaxed text-center">
            <p>
              VytalPath Academy is an educational platform — we cover 101 topic areas
              across HIPAA, insurance billing, medical terminology, EHR systems, scheduling, and patient communication.
            </p>
            <p>
              But what makes VytalPath different is the hands-on practice. Our built-in EHR Practice Lab, phone call simulations,
              and AI coaching let you experience real healthcare workflows — not just read about them.
            </p>
            <p>
              You'll explore how insurance verification works, practice navigating electronic health records, and work through
              the daily scenarios that healthcare front office staff handle every day.
            </p>
            <p className="text-white font-medium">
              Understanding comes from doing — and that's what VytalPath is built for.
            </p>
          </div>
          <div className="text-center mt-6">
            <button
              onClick={() => setShowCurriculum(true)}
              className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium transition-colors duration-300"
            >
              See What's Included in the Curriculum
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ============ PRICING / VALUE COMPARISON ============ */}
      <section id="pricing" className="bg-gray-50/50 py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-gray-900 mb-3">
              How VytalPath Academy Compares
            </h2>
            <p className="text-lg font-light text-gray-500">One price. Everything included. No upsells.</p>
          </div>

          {/* Comparison Table */}
          <div className="pt-4">
            <div className="bg-white rounded-2xl shadow-apple border border-gray-200/50 overflow-x-auto pt-4">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="p-4 text-left w-2/5" />
                    <th className="p-4 text-center border-l border-gray-100 w-1/5">
                      <p className="text-sm font-medium text-gray-400">Traditional Programs</p>
                      <p className="text-xl font-semibold text-gray-400">$1,000–$5,000</p>
                    </th>
                    <th className="p-4 text-center border-l border-gray-100 bg-blue-50/50 w-1/5 relative">
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full whitespace-nowrap z-10">
                        Best Value
                      </div>
                      <p className="text-sm font-medium text-gray-900 mt-1">VytalPath Academy</p>
                      <p className="text-2xl font-semibold text-gray-900">$327<span className="text-sm font-normal text-gray-500">/yr</span></p>
                    </th>
                    <th className="p-4 text-center border-l border-gray-100 w-1/5">
                      <p className="text-sm font-medium text-gray-400">Free Resources</p>
                      <p className="text-xl font-semibold text-gray-400">$0</p>
                    </th>
                  </tr>
                </thead>
              <tbody>
                {[
                  { feature: 'Schedule', traditional: 'Fixed classes', vytalpath: 'Learn at your own pace', free: 'No structure' },
                  { feature: 'Timeline', traditional: 'Months', vytalpath: '4–8 weeks (average)', free: 'N/A' },
                  { feature: 'Video & Reading Lessons', traditional: true, vytalpath: true, free: 'Partial' },
                  { feature: 'Hands-on EHR Practice Lab', traditional: false, vytalpath: true, free: false },
                  { feature: 'AI Coaching (24/7)', traditional: false, vytalpath: true, free: false },
                  { feature: '24 Procedure Guides (SOPs)', traditional: false, vytalpath: true, free: false },
                  { feature: 'Phone & Insurance Simulations', traditional: false, vytalpath: true, free: false },
                  { feature: 'Progress Tracking (101 topics)', traditional: 'Varies', vytalpath: true, free: false },
                  { feature: 'Refund Guarantee', traditional: 'Varies', vytalpath: '3-Day Full Refund', free: 'N/A' },
                ].map((row, i) => (
                  <tr key={row.feature} className={i % 2 === 0 ? 'bg-gray-50/30' : 'bg-white'}>
                    <td className="p-3.5 text-sm text-gray-700 font-medium">{row.feature}</td>
                    {[row.traditional, row.vytalpath, row.free].map((val, j) => (
                      <td key={j} className={`p-3.5 text-center border-l border-gray-100 ${j === 1 ? 'bg-blue-50/30' : ''}`}>
                        {val === true ? (
                          <CheckCircle className={`w-4 h-4 mx-auto ${j === 1 ? 'text-blue-500' : 'text-gray-300'}`} />
                        ) : val === false ? (
                          <Minus className="w-4 h-4 mx-auto text-gray-200" />
                        ) : (
                          <span className={`text-xs ${j === 1 ? 'text-blue-600 font-medium' : 'text-gray-400'}`}>{val}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
              </table>
            </div>
          </div>

          {/* CTA below table */}
          <div className="text-center mt-8">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => setAuthModal('signUp')}
                className="px-8 py-3.5 text-lg font-medium text-white bg-gray-900 rounded-2xl hover:bg-gray-800 transition-all duration-300 shadow-apple hover:shadow-apple-lg"
              >
                Get Started — $327
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-3">One-time payment · Full year of access · 3-day money-back guarantee</p>
          </div>

          {/* Volume pricing callout */}
          <div className="mt-8 bg-white rounded-2xl p-6 border border-gray-200/50 shadow-apple-sm">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">For Clinic Managers & Office Administrators</h4>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Volume pricing available for teams — as low as $121/seat. Give your front office staff access to
                  consistent, comprehensive learning content that supports onboarding and ongoing development.{' '}
                  <a href="mailto:hello@vytalpath.com?subject=VytalPath%20Academy%20Team%20Pricing" className="text-blue-600 hover:text-blue-700 transition-colors font-medium">
                    Contact us for team pricing
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ WHO THIS IS FOR ============ */}
      <section className="bg-white py-16 md:py-20 border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-10">
            <p className="text-sm font-medium text-blue-600 uppercase tracking-wider mb-3">Is VytalPath Academy right for you?</p>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-gray-900">
              Zero experience required.{' '}
              <span className="text-blue-600">That's literally who this is for.</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: 'Curious About Healthcare Work',
                pain: '"I\'m interested in healthcare front office work but I don\'t know what it actually involves — and I can\'t afford expensive programs just to explore."',
                answer: 'Explore HIPAA, insurance, EHR systems, and medical terminology at your own pace. Understand what healthcare front office work looks like from the inside — without the cost or commitment of a formal program.',
              },
              {
                title: 'Flexible Learners',
                pain: '"I need learning that fits around my schedule — no rigid classrooms, no expensive commitments, no months-long programs."',
                answer: 'Learn at your own pace over a full year. Complete lessons whenever you have time. Pause and restart as needed. Learn on your terms.',
              },
              {
                title: 'Office Professionals Exploring Healthcare',
                pain: '"I have admin experience but I don\'t know HIPAA, insurance billing, or clinical workflows. I want to understand how healthcare offices work."',
                answer: 'Leverage your existing skills — organization, communication, multitasking — and add healthcare-specific knowledge. You already know how offices run. We teach you how healthcare offices are different.',
              },
              {
                title: 'Clinic Managers & Office Administrators',
                pain: '"Inconsistent knowledge across staff. No standardized learning content. New team members need a consistent foundation."',
                answer: 'Consistent learning content for your team. Volume pricing as low as $121/seat. Give staff a shared foundation in HIPAA, insurance, EHR systems, and patient communication.',
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
              Common Questions
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

      {/* ============ FINAL CTA ============ */}
      <section className="bg-gray-900 py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
          <h3 className="text-3xl md:text-4xl font-semibold tracking-tight text-white mb-4">
            Ready to Understand How Healthcare Front Office Work Really Works?
          </h3>
          <p className="text-lg font-light text-gray-400 mb-8 leading-relaxed max-w-2xl mx-auto">
            Explore HIPAA, insurance billing, medical terminology, EHR systems, scheduling, and patient communication —
            all at your own pace. Hands-on practice, AI coaching, and 80+ lessons across 9 topic areas.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => setAuthModal('signUp')}
              className="px-8 py-4 text-lg font-medium text-gray-900 bg-white rounded-2xl hover:bg-gray-100 transition-all duration-300 shadow-apple hover:shadow-apple-lg"
            >
              Get Started — $327
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-4">One-time payment · Full year of access · 3-day money-back guarantee</p>
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
                Healthcare front office learning platform
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
