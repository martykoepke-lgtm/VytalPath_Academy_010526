import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ChevronRight, ChevronDown, BookOpen, Play, FileText,
  Lock, CheckCircle, Clock, GraduationCap, ArrowLeft,
  ClipboardCheck, Trophy
} from 'lucide-react';
import { useProgress } from '../../contexts/ProgressContext';
import type { CourseWithModules, ContentType } from '../../types/course';

// Supabase Storage base URL for videos
const VIDEO_BASE_URL = 'https://vwieorhlcapeeamvltqa.supabase.co/storage/v1/object/public/videos';

// Temporary hardcoded data - will be replaced with database fetch
const coursesData: Record<string, CourseWithModules> = {
  'healthcare-admin-essentials': {
    id: '1',
    slug: 'healthcare-admin-essentials',
    title: 'Healthcare Foundations',
    description: 'Build the foundation for any healthcare administrative role. Learn about healthcare settings, medical law and ethics, insurance basics, and essential terminology.',
    type: 'foundation',
    prerequisite_ids: [],
    sort_order: 1,
    is_published: true,
    estimated_hours: 2,
    certificate_title: 'Healthcare Foundations Certificate',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    progress_percent: 0,
    is_enrolled: false,
    is_completed: false,
    is_locked: false,
    modules: [
      {
        id: 'm1',
        course_id: '1',
        slug: 'healthcare-settings',
        title: 'Healthcare Settings',
        description: 'Understand the different types of healthcare environments and your role within them.',
        sort_order: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_completed: false,
        is_locked: false,
        quiz_passed: false,
        quiz: {
          id: 'q1',
          module_id: 'm1',
          title: 'Healthcare Settings Quiz',
          description: 'Test your knowledge of healthcare settings',
          passing_score: 80,
          max_attempts: 3,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        lessons: [
          {
            id: 'l1',
            module_id: 'm1',
            slug: 'healthcare-front-office-foundations',
            title: 'Healthcare Front Office Foundations',
            description: 'An introduction to the essential skills and knowledge needed for front office success.',
            content_type: 'video',
            video_url: `${VIDEO_BASE_URL}/healthcare-front-office-foundations.mp4`,
            reading_content: null,
            duration_minutes: 4,
            sort_order: 1,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            is_completed: false,
            is_locked: false,
          },
          {
            id: 'l2',
            module_id: 'm1',
            slug: 'acute-vs-ambulatory-care',
            title: 'Acute vs. Ambulatory Care',
            description: 'Learn the key differences between acute care (hospitals) and ambulatory care (outpatient clinics).',
            content_type: 'video',
            video_url: `${VIDEO_BASE_URL}/acute-vs-ambulatory-care.mp4`,
            reading_content: null,
            duration_minutes: 4,
            sort_order: 2,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            is_completed: false,
            is_locked: false,
          },
        ],
      },
      {
        id: 'm2',
        course_id: '1',
        slug: 'medical-law-ethics',
        title: 'Medical Law & Ethics',
        description: 'Essential legal and ethical guidelines for healthcare professionals.',
        sort_order: 2,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_completed: false,
        is_locked: false,
        quiz_passed: false,
        quiz: {
          id: 'q2',
          module_id: 'm2',
          title: 'Authorization & Consent Quiz',
          description: 'Test your knowledge of HIPAA and patient privacy',
          passing_score: 80,
          max_attempts: 3,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        lessons: [
          {
            id: 'l3',
            module_id: 'm2',
            slug: 'hipaa-essentials',
            title: 'HIPAA Essentials Explained',
            description: 'Understanding HIPAA regulations, patient privacy rights, and your responsibilities.',
            content_type: 'video',
            video_url: `${VIDEO_BASE_URL}/hipaa-essentials-explained.mp4`,
            reading_content: null,
            duration_minutes: 4,
            sort_order: 1,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            is_completed: false,
            is_locked: false,
          },
          {
            id: 'l4',
            module_id: 'm2',
            slug: 'phi-explained',
            title: 'PHI Explained',
            description: 'Learn what Protected Health Information is and how to identify it.',
            content_type: 'video',
            video_url: `${VIDEO_BASE_URL}/phi-explained.mp4`,
            reading_content: null,
            duration_minutes: 4,
            sort_order: 2,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            is_completed: false,
            is_locked: false,
          },
          {
            id: 'l4b',
            module_id: 'm2',
            slug: 'hipaa-access-rules',
            title: 'HIPAA Access Rules',
            description: 'Learn about HIPAA access rules and who can access patient health information.',
            content_type: 'video',
            video_url: `${VIDEO_BASE_URL}/hipaa-access-rules.mp4`,
            reading_content: null,
            duration_minutes: 4,
            sort_order: 3,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            is_completed: false,
            is_locked: false,
          },
          {
            id: 'l5',
            module_id: 'm2',
            slug: 'authorization-consent',
            title: 'Authorization & Consent',
            description: 'Understanding patient authorization and consent requirements.',
            content_type: 'reading',
            video_url: null,
            reading_content: null,
            duration_minutes: 8,
            sort_order: 3,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            is_completed: false,
            is_locked: false,
          },
        ],
      },
      {
        id: 'm3',
        course_id: '1',
        slug: 'insurance-fundamentals',
        title: 'Insurance Overview',
        description: 'A high-level introduction to health insurance concepts. For detailed, job-specific insurance training, see the Front Office Specialist course.',
        sort_order: 3,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_completed: false,
        is_locked: false,
        quiz_passed: false,
        quiz: {
          id: 'q3',
          module_id: 'm3',
          title: 'Insurance Overview Quiz',
          description: 'Test your understanding of basic health insurance concepts',
          passing_score: 80,
          max_attempts: 3,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        lessons: [
          {
            id: 'l6',
            module_id: 'm3',
            slug: 'introduction-health-insurance',
            title: 'Introduction to Health Insurance',
            description: 'A broad overview of how health insurance works in the US healthcare system.',
            content_type: 'video',
            video_url: `${VIDEO_BASE_URL}/introduction-to-health-insurance.mp4`,
            reading_content: null,
            duration_minutes: 4,
            sort_order: 1,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            is_completed: false,
            is_locked: false,
          },
          {
            id: 'l7',
            module_id: 'm3',
            slug: 'payer-types-plan-types',
            title: 'Types of Payers & Plan Types',
            description: 'Learn about different insurance payers (Medicare, Medicaid, commercial) and plan types (HMO, PPO, EPO).',
            content_type: 'video',
            video_url: `${VIDEO_BASE_URL}/types-of-payers-and-plan-types.mp4`,
            reading_content: null,
            duration_minutes: 4,
            sort_order: 2,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            is_completed: false,
            is_locked: false,
          },
          {
            id: 'l8',
            module_id: 'm3',
            slug: 'key-insurance-terms',
            title: 'Key Insurance Terms',
            description: 'Define essential insurance vocabulary: premium, deductible, copay, coinsurance, and out-of-pocket maximum.',
            content_type: 'video',
            video_url: `${VIDEO_BASE_URL}/key-insurance-terms.mp4`,
            reading_content: null,
            duration_minutes: 4,
            sort_order: 3,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            is_completed: false,
            is_locked: false,
          },
        ],
      },
      {
        id: 'm4',
        course_id: '1',
        slug: 'medical-terminology-basics',
        title: 'Medical Terminology Basics',
        description: 'Learn essential medical abbreviations and terminology for daily clinic operations. Practice with flashcards in Study Mode!',
        sort_order: 4,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_completed: false,
        is_locked: false,
        quiz_passed: false,
        quiz: {
          id: 'q4',
          module_id: 'm4',
          title: 'Medical Terminology Quiz',
          description: 'Test your knowledge of medical abbreviations and terms',
          passing_score: 80,
          max_attempts: 3,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        lessons: [
          {
            id: 'l9',
            module_id: 'm4',
            slug: 'intro-medical-terminology',
            title: 'Introduction to Medical Terminology',
            description: 'Learn how medical terms are constructed from prefixes, roots, and suffixes - the building blocks of medical language.',
            content_type: 'reading',
            video_url: null,
            reading_content: null,
            duration_minutes: 8,
            sort_order: 1,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            is_completed: false,
            is_locked: false,
          },
          {
            id: 'l10',
            module_id: 'm4',
            slug: 'common-prefixes',
            title: 'Common Prefixes',
            description: 'Master essential prefixes for size, position, quantity, negatives, and colors used in medical terminology.',
            content_type: 'reading',
            video_url: null,
            reading_content: null,
            duration_minutes: 10,
            sort_order: 2,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            is_completed: false,
            is_locked: false,
          },
          {
            id: 'l11a',
            module_id: 'm4',
            slug: 'common-root-words',
            title: 'Common Root Words',
            description: 'Learn the root words for body systems, organs, and anatomical structures.',
            content_type: 'reading',
            video_url: null,
            reading_content: null,
            duration_minutes: 12,
            sort_order: 3,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            is_completed: false,
            is_locked: false,
          },
          {
            id: 'l12a',
            module_id: 'm4',
            slug: 'common-suffixes',
            title: 'Common Suffixes',
            description: 'Understand suffixes that indicate conditions, procedures, and medical specialties.',
            content_type: 'reading',
            video_url: null,
            reading_content: null,
            duration_minutes: 10,
            sort_order: 4,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            is_completed: false,
            is_locked: false,
          },
          {
            id: 'l13a',
            module_id: 'm4',
            slug: 'common-abbreviations',
            title: 'Common Medical Abbreviations',
            description: 'Master the abbreviations for timing, routes, diagnoses, and tests you will see daily in clinic settings.',
            content_type: 'reading',
            video_url: null,
            reading_content: null,
            duration_minutes: 10,
            sort_order: 5,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            is_completed: false,
            is_locked: false,
          },
        ],
      },
    ],
  },
  'front-office-specialist': {
    id: '2',
    slug: 'front-office-specialist',
    title: 'Front Office Specialist',
    description: 'Master the daily operations of a healthcare front office. Deep-dive into insurance verification, patient scheduling, check-in/check-out procedures, and payment collection.',
    type: 'role',
    prerequisite_ids: ['1'],
    sort_order: 2,
    is_published: true,
    estimated_hours: 1,
    certificate_title: 'Front Office Specialist Certificate',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    progress_percent: 0,
    is_enrolled: false,
    is_completed: false,
    is_locked: false, // Requires Foundation course
    modules: [
      {
        id: 'm5',
        course_id: '2',
        slug: 'insurance-operations',
        title: 'Insurance Operations',
        description: 'Master the day-to-day insurance tasks: verifying eligibility, understanding benefits, and collecting patient responsibility.',
        sort_order: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_completed: false,
        is_locked: false,
        quiz_passed: false,
        quiz: {
          id: 'q5',
          module_id: 'm5',
          title: 'Insurance Operations Quiz',
          description: 'Test your knowledge of day-to-day insurance verification and payment collection',
          passing_score: 80,
          max_attempts: 3,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        lessons: [
          {
            id: 'l11',
            module_id: 'm5',
            slug: 'reading-insurance-card',
            title: 'Reading an Insurance Card',
            description: 'Learn to identify key information on insurance cards: member ID, group number, plan type, and contact numbers.',
            content_type: 'video',
            video_url: `${VIDEO_BASE_URL}/reading-an-insurance-card.mp4`,
            reading_content: null,
            duration_minutes: 4,
            sort_order: 1,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            is_completed: false,
            is_locked: false,
          },
          {
            id: 'l12',
            module_id: 'm5',
            slug: 'real-time-eligibility',
            title: 'Real-Time Eligibility Verification',
            description: 'Step-by-step process for verifying patient eligibility before appointments.',
            content_type: 'video',
            video_url: `${VIDEO_BASE_URL}/insurance-eligibility-verification.mp4`,
            reading_content: null,
            duration_minutes: 5,
            sort_order: 2,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            is_completed: false,
            is_locked: false,
          },
          {
            id: 'l13',
            module_id: 'm5',
            slug: 'understanding-copays',
            title: 'Understanding Copays',
            description: 'What copays are, how to identify them, when to collect, and how to handle discrepancies.',
            content_type: 'video',
            video_url: `${VIDEO_BASE_URL}/understanding-copays.mp4`,
            reading_content: null,
            duration_minutes: 4,
            sort_order: 3,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            is_completed: false,
            is_locked: false,
          },
          {
            id: 'l14',
            module_id: 'm5',
            slug: 'deductibles-oop-max',
            title: 'Deductibles & Out-of-Pocket Maximum',
            description: 'Understanding deductibles, tracking patient progress, and out-of-pocket maximums.',
            content_type: 'video',
            video_url: `${VIDEO_BASE_URL}/deductibles-and-out-of-pocket-maximum.mp4`,
            reading_content: null,
            duration_minutes: 4,
            sort_order: 4,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            is_completed: false,
            is_locked: false,
          },
          {
            id: 'l15',
            module_id: 'm5',
            slug: 'coinsurance-calculations',
            title: 'Coinsurance Calculations',
            description: 'How to calculate patient coinsurance responsibility and explain it to patients.',
            content_type: 'video',
            video_url: `${VIDEO_BASE_URL}/coinsurance-calculations.mp4`,
            reading_content: null,
            duration_minutes: 4,
            sort_order: 5,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            is_completed: false,
            is_locked: false,
          },
          {
            id: 'l16',
            module_id: 'm5',
            slug: 'collecting-patient-payments',
            title: 'Collecting Patient Payments',
            description: 'Best practices for collecting copays, coinsurance, and outstanding balances.',
            content_type: 'video',
            video_url: `${VIDEO_BASE_URL}/collecting-patient-payments.mp4`,
            reading_content: null,
            duration_minutes: 4,
            sort_order: 6,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            is_completed: false,
            is_locked: false,
          },
        ],
      },
    ],
  },
};

const contentTypeIcons: Record<ContentType, React.ElementType> = {
  video: Play,
  reading: FileText,
};

export function CourseDetail() {
  const { courseSlug } = useParams<{ courseSlug: string }>();
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set(['m1', 'm2', 'm3', 'm4', 'm5']));
  const progress = useProgress();

  // Get course by slug from data
  const course = courseSlug ? coursesData[courseSlug] : null;

  if (!course) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <p className="text-gray-500">Course not found</p>
        <Link to="/courses" className="text-blue-600 hover:underline mt-4 inline-block">
          Back to Courses
        </Link>
      </div>
    );
  }

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

  // Calculate progress using context
  const totalLessons = course.modules.reduce((sum, m) => sum + m.lessons.length, 0);
  const completedLessons = course.modules.reduce(
    (sum, m) => sum + m.lessons.filter((l) => progress.isLessonCompleted(l.slug)).length,
    0
  );

  // Helper to check if a module's quiz is passed
  const isModuleQuizPassed = (moduleSlug: string) => progress.hasPassedQuiz(moduleSlug);

  // Helper to get best quiz score for a module
  const getModuleBestScore = (moduleSlug: string) => progress.getBestQuizScore(moduleSlug);

  // Helper to check if lesson is completed
  const isLessonDone = (lessonSlug: string) => progress.isLessonCompleted(lessonSlug);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back navigation */}
      <Link
        to="/courses"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Courses
      </Link>

      {/* Course Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center">
            <img src="/icons/courses-icon.png" alt="Course" className="w-14 h-14" />
          </div>
          <div className="flex-1">
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-700">
              Foundation Course
            </span>
            <h1 className="text-2xl font-bold text-gray-900 mt-2 mb-2">{course.title}</h1>
            <p className="text-gray-600 mb-4">{course.description}</p>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <BookOpen className="w-4 h-4" />
                {course.modules.length} modules
              </span>
              <span className="flex items-center gap-1">
                <Play className="w-4 h-4" />
                {totalLessons} lessons
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                ~{course.estimated_hours} hours
              </span>
            </div>
          </div>
        </div>

        {/* Progress */}
        {completedLessons > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-600">Your Progress</span>
              <span className="font-medium text-blue-600">
                {completedLessons} of {totalLessons} lessons completed
              </span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-blue-500 rounded-full transition-all"
                style={{ width: `${(completedLessons / totalLessons) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Modules */}
      <div className="space-y-4">
        {course.modules.map((module, moduleIndex) => {
          const isExpanded = expandedModules.has(module.id);
          // Use progress context for completion status
          const quizPassed = isModuleQuizPassed(module.slug);
          const lessonsCompleted = module.lessons.filter((l) => isLessonDone(l.slug)).length;
          const allLessonsComplete = lessonsCompleted === module.lessons.length;
          const moduleComplete = allLessonsComplete && quizPassed;
          const ModuleIcon = module.is_locked ? Lock : moduleComplete ? CheckCircle : BookOpen;
          const completedInModule = lessonsCompleted;

          return (
            <div
              key={module.id}
              className={`bg-white rounded-xl shadow-sm border overflow-hidden ${
                module.is_locked ? 'border-gray-200 opacity-75' : 'border-gray-200'
              }`}
            >
              {/* Module Header */}
              <button
                onClick={() => toggleModule(module.id)}
                disabled={module.is_locked}
                className={`w-full p-5 flex items-center gap-4 text-left transition-colors ${
                  module.is_locked ? 'cursor-not-allowed' : 'hover:bg-gray-50'
                }`}
              >
                <div
                  className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                    moduleComplete
                      ? 'bg-green-100'
                      : module.is_locked
                      ? 'bg-gray-100'
                      : 'bg-blue-100'
                  }`}
                >
                  <ModuleIcon
                    className={`w-5 h-5 ${
                      moduleComplete
                        ? 'text-green-600'
                        : module.is_locked
                        ? 'text-gray-400'
                        : 'text-blue-600'
                    }`}
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
                  <h3 className={`text-lg font-semibold ${module.is_locked ? 'text-gray-400' : 'text-gray-900'}`}>
                    {module.title}
                  </h3>
                  <p className={`text-sm mt-1 ${module.is_locked ? 'text-gray-400' : 'text-gray-600'}`}>
                    {module.description}
                  </p>
                </div>

                <div className="flex-shrink-0 flex items-center gap-3">
                  <span className="text-sm text-gray-500">
                    {completedInModule}/{module.lessons.length} lessons
                  </span>
                  {!module.is_locked && (
                    <ChevronDown
                      className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                    />
                  )}
                </div>
              </button>

              {/* Lessons */}
              {isExpanded && !module.is_locked && (
                <div className="border-t border-gray-100 bg-gray-50">
                  {module.lessons.map((lesson, lessonIndex) => {
                    const LessonIcon = contentTypeIcons[lesson.content_type];
                    const isAvailable = !lesson.is_locked;

                    return (
                      <div key={lesson.id}>
                        {isAvailable ? (
                          <Link
                            to={`/courses/${courseSlug}/${module.slug}/${lesson.slug}`}
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
                        ) : (
                          <div className="flex items-center gap-4 p-4 pl-16 opacity-60">
                            <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center bg-gray-200">
                              <Lock className="w-4 h-4 text-gray-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-gray-500">{lesson.title}</h4>
                              <p className="text-sm text-gray-400 line-clamp-1">{lesson.description}</p>
                            </div>
                            <div className="flex-shrink-0 text-sm text-gray-400">
                              Complete previous lesson to unlock
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* Quiz */}
                  {/* DEVELOPMENT MODE: Quiz always accessible for testing */}
                  {/* TODO: Re-enable lesson completion check when content is finalized */}
                  {module.quiz && (
                    <div className="border-t border-gray-200">
                      <Link
                        to={`/courses/${courseSlug}/${module.slug}/quiz`}
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
                              : `Pass with ${module.quiz.passing_score}% to unlock next module`}
                          </p>
                        </div>
                        <div className="flex-shrink-0 flex items-center gap-2">
                          {quizPassed ? (
                            <span className="text-sm text-green-600 font-medium">
                              Completed
                            </span>
                          ) : (
                            <span className="text-sm text-gray-500">
                              {module.quiz.max_attempts} attempts allowed
                            </span>
                          )}
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        </div>
                      </Link>
                    </div>
                  )}

                  {/* Study Mode Link for Medical Terminology Module */}
                  {module.slug === 'medical-terminology-basics' && (
                    <div className="border-t border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                      <Link
                        to="/terminology"
                        className="flex items-center gap-4 p-4 pl-16 hover:bg-blue-100/50 transition-colors"
                      >
                        <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-500">
                          <GraduationCap className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900">Practice with Study Mode</h4>
                          <p className="text-sm text-gray-600">
                            Flashcards for Roots, Prefixes, Suffixes, Directions & Positions
                          </p>
                        </div>
                        <div className="flex-shrink-0 flex items-center gap-2">
                          <span className="text-sm text-blue-600 font-medium">
                            Go to Study Mode
                          </span>
                          <ChevronRight className="w-4 h-4 text-blue-400" />
                        </div>
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Certificate Preview */}
      <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
            <img src="/icons/courses-icon.png" alt="Progress" className="w-10 h-10" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 mb-1">Track Your Progress</h3>
            <p className="text-sm text-gray-600">
              Complete all modules and knowledge checks to track your understanding across healthcare administration topics.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
