import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronRight, ChevronDown, BookOpen, Play, FileText,
  CheckCircle, ClipboardCheck, Trophy, Workflow, ListChecks
} from 'lucide-react';
import { useProgress } from '../../contexts/ProgressContext';
import { SEO, seoConfigs } from '../SEO';
import type { ContentType } from '../../types/course';

// Workflow lessons from Registration & Scheduling scripts
const workflowModules = [
  {
    id: 'm-reg-sched',
    slug: 'registration-scheduling',
    title: 'Registration & Scheduling',
    description: 'Master patient registration and appointment scheduling workflows for front office operations.',
    sort_order: 1,
    quiz: {
      id: 'q-reg-sched',
      title: 'Registration & Scheduling Quiz',
      description: 'Test your knowledge of patient registration and scheduling procedures',
      passing_score: 80,
      max_attempts: 3,
    },
    lessons: [
      {
        id: 'wl1',
        slug: 'new-patient-registration',
        title: 'New Patient Registration & Scheduling',
        description: 'Learn the complete process for registering new patients and scheduling their first appointments.',
        content_type: 'video' as ContentType,
        video_url: null, // Video pending
        duration_minutes: 5,
      },
      {
        id: 'wl2',
        slug: 'existing-patient-scheduling',
        title: 'Existing Patient Scheduling',
        description: 'Master the workflow for scheduling appointments for established patients efficiently.',
        content_type: 'video' as ContentType,
        video_url: null, // Video pending
        duration_minutes: 4,
      },
      {
        id: 'wl3',
        slug: 'follow-ups-recalls',
        title: 'Scheduling Follow-Ups & Recalls',
        description: 'Learn to schedule follow-up appointments and manage patient recall lists.',
        content_type: 'video' as ContentType,
        video_url: null, // Video pending
        duration_minutes: 4,
      },
      {
        id: 'wl4',
        slug: 'appointment-reminders',
        title: 'Appointment Reminder Calls',
        description: 'Best practices for making appointment reminder calls and reducing no-shows.',
        content_type: 'video' as ContentType,
        video_url: null, // Video pending
        duration_minutes: 4,
      },
    ],
  },
];

const contentTypeIcons: Record<ContentType, React.ElementType> = {
  video: Play,
  reading: FileText,
};

type ViewMode = 'lessons' | 'sops';

export function WorkflowsSection() {
  const [viewMode, setViewMode] = useState<ViewMode>('lessons');
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set(['m-reg-sched']));
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

  const totalLessons = workflowModules.reduce((sum, m) => sum + m.lessons.length, 0);
  const completedLessons = workflowModules.reduce(
    (sum, m) => sum + m.lessons.filter((l) => progress.isLessonCompleted(l.slug)).length,
    0
  );

  const isModuleQuizPassed = (moduleSlug: string) => progress.hasPassedQuiz(moduleSlug);
  const getModuleBestScore = (moduleSlug: string) => progress.getBestQuizScore(moduleSlug);
  const isLessonDone = (lessonSlug: string) => progress.isLessonCompleted(lessonSlug);

  return (
    <>
      <SEO {...seoConfigs.workflows} />
      <article className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl">
            <Workflow className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Navigating Workflows</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Learn the standard procedures for front office operations. Watch video lessons and reference step-by-step workflow guides.
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
              Video Lessons
            </span>
          </button>
          <button
            onClick={() => setViewMode('sops')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
              viewMode === 'sops'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <span className="flex items-center gap-2">
              <ListChecks className="w-4 h-4" />
              Quick Reference
            </span>
          </button>
        </div>
      </div>

      {viewMode === 'lessons' ? (
        <>
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

          {/* Coming Soon Notice */}
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <div className="flex items-center gap-3">
              <Play className="w-5 h-5 text-amber-600" />
              <p className="text-sm text-amber-800">
                <strong>Videos Coming Soon:</strong> Lesson videos are currently in production. Check back soon!
              </p>
            </div>
          </div>

          {/* Modules */}
          <div className="space-y-4">
            {workflowModules.map((module, moduleIndex) => {
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
                        const isAvailable = lesson.video_url !== null;

                        return isAvailable ? (
                          <Link
                            key={lesson.id}
                            to={`/workflows/lessons/${module.slug}/${lesson.slug}`}
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
                          <div
                            key={lesson.id}
                            className="flex items-center gap-4 p-4 pl-16 opacity-60"
                          >
                            <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center bg-gray-200">
                              <LessonIcon className="w-4 h-4 text-gray-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-gray-500">{lesson.title}</h4>
                              <p className="text-sm text-gray-400 line-clamp-1">{lesson.description}</p>
                            </div>
                            <div className="flex-shrink-0 text-sm text-amber-600 font-medium">
                              Coming Soon
                            </div>
                          </div>
                        );
                      })}

                      {/* Quiz - disabled until videos are ready */}
                      {module.quiz && (
                        <div className="border-t border-gray-200">
                          <div className="flex items-center gap-4 p-4 pl-16 opacity-60">
                            <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center bg-gray-200">
                              <ClipboardCheck className="w-4 h-4 text-gray-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-gray-500">{module.quiz.title}</h4>
                              <p className="text-sm text-gray-400">
                                Complete all lessons to unlock the quiz
                              </p>
                            </div>
                            <div className="flex-shrink-0 text-sm text-gray-400">
                              Locked
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Quick Reference Prompt */}
          <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                <ListChecks className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 mb-1">Quick Reference Guides</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Need a quick refresher? Browse step-by-step workflow guides for common front office procedures.
                </p>
                <button
                  onClick={() => setViewMode('sops')}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  View Quick Reference
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* SOPs / Quick Reference View */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <ListChecks className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">Workflow Quick Reference</h2>
            </div>
            <p className="text-gray-600 mb-6">
              Step-by-step guides for common front office procedures. Use these as a quick reference while performing daily tasks.
            </p>
            <Link
              to="/workflows/sops"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse All Workflows
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Common Workflows Preview */}
          <nav className="mt-6 grid gap-4 sm:grid-cols-2" aria-label="Quick Reference Links">
            <Link
              to="/workflows/sops/patient-check-in"
              className="p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all"
            >
              <h3 className="font-semibold text-gray-900 mb-1">Patient Check-In</h3>
              <p className="text-sm text-gray-600">Standard check-in procedure for patient arrivals</p>
            </Link>
            <Link
              to="/workflows/sops/patient-check-out"
              className="p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all"
            >
              <h3 className="font-semibold text-gray-900 mb-1">Patient Check-Out</h3>
              <p className="text-sm text-gray-600">Complete the visit and schedule follow-ups</p>
            </Link>
            <Link
              to="/workflows/sops/insurance-verification"
              className="p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all"
            >
              <h3 className="font-semibold text-gray-900 mb-1">Insurance Verification</h3>
              <p className="text-sm text-gray-600">Verify patient eligibility and benefits</p>
            </Link>
            <Link
              to="/workflows/sops/scheduling-appointment"
              className="p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all"
            >
              <h3 className="font-semibold text-gray-900 mb-1">Scheduling Appointments</h3>
              <p className="text-sm text-gray-600">Book new and follow-up appointments</p>
            </Link>
          </nav>
        </>
      )}
      </article>
    </>
  );
}
