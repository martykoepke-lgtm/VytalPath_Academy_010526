import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronRight, ChevronDown, BookOpen, Play, FileText,
  CheckCircle, ClipboardCheck, Trophy,
  Scale, X, Shield, UserCheck, AlertTriangle, Building2, Lock
} from 'lucide-react';
import { useProgress } from '../../contexts/ProgressContext';
import { SEO, seoConfigs } from '../SEO';
import type { ContentType } from '../../types/course';
import { PHIIdentifierChallenge } from '../learning/PHIIdentifierChallenge';

// Supabase Storage base URL for videos
const VIDEO_BASE_URL = 'https://vwieorhlcapeeamvltqa.supabase.co/storage/v1/object/public/videos';

interface Lesson {
  id: string;
  slug: string;
  title: string;
  description: string;
  content_type: ContentType;
  video_url: string | null;
  duration_minutes: number;
  coming_soon?: boolean;
}

interface Module {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: 'shield' | 'user-check' | 'alert-triangle' | 'building';
  color: 'slate' | 'blue' | 'amber' | 'teal';
  coming_soon?: boolean;
  quiz?: {
    id: string;
    title: string;
    description: string;
    passing_score: number;
    max_attempts: number;
  };
  lessons: Lesson[];
}

// Module icons mapping
const moduleIcons = {
  'shield': Shield,
  'user-check': UserCheck,
  'alert-triangle': AlertTriangle,
  'building': Building2,
};


// Medical Law & Ethics section modules - restructured into 4 modules
const medicalLawModules: Module[] = [
  {
    id: 'm1',
    slug: 'hipaa-foundations',
    title: 'HIPAA Foundations',
    description: 'Core HIPAA knowledge every healthcare worker needs to protect patient privacy.',
    icon: 'shield',
    color: 'slate',
    quiz: {
      id: 'q1',
      title: 'HIPAA Foundations Quiz',
      description: 'Test your understanding of HIPAA basics and PHI',
      passing_score: 80,
      max_attempts: 3,
    },
    lessons: [
      {
        id: 'l1',
        slug: 'hipaa-basics',
        title: 'HIPAA Basics',
        description: 'Understanding HIPAA regulations, patient privacy rights, and your responsibilities.',
        content_type: 'video' as ContentType,
        video_url: `${VIDEO_BASE_URL}/hipaa-basics.mp4`,
        duration_minutes: 4,
      },
      {
        id: 'l2',
        slug: 'phi-explained',
        title: 'PHI Explained',
        description: 'Learn what Protected Health Information is and how to identify it.',
        content_type: 'video' as ContentType,
        video_url: `${VIDEO_BASE_URL}/phi_explained.mp4`,
        duration_minutes: 4,
      },
      {
        id: 'l4',
        slug: 'minimum-necessary-standard',
        title: 'The Minimum Necessary Standard',
        description: 'Only access and share the minimum PHI needed for the task.',
        content_type: 'reading' as ContentType,
        video_url: null,
        duration_minutes: 10,
      },
    ],
  },
  {
    id: 'm2',
    slug: 'patient-privacy-rights',
    title: 'Patient Privacy & Rights',
    description: 'Understanding patient protections, consent requirements, and violation consequences.',
    icon: 'user-check',
    color: 'blue',
    quiz: {
      id: 'q2',
      title: 'Patient Rights Quiz',
      description: 'Test your knowledge of patient rights and authorization',
      passing_score: 80,
      max_attempts: 3,
    },
    lessons: [
      {
        id: 'l5',
        slug: 'patient-rights-under-hipaa',
        title: 'Patient Rights Under HIPAA',
        description: 'Learn the six core patient rights over their health information.',
        content_type: 'reading' as ContentType,
        video_url: null,
        duration_minutes: 12,
      },
      {
        id: 'l6',
        slug: 'authorization-consent',
        title: 'Authorization & Consent',
        description: 'Understanding patient authorization and consent requirements under HIPAA.',
        content_type: 'video' as ContentType,
        video_url: `${VIDEO_BASE_URL}/hipaa_auth_consent.mp4`,
        duration_minutes: 5,
      },
      {
        id: 'l3',
        slug: 'hipaa-violations-fines-penalties',
        title: 'HIPAA Violations, Fines & Penalties',
        description: 'Learn about the consequences of HIPAA violations and real enforcement cases.',
        content_type: 'reading' as ContentType,
        video_url: null,
        duration_minutes: 12,
      },
    ],
  },
  {
    id: 'm3',
    slug: 'healthcare-laws',
    title: 'Emergency & Access Laws',
    description: 'Critical healthcare laws beyond HIPAA that protect patients and ensure ethical practices.',
    icon: 'alert-triangle',
    color: 'amber',
    quiz: {
      id: 'q3',
      title: 'Healthcare Laws Quiz',
      description: 'Test your knowledge of EMTALA and fraud prevention laws',
      passing_score: 80,
      max_attempts: 3,
    },
    lessons: [
      {
        id: 'l7',
        slug: 'emtala-patient-anti-dumping',
        title: 'EMTALA: The Anti-Dumping Law',
        description: 'Federal law requiring emergency screening and stabilization for all patients.',
        content_type: 'reading' as ContentType,
        video_url: null,
        duration_minutes: 12,
      },
      {
        id: 'l8',
        slug: 'fraud-abuse-stark-law',
        title: 'Healthcare Fraud, Abuse & Stark Law',
        description: 'Learn about fraud, kickbacks, and self-referral rules that protect patients.',
        content_type: 'reading' as ContentType,
        video_url: null,
        duration_minutes: 15,
      },
      {
        id: 'l9',
        slug: 'anti-kickback-statute',
        title: 'Anti-Kickback Statute',
        description: 'Understanding prohibited referral payments and their impact on patient care.',
        content_type: 'reading' as ContentType,
        video_url: null,
        duration_minutes: 10,
        coming_soon: true,
      },
      {
        id: 'l10',
        slug: 'false-claims-act',
        title: 'False Claims Act',
        description: 'How the FCA protects healthcare programs from fraud and your role in prevention.',
        content_type: 'reading' as ContentType,
        video_url: null,
        duration_minutes: 10,
        coming_soon: true,
      },
    ],
  },
  {
    id: 'm4',
    slug: 'workplace-compliance',
    title: 'Workplace Compliance',
    description: 'Day-to-day compliance practices, documentation, and incident handling in your role.',
    icon: 'building',
    color: 'teal',
    coming_soon: true,
    lessons: [
      {
        id: 'l11',
        slug: 'compliance-culture',
        title: 'Building a Compliance Culture',
        description: 'Creating and maintaining a culture of compliance in healthcare settings.',
        content_type: 'reading' as ContentType,
        video_url: null,
        duration_minutes: 12,
        coming_soon: true,
      },
      {
        id: 'l12',
        slug: 'documentation-best-practices',
        title: 'Documentation Best Practices',
        description: 'Proper documentation techniques to ensure compliance and protect patients.',
        content_type: 'reading' as ContentType,
        video_url: null,
        duration_minutes: 15,
        coming_soon: true,
      },
      {
        id: 'l13',
        slug: 'incident-reporting',
        title: 'Incident Reporting & Response',
        description: 'How to properly report and respond to compliance incidents and breaches.',
        content_type: 'reading' as ContentType,
        video_url: null,
        duration_minutes: 12,
        coming_soon: true,
      },
      {
        id: 'l14',
        slug: 'security-awareness',
        title: 'Security Awareness',
        description: 'Protecting electronic PHI and maintaining security in daily operations.',
        content_type: 'reading' as ContentType,
        video_url: null,
        duration_minutes: 10,
        coming_soon: true,
      },
    ],
  },
];

const contentTypeIcons: Record<ContentType, React.ElementType> = {
  video: Play,
  reading: FileText,
};

export function MedicalLawEthicsSection() {
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

  // Only count available lessons (not coming soon)
  const availableLessons = medicalLawModules.reduce(
    (sum, m) => sum + m.lessons.filter((l) => !l.coming_soon).length,
    0
  );
  const completedLessons = medicalLawModules.reduce(
    (sum, m) => sum + m.lessons.filter((l) => !l.coming_soon && progress.isLessonCompleted(l.slug)).length,
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
          <div className="inline-flex items-center justify-center w-20 h-20 mb-4 bg-blue-100 rounded-3xl shadow-apple-sm">
            <Scale className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-4xl font-semibold tracking-tight text-gray-900 mb-3">Medical Law & Compliance</h1>
          <p className="text-xl font-light text-gray-500 leading-relaxed max-w-2xl mx-auto">
            Master HIPAA compliance, patient rights, and healthcare regulations. Essential knowledge for protecting patient privacy and avoiding legal pitfalls.
          </p>
        </header>

        {/* Section Introduction Video */}
        {showSectionIntro ? (
          <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between p-3 bg-gray-50 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-blue-600" />
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
                <source src={`${VIDEO_BASE_URL}/medlawintro.mp4`} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowSectionIntro(true)}
            className="w-full mb-6 p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-200 hover:bg-blue-50/50 transition-all flex items-center gap-4 text-left"
          >
            <div className="flex-shrink-0 w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <Play className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">Section Overview</h3>
              <p className="text-sm text-gray-500">Watch a brief introduction to Medical Law & Compliance</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        )}

        {/* Progress Summary */}
        {completedLessons > 0 && (
          <div className="mb-6 bg-white rounded-2xl shadow-apple border-gray-200/50 p-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-600">Your Progress</span>
              <span className="font-medium text-blue-600">
                {completedLessons} of {availableLessons} lessons completed
              </span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all"
                style={{ width: `${(completedLessons / availableLessons) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Modules */}
        <section className="space-y-4" aria-label="Training Modules">
          {medicalLawModules.map((module, moduleIndex) => {
            const isExpanded = expandedModules.has(module.id);
            const quizPassed = module.quiz ? isModuleQuizPassed(module.slug) : false;
            const availableModuleLessons = module.lessons.filter((l) => !l.coming_soon);
            const lessonsCompleted = availableModuleLessons.filter((l) => isLessonDone(l.slug)).length;
            const allLessonsComplete = availableModuleLessons.length > 0 && lessonsCompleted === availableModuleLessons.length;
            const moduleComplete = allLessonsComplete && (module.quiz ? quizPassed : true);
            const ModuleIcon = moduleIcons[module.icon];
            const isModuleComingSoon = module.coming_soon;

            return (
              <div
                key={module.id}
                className={`bg-white rounded-2xl shadow-apple border-gray-200/50 overflow-hidden hover-lift ${isModuleComingSoon ? 'opacity-75' : ''}`}
              >
                  {/* Module Header */}
                  <button
                    onClick={() => !isModuleComingSoon && toggleModule(module.id)}
                    className={`w-full p-5 flex items-center gap-4 text-left transition-colors ${isModuleComingSoon ? 'cursor-default' : 'hover:bg-gray-50'}`}
                  >
                    <div
                      className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center ${
                        moduleComplete ? 'bg-green-100' : 'bg-blue-50'
                      }`}
                    >
                      {isModuleComingSoon ? (
                        <Lock className="w-5 h-5 text-gray-400" />
                      ) : moduleComplete ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <ModuleIcon className="w-5 h-5 text-blue-600" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-500">Module {moduleIndex + 1}</span>
                        {isModuleComingSoon && (
                          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                            Coming Soon
                          </span>
                        )}
                        {moduleComplete && (
                          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                            Completed
                          </span>
                        )}
                        {quizPassed && !moduleComplete && !isModuleComingSoon && (
                          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">
                            Quiz Passed ({getModuleBestScore(module.slug)}%)
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-medium text-gray-900">{module.title}</h3>
                      <p className="text-sm mt-1 text-gray-600">{module.description}</p>
                    </div>

                    <div className="flex-shrink-0 flex items-center gap-3">
                      {!isModuleComingSoon && (
                        <>
                          <span className="text-sm text-gray-500">
                            {lessonsCompleted}/{availableModuleLessons.length} lessons
                          </span>
                          <ChevronDown
                            className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                          />
                        </>
                      )}
                    </div>
                  </button>

                  {/* Lessons */}
                  {isExpanded && !isModuleComingSoon && (
                    <div className="border-t border-gray-100 bg-gray-50">
                      {module.lessons.map((lesson) => {
                        const LessonIcon = contentTypeIcons[lesson.content_type];
                        const isComingSoon = lesson.coming_soon;

                        if (isComingSoon) {
                          return (
                            <div
                              key={lesson.id}
                              className="flex items-center gap-4 p-4 pl-16 opacity-60"
                            >
                              <div className="flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center bg-gray-200">
                                <Lock className="w-4 h-4 text-gray-400" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-normal text-gray-700">{lesson.title}</h4>
                                <p className="text-sm text-gray-400 line-clamp-1">{lesson.description}</p>
                              </div>
                              <div className="flex-shrink-0 flex items-center gap-3 text-sm text-gray-400">
                                <span className="px-2 py-0.5 bg-gray-100 rounded text-xs font-medium">Coming Soon</span>
                              </div>
                            </div>
                          );
                        }

                        return (
                          <Link
                            key={lesson.id}
                            to={`/medical-law-ethics/${module.slug}/${lesson.slug}`}
                            className="flex items-center gap-4 p-4 pl-16 hover:bg-gray-100 transition-colors"
                          >
                            <div
                              className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center ${
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
                              <h4 className="font-normal text-gray-900">{lesson.title}</h4>
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
                              className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center ${
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

        {/* Interactive Practice */}
        <div className="mt-8">
          <PHIIdentifierChallenge />
        </div>
      </article>
    </>
  );
}
