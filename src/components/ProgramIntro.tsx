import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Play, FileText, Sparkles, MessageCircle, ChevronRight,
  Heart, Scale, DollarSign, ClipboardList, BookA, Monitor, Briefcase,
  ArrowRight, X, Bot, Stethoscope, ClipboardCheck, Users
} from 'lucide-react';
import { useAgentOrchestrator } from '../contexts/AgentOrchestratorContext';
import SuggestedActionCard from './ai-tutor/SuggestedActionCard';

const VIDEO_BASE_URL = 'https://vwieorhlcapeeamvltqa.supabase.co/storage/v1/object/public/videos';

const learningModes = [
  {
    icon: Play,
    title: 'Video Lessons',
    description: 'Watch expert-led video lessons that walk you through real-world workflows and concepts at your own pace.',
  },
  {
    icon: FileText,
    title: 'Reading & SOPs',
    description: 'Detailed written guides and 24 step-by-step standard operating procedures you can reference on the job.',
  },
  {
    icon: Monitor,
    title: 'EHR Simulation',
    description: 'Practice scheduling, registration, check-in, and chart navigation in a simulated practice management system.',
  },
  {
    icon: Sparkles,
    title: 'Interactive Exercises',
    description: 'Flashcards, term matching, phone simulations, mock interviews, and hands-on practice scenarios.',
  },
];

const programSections = [
  {
    icon: Heart,
    title: 'Foundations of Healthcare',
    description: 'Understand acute vs. ambulatory care and your essential role in healthcare delivery.',
    path: '/foundations',
  },
  {
    icon: Scale,
    title: 'Medical Law & Compliance',
    description: 'HIPAA essentials, PHI, patient rights, consent, EMTALA, fraud prevention, workplace safety, infection control, and administrative procedures.',
    path: '/medical-law-ethics',
  },
  {
    icon: DollarSign,
    title: 'Insurance & Billing',
    description: 'Payer types, eligibility, insurance cards, copays, payment collection, ICD-10/CPT coding, referrals, and prior authorization.',
    path: '/insurance',
  },
  {
    icon: ClipboardList,
    title: 'Front Office Workflows',
    description: 'Registration, scheduling, check-in, check-out, administrative skills, cash handling, supply management, and 24 SOP guides.',
    path: '/workflows',
  },
  {
    icon: MessageCircle,
    title: 'Patient Communication',
    description: 'Communication styles, active listening, de-escalation, cultural competence, phone etiquette, and team communication.',
    path: '/communication',
  },
  {
    icon: Monitor,
    title: 'EHR & Practice Management',
    description: 'PM vs EHR systems, encounter types, scheduling, phone encounters, duplicate prevention, telehealth, and patient portals.',
    path: '/ehr-fundamentals',
  },
  {
    icon: BookA,
    title: 'Medical Terminology',
    description: 'Prefixes, roots, suffixes, abbreviations, and interactive flashcards for practice.',
    path: '/terminology',
  },
  {
    icon: Monitor,
    title: 'EHR Practice Lab',
    description: 'Hands-on simulation — schedule appointments, register patients, and manage a clinic day.',
    path: '/ehr-lab',
  },
  {
    icon: Briefcase,
    title: 'Job Readiness',
    description: 'Phone simulations, mock interviews, resume building, and readiness assessments.',
    path: '/practice',
  },
];

export function ProgramIntro() {
  const [showIntroVideo, setShowIntroVideo] = useState(false);
  const navigate = useNavigate();
  const { suggestedNextAction, setActiveAgent } = useAgentOrchestrator();

  const handleSuggestedAction = () => {
    if (suggestedNextAction) {
      if (suggestedNextAction.agentMode) {
        setActiveAgent(suggestedNextAction.agentMode);
      }
      if (suggestedNextAction.route) {
        navigate(suggestedNextAction.route);
      }
    }
  };

  return (
    <article className="max-w-3xl mx-auto">
      {/* Welcome Header */}
      <header className="text-center mb-8">
        <img
          src="/vp-long-logo.png"
          alt="VytalPath Academy"
          className="h-14 md:h-16 w-auto mx-auto mb-6"
        />
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-gray-900 mb-4">
          Welcome to VytalPath Academy
        </h1>
        <p className="text-xl font-light text-gray-500 leading-relaxed max-w-2xl mx-auto">
          A comprehensive training program designed to prepare you for success in healthcare front office administration.
        </p>
      </header>

      {/* Welcome Video */}
      {showIntroVideo ? (
        <div className="mb-12 bg-white rounded-2xl shadow-apple border-gray-200/50 overflow-hidden">
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-gray-900">Welcome to VytalPath Academy</span>
            </div>
            <button
              onClick={() => setShowIntroVideo(false)}
              className="p-1 hover:bg-blue-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          <div className="aspect-video bg-black">
            <video
              controls
              autoPlay
              className="w-full h-full"
              controlsList="nodownload"
            >
              <source src={`${VIDEO_BASE_URL}/myintro.mp4`} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      ) : (
        <div className="mb-12 bg-blue-50/50 rounded-2xl border border-blue-100 overflow-hidden">
          <div className="p-6 flex items-center gap-6">
            <button
              onClick={() => setShowIntroVideo(true)}
              className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105 transition-all cursor-pointer"
            >
              <Play className="w-8 h-8 text-white ml-1" />
            </button>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-600">Start Here</span>
              </div>
              <h2 className="text-lg font-bold text-gray-900 mb-1">Meet Your Instructor</h2>
              <p className="text-gray-600 text-sm">
                A quick introduction to the program and how it will prepare you for success.
              </p>
            </div>
            <button
              onClick={() => setShowIntroVideo(true)}
              className="flex-shrink-0 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-2xl shadow-apple-sm transition-colors flex items-center gap-2"
            >
              <Play className="w-4 h-4" />
              Watch Intro
            </button>
          </div>
        </div>
      )}

      {/* How You'll Learn */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold tracking-tight text-gray-900 mb-2 text-center">
          How You'll Learn
        </h2>
        <p className="text-gray-500 text-center mb-8 max-w-xl mx-auto">
          Every topic combines multiple learning formats to help you understand, practice, and retain.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {learningModes.map((mode) => (
            <div
              key={mode.title}
              className="bg-white rounded-2xl shadow-apple border border-gray-200/50 p-6 hover-lift transition-all duration-300"
            >
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-4">
                <mode.icon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-medium text-gray-900 mb-1">{mode.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{mode.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Program Structure */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold tracking-tight text-gray-900 mb-2 text-center">
          Your Learning Path
        </h2>
        <p className="text-gray-500 text-center mb-8 max-w-xl mx-auto">
          Nine sections covering everything from HIPAA to hands-on EHR practice. Work through them in order or jump to what you need most.
        </p>

        <div className="space-y-3">
          {programSections.map((section, index) => (
            <Link
              key={section.path}
              to={section.path}
              className="flex items-center gap-4 bg-white rounded-2xl shadow-apple-sm border border-gray-200/50 p-5 hover-lift transition-all duration-300 group"
            >
              <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-sm font-medium text-gray-400">
                {String(index + 1).padStart(2, '0')}
              </div>
              <div className="flex-shrink-0 w-11 h-11 bg-blue-50 rounded-2xl flex items-center justify-center">
                <section.icon className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900">{section.title}</h3>
                <p className="text-sm text-gray-500">{section.description}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-blue-600 transition-colors duration-300" />
            </Link>
          ))}
        </div>
      </section>

      {/* AI-Enhanced Learning */}
      <section className="mb-16">
        <div className="bg-gradient-to-br from-slate-50 to-blue-50/50 rounded-2xl border border-slate-200/60 p-8">
          <div className="text-center mb-6">
            <div className="w-14 h-14 bg-slate-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Bot className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">AI That Adapts to Your Learning</h3>
            <p className="text-gray-500 max-w-lg mx-auto leading-relaxed">
              Your AI study assistant follows your progress and meets you where you are — explaining concepts when you're studying,
              coaching you through the EHR Lab, generating practice questions on your weak areas, and simulating real patient
              interactions so you're prepared before day one.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
            {[
              { icon: MessageCircle, label: 'Explains concepts', color: 'text-blue-600', bg: 'bg-blue-50' },
              { icon: Stethoscope, label: 'Coaches EHR workflows', color: 'text-teal-600', bg: 'bg-teal-50' },
              { icon: ClipboardCheck, label: 'Targets weak areas', color: 'text-green-600', bg: 'bg-green-50' },
              { icon: Users, label: 'Simulates patients', color: 'text-purple-600', bg: 'bg-purple-50' },
            ].map((item) => (
              <div key={item.label} className="flex flex-col items-center text-center gap-2 p-3">
                <div className={`w-9 h-9 ${item.bg} rounded-xl flex items-center justify-center`}>
                  <item.icon className={`w-4.5 h-4.5 ${item.color}`} />
                </div>
                <span className="text-xs font-medium text-gray-600">{item.label}</span>
              </div>
            ))}
          </div>

          <p className="text-center text-sm text-gray-400">
            Look for the chat icon in the bottom corner — it's available on every page.
          </p>
        </div>
      </section>

      {/* Suggested Next Step */}
      {suggestedNextAction && (
        <section className="mb-16">
          <div className="max-w-md mx-auto">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider text-center mb-3">Recommended for you</p>
            <SuggestedActionCard action={suggestedNextAction} onAction={handleSuggestedAction} />
          </div>
        </section>
      )}

      {/* Get Started CTA */}
      <div className="text-center pb-8">
        <Link
          to="/foundations"
          className="inline-flex items-center gap-3 px-8 py-4 bg-blue-600 text-white font-medium text-lg rounded-2xl hover:bg-blue-700 shadow-apple hover:shadow-apple-lg transition-all duration-300"
        >
          Begin Your Training
          <ArrowRight className="w-5 h-5" />
        </Link>
        <p className="text-sm text-gray-400 mt-3">Start with Foundations of Healthcare</p>
      </div>
    </article>
  );
}
