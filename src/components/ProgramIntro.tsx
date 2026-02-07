import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Play, FileText, Sparkles, MessageCircle, ChevronRight,
  Heart, Scale, DollarSign, ClipboardList, BookA,
  ArrowRight, X
} from 'lucide-react';

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
    description: 'Detailed written guides and step-by-step standard operating procedures you can reference on the job.',
  },
  {
    icon: Sparkles,
    title: 'Interactive Practice',
    description: 'Flashcards, term matching, and hands-on exercises that reinforce what you learn.',
  },
  {
    icon: MessageCircle,
    title: 'AI Study Assistant',
    description: 'Ask questions anytime. Your AI tutor explains concepts, quizzes you, and walks you through scenarios.',
  },
];

const programSections = [
  {
    icon: Heart,
    title: 'Foundations of Healthcare',
    description: 'Understand the healthcare system and your essential role within it.',
    path: '/foundations',
  },
  {
    icon: Scale,
    title: 'Medical Law & Compliance',
    description: 'HIPAA, patient rights, and the regulations that protect everyone.',
    path: '/medical-law-ethics',
  },
  {
    icon: DollarSign,
    title: 'Insurance & Billing',
    description: 'Payer types, eligibility, copays, deductibles, and payment collection.',
    path: '/insurance',
  },
  {
    icon: ClipboardList,
    title: 'Front Office Workflows',
    description: 'From opening to closing — registration, check-in, scheduling, and daily operations.',
    path: '/workflows',
  },
  {
    icon: BookA,
    title: 'Medical Terminology',
    description: 'Prefixes, roots, suffixes, abbreviations, and interactive flashcards.',
    path: '/terminology',
  },
];

export function ProgramIntro() {
  const [showIntroVideo, setShowIntroVideo] = useState(false);

  return (
    <article className="max-w-3xl mx-auto">
      {/* Welcome Header */}
      <header className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 mb-6 bg-blue-100 rounded-3xl shadow-apple-sm">
          <img
            src="/vp-checkmark.png"
            alt="VytalPath Academy"
            className="h-12 w-auto"
          />
        </div>
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
          Five sections, each building on the last. Work through them in order or jump to what you need most.
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

      {/* AI Enhancement Note */}
      <section className="mb-16">
        <div className="bg-blue-50/50 rounded-2xl border border-blue-100 p-8 text-center">
          <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="w-7 h-7 text-white" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">AI-Enhanced Learning</h3>
          <p className="text-gray-500 max-w-lg mx-auto mb-1 leading-relaxed">
            Your AI study assistant is available on every page. Ask it to explain concepts,
            walk you through scenarios, quiz you on what you've learned, or clarify anything
            from the curriculum.
          </p>
          <p className="text-sm text-gray-400">
            Look for the chat icon in the bottom corner.
          </p>
        </div>
      </section>

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
