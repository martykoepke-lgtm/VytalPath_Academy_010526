import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowRight, CheckCircle, Clock, Shield,
  Play, FileText, Sparkles, MessageCircle, Award, Brain,
  ChevronLeft, ChevronRight, ChevronDown, Monitor, GraduationCap, Users,
  Minus, Stethoscope, ClipboardList, DollarSign, BookA, Briefcase
} from 'lucide-react';
import { SignIn } from './SignIn';
import { SignUp } from './SignUp';
import { ForgotPassword } from './ForgotPassword';
import { CurriculumModal } from './CurriculumModal';
import { SubscriptionModal } from './SubscriptionModal';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription } from '../contexts/SubscriptionContext';

const VIDEO_BASE_URL = 'https://vwieorhlcapeeamvltqa.supabase.co/storage/v1/object/public/videos';

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
    question: 'How long does it take to complete?',
    answer: "VytalPath Academy includes 10+ hours of content across 80+ lessons. Most learners finish in 4–8 weeks, but you have a full year of access — learn at your own pace.",
  },
  {
    question: 'Do I need any prerequisites or experience?',
    answer: "No. VytalPath Academy is designed for beginners with no healthcare experience. We start with the fundamentals and build from there.",
  },
  {
    question: 'Will I be certified?',
    answer: "You'll earn a Certificate of Completion covering 101 knowledge areas across 9 essential sections. This demonstrates comprehensive training to employers. VytalPath is competency-based — we teach practical skills hiring managers look for.",
  },
  {
    question: "What if I can't afford $327 right now?",
    answer: "We understand. Consider this: traditional programs cost $1,000–$5,000. VytalPath gives you comprehensive training, hands-on practice, and job readiness tools for $327 — and you have 3 days to request a full refund if it's not right for you. The bigger cost is staying stuck in unstable work for months longer.",
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
    question: 'Will employers actually hire me with this?',
    answer: "Employers need people who understand HIPAA, insurance billing, medical terminology, EHR systems, scheduling, and patient communication. VytalPath teaches all of that — and you get hands-on practice so you can confidently say \"Yes, I know how to do this\" in interviews. Our job readiness tools (resume builder, mock interviews) help you demonstrate competency to hiring managers.",
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
  const [activeScreenshot, setActiveScreenshot] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [subscriptionModalDismissed, setSubscriptionModalDismissed] = useState(() => {
    return localStorage.getItem('vytalpath_subscription_modal_dismissed') === 'true';
  });

  const location = useLocation();
  const navigate = useNavigate();
  const { user, session } = useAuth();
  const { hasAccess, loading: subscriptionLoading } = useSubscription();
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

  // Clear dismissal flag if user gains access (subscribed)
  useEffect(() => {
    if (session && !subscriptionLoading && hasAccess && subscriptionModalDismissed) {
      localStorage.removeItem('vytalpath_subscription_modal_dismissed');
      setSubscriptionModalDismissed(false);
    }
  }, [session, subscriptionLoading, hasAccess, subscriptionModalDismissed]);

  // Show subscription modal for logged-in users without access
  const showSubscriptionModal = session && !subscriptionLoading && !hasAccess && !subscriptionModalDismissed;

  const handleDismissSubscriptionModal = () => {
    localStorage.setItem('vytalpath_subscription_modal_dismissed', 'true');
    setSubscriptionModalDismissed(true);
  };

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
              Get Hired in Healthcare{' '}
              <span className="text-blue-600">Without Going Back to School</span>
            </h1>

            <p className="text-lg md:text-xl font-light text-gray-500 max-w-2xl mx-auto mb-6 leading-relaxed">
              Master HIPAA, insurance billing, EHR systems, and medical office workflows with hands-on training — then land your first healthcare front office job with confidence.
            </p>

            {/* Proof stats as bullets */}
            <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-gray-500 mb-8">
              {[
                '80+ lessons covering everything employers need',
                'Built-in EHR Practice Lab — actually practice real workflows',
                '$327 for comprehensive training (competitors charge $1,000+)',
                'Complete at your own pace — full year of access',
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-4">
              <button
                onClick={() => setAuthModal('signUp')}
                className="group px-8 py-3.5 text-lg font-medium text-white bg-gray-900 rounded-2xl hover:bg-gray-800 transition-all duration-300 shadow-apple hover:shadow-apple-lg flex items-center gap-2"
              >
                Enroll for $327 — 3-Day Money-Back Guarantee
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
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
                <Award className="w-3.5 h-3.5" /> Certificate of Completion Included
              </span>
              <span className="flex items-center gap-1.5 text-xs text-gray-400">
                <Briefcase className="w-3.5 h-3.5" /> Resume Builder & Mock Interviews
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
                <source src={`${VIDEO_BASE_URL}/welcome_landing2.mp4`} type="video/mp4" />
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
            You Want a Stable Healthcare Career, But the System Keeps You Locked Out
          </h2>
          <div className="space-y-5 text-gray-500 leading-relaxed text-lg">
            <p>
              You're applying to medical office jobs, but every posting says "experience required." You can't get experience
              because no one will hire you without training. You can't afford training because programs cost $1,000 to $5,000.
              And even if you could afford it, you can't commit to rigid classroom schedules.
            </p>
            <p>
              Every rejection email makes you feel more frustrated. You know you'd be great at this work — you're organized,
              you care about helping people, you learn fast — but employers never give you a chance to prove it.
            </p>
            <p>
              Meanwhile, you're working unstable jobs that don't pay enough and don't lead anywhere. You watch people with
              healthcare careers build steady income, job security, and meaningful work while you stay locked out.
            </p>
            <p className="font-medium text-gray-900">
              It feels like healthcare careers are only for people who can afford expensive programs or already have connections.
              That's not fair — and it's not true.
            </p>
          </div>
        </div>
      </section>

      {/* ============ THE GUIDE ============ */}
      <section className="bg-gray-900 text-white py-16 md:py-20">
        <div className="max-w-3xl mx-auto px-6 sm:px-8 lg:px-12">
          {/* Visual pullquote */}
          <blockquote className="text-2xl md:text-3xl font-semibold leading-snug mb-10 pl-6 border-l-2 border-blue-400">
            "I couldn't get hired in healthcare even with a bachelor's degree — until I learned the foundational knowledge employers actually need."
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
              When my wife Lori — a clinic manager constantly struggling to find qualified front office candidates — asked me
              to build a training program, I said yes. But I refused to build another course full of boring videos and PDFs
              that don't actually help people get hired.
            </p>
            <p>
              Real learning requires hands-on practice and coaching. So I spent months building AI agents that coach learners
              through the material, answer questions in real time, and provide the interactive experience people actually need
              to master this work.
            </p>
            <p>
              I built VytalPath Academy because I know what that foundation did for me, and I want to give more people the same
              chance. <span className="text-white font-medium">You don't need years of experience to get started — you need the
              right knowledge.</span> Once you have that foundation, doors start opening.
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
              Everything You Need to Get Hired — In One Program
            </h2>
            <p className="text-xl font-light text-gray-500 max-w-2xl mx-auto">
              Nine training areas covering the exact skills clinics are hiring for
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Shield,
                title: 'HIPAA & Compliance Mastery',
                outcome: "Stop worrying about \"Do I know enough?\" Master patient privacy laws, confidentiality standards, and compliance requirements — the foundation of every healthcare job.",
              },
              {
                icon: DollarSign,
                title: 'Insurance Billing & Verification',
                outcome: 'Speak the language employers need to hear. Understand insurance types, authorization processes, claims, and billing workflows — skills that make you immediately valuable.',
              },
              {
                icon: BookA,
                title: 'Medical Terminology',
                outcome: 'Stop feeling lost in healthcare conversations. Learn body systems, common diagnoses, procedures, and abbreviations so you can communicate confidently with clinical staff and patients.',
              },
              {
                icon: Monitor,
                title: 'EHR Systems & Documentation',
                outcome: "Know how the systems actually work. Navigate electronic health records, understand clinical workflows, and document patient interactions the way real offices do.",
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
                title: 'Resume Builder & Mock Interviews',
                outcome: 'Show up prepared and confident. Use our job readiness tools to build a healthcare-focused resume and practice interview questions with AI feedback.',
              },
              {
                icon: Award,
                title: 'Certificate of Completion',
                outcome: "Prove you've done the work. Show employers you've completed comprehensive training covering 101 knowledge areas across 9 essential sections.",
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

      {/* ============ KEY DIFFERENTIATOR ============ */}
      <section className="bg-white py-16 md:py-20">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-gray-900 mb-3">
              The Only Program Where You Actually Practice Healthcare Workflows
            </h2>
            <p className="text-lg font-light text-gray-500 max-w-2xl mx-auto">
              Watching videos doesn't prepare you for the job. Hands-on practice does.
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
                  'Walk into interviews knowing you\'ve actually done the work',
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

      {/* ============ PATTERN INTERRUPT ============ */}
      <section className="bg-gray-900 py-14 md:py-16">
        <div className="max-w-3xl mx-auto px-6 sm:px-8 lg:px-12">
          <h3 className="text-2xl md:text-3xl font-semibold text-white mb-4 text-center">
            "But Is It Accredited? Will Employers Actually Hire Me With This?"
          </h3>
          <div className="space-y-4 text-gray-300 leading-relaxed text-center">
            <p>
              VytalPath Academy is competency-based training — we teach you the 101 knowledge areas employers need
              across HIPAA, insurance billing, medical terminology, EHR systems, scheduling, and patient communication.
            </p>
            <p>
              Our certificate demonstrates you've completed comprehensive training covering everything a healthcare
              front office professional needs to know.
            </p>
            <p>
              Here's what matters to employers: Can you navigate an EHR? Do you understand HIPAA? Can you verify insurance?
              Do you know medical terminology? Can you handle scheduling conflicts?
            </p>
            <p className="text-white font-medium">
              The answer is yes — and you can prove it.
            </p>
            <p>
              Many employers value practical competency alongside (or instead of) formal certification. We include job readiness
              tools — resume builder, mock interviews, procedure guides — so you can walk into applications and interviews
              with verified skills and confidence.
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
            <div className="bg-white rounded-2xl shadow-apple border border-gray-200/50 overflow-x-auto">
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
                  { feature: 'Phone & Interview Simulations', traditional: false, vytalpath: true, free: false },
                  { feature: 'Healthcare Resume Builder', traditional: false, vytalpath: true, free: false },
                  { feature: 'Competency Tracking (101 topics)', traditional: 'Varies', vytalpath: true, free: false },
                  { feature: 'Certificate of Completion', traditional: true, vytalpath: true, free: false },
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
            <button
              onClick={() => setAuthModal('signUp')}
              className="px-8 py-3.5 text-lg font-medium text-white bg-gray-900 rounded-2xl hover:bg-gray-800 transition-all duration-300 shadow-apple hover:shadow-apple-lg"
            >
              Enroll for $327 — Risk-Free
            </button>
            <p className="text-sm text-gray-500 mt-2">
              Or 3 monthly payments of $109
            </p>
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
                  Volume pricing available for teams — as low as $121/seat. Train your entire front office staff with
                  standardized, comprehensive content that reduces turnover and improves onboarding.{' '}
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
                title: 'Career Changers & Job Seekers',
                pain: '"I want stable healthcare work but I don\'t know where to start, can\'t afford expensive programs, and keep getting rejected for lack of experience."',
                answer: 'Get the foundational knowledge employers need — HIPAA, insurance, EHR systems, medical terminology — at a fraction of the cost. Practice real workflows. Walk into applications with verified competency and confidence.',
              },
              {
                title: 'Moms & Career Restarters',
                pain: '"I need flexible learning that fits around my schedule — no rigid classrooms, no expensive childcare, no months of commitment."',
                answer: 'Learn at your own pace over a full year. Complete lessons whenever you have time. Pause and restart as needed. Build a career with stability, growth, and meaning on your terms.',
              },
              {
                title: 'Office Professionals Transitioning to Healthcare',
                pain: '"I have admin experience but lack healthcare-specific knowledge. Employers won\'t hire me because I don\'t know HIPAA, insurance billing, or clinical workflows."',
                answer: 'Leverage your existing skills — organization, communication, multitasking — and add the healthcare foundation employers need. You already know how to do the work. We teach you how to do it in healthcare.',
              },
              {
                title: 'Clinic Managers & Hiring Teams',
                pain: '"High front office turnover. Unqualified applicants. Strong candidates we can\'t hire because they lack foundational knowledge. Inconsistent training across staff."',
                answer: 'Standardized training for new hires and existing staff. Volume pricing as low as $121/seat. Reduce onboarding time, improve retention, and ensure everyone has the same foundational competency.',
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
            You're One Foundation Away From a Stable Healthcare Career
          </h3>
          <p className="text-lg font-light text-gray-400 mb-8 leading-relaxed max-w-2xl mx-auto">
            You don't need years of experience or thousands of dollars. You need the right knowledge — HIPAA, insurance billing,
            medical terminology, EHR systems, scheduling, and patient communication. You need hands-on practice so you can walk
            into interviews with confidence. And you need a credential that shows employers you've done the work.
          </p>
          <p className="text-lg text-gray-300 mb-8">
            That's exactly what VytalPath Academy gives you.
          </p>
          <button
            onClick={() => setAuthModal('signUp')}
            className="px-8 py-4 text-lg font-medium text-gray-900 bg-white rounded-2xl hover:bg-gray-100 transition-all duration-300 shadow-apple hover:shadow-apple-lg"
          >
            Enroll Now for $327 — 3-Day Money-Back Guarantee
          </button>
          <p className="text-sm text-gray-500 mt-4">Or 3 payments of $109 · Full year of access · Certificate of Completion</p>
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

      {/* Subscription Modal - for logged-in users without subscription */}
      {showSubscriptionModal && (
        <SubscriptionModal
          onClose={handleDismissSubscriptionModal}
          dismissible={true}
        />
      )}
    </div>
  );
}
