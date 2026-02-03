import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronRight, ChevronDown, BookOpen, Play, FileText,
  CheckCircle, Clock, GraduationCap, ClipboardCheck, Trophy,
  Sparkles, X
} from 'lucide-react';
import { useProgress } from '../../contexts/ProgressContext';
import { SEO, seoConfigs } from '../SEO';
import type { ContentType } from '../../types/course';

// Foundations section includes: Intro, Healthcare Settings, Medical Law & Ethics
const foundationsModules = [
  {
    id: 'm1',
    slug: 'healthcare-settings',
    title: 'Healthcare Settings',
    description: 'Understand the different types of healthcare environments and your role within them.',
    sort_order: 1,
    quiz: {
      id: 'q1',
      title: 'Healthcare Settings Quiz',
      description: 'Test your knowledge of healthcare settings',
      passing_score: 80,
      max_attempts: 3,
    },
    lessons: [
      {
        id: 'l1',
        slug: 'healthcare-front-office-foundations',
        title: 'Healthcare Front Office Foundations',
        description: 'An introduction to the essential skills and knowledge needed for front office success.',
        content_type: 'video' as ContentType,
        video_url: '/videos/Healthcare Front Office Foundations.mp4',
        duration_minutes: 4,
      },
      {
        id: 'l2',
        slug: 'acute-vs-ambulatory-care',
        title: 'Acute vs. Ambulatory Care',
        description: 'Learn the key differences between acute care (hospitals) and ambulatory care (outpatient clinics).',
        content_type: 'video' as ContentType,
        video_url: '/videos/Acute vs. Ambulatory Care.mp4',
        duration_minutes: 4,
      },
    ],
  },
  {
    id: 'm2',
    slug: 'medical-law-ethics',
    title: 'Medical Law & Ethics',
    description: 'Essential legal and ethical guidelines for healthcare professionals.',
    sort_order: 2,
    quiz: {
      id: 'q2',
      title: 'Medical Law & Ethics Quiz',
      description: 'Test your knowledge of HIPAA, patient rights, and healthcare compliance',
      passing_score: 80,
      max_attempts: 3,
    },
    lessons: [
      {
        id: 'l3',
        slug: 'hipaa-essentials',
        title: 'HIPAA Essentials Explained',
        description: 'Understanding HIPAA regulations, patient privacy rights, and your responsibilities.',
        content_type: 'video' as ContentType,
        video_url: '/videos/HIPAA Essentials Explained.mp4',
        duration_minutes: 4,
      },
      {
        id: 'l4',
        slug: 'phi-explained',
        title: 'PHI Explained',
        description: 'Learn what Protected Health Information is and how to identify it.',
        content_type: 'video' as ContentType,
        video_url: '/videos/PHI Explained (1).mp4',
        duration_minutes: 4,
      },
      {
        id: 'l4b',
        slug: 'hipaa-access-rules',
        title: 'HIPAA Access Rules',
        description: 'Learn about HIPAA access rules and who can access patient health information.',
        content_type: 'video' as ContentType,
        video_url: '/videos/HIPAA Access Rules.mp4',
        duration_minutes: 4,
      },
      {
        id: 'l4c',
        slug: 'hipaa-violations-fines-penalties',
        title: 'HIPAA Violations, Fines & Penalties',
        description: 'Learn about the consequences of HIPAA violations and real enforcement cases.',
        content_type: 'reading' as ContentType,
        video_url: null,
        duration_minutes: 12,
      },
      {
        id: 'l4d',
        slug: 'minimum-necessary-standard',
        title: 'The Minimum Necessary Standard',
        description: 'Only access and share the minimum PHI needed for the task.',
        content_type: 'reading' as ContentType,
        video_url: null,
        duration_minutes: 10,
      },
      {
        id: 'l4e',
        slug: 'patient-rights-under-hipaa',
        title: 'Patient Rights Under HIPAA',
        description: 'Learn the six core patient rights over their health information.',
        content_type: 'reading' as ContentType,
        video_url: null,
        duration_minutes: 12,
      },
      {
        id: 'l5',
        slug: 'authorization-consent',
        title: 'Authorization & Consent',
        description: 'Understanding patient authorization and consent requirements.',
        content_type: 'reading' as ContentType,
        video_url: null,
        duration_minutes: 15,
      },
      {
        id: 'l5b',
        slug: 'emtala-patient-anti-dumping',
        title: 'EMTALA: The Anti-Dumping Law',
        description: 'Federal law requiring emergency screening and stabilization for all patients.',
        content_type: 'reading' as ContentType,
        video_url: null,
        duration_minutes: 12,
      },
      {
        id: 'l5c',
        slug: 'fraud-abuse-stark-law',
        title: 'Healthcare Fraud, Abuse & Stark Law',
        description: 'Learn about fraud, kickbacks, and self-referral rules that protect patients.',
        content_type: 'reading' as ContentType,
        video_url: null,
        duration_minutes: 15,
      },
    ],
  },
];

const contentTypeIcons: Record<ContentType, React.ElementType> = {
  video: Play,
  reading: FileText,
};

export function FoundationsSection() {
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set(['m1', 'm2']));
  const [showIntroVideo, setShowIntroVideo] = useState(false);
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

  const totalLessons = foundationsModules.reduce((sum, m) => sum + m.lessons.length, 0);
  const completedLessons = foundationsModules.reduce(
    (sum, m) => sum + m.lessons.filter((l) => progress.isLessonCompleted(l.slug)).length,
    0
  );

  const isModuleQuizPassed = (moduleSlug: string) => progress.hasPassedQuiz(moduleSlug);
  const getModuleBestScore = (moduleSlug: string) => progress.getBestQuizScore(moduleSlug);
  const isLessonDone = (lessonSlug: string) => progress.isLessonCompleted(lessonSlug);

  return (
    <>
      <SEO {...seoConfigs.foundations} />
      <article className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 mb-4">
          <img src="/icons/courses-icon.png" alt="Foundations" className="w-14 h-14" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Foundations of Healthcare</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Build your foundation in healthcare administration. Learn about healthcare settings, medical law, ethics, and HIPAA compliance.
        </p>
      </header>

      {/* Welcome Video Section */}
      {showIntroVideo ? (
        <div className="mb-8 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
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
              <source src="/videos/VytalPath Academy Introduction.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      ) : (
        <div className="mb-8 bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 rounded-xl border border-blue-200 overflow-hidden">
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
              <h2 className="text-lg font-bold text-gray-900 mb-1">Welcome to VytalPath Academy</h2>
              <p className="text-gray-600 text-sm">
                Meet your AI instructor and discover how this program will prepare you for success.
              </p>
            </div>
            <button
              onClick={() => setShowIntroVideo(true)}
              className="flex-shrink-0 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
            >
              <Play className="w-4 h-4" />
              Watch Intro
            </button>
          </div>
        </div>
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
      <section className="space-y-4" aria-label="Training Modules">
        {foundationsModules.map((module, moduleIndex) => {
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
                        to={`/foundations/${module.slug}/${lesson.slug}`}
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
                        to={`/foundations/${module.slug}/quiz`}
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
    </article>
    </>
  );
}
