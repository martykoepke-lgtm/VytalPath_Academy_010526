import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronRight, ChevronDown, Play, FileText,
  CheckCircle, Workflow, ListChecks, X, Calendar, Clock
} from 'lucide-react';
import { useProgress } from '../../contexts/ProgressContext';
import { SEO, seoConfigs } from '../SEO';
import type { ContentType } from '../../types/course';
import { SOPModal, type SOPContent } from '../workflows/SOPModal';
import { getSOPBySlug } from '../../data/sopContent';

// Supabase Storage base URL for videos
const VIDEO_BASE_URL = 'https://vwieorhlcapeeamvltqa.supabase.co/storage/v1/object/public/videos';

// Workflow modules organized by phase
// Each video lesson has a companion written SOP

interface WorkflowLesson {
  id: string;
  slug: string;
  title: string;
  description: string;
  content_type: ContentType;
  video_url: string | null;
  duration_minutes: number;
  sop_slug?: string; // Link to companion written SOP
  sop_title?: string;
}

interface WorkflowPhase {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: 'calendar' | 'clock';
  lessons: WorkflowLesson[];
}

// BEFORE THE VISIT - Video modules with written SOP companions
// Note: Insurance eligibility verification is built into the New Patient Registration SOP
const beforeVisitPhase: WorkflowPhase = {
  id: 'before-visit',
  slug: 'before-visit',
  title: 'Before the Visit',
  description: 'Registration, scheduling, and pre-visit preparation workflows.',
  icon: 'calendar',
  lessons: [
    {
      id: 'wl1',
      slug: 'new-patient-registration',
      title: 'New Patient Registration & Scheduling',
      description: 'Complete registration process including demographics, insurance collection, eligibility verification, and appointment booking.',
      content_type: 'video' as ContentType,
      video_url: `${VIDEO_BASE_URL}/new_pt_reg.mp4`,
      duration_minutes: 5,
      sop_slug: 'new-patient-registration-sop',
      sop_title: 'Written SOP: New Patient Registration (includes eligibility)',
    },
    {
      id: 'wl2',
      slug: 'existing-patient-scheduling',
      title: 'Existing Patient Scheduling',
      description: 'Streamlined scheduling for established patients including info verification and insurance updates.',
      content_type: 'video' as ContentType,
      video_url: `${VIDEO_BASE_URL}/est-pt-scheduling.mp4`,
      duration_minutes: 4,
      sop_slug: 'existing-patient-scheduling-sop',
      sop_title: 'Written SOP: Existing Patient Scheduling',
    },
    {
      id: 'wl3',
      slug: 'appointment-reminders',
      title: 'Appointment Reminder Calls',
      description: 'Reminder workflows, pre-visit preparation, and reducing no-shows.',
      content_type: 'video' as ContentType,
      video_url: `${VIDEO_BASE_URL}/reminder-calls.mp4`,
      duration_minutes: 4,
      sop_slug: 'reminder-calls-sop',
      sop_title: 'Written SOP: Reminder Calls & Pre-Visit Prep',
    },
  ],
};

// DURING THE VISIT - Check-in and Check-out procedures
const duringVisitPhase: WorkflowPhase = {
  id: 'during-visit',
  slug: 'during-visit',
  title: 'During the Visit',
  description: 'Check-in and check-out procedures for all patient types.',
  icon: 'clock',
  lessons: [
    {
      id: 'wl-b',
      slug: 'new-patient-check-in',
      title: 'New Patient Check-In',
      description: 'Comprehensive check-in process for new patients with scheduled appointments.',
      content_type: 'reading' as ContentType,
      video_url: null,
      duration_minutes: 12,
      sop_slug: 'patient-check-in',
    },
    {
      id: 'wl-c',
      slug: 'existing-patient-check-in',
      title: 'Existing Patient Check-In',
      description: 'Streamlined check-in process for established patients.',
      content_type: 'reading' as ContentType,
      video_url: null,
      duration_minutes: 8,
      sop_slug: 'existing-patient-check-in',
    },
    {
      id: 'wl-d',
      slug: 'urgent-walk-in-check-in',
      title: 'Urgent Care / Walk-In Check-In',
      description: 'Rapid check-in protocol for urgent, same-day, and walk-in patients.',
      content_type: 'reading' as ContentType,
      video_url: null,
      duration_minutes: 10,
      sop_slug: 'urgent-walk-in-check-in',
    },
    {
      id: 'wl-h',
      slug: 'patient-check-out',
      title: 'Patient Check-Out Procedures',
      description: 'Complete checkout workflow including scheduling, payments, and follow-up.',
      content_type: 'reading' as ContentType,
      video_url: null,
      duration_minutes: 8,
      sop_slug: 'patient-check-out',
    },
  ],
};

// THROUGHOUT THE DAY - Daily operations and schedule management
const throughoutDayPhase: WorkflowPhase = {
  id: 'throughout-day',
  slug: 'throughout-day',
  title: 'Throughout the Day',
  description: 'Managing schedule changes, prioritizing tasks, and handling daily operations.',
  icon: 'clock',
  lessons: [
    {
      id: 'wl-e',
      slug: 'no-shows-late-arrivals',
      title: 'No-Shows and Late Arrivals',
      description: 'Procedures for managing late arrivals, no-shows, and schedule optimization.',
      content_type: 'reading' as ContentType,
      video_url: null,
      duration_minutes: 8,
      sop_slug: 'no-shows-late-arrivals',
    },
    {
      id: 'wl-f',
      slug: 'waitlists-same-day-add-ons',
      title: 'Waitlists and Same-Day Add-Ons',
      description: 'Strategies for waitlist management and handling same-day appointment requests.',
      content_type: 'reading' as ContentType,
      video_url: null,
      duration_minutes: 8,
      sop_slug: 'waitlists-same-day',
    },
    {
      id: 'wl-g',
      slug: 'balancing-phones-messages-walk-ins',
      title: 'Balancing Phones, Messages, and Walk-Ins',
      description: 'Strategies for managing multiple demands and maintaining efficiency.',
      content_type: 'reading' as ContentType,
      video_url: null,
      duration_minutes: 10,
      sop_slug: 'balancing-tasks',
    },
  ],
};

const workflowPhases = [beforeVisitPhase, duringVisitPhase, throughoutDayPhase];

const contentTypeIcons: Record<ContentType, React.ElementType> = {
  video: Play,
  reading: FileText,
};

export function WorkflowsSection() {
  const [expandedPhases, setExpandedPhases] = useState<Set<string>>(new Set(['before-visit', 'during-visit']));
  const [showSectionIntro, setShowSectionIntro] = useState(false);
  const [selectedSOP, setSelectedSOP] = useState<SOPContent | null>(null);
  const progress = useProgress();

  const openSOP = (slug: string) => {
    const sop = getSOPBySlug(slug);
    if (sop) {
      setSelectedSOP(sop);
    }
  };

  const closeSOP = () => {
    setSelectedSOP(null);
  };

  const togglePhase = (phaseId: string) => {
    setExpandedPhases((prev) => {
      const next = new Set(prev);
      if (next.has(phaseId)) {
        next.delete(phaseId);
      } else {
        next.add(phaseId);
      }
      return next;
    });
  };

  const totalLessons = workflowPhases.reduce((sum, p) => sum + p.lessons.length, 0);
  const completedLessons = workflowPhases.reduce(
    (sum, p) => sum + p.lessons.filter((l) => progress.isLessonCompleted(l.slug)).length,
    0
  );

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

        {/* Section Introduction Video */}
        {showSectionIntro ? (
          <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between p-3 bg-gray-50 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Workflow className="w-4 h-4 text-blue-600" />
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
                <source src={`${VIDEO_BASE_URL}/wfintro.mp4`} type="video/mp4" />
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
              <p className="text-sm text-gray-500">Watch a brief introduction to Navigating Workflows</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        )}

        {/* Learning Sequence Guide */}
        <div className="mb-8 p-4 bg-blue-50 rounded-xl border border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-2">How to Use This Section</h3>
          <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
            <li><strong>Watch the video</strong> first for an overview of the workflow</li>
            <li><strong>Read the written SOP</strong> for detailed step-by-step guidance</li>
            <li><strong>Use the SOP as a desk reference</strong> during live work until the process becomes second nature</li>
          </ol>
        </div>

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

        {/* Workflow Phases */}
        <div className="space-y-6">
          {workflowPhases.map((phase) => {
            const isExpanded = expandedPhases.has(phase.id);
            const phaseCompleted = phase.lessons.filter((l) => isLessonDone(l.slug)).length;
            const PhaseIcon = phase.icon === 'calendar' ? Calendar : Clock;
            const videoLessons = phase.lessons.filter((l) => l.content_type === 'video');
            const readingLessons = phase.lessons.filter((l) => l.content_type === 'reading');

            return (
              <div
                key={phase.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
              >
                {/* Phase Header */}
                <button
                  onClick={() => togglePhase(phase.id)}
                  className="w-full p-5 flex items-center gap-4 text-left transition-colors hover:bg-gray-50"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center bg-blue-100">
                    <PhaseIcon className="w-5 h-5 text-blue-600" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900">{phase.title}</h3>
                    <p className="text-sm mt-1 text-gray-600">{phase.description}</p>
                  </div>

                  <div className="flex-shrink-0 flex items-center gap-3">
                    <span className="text-sm text-gray-500">
                      {phaseCompleted}/{phase.lessons.length} complete
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                    />
                  </div>
                </button>

                {/* Lessons */}
                {isExpanded && (
                  <div className="border-t border-gray-100 bg-gray-50">
                    {/* Video Lessons with SOP Companions */}
                    {videoLessons.length > 0 && videoLessons.map((lesson) => (
                      <div key={lesson.id} className="border-b border-gray-100 last:border-b-0">
                        {/* Video Lesson */}
                        <Link
                          to={`/workflows/lessons/registration-scheduling/${lesson.slug}`}
                          className="flex items-center gap-4 p-4 pl-8 hover:bg-gray-100 transition-colors"
                        >
                          <div
                            className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                              isLessonDone(lesson.slug) ? 'bg-green-100' : 'bg-blue-600'
                            }`}
                          >
                            {isLessonDone(lesson.slug) ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                              <Play className="w-4 h-4 text-white" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900">{lesson.title}</h4>
                            <p className="text-sm text-gray-500 line-clamp-1">{lesson.description}</p>
                          </div>
                          <div className="flex-shrink-0 flex items-center gap-3 text-sm text-gray-500">
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium">Video</span>
                            <span>{lesson.duration_minutes} min</span>
                            <ChevronRight className="w-4 h-4" />
                          </div>
                        </Link>

                        {/* Companion Written SOP */}
                        {lesson.sop_slug && (
                          <button
                            onClick={() => openSOP(lesson.sop_slug!)}
                            className="w-full flex items-center gap-4 p-3 pl-16 bg-gray-100/50 hover:bg-gray-100 transition-colors border-t border-gray-100 text-left"
                          >
                            <div className="flex-shrink-0 w-6 h-6 rounded flex items-center justify-center bg-gray-200">
                              <FileText className="w-3.5 h-3.5 text-gray-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <span className="text-sm text-gray-700">{lesson.sop_title || 'Written SOP Companion'}</span>
                            </div>
                            <div className="flex-shrink-0 flex items-center gap-2 text-xs text-gray-500">
                              <span className="px-2 py-0.5 bg-gray-200 text-gray-600 rounded font-medium">SOP</span>
                              <ChevronRight className="w-3 h-3" />
                            </div>
                          </button>
                        )}
                      </div>
                    ))}

                    {/* Separator if both video and reading lessons exist */}
                    {videoLessons.length > 0 && readingLessons.length > 0 && (
                      <div className="mx-4 my-3 flex items-center gap-3">
                        <div className="flex-1 h-px bg-gray-300"></div>
                        <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full">
                          <FileText className="w-3.5 h-3.5 text-gray-500" />
                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Written SOPs</span>
                        </div>
                        <div className="flex-1 h-px bg-gray-300"></div>
                      </div>
                    )}

                    {/* Reading/SOP-only Lessons */}
                    {readingLessons.map((lesson) => (
                      <button
                        key={lesson.id}
                        onClick={() => lesson.sop_slug && openSOP(lesson.sop_slug)}
                        className="w-full flex items-center gap-4 p-4 pl-8 hover:bg-gray-100 transition-colors text-left"
                      >
                        <div
                          className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                            isLessonDone(lesson.slug) ? 'bg-green-100' : 'bg-gray-500'
                          }`}
                        >
                          {isLessonDone(lesson.slug) ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <FileText className="w-4 h-4 text-white" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900">{lesson.title}</h4>
                          <p className="text-sm text-gray-500 line-clamp-1">{lesson.description}</p>
                        </div>
                        <div className="flex-shrink-0 flex items-center gap-3 text-sm text-gray-500">
                          <span className="px-2 py-0.5 bg-gray-200 text-gray-600 rounded text-xs font-medium">SOP</span>
                          <span>{lesson.duration_minutes} min</span>
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Browse All SOPs Link */}
        <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
              <ListChecks className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 mb-1">All Workflow SOPs</h3>
              <p className="text-sm text-gray-600 mb-3">
                Browse the complete collection of step-by-step workflow guides for front office procedures.
              </p>
              <Link
                to="/workflows/sops"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Browse All SOPs
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </article>

      {/* SOP Modal */}
      {selectedSOP && (
        <SOPModal sop={selectedSOP} onClose={closeSOP} />
      )}
    </>
  );
}
