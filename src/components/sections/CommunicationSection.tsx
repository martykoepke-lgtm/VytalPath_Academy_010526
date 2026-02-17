import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronRight, ChevronDown, BookOpen, FileText,
  CheckCircle, ClipboardCheck, Trophy, MessageCircle
} from 'lucide-react';
import { useProgress } from '../../contexts/ProgressContext';
import { SEO } from '../SEO';
import type { ContentType } from '../../types/course';

const communicationModules = [
  {
    id: 'comm-m1',
    slug: 'comm-foundations',
    title: 'Communication Foundations',
    description: 'Master the core principles of effective healthcare communication — styles, cycles, active listening, and nonverbal cues.',
    sort_order: 1,
    quiz: {
      id: 'comm-q1',
      title: 'Communication Foundations Quiz',
      description: 'Test your understanding of communication styles, active listening, and nonverbal cues',
      passing_score: 80,
      max_attempts: 3,
    },
    lessons: [
      { id: 'comm-l1', slug: 'communication-styles-and-cycle', title: 'Communication Styles & the Communication Cycle', description: 'Learn the four communication styles, the sender-message-receiver cycle, and how to relay information clearly.', content_type: 'reading' as ContentType, duration_minutes: 7 },
      { id: 'comm-l2', slug: 'active-listening-empathy', title: 'Active Listening & Showing Empathy', description: 'Techniques for truly hearing patients — paraphrasing, reflecting, and demonstrating empathy without overstepping.', content_type: 'reading' as ContentType, duration_minutes: 6 },
      { id: 'comm-l3', slug: 'nonverbal-communication', title: 'Nonverbal Communication & Body Language', description: 'Recognize and use facial expressions, posture, eye contact, personal space, and tone of voice effectively.', content_type: 'reading' as ContentType, duration_minutes: 6 },
    ],
  },
  {
    id: 'comm-m2',
    slug: 'patient-interactions',
    title: 'Patient Interactions',
    description: 'Navigate real patient conversations — from intake questioning to cultural sensitivity and medical language translation.',
    sort_order: 2,
    quiz: {
      id: 'comm-q2',
      title: 'Patient Interactions Quiz',
      description: 'Test your skills in patient questioning techniques, barrier navigation, and inclusive communication',
      passing_score: 80,
      max_attempts: 3,
    },
    lessons: [
      { id: 'comm-l4', slug: 'interviewing-techniques', title: 'Interviewing & Questioning Techniques', description: 'Use open-ended, closed-ended, probing, and screening questions — and know the boundaries of what you can ask.', content_type: 'reading' as ContentType, duration_minutes: 7 },
      { id: 'comm-l5', slug: 'communication-barriers', title: 'Overcoming Communication Barriers', description: 'Strategies for cultural differences, language barriers, cognitive levels, sensory disabilities, and age-related challenges.', content_type: 'reading' as ContentType, duration_minutes: 7 },
      { id: 'comm-l6', slug: 'gender-identity-inclusivity', title: 'Gender Identity & Inclusive Language', description: 'Understand gender identity vs. expression, preferred pronouns, and creating a welcoming environment for all patients.', content_type: 'reading' as ContentType, duration_minutes: 5 },
      { id: 'comm-l7', slug: 'medical-to-layman-terms', title: 'Translating Medical Language for Patients', description: 'Convert medical terminology into plain language patients understand — without losing accuracy.', content_type: 'reading' as ContentType, duration_minutes: 5 },
    ],
  },
  {
    id: 'comm-m3',
    slug: 'professional-standards',
    title: 'Professional Standards',
    description: 'Build the professional communication habits used in healthcare settings every day — presence, de-escalation, documentation, and digital etiquette.',
    sort_order: 3,
    quiz: {
      id: 'comm-q3',
      title: 'Professional Standards Quiz',
      description: 'Test your knowledge of professional conduct, de-escalation, and communication documentation',
      passing_score: 80,
      max_attempts: 3,
    },
    lessons: [
      { id: 'comm-l8', slug: 'professional-presence', title: 'Professional Presence & Workplace Conduct', description: 'Appearance, hygiene, demeanor, boundaries, language, and tone — the unwritten rules of healthcare professionalism.', content_type: 'reading' as ContentType, duration_minutes: 6 },
      { id: 'comm-l9', slug: 'difficult-situations-de-escalation', title: 'Handling Difficult Situations & De-escalation', description: 'Manage irate patients, custody disputes, chain of command issues, and know when and how to escalate.', content_type: 'reading' as ContentType, duration_minutes: 8 },
      { id: 'comm-l10', slug: 'telecom-email-messaging', title: 'Telephone, Email & Intraoffice Messaging', description: 'Phone etiquette, email standards, EHR messaging templates, chat protocols, and professional digital communication.', content_type: 'reading' as ContentType, duration_minutes: 7 },
      { id: 'comm-l11', slug: 'documentation-community-resources', title: 'Documenting Communications & Community Resources', description: 'How to document phone calls, patient interactions, and complaints — plus connecting patients to educational and community resources.', content_type: 'reading' as ContentType, duration_minutes: 6 },
    ],
  },
];

const communicationSeoConfig = {
  title: 'Patient Communication | VytalPath Academy',
  description: 'Build the communication skills healthcare teams rely on — from active listening and empathy to conflict de-escalation and professional documentation.',
  path: '/communication',
};

export function CommunicationSection() {
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
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

  const totalLessons = communicationModules.reduce((sum, m) => sum + m.lessons.length, 0);
  const completedLessons = communicationModules.reduce(
    (sum, m) => sum + m.lessons.filter((l) => progress.isLessonCompleted(l.slug)).length,
    0
  );

  const isModuleQuizPassed = (moduleSlug: string) => progress.hasPassedQuiz(moduleSlug);
  const getModuleBestScore = (moduleSlug: string) => progress.getBestQuizScore(moduleSlug);
  const isLessonDone = (lessonSlug: string) => progress.isLessonCompleted(lessonSlug);

  return (
    <>
      <SEO {...communicationSeoConfig} />
      <article className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 mb-4 bg-rose-100 rounded-3xl shadow-apple-sm">
            <MessageCircle className="w-10 h-10 text-rose-600" />
          </div>
          <h1 className="text-4xl font-semibold tracking-tight text-gray-900 mb-3">Patient Communication</h1>
          <p className="text-xl font-light text-gray-500 leading-relaxed max-w-2xl mx-auto">
            Build the communication skills healthcare teams rely on — from active listening to conflict de-escalation.
          </p>
        </header>

        {/* Progress Summary */}
        {completedLessons > 0 && (
          <div className="mb-6 bg-white rounded-2xl shadow-apple border-gray-200/50 p-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-600">Your Progress</span>
              <span className="font-medium text-rose-600">
                {completedLessons} of {totalLessons} lessons completed
              </span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-rose-500 rounded-full transition-all"
                style={{ width: `${(completedLessons / totalLessons) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Modules */}
        <section className="space-y-4" aria-label="Training Modules">
          {communicationModules.map((module, moduleIndex) => {
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
                      moduleComplete ? 'bg-green-100' : 'bg-rose-50'
                    }`}
                  >
                    <ModuleIcon
                      className={`w-5 h-5 ${moduleComplete ? 'text-green-600' : 'text-rose-600'}`}
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
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
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
                        to={`/communication/${module.slug}/${lesson.slug}`}
                        className="flex items-center gap-4 p-4 pl-16 hover:bg-gray-100 transition-colors"
                      >
                        <div
                          className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center ${
                            isLessonDone(lesson.slug) ? 'bg-green-100' : 'bg-rose-600'
                          }`}
                        >
                          {isLessonDone(lesson.slug) ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
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
                          to={`/communication/${module.slug}/quiz`}
                          className="flex items-center gap-4 p-4 pl-16 hover:bg-gray-100 transition-colors"
                        >
                          <div
                            className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                              quizPassed ? 'bg-green-100' : 'bg-rose-600'
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
