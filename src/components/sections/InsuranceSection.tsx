import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronRight, ChevronDown, BookOpen, Play, FileText,
  CheckCircle, Clock, ClipboardCheck, Trophy, DollarSign, X,
  CreditCard, FileSearch, MousePointerClick
} from 'lucide-react';
import { useProgress } from '../../contexts/ProgressContext';
import { SEO, seoConfigs } from '../SEO';
import { InsuranceCardExplorer } from '../learning/InsuranceCardExplorer';
import { EligibilityReportExplorer } from '../learning/EligibilityReportExplorer';
import type { ContentType } from '../../types/course';

// Supabase Storage base URL for videos
const VIDEO_BASE_URL = 'https://vwieorhlcapeeamvltqa.supabase.co/storage/v1/object/public/videos';

// Insurance section combines: Insurance Overview + Insurance Operations
const insuranceModules = [
  {
    id: 'm3',
    slug: 'insurance-fundamentals',
    title: 'Insurance Basics',
    description: 'A high-level introduction to health insurance concepts, payer types, and essential terminology.',
    sort_order: 1,
    quiz: {
      id: 'q3',
      title: 'Insurance Basics Quiz',
      description: 'Test your understanding of basic health insurance concepts',
      passing_score: 80,
      max_attempts: 3,
    },
    lessons: [
      {
        id: 'l6',
        slug: 'why-insurance-exists',
        title: 'Why Insurance Exists',
        description: 'Understand the fundamental purpose of health insurance and how it protects patients and providers.',
        content_type: 'video' as ContentType,
        video_url: `${VIDEO_BASE_URL}/whyinsexists.mp4`,
        duration_minutes: 4,
      },
      {
        id: 'l7',
        slug: 'payer-types-plan-types',
        title: 'Types of Payers & Plan Types',
        description: 'Learn about different insurance payers (Medicare, Medicaid, commercial) and plan types (HMO, PPO, EPO).',
        content_type: 'video' as ContentType,
        video_url: `${VIDEO_BASE_URL}/payers_plans.mp4`,
        duration_minutes: 4,
      },
      {
        id: 'l8',
        slug: 'key-insurance-terms',
        title: 'Key Insurance Terms',
        description: 'Define essential insurance vocabulary: premium, deductible, copay, coinsurance, and out-of-pocket maximum.',
        content_type: 'video' as ContentType,
        video_url: `${VIDEO_BASE_URL}/ins_terms.mp4`,
        duration_minutes: 4,
      },
      {
        id: 'l9',
        slug: 'eligibility-and-payments',
        title: 'Eligibility & Payments Overview',
        description: 'An introduction to verifying eligibility and understanding patient payment responsibility.',
        content_type: 'video' as ContentType,
        video_url: `${VIDEO_BASE_URL}/elig-and-payments.mp4`,
        duration_minutes: 5,
      },
    ],
  },
  {
    id: 'm5',
    slug: 'insurance-operations',
    title: 'Front Desk Insurance Operations',
    description: 'Master the day-to-day insurance tasks: verifying eligibility, understanding benefits, and collecting patient responsibility.',
    sort_order: 2,
    quiz: {
      id: 'q5',
      title: 'Insurance Operations Quiz',
      description: 'Test your knowledge of day-to-day insurance verification and payment collection',
      passing_score: 80,
      max_attempts: 3,
    },
    lessons: [
      {
        id: 'l11',
        slug: 'reading-insurance-card',
        title: 'Reading an Insurance Card',
        description: 'Learn to identify key information on insurance cards: member ID, group number, plan type, and contact numbers.',
        content_type: 'video' as ContentType,
        video_url: `${VIDEO_BASE_URL}/Read_ins_card.mp4`,
        duration_minutes: 4,
      },
      {
        id: 'l12',
        slug: 'real-time-eligibility',
        title: 'Real-Time Eligibility Verification',
        description: 'Step-by-step process for verifying patient eligibility before appointments.',
        content_type: 'video' as ContentType,
        video_url: `${VIDEO_BASE_URL}/Realtime_eligibility.mp4`,
        duration_minutes: 5,
      },
      {
        id: 'l13',
        slug: 'understanding-copays',
        title: 'Understanding Copays',
        description: 'What copays are, how to identify them, when to collect, and how to handle discrepancies.',
        content_type: 'video' as ContentType,
        video_url: `${VIDEO_BASE_URL}/Understand_copay.mp4`,
        duration_minutes: 4,
      },
      {
        id: 'l14',
        slug: 'deductibles-oop-max',
        title: 'Deductibles & Out-of-Pocket Maximum',
        description: 'Understanding deductibles, tracking patient progress, and out-of-pocket maximums.',
        content_type: 'video' as ContentType,
        video_url: `${VIDEO_BASE_URL}/Deduct_OOPmax.mp4`,
        duration_minutes: 4,
      },
      {
        id: 'l15',
        slug: 'coinsurance-calculations',
        title: 'Coinsurance Calculations',
        description: 'How to calculate patient coinsurance responsibility and explain it to patients.',
        content_type: 'video' as ContentType,
        video_url: `${VIDEO_BASE_URL}/coinsurance_operations.mp4`,
        duration_minutes: 4,
      },
      {
        id: 'l16',
        slug: 'collecting-patient-payments',
        title: 'Collecting Patient Payments',
        description: 'Best practices for collecting copays, coinsurance, and outstanding balances.',
        content_type: 'video' as ContentType,
        video_url: `${VIDEO_BASE_URL}/Collect_copay.mp4`,
        duration_minutes: 4,
      },
    ],
  },
];

const contentTypeIcons: Record<ContentType, React.ElementType> = {
  video: Play,
  reading: FileText,
};

type ExplorerView = 'card' | 'eligibility';

export function InsuranceSection() {
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set(['m3', 'm5']));
  const [showSectionIntro, setShowSectionIntro] = useState(false);
  const [explorerView, setExplorerView] = useState<ExplorerView>('card');
  const progress = useProgress();

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) => {
      const next = new Set(prev);
      if (next.has(moduleId)) {
        next.delete(moduleId);
      } else {
        next.add(moduleId);
      }
      return next;
    });
  };

  const totalLessons = insuranceModules.reduce((sum, m) => sum + m.lessons.length, 0);
  const completedLessons = insuranceModules.reduce(
    (sum, m) => sum + m.lessons.filter((l) => progress.isLessonCompleted(l.slug)).length,
    0
  );

  const isModuleQuizPassed = (moduleSlug: string) => progress.hasPassedQuiz(moduleSlug);
  const getModuleBestScore = (moduleSlug: string) => progress.getBestQuizScore(moduleSlug);
  const isLessonDone = (lessonSlug: string) => progress.isLessonCompleted(lessonSlug);

  return (
    <>
      <SEO {...seoConfigs.insurance} />
      <article className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl">
            <DollarSign className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Insurance Training</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Master health insurance from basics to daily operations. Learn payer types, eligibility verification, copays, deductibles, and payment collection.
          </p>
        </header>

        {/* Section Introduction Video */}
        {showSectionIntro ? (
          <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between p-3 bg-gray-50 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-gray-900 text-sm">Section Overview</span>
              </div>
              <button
                onClick={() => setShowSectionIntro(false)}
                className="p-1 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            <div className="aspect-video bg-black">
              <video
                controls
                autoPlay
                className="w-full h-full"
                controlsList="nodownload"
              >
                <source src={`${VIDEO_BASE_URL}/insuranceintro.mp4`} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowSectionIntro(true)}
            className="w-full mb-6 p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all flex items-center gap-4 text-left"
          >
            <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Play className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">Section Overview</h3>
              <p className="text-sm text-gray-500">Watch a brief introduction to Insurance Training</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        )}

      {/* Progress Summary */}
      {completedLessons > 0 && (
        <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-600">Your Progress</span>
            <span className="font-medium text-blue-600">
              {completedLessons} of {totalLessons} lessons completed
            </span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all"
              style={{ width: `${(completedLessons / totalLessons) * 100}%` }}
            />
          </div>
        </div>
      )}

        {/* Modules */}
        <section className="space-y-4" aria-label="Insurance Training Modules">
          {insuranceModules.map((module, moduleIndex) => {
          const isExpanded = expandedModules.has(module.id);
          const quizPassed = isModuleQuizPassed(module.slug);
          const lessonsCompleted = module.lessons.filter((l) => isLessonDone(l.slug)).length;
          const allLessonsComplete = lessonsCompleted === module.lessons.length;
          const moduleComplete = allLessonsComplete && quizPassed;
          const ModuleIcon = moduleComplete ? CheckCircle : BookOpen;

          return (
            <div
              key={module.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
            >
              {/* Module Header */}
              <button
                onClick={() => toggleModule(module.id)}
                className="w-full p-5 flex items-center gap-4 text-left transition-colors hover:bg-gray-50"
              >
                <div
                  className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                    moduleComplete ? 'bg-green-100' : 'bg-blue-100'
                  }`}
                >
                  <ModuleIcon
                    className={`w-5 h-5 ${moduleComplete ? 'text-green-600' : 'text-blue-600'}`}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-500">Module {moduleIndex + 1}</span>
                    {moduleComplete && (
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                        Completed
                      </span>
                    )}
                    {quizPassed && !moduleComplete && (
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                        Quiz Passed ({getModuleBestScore(module.slug)}%)
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{module.title}</h3>
                  <p className="text-sm mt-1 text-gray-600">{module.description}</p>
                </div>

                <div className="flex-shrink-0 flex items-center gap-3">
                  <span className="text-sm text-gray-500">
                    {lessonsCompleted}/{module.lessons.length} lessons
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                  />
                </div>
              </button>

              {/* Lessons */}
              {isExpanded && (
                <div className="border-t border-gray-100 bg-gray-50">
                  {module.lessons.map((lesson) => {
                    const LessonIcon = contentTypeIcons[lesson.content_type];

                    return (
                      <Link
                        key={lesson.id}
                        to={`/insurance/${module.slug}/${lesson.slug}`}
                        className="flex items-center gap-4 p-4 pl-16 hover:bg-gray-100 transition-colors"
                      >
                        <div
                          className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                            isLessonDone(lesson.slug) ? 'bg-green-100' : 'bg-blue-600'
                          }`}
                        >
                          {isLessonDone(lesson.slug) ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <LessonIcon className="w-4 h-4 text-white" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900">{lesson.title}</h4>
                          <p className="text-sm text-gray-500 line-clamp-1">{lesson.description}</p>
                        </div>
                        <div className="flex-shrink-0 flex items-center gap-3 text-sm text-gray-500">
                          <span className="capitalize">{lesson.content_type}</span>
                          <span>{lesson.duration_minutes} min</span>
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </Link>
                    );
                  })}

                  {/* Quiz */}
                  {module.quiz && (
                    <div className="border-t border-gray-200">
                      <Link
                        to={`/insurance/${module.slug}/quiz`}
                        className="flex items-center gap-4 p-4 pl-16 hover:bg-gray-100 transition-colors"
                      >
                        <div
                          className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                            quizPassed ? 'bg-green-100' : 'bg-blue-600'
                          }`}
                        >
                          {quizPassed ? (
                            <Trophy className="w-4 h-4 text-green-600" />
                          ) : (
                            <ClipboardCheck className="w-4 h-4 text-white" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900">{module.quiz.title}</h4>
                          <p className="text-sm text-gray-500">
                            {quizPassed
                              ? `Passed with ${getModuleBestScore(module.slug)}%`
                              : `Pass with ${module.quiz.passing_score}% to complete module`}
                          </p>
                        </div>
                        <div className="flex-shrink-0 flex items-center gap-2">
                          {quizPassed ? (
                            <span className="text-sm text-green-600 font-medium">Completed</span>
                          ) : (
                            <span className="text-sm text-gray-500">{module.quiz.max_attempts} attempts</span>
                          )}
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        </div>
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
        </section>

        {/* Interactive Practice: Visual Explorers */}
        <section className="mt-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
              <MousePointerClick className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Interactive Practice</h2>
              <p className="text-sm text-gray-600">Click on different areas to learn what each field means</p>
            </div>
          </div>

          {/* Explorer Toggle */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setExplorerView('card')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                explorerView === 'card'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              Insurance Card
            </button>
            <button
              onClick={() => setExplorerView('eligibility')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                explorerView === 'eligibility'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <FileSearch className="w-4 h-4" />
              Eligibility Report
            </button>
          </div>

          {/* Explorer Component */}
          {explorerView === 'card' ? (
            <InsuranceCardExplorer />
          ) : (
            <EligibilityReportExplorer />
          )}
        </section>

        {/* Interactive Exercise Link */}
        <aside className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
              <ClipboardCheck className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 mb-1">Practice: Insurance Term Matching</h3>
              <p className="text-sm text-gray-600 mb-3">
                Test your knowledge by matching insurance terms to their definitions in this interactive exercise.
              </p>
              <Link
                to="/exercises/insurance-matching"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Start Exercise
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </aside>
      </article>
    </>
  );
}
