import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronRight, ChevronDown, BookOpen, Play, FileText,
  CheckCircle, Clock, GraduationCap, ClipboardCheck, Trophy,
  Scale
} from 'lucide-react';
import { useProgress } from '../../contexts/ProgressContext';
import { SEO, seoConfigs } from '../SEO';
import type { ContentType } from '../../types/course';

// Supabase Storage base URL for videos
const VIDEO_BASE_URL = 'https://vwieorhlcapeeamvltqa.supabase.co/storage/v1/object/public/videos';

// Medical Law & Ethics section modules
const medicalLawModules = [
  {
    id: 'm1',
    slug: 'medical-law-ethics',
    title: 'Medical Law & Ethics',
    description: 'Essential legal and ethical guidelines for healthcare professionals.',
    sort_order: 1,
    quiz: {
      id: 'q1',
      title: 'Medical Law & Ethics Quiz',
      description: 'Test your knowledge of HIPAA, patient rights, and healthcare compliance',
      passing_score: 80,
      max_attempts: 3,
    },
    lessons: [
      {
        id: 'l1',
        slug: 'hipaa-essentials',
        title: 'HIPAA Essentials Explained',
        description: 'Understanding HIPAA regulations, patient privacy rights, and your responsibilities.',
        content_type: 'video' as ContentType,
        video_url: `${VIDEO_BASE_URL}/hipaa-essentials-explained.mp4`,
        duration_minutes: 4,
      },
      {
        id: 'l2',
        slug: 'phi-explained',
        title: 'PHI Explained',
        description: 'Learn what Protected Health Information is and how to identify it.',
        content_type: 'video' as ContentType,
        video_url: `${VIDEO_BASE_URL}/phi-explained.mp4`,
        duration_minutes: 4,
      },
      {
        id: 'l3',
        slug: 'hipaa-access-rules',
        title: 'HIPAA Access Rules',
        description: 'Learn about HIPAA access rules and who can access patient health information.',
        content_type: 'video' as ContentType,
        video_url: `${VIDEO_BASE_URL}/hipaa-access-rules.mp4`,
        duration_minutes: 4,
      },
      {
        id: 'l4',
        slug: 'hipaa-violations-fines-penalties',
        title: 'HIPAA Violations, Fines & Penalties',
        description: 'Learn about the consequences of HIPAA violations and real enforcement cases.',
        content_type: 'reading' as ContentType,
        video_url: null,
        duration_minutes: 12,
      },
      {
        id: 'l5',
        slug: 'minimum-necessary-standard',
        title: 'The Minimum Necessary Standard',
        description: 'Only access and share the minimum PHI needed for the task.',
        content_type: 'reading' as ContentType,
        video_url: null,
        duration_minutes: 10,
      },
      {
        id: 'l6',
        slug: 'patient-rights-under-hipaa',
        title: 'Patient Rights Under HIPAA',
        description: 'Learn the six core patient rights over their health information.',
        content_type: 'reading' as ContentType,
        video_url: null,
        duration_minutes: 12,
      },
      {
        id: 'l7',
        slug: 'authorization-consent',
        title: 'Authorization & Consent',
        description: 'Understanding patient authorization and consent requirements.',
        content_type: 'reading' as ContentType,
        video_url: null,
        duration_minutes: 15,
      },
      {
        id: 'l8',
        slug: 'emtala-patient-anti-dumping',
        title: 'EMTALA: The Anti-Dumping Law',
        description: 'Federal law requiring emergency screening and stabilization for all patients.',
        content_type: 'reading' as ContentType,
        video_url: null,
        duration_minutes: 12,
      },
      {
        id: 'l9',
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

export function MedicalLawEthicsSection() {
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set(['m1']));
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

  const totalLessons = medicalLawModules.reduce((sum, m) => sum + m.lessons.length, 0);
  const completedLessons = medicalLawModules.reduce(
    (sum, m) => sum + m.lessons.filter((l) => progress.isLessonCompleted(l.slug)).length,
    0
  );

  const isModuleQuizPassed = (moduleSlug: string) => progress.hasPassedQuiz(moduleSlug);
  const getModuleBestScore = (moduleSlug: string) => progress.getBestQuizScore(moduleSlug);
  const isLessonDone = (lessonSlug: string) => progress.isLessonCompleted(lessonSlug);

  return (
    <>
      <SEO {...seoConfigs.medicalLawEthics} />
      <article className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-blue-100 rounded-2xl">
            <Scale className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Medical Law & Ethics</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Master HIPAA compliance, patient rights, and healthcare regulations. Essential knowledge for protecting patient privacy and avoiding legal pitfalls.
          </p>
        </header>

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
          {medicalLawModules.map((module, moduleIndex) => {
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
                          to={`/medical-law-ethics/${module.slug}/${lesson.slug}`}
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
                          to={`/medical-law-ethics/${module.slug}/quiz`}
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
