import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronRight, ChevronDown, BookOpen, FileText,
  CheckCircle, GraduationCap, ClipboardCheck, Trophy, BookA
} from 'lucide-react';
import { useProgress } from '../../contexts/ProgressContext';
import { SEO, seoConfigs } from '../SEO';
import { TerminologyView } from '../TerminologyView';
import { TermDetail } from '../TermDetail';
import type { MedicalTerm } from '../../types/medical';
import type { ContentType } from '../../types/course';

// Medical Terminology module lessons
const terminologyModule = {
  id: 'm4',
  slug: 'medical-terminology-basics',
  title: 'Medical Terminology Lessons',
  description: 'Learn essential medical abbreviations and terminology for daily clinic operations.',
  quiz: {
    id: 'q4',
    title: 'Medical Terminology Quiz',
    description: 'Test your knowledge of medical abbreviations and terms',
    passing_score: 80,
    max_attempts: 3,
  },
  lessons: [
    {
      id: 'l9',
      slug: 'intro-medical-terminology',
      title: 'Introduction to Medical Terminology',
      description: 'Learn how medical terms are constructed from prefixes, roots, and suffixes - the building blocks of medical language.',
      content_type: 'reading' as ContentType,
      duration_minutes: 8,
    },
    {
      id: 'l10',
      slug: 'common-prefixes',
      title: 'Common Prefixes',
      description: 'Master essential prefixes for size, position, quantity, negatives, and colors used in medical terminology.',
      content_type: 'reading' as ContentType,
      duration_minutes: 10,
    },
    {
      id: 'l11a',
      slug: 'common-root-words',
      title: 'Common Root Words',
      description: 'Learn the root words for body systems, organs, and anatomical structures.',
      content_type: 'reading' as ContentType,
      duration_minutes: 12,
    },
    {
      id: 'l12a',
      slug: 'common-suffixes',
      title: 'Common Suffixes',
      description: 'Understand suffixes that indicate conditions, procedures, and medical specialties.',
      content_type: 'reading' as ContentType,
      duration_minutes: 10,
    },
    {
      id: 'l13a',
      slug: 'common-abbreviations',
      title: 'Common Medical Abbreviations',
      description: 'Master the abbreviations for timing, routes, diagnoses, and tests you will see daily in clinic settings.',
      content_type: 'reading' as ContentType,
      duration_minutes: 10,
    },
  ],
};

const contentTypeIcons: Record<ContentType, React.ElementType> = {
  video: FileText,
  reading: FileText,
};

type ViewMode = 'lessons' | 'study';

export function TerminologySection() {
  const [viewMode, setViewMode] = useState<ViewMode>('lessons');
  const [expandedModule, setExpandedModule] = useState(true);
  const [selectedTerm, setSelectedTerm] = useState<MedicalTerm | null>(null);
  const progress = useProgress();

  const isModuleQuizPassed = progress.hasPassedQuiz(terminologyModule.slug);
  const getModuleBestScore = () => progress.getBestQuizScore(terminologyModule.slug);
  const isLessonDone = (lessonSlug: string) => progress.isLessonCompleted(lessonSlug);

  const lessonsCompleted = terminologyModule.lessons.filter((l) => isLessonDone(l.slug)).length;
  const allLessonsComplete = lessonsCompleted === terminologyModule.lessons.length;
  const moduleComplete = allLessonsComplete && isModuleQuizPassed;

  return (
    <>
      <SEO {...seoConfigs.terminology} />
      <article className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl">
            <BookA className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Medical Terminology</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Master the language of healthcare. Learn prefixes, roots, suffixes, and common abbreviations used in clinical settings.
          </p>
        </header>

      {/* View Mode Toggle */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1 shadow-sm">
          <button
            onClick={() => setViewMode('lessons')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
              viewMode === 'lessons'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <span className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Lessons
            </span>
          </button>
          <button
            onClick={() => setViewMode('study')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
              viewMode === 'study'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <span className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4" />
              Study Mode
            </span>
          </button>
        </div>
      </div>

      {viewMode === 'lessons' ? (
        <>
          {/* Progress Summary */}
          {lessonsCompleted > 0 && (
            <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-600">Your Progress</span>
                <span className="font-medium text-blue-600">
                  {lessonsCompleted} of {terminologyModule.lessons.length} lessons completed
                </span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all"
                  style={{ width: `${(lessonsCompleted / terminologyModule.lessons.length) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Module */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Module Header */}
            <button
              onClick={() => setExpandedModule(!expandedModule)}
              className="w-full p-5 flex items-center gap-4 text-left transition-colors hover:bg-gray-50"
            >
              <div
                className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                  moduleComplete ? 'bg-green-100' : 'bg-blue-100'
                }`}
              >
                {moduleComplete ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <BookOpen className="w-5 h-5 text-blue-600" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  {moduleComplete && (
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                      Completed
                    </span>
                  )}
                  {isModuleQuizPassed && !moduleComplete && (
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                      Quiz Passed ({getModuleBestScore()}%)
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{terminologyModule.title}</h3>
                <p className="text-sm mt-1 text-gray-600">{terminologyModule.description}</p>
              </div>

              <div className="flex-shrink-0 flex items-center gap-3">
                <span className="text-sm text-gray-500">
                  {lessonsCompleted}/{terminologyModule.lessons.length} lessons
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-400 transition-transform ${expandedModule ? 'rotate-180' : ''}`}
                />
              </div>
            </button>

            {/* Lessons */}
            {expandedModule && (
              <div className="border-t border-gray-100 bg-gray-50">
                {terminologyModule.lessons.map((lesson) => {
                  const LessonIcon = contentTypeIcons[lesson.content_type];

                  return (
                    <Link
                      key={lesson.id}
                      to={`/terminology/${terminologyModule.slug}/${lesson.slug}`}
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
                {terminologyModule.quiz && (
                  <div className="border-t border-gray-200">
                    <Link
                      to={`/terminology/${terminologyModule.slug}/quiz`}
                      className="flex items-center gap-4 p-4 pl-16 hover:bg-gray-100 transition-colors"
                    >
                      <div
                        className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                          isModuleQuizPassed ? 'bg-green-100' : 'bg-blue-600'
                        }`}
                      >
                        {isModuleQuizPassed ? (
                          <Trophy className="w-4 h-4 text-green-600" />
                        ) : (
                          <ClipboardCheck className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900">{terminologyModule.quiz.title}</h4>
                        <p className="text-sm text-gray-500">
                          {isModuleQuizPassed
                            ? `Passed with ${getModuleBestScore()}%`
                            : `Pass with ${terminologyModule.quiz.passing_score}% to complete`}
                        </p>
                      </div>
                      <div className="flex-shrink-0 flex items-center gap-2">
                        {isModuleQuizPassed ? (
                          <span className="text-sm text-green-600 font-medium">Completed</span>
                        ) : (
                          <span className="text-sm text-gray-500">{terminologyModule.quiz.max_attempts} attempts</span>
                        )}
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </div>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Study Mode Prompt */}
          <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 mb-1">Practice with Study Mode</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Use interactive flashcards to practice roots, prefixes, suffixes, directions, and positions.
                </p>
                <button
                  onClick={() => setViewMode('study')}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Open Study Mode
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Study Mode - Flashcards */}
          <TerminologyView onTermSelect={setSelectedTerm} />

          {/* Term Detail Modal */}
          {/* Term Detail Modal */}
          {selectedTerm && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedTerm(null)}
            >
              <div
                className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <TermDetail term={selectedTerm} onClose={() => setSelectedTerm(null)} />
              </div>
            </div>
          )}
        </>
      )}
      </article>
    </>
  );
}
