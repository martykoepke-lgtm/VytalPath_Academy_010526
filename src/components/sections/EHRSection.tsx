import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronRight, ChevronDown, BookOpen, FileText, Play,
  CheckCircle, ClipboardCheck, Trophy, Monitor, X
} from 'lucide-react';
import { useProgress } from '../../contexts/ProgressContext';
import { SEO, seoConfigs } from '../SEO';
import type { ContentType } from '../../types/course';

const VIDEO_BASE_URL = 'https://vwieorhlcapeeamvltqa.supabase.co/storage/v1/object/public/videos';

const ehrModules = [
  {
    id: 'ehr-m1',
    slug: 'ehr-basics',
    title: 'Understanding Your Systems',
    description: 'Learn what Practice Management and EHR systems do, how they connect, and the role of encounters and patient identifiers.',
    sort_order: 1,
    quiz: {
      id: 'ehr-q1',
      title: 'EHR Basics Quiz',
      description: 'Test your knowledge of PM systems, EHR components, and patient identifiers',
      passing_score: 80,
      max_attempts: 3,
    },
    lessons: [
      { id: 'ehr-l1', slug: 'encounters-and-identifiers', title: 'Encounter Types & Patient Identifiers', description: 'Learn the different encounter types in an EHR and the critical difference between MRN and FIN.', content_type: 'reading' as ContentType, duration_minutes: 8 },
      { id: 'ehr-l2', slug: 'pm-vs-ehr', title: 'The Two Systems in Every Clinic', description: 'Understand what PM and EHR systems do, which screens you work in, and how they connect.', content_type: 'video' as ContentType, video_url: `${VIDEO_BASE_URL}/The%20Two%20Systems%20in%20Every%20Clinic_1080p_caption.mp4`, duration_minutes: 6 },
      { id: 'ehr-l3', slug: 'ehr-navigation', title: 'Inside the Chart — Your EHR Orientation', description: 'Tour the key EHR sections: patient banner, demographics, encounters, orders, results, and security.', content_type: 'reading' as ContentType, duration_minutes: 8 },
    ],
  },
  {
    id: 'ehr-m2',
    slug: 'clinic-encounters',
    title: 'Clinic Encounters',
    description: 'Master the different clinic encounter types, the full encounter lifecycle, and scheduling methods used in ambulatory care.',
    sort_order: 2,
    quiz: {
      id: 'ehr-q2',
      title: 'Clinic Encounters Quiz',
      description: 'Test your knowledge of encounter types, lifecycle stages, and scheduling methods',
      passing_score: 80,
      max_attempts: 3,
    },
    lessons: [
      { id: 'ehr-l4', slug: 'clinic-encounter-types', title: 'Encounters & Encounter Selection', description: 'Understand encounters, MRN vs FIN, clinic encounter types (NP, EST, AWV, TCM), and why appointment type selection matters.', content_type: 'video' as ContentType, video_url: `${VIDEO_BASE_URL}/Encounters%20%26%20Encounter%20Selection%20-%20VytalPath%20Academy_1080p_caption.mp4`, duration_minutes: 5 },
      { id: 'ehr-l5', slug: 'encounter-lifecycle', title: 'The Encounter Lifecycle', description: 'Follow an encounter from scheduling through check-in, clinical workflow, charge capture, and billing.', content_type: 'reading' as ContentType, duration_minutes: 8 },
      { id: 'ehr-l6', slug: 'scheduling-types-templates', title: 'Scheduling Types & Templates', description: 'Learn time-specified, wave, modified wave, block, and open scheduling methods.', content_type: 'reading' as ContentType, duration_minutes: 7 },
    ],
  },
  {
    id: 'ehr-m3',
    slug: 'non-clinic-encounters',
    title: 'Non-Clinic Encounters',
    description: 'Understand phone encounters, non-visit encounter types, and how to prevent and handle duplicate patient records.',
    sort_order: 3,
    quiz: {
      id: 'ehr-q3',
      title: 'Non-Clinic Encounters Quiz',
      description: 'Test your knowledge of phone encounters, non-visit types, and duplicate prevention',
      passing_score: 80,
      max_attempts: 3,
    },
    lessons: [
      { id: 'ehr-l7', slug: 'phone-encounters', title: 'Phone Encounters', description: 'When and why phone encounters are created, documentation standards, and message routing.', content_type: 'reading' as ContentType, duration_minutes: 6 },
      { id: 'ehr-l8', slug: 'non-visit-encounters', title: 'Non-Visit Encounters', description: 'eRx, lab-only orders, imaging orders, prior auth encounters, and letter encounters.', content_type: 'reading' as ContentType, duration_minutes: 6 },
      { id: 'ehr-l9', slug: 'duplicate-records', title: 'Duplicate Records: Prevention & Resolution', description: 'How duplicates happen, the two-identifier rule, MPI, and what to do when you find one.', content_type: 'reading' as ContentType, duration_minutes: 6 },
    ],
  },
  {
    id: 'ehr-m4',
    slug: 'telehealth-portals',
    title: 'Telehealth & Patient Portals',
    description: 'Understand telehealth visit types, technology platforms, patient portal features, and front office support for virtual care.',
    sort_order: 4,
    quiz: {
      id: 'ehr-q4',
      title: 'Telehealth & Portals Quiz',
      description: 'Test your knowledge of telehealth workflows, platforms, and patient portal management',
      passing_score: 80,
      max_attempts: 3,
    },
    lessons: [
      { id: 'ehr-l10', slug: 'telehealth-appointment-types', title: 'Telehealth Appointment Types', description: 'Which visits work for telehealth, scheduling considerations, and common encounter types for virtual care.', content_type: 'reading' as ContentType, duration_minutes: 7 },
      { id: 'ehr-l11', slug: 'telehealth-platforms-technology', title: 'Telehealth Platforms & Technology', description: 'Major telehealth platforms, hardware/software requirements, HIPAA-compliant video tools, and integration with PM/EHR.', content_type: 'reading' as ContentType, duration_minutes: 7 },
      { id: 'ehr-l12', slug: 'patient-portals', title: 'Patient Portals', description: 'Portal features, self-scheduling, messaging, notifications, and front desk support for portal issues.', content_type: 'reading' as ContentType, duration_minutes: 7 },
      { id: 'ehr-l13', slug: 'telehealth-procedures-troubleshooting', title: 'Telehealth Procedures & Troubleshooting', description: 'Pre-visit preparation, day-of workflows, common technical issues, and front office troubleshooting scripts.', content_type: 'reading' as ContentType, duration_minutes: 8 },
    ],
  },
];

export function EHRSection() {
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
  const [showSectionIntro, setShowSectionIntro] = useState(false);
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

  const totalLessons = ehrModules.reduce((sum, m) => sum + m.lessons.length, 0);
  const completedLessons = ehrModules.reduce(
    (sum, m) => sum + m.lessons.filter((l) => progress.isLessonCompleted(l.slug)).length,
    0
  );

  const isModuleQuizPassed = (moduleSlug: string) => progress.hasPassedQuiz(moduleSlug);
  const getModuleBestScore = (moduleSlug: string) => progress.getBestQuizScore(moduleSlug);
  const isLessonDone = (lessonSlug: string) => progress.isLessonCompleted(lessonSlug);

  return (
    <>
      <SEO {...seoConfigs.ehrFundamentals} />
      <article className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 mb-4 bg-cyan-100 rounded-3xl shadow-apple-sm">
            <Monitor className="w-10 h-10 text-cyan-600" />
          </div>
          <h1 className="text-4xl font-semibold tracking-tight text-gray-900 mb-3">EHR & Practice Management</h1>
          <p className="text-xl font-light text-gray-500 leading-relaxed max-w-2xl mx-auto">
            Master the systems you'll work in every day. Learn how Practice Management and EHR systems work together, and how to create and manage different encounter types.
          </p>
        </header>

        {/* Section Introduction Video */}
        {showSectionIntro ? (
          <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between p-3 bg-gray-50 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Monitor className="w-4 h-4 text-cyan-600" />
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
                className="w-full h-full"
                controlsList="nodownload"
              >
                <source src={`${VIDEO_BASE_URL}/EHR%20%26%20Practice%20Management%20Section%20Intro_1080p_caption.mp4`} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowSectionIntro(true)}
            className="w-full mb-6 p-4 bg-white rounded-xl border border-gray-200 hover:border-cyan-200 hover:bg-cyan-50/50 transition-all flex items-center gap-4 text-left"
          >
            <div className="flex-shrink-0 w-10 h-10 bg-cyan-50 rounded-lg flex items-center justify-center">
              <Play className="w-5 h-5 text-cyan-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">Section Overview</h3>
              <p className="text-sm text-gray-500">Watch a brief introduction to EHR & Practice Management</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        )}

        {/* Progress Summary */}
        {completedLessons > 0 && (
          <div className="mb-6 bg-white rounded-2xl shadow-apple border-gray-200/50 p-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-600">Your Progress</span>
              <span className="font-medium text-cyan-600">
                {completedLessons} of {totalLessons} lessons completed
              </span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-cyan-500 rounded-full transition-all"
                style={{ width: `${(completedLessons / totalLessons) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Modules */}
        <section className="space-y-4" aria-label="Training Modules">
          {ehrModules.map((module, moduleIndex) => {
            const isExpanded = expandedModules.has(module.id);
            const quizPassed = isModuleQuizPassed(module.slug);
            const lessonsCompleted = module.lessons.filter((l) => isLessonDone(l.slug)).length;
            const allLessonsComplete = lessonsCompleted === module.lessons.length;
            const moduleComplete = allLessonsComplete && quizPassed;
            const ModuleIcon = moduleComplete ? CheckCircle : BookOpen;

            return (
              <div
                key={module.id}
                className="bg-white rounded-2xl shadow-apple border-gray-200/50 overflow-hidden hover-lift"
              >
                {/* Module Header */}
                <button
                  onClick={() => toggleModule(module.id)}
                  className="w-full p-5 flex items-center gap-4 text-left transition-colors hover:bg-gray-50"
                >
                  <div
                    className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center ${
                      moduleComplete ? 'bg-green-100' : 'bg-cyan-50'
                    }`}
                  >
                    <ModuleIcon
                      className={`w-5 h-5 ${moduleComplete ? 'text-green-600' : 'text-cyan-600'}`}
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
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-700">
                          Quiz Passed ({getModuleBestScore(module.slug)}%)
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">{module.title}</h3>
                    <p className="text-sm mt-1 text-gray-600">{module.description}</p>
                  </div>

                  <div className="flex-shrink-0 flex items-center gap-3">
                    <span className="text-sm text-gray-500">
                      {lessonsCompleted}/{module.lessons.length} lessons
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                    />
                  </div>
                </button>

                {/* Lessons */}
                {isExpanded && (
                  <div className="border-t border-gray-100 bg-gray-50">
                    {module.lessons.map((lesson) => (
                      <Link
                        key={lesson.id}
                        to={`/ehr-fundamentals/${module.slug}/${lesson.slug}`}
                        className="flex items-center gap-4 p-4 pl-16 hover:bg-gray-100 transition-colors"
                      >
                        <div
                          className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center ${
                            isLessonDone(lesson.slug) ? 'bg-green-100' : 'bg-cyan-600'
                          }`}
                        >
                          {isLessonDone(lesson.slug) ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : lesson.content_type === 'video' ? (
                            <Play className="w-4 h-4 text-white" />
                          ) : (
                            <FileText className="w-4 h-4 text-white" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-normal text-gray-900">{lesson.title}</h4>
                          <p className="text-sm text-gray-500 line-clamp-1">{lesson.description}</p>
                        </div>
                        <div className="flex-shrink-0 flex items-center gap-3 text-sm text-gray-500">
                          <span className="capitalize">{lesson.content_type}</span>
                          <span>{lesson.duration_minutes} min</span>
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </Link>
                    ))}

                    {/* Quiz */}
                    {module.quiz && (
                      <div className="border-t border-gray-200">
                        <Link
                          to={`/ehr-fundamentals/${module.slug}/quiz`}
                          className="flex items-center gap-4 p-4 pl-16 hover:bg-gray-100 transition-colors"
                        >
                          <div
                            className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                              quizPassed ? 'bg-green-100' : 'bg-cyan-600'
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
      </article>
    </>
  );
}
