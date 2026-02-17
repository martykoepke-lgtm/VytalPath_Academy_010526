import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronRight, ChevronDown, BookOpen, FileText, Play,
  CheckCircle, GraduationCap, ClipboardCheck, Trophy, BookA, X, Puzzle
} from 'lucide-react';
import { useProgress } from '../../contexts/ProgressContext';
import { SEO, seoConfigs } from '../SEO';
import { TerminologyView } from '../TerminologyView';
import { TermDetail } from '../TermDetail';
import { TermBuilderWorkshop } from '../learning/TermBuilderWorkshop';
import type { MedicalTerm } from '../../types/medical';
import type { ContentType } from '../../types/course';

// Supabase Storage base URL for videos
const VIDEO_BASE_URL = 'https://vwieorhlcapeeamvltqa.supabase.co/storage/v1/object/public/videos';

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
    max_attempts: 0,
  },
  lessons: [
    {
      id: 'lv1',
      slug: 'common-abbreviations-video',
      title: 'Common Abbreviations in Healthcare',
      description: 'Master the abbreviations you will encounter daily in clinical settings.',
      content_type: 'video' as ContentType,
      video_url: `${VIDEO_BASE_URL}/term-abbrev.mp4`,
      duration_minutes: 5,
    },
    {
      id: 'lv2',
      slug: 'word-building-decoding-terms',
      title: 'Word Building: Decoding Medical Terms',
      description: 'Learn how to break down and understand medical terms using prefixes, roots, and suffixes.',
      content_type: 'video' as ContentType,
      video_url: `${VIDEO_BASE_URL}/termbuilding.mp4`,
      duration_minutes: 5,
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
    {
      id: 'l14',
      slug: 'do-not-use-abbreviations',
      title: 'The "Do Not Use" List',
      description: 'Learn the dangerous abbreviations banned by the Joint Commission — and why they can kill patients.',
      content_type: 'reading' as ContentType,
      duration_minutes: 12,
    },
    {
      id: 'l15',
      slug: 'body-systems-overview',
      title: 'Body Systems: Your Navigation Guide',
      description: 'Master anatomical directions and body system roots to decode medical terms and route information correctly.',
      content_type: 'reading' as ContentType,
      duration_minutes: 15,
    },
    {
      id: 'l16',
      slug: 'common-diseases-symptoms',
      title: 'What You\'ll Hear at the Front Desk',
      description: 'Recognize common symptoms by body system — and know when to escalate immediately.',
      content_type: 'reading' as ContentType,
      duration_minutes: 15,
    },
  ],
};

const contentTypeIcons: Record<ContentType, React.ElementType> = {
  video: Play,
  reading: FileText,
};

type ViewMode = 'lessons' | 'study' | 'builder';

export function TerminologySection() {
  const [viewMode, setViewMode] = useState<ViewMode>('lessons');
  const [expandedModule, setExpandedModule] = useState(false);
  const [selectedTerm, setSelectedTerm] = useState<MedicalTerm | null>(null);
  const [showSectionIntro, setShowSectionIntro] = useState(false);
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
          <div className="inline-flex items-center justify-center w-20 h-20 mb-4 bg-blue-100 rounded-3xl shadow-apple-sm">
            <BookA className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-4xl font-semibold tracking-tight text-gray-900 mb-3">Medical Terminology</h1>
          <p className="text-xl font-light text-gray-500 leading-relaxed max-w-2xl mx-auto">
            Master the language of healthcare. Learn prefixes, roots, suffixes, and common abbreviations used in clinical settings.
          </p>
        </header>

        {/* Section Introduction Video */}
        {showSectionIntro ? (
          <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between p-3 bg-gray-50 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <BookA className="w-4 h-4 text-blue-600" />
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
                <source src={`${VIDEO_BASE_URL}/termintro.mp4`} type="video/mp4" />
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
              <p className="text-sm text-gray-500">Watch a brief introduction to Medical Terminology</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        )}

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
          <button
            onClick={() => setViewMode('builder')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
              viewMode === 'builder'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <span className="flex items-center gap-2">
              <Puzzle className="w-4 h-4" />
              Term Builder
            </span>
          </button>
        </div>
      </div>

      {viewMode === 'builder' ? (
        <TermBuilderWorkshop />
      ) : viewMode === 'lessons' ? (
        <>
          {/* Progress Summary */}
          {lessonsCompleted > 0 && (
            <div className="mb-6 bg-white rounded-2xl shadow-apple border-gray-200/50 p-4">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-600">Your Progress</span>
                <span className="font-medium text-blue-600">
                  {lessonsCompleted} of {terminologyModule.lessons.length} lessons completed
                </span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all"
                  style={{ width: `${(lessonsCompleted / terminologyModule.lessons.length) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Module */}
          <div className="bg-white rounded-2xl shadow-apple border-gray-200/50 overflow-hidden hover-lift">
            {/* Module Header */}
            <button
              onClick={() => setExpandedModule(!expandedModule)}
              className="w-full p-5 flex items-center gap-4 text-left transition-colors hover:bg-gray-50"
            >
              <div
                className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center ${
                  moduleComplete ? 'bg-green-100' : 'bg-blue-50'
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
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">
                      Quiz Passed ({getModuleBestScore()}%)
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-medium text-gray-900">{terminologyModule.title}</h3>
                <p className="text-sm mt-1 text-gray-600">{terminologyModule.description}</p>
              </div>

              <div className="flex-shrink-0 flex items-center gap-3">
                <span className="text-sm text-gray-500">
                  {lessonsCompleted}/{terminologyModule.lessons.length} lessons
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${expandedModule ? 'rotate-180' : ''}`}
                />
              </div>
            </button>

            {/* Lessons */}
            {expandedModule && (
              <div className="border-t border-gray-100 bg-gray-50">
                {/* Video Lessons */}
                {terminologyModule.lessons
                  .filter((lesson) => lesson.content_type === 'video')
                  .map((lesson) => {
                    const LessonIcon = contentTypeIcons[lesson.content_type];

                    return (
                      <Link
                        key={lesson.id}
                        to={`/terminology/${terminologyModule.slug}/${lesson.slug}`}
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

                {/* Separator between Video and Reading Lessons */}
                <div className="mx-4 my-3 flex items-center gap-3">
                  <div className="flex-1 h-px bg-gray-300"></div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full">
                    <FileText className="w-3.5 h-3.5 text-gray-500" />
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Reading Materials</span>
                  </div>
                  <div className="flex-1 h-px bg-gray-300"></div>
                </div>

                {/* Reading Lessons */}
                {terminologyModule.lessons
                  .filter((lesson) => lesson.content_type === 'reading')
                  .map((lesson) => {
                    const LessonIcon = contentTypeIcons[lesson.content_type];

                    return (
                      <Link
                        key={lesson.id}
                        to={`/terminology/${terminologyModule.slug}/${lesson.slug}`}
                        className="flex items-center gap-4 p-4 pl-16 hover:bg-gray-100 transition-colors"
                      >
                        <div
                          className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center ${
                            isLessonDone(lesson.slug) ? 'bg-green-100' : 'bg-gray-500'
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
                          <span className="text-sm text-gray-500">Unlimited retakes</span>
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
          <div className="mt-8 p-6 bg-blue-50/50 rounded-2xl border border-blue-100">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 mb-1">Practice with Study Mode</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Use interactive flashcards to practice roots, prefixes, suffixes, directions, and positions.
                </p>
                <button
                  onClick={() => setViewMode('study')}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-2xl hover:bg-blue-700 shadow-apple-sm transition-colors"
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
