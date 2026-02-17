import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronRight, ChevronDown, Play, FileText,
  CheckCircle, ClipboardList, ListChecks, X, Calendar, Clock,
  Sunrise, Moon, ListOrdered, FolderOpen, Trophy, ClipboardCheck
} from 'lucide-react';
import { useProgress } from '../../contexts/ProgressContext';
import { SEO, seoConfigs } from '../SEO';
import type { ContentType } from '../../types/course';
import { SOPModal, type SOPContent } from '../workflows/SOPModal';
import { getSOPBySlug } from '../../data/sopContent';
import { WorkflowSequencer } from '../learning/WorkflowSequencer';

// Supabase Storage base URL for videos
const VIDEO_BASE_URL = 'https://vwieorhlcapeeamvltqa.supabase.co/storage/v1/object/public/videos';

interface WorkflowLesson {
  id: string;
  slug: string;
  title: string;
  description: string;
  content_type: ContentType;
  video_url: string | null;
  duration_minutes: number;
  sop_slug?: string;
  sop_title?: string;
}

interface WorkflowPhase {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: React.ElementType;
  lessons: WorkflowLesson[];
}

// ─── PHASE 1: OPENING THE OFFICE ───
const openingPhase: WorkflowPhase = {
  id: 'opening',
  slug: 'opening',
  title: 'Opening the Office',
  description: 'Morning setup procedures to start the day smoothly.',
  icon: Sunrise,
  lessons: [
    {
      id: 'admin-1',
      slug: 'phone-system-login',
      title: 'Phone System Login & Setup',
      description: 'Morning phone system setup enables call tracking, routing, and message retrieval.',
      content_type: 'reading' as ContentType,
      video_url: null,
      duration_minutes: 8,
      sop_slug: 'phone-system-login',
    },
    {
      id: 'admin-2',
      slug: 'cash-drawer-opening',
      title: 'Cash Drawer Opening',
      description: 'Proper cash drawer setup ensures accurate financial tracking throughout the day.',
      content_type: 'reading' as ContentType,
      video_url: null,
      duration_minutes: 10,
      sop_slug: 'cash-drawer-opening',
    },
    {
      id: 'admin-3',
      slug: 'pre-scrubbing-schedule',
      title: 'Pre-Scrubbing the Schedule',
      description: 'Pre-scrubbing reduces day-of surprises and ensures smooth patient flow.',
      content_type: 'reading' as ContentType,
      video_url: null,
      duration_minutes: 12,
      sop_slug: 'pre-scrubbing-schedule',
    },
  ],
};

// ─── PHASE 2: BEFORE THE VISIT ───
const beforeVisitPhase: WorkflowPhase = {
  id: 'before-visit',
  slug: 'before-visit',
  title: 'Before the Visit',
  description: 'Registration, scheduling, and pre-visit preparation workflows.',
  icon: Calendar,
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

// ─── PHASE 3: DURING THE VISIT ───
const duringVisitPhase: WorkflowPhase = {
  id: 'during-visit',
  slug: 'during-visit',
  title: 'During the Visit',
  description: 'Check-in and check-out procedures for all patient types.',
  icon: Clock,
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

// ─── PHASE 4: THROUGHOUT THE DAY ───
const throughoutDayPhase: WorkflowPhase = {
  id: 'throughout-day',
  slug: 'throughout-day',
  title: 'Throughout the Day',
  description: 'Managing schedule changes, prioritizing tasks, and handling daily operations.',
  icon: Clock,
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

// ─── PHASE 5: CLOSING THE OFFICE ───
const closingPhase: WorkflowPhase = {
  id: 'closing',
  slug: 'closing',
  title: 'Closing the Office',
  description: 'End-of-day reconciliation and closing procedures.',
  icon: Moon,
  lessons: [
    {
      id: 'admin-4',
      slug: 'cash-drawer-closing',
      title: 'Cash Drawer Closing & Reconciliation',
      description: 'Accurate closing ensures financial integrity and protects you and the practice.',
      content_type: 'reading' as ContentType,
      video_url: null,
      duration_minutes: 12,
      sop_slug: 'cash-drawer-closing',
    },
    {
      id: 'admin-5',
      slug: 'eod-reconciliation',
      title: 'End-of-Day Reconciliation & Deposit',
      description: 'Daily financial reconciliation ensures accurate records and prepares deposits.',
      content_type: 'reading' as ContentType,
      video_url: null,
      duration_minutes: 15,
      sop_slug: 'eod-reconciliation',
    },
  ],
};

// ─── PHASE 6: ADMINISTRATIVE TASKS ───
const adminTasksPhase: WorkflowPhase = {
  id: 'admin-tasks',
  slug: 'admin-tasks',
  title: 'Administrative Tasks',
  description: 'Ongoing administrative duties and compliance requirements.',
  icon: ClipboardList,
  lessons: [
    {
      id: 'admin-6',
      slug: 'no-show-letters',
      title: 'No-Show Letters',
      description: 'Formal documentation of no-show occurrences per clinic policy.',
      content_type: 'reading' as ContentType,
      video_url: null,
      duration_minutes: 8,
      sop_slug: 'no-show-letters',
    },
    {
      id: 'admin-7',
      slug: 'ordering-supplies',
      title: 'Ordering Front Office Supplies',
      description: 'Maintaining adequate supplies ensures uninterrupted office operations.',
      content_type: 'reading' as ContentType,
      video_url: null,
      duration_minutes: 8,
      sop_slug: 'ordering-supplies',
    },
    {
      id: 'admin-8',
      slug: 'monthly-compliance-logs',
      title: 'Monthly Compliance Logs',
      description: 'Required monthly documentation for regulatory compliance.',
      content_type: 'reading' as ContentType,
      video_url: null,
      duration_minutes: 10,
      sop_slug: 'monthly-compliance-logs',
    },
  ],
};

// ─── PHASE 7: ADMINISTRATIVE SKILLS ───
const adminSkillsPhase: WorkflowPhase = {
  id: 'admin-skills',
  slug: 'admin-skills',
  title: 'Administrative Skills',
  description: 'Filing, correspondence, computer skills, ADA compliance, and system management.',
  icon: FolderOpen,
  lessons: [
    {
      id: 'ap-1',
      slug: 'filing-systems',
      title: 'Filing Systems in Healthcare',
      description: 'Alphabetical, color-coded, and terminal digit filing systems used in medical offices.',
      content_type: 'reading' as ContentType,
      video_url: null,
      duration_minutes: 10,
    },
    {
      id: 'ap-2',
      slug: 'business-correspondence',
      title: 'Business Correspondence & Templates',
      description: 'Professional letters, greetings, salutations, and common templates in medical offices.',
      content_type: 'reading' as ContentType,
      video_url: null,
      duration_minutes: 10,
    },
    {
      id: 'ap-3',
      slug: 'computer-skills-medical-office',
      title: 'Computer Skills for Medical Offices',
      description: 'Essential email, word processing, spreadsheet, and hardware skills for healthcare admin.',
      content_type: 'reading' as ContentType,
      video_url: null,
      duration_minutes: 12,
    },
    {
      id: 'ap-4',
      slug: 'ada-compliance',
      title: 'ADA Compliance in Healthcare',
      description: 'ADA requirements for medical offices — accessibility, accommodations, and service animals.',
      content_type: 'reading' as ContentType,
      video_url: null,
      duration_minutes: 12,
    },
    {
      id: 'ap-5',
      slug: 'data-storage-backup',
      title: 'Data Storage & Backup',
      description: 'Data storage requirements, backup procedures, and protecting health information systems.',
      content_type: 'reading' as ContentType,
      video_url: null,
      duration_minutes: 10,
    },
    {
      id: 'ap-6',
      slug: 'system-downtime-procedures',
      title: 'System Downtime Procedures',
      description: 'What to do when the EHR, internet, phones, or other systems go down.',
      content_type: 'reading' as ContentType,
      video_url: null,
      duration_minutes: 12,
    },
  ],
};

// All phases in natural daily flow order
const allPhases = [
  openingPhase,
  beforeVisitPhase,
  duringVisitPhase,
  throughoutDayPhase,
  closingPhase,
  adminTasksPhase,
  adminSkillsPhase,
];

export function WorkflowsSection() {
  const [expandedPhases, setExpandedPhases] = useState<Set<string>>(new Set());
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

  const totalLessons = allPhases.reduce((sum, p) => sum + p.lessons.length, 0);
  const completedLessons = allPhases.reduce(
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
          <div className="inline-flex items-center justify-center w-20 h-20 mb-4 bg-blue-100 rounded-3xl shadow-apple-sm">
            <ClipboardList className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-4xl font-semibold tracking-tight text-gray-900 mb-3">Front Office Workflows</h1>
          <p className="text-xl font-light text-gray-500 leading-relaxed max-w-2xl mx-auto">
            Master every procedure in your day — from opening the office to closing it down. Organized in the order you'll actually use them.
          </p>
        </header>

        {/* Section Introduction Video */}
        {showSectionIntro ? (
          <div className="mb-6 bg-white rounded-2xl shadow-apple border border-gray-200/50 overflow-hidden">
            <div className="flex items-center justify-between p-3 bg-gray-50 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-gray-900 text-sm">Section Overview</span>
              </div>
              <button
                onClick={() => setShowSectionIntro(false)}
                className="p-1 hover:bg-gray-200 rounded-2xl transition-all duration-300"
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
                <source src={`${VIDEO_BASE_URL}/FO_workflows2.mp4`} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowSectionIntro(true)}
            className="w-full mb-6 p-4 bg-white rounded-2xl border border-gray-200/50 hover:border-blue-200 hover:bg-blue-50/50 transition-all duration-300 flex items-center gap-4 text-left shadow-apple-sm"
          >
            <div className="flex-shrink-0 w-10 h-10 bg-blue-50 rounded-2xl flex items-center justify-center">
              <Play className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-900">Section Overview</h3>
              <p className="text-sm text-gray-500">Watch a brief introduction to Front Office Workflows</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        )}

        {/* Learning Sequence Guide */}
        <div className="mb-8 p-5 bg-blue-50/50 rounded-2xl border border-blue-100">
          <h3 className="font-medium text-gray-900 mb-2">How to Use This Section</h3>
          <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
            <li><strong>Watch the video</strong> first for an overview of the workflow (where available)</li>
            <li><strong>Read the written SOP</strong> for detailed step-by-step guidance</li>
            <li><strong>Use the SOP as a desk reference</strong> during live work until the process becomes second nature</li>
          </ol>
        </div>

        {/* Progress Summary */}
        {completedLessons > 0 && (
          <div className="mb-6 bg-white rounded-2xl shadow-apple border border-gray-200/50 p-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-500">Your Progress</span>
              <span className="font-medium text-blue-600">
                {completedLessons} of {totalLessons} procedures completed
              </span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${(completedLessons / totalLessons) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Workflow Phases */}
        <div className="space-y-4">
          {allPhases.map((phase) => {
            const isExpanded = expandedPhases.has(phase.id);
            const phaseCompleted = phase.lessons.filter((l) => isLessonDone(l.slug)).length;
            const PhaseIcon = phase.icon;
            const videoLessons = phase.lessons.filter((l) => l.content_type === 'video');
            const readingLessons = phase.lessons.filter((l) => l.content_type === 'reading');

            return (
              <div
                key={phase.id}
                className="bg-white rounded-2xl shadow-apple border border-gray-200/50 overflow-hidden hover-lift transition-all duration-300"
              >
                {/* Phase Header */}
                <button
                  onClick={() => togglePhase(phase.id)}
                  className="w-full p-5 flex items-center gap-4 text-left transition-all duration-300 hover:bg-gray-50"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center bg-blue-50">
                    <PhaseIcon className="w-5 h-5 text-blue-600" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-medium text-gray-900">{phase.title}</h3>
                    <p className="text-sm mt-0.5 text-gray-500">{phase.description}</p>
                  </div>

                  <div className="flex-shrink-0 flex items-center gap-3">
                    <span className="text-sm text-gray-400">
                      {phaseCompleted}/{phase.lessons.length}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                    />
                  </div>
                </button>

                {/* Lessons */}
                {isExpanded && (
                  <div className="border-t border-gray-100 bg-gray-50/50">
                    {/* Video Lessons with SOP Companions */}
                    {videoLessons.map((lesson) => (
                      <div key={lesson.id} className="border-b border-gray-100 last:border-b-0">
                        {/* Video Lesson */}
                        <Link
                          to={`/workflows/lessons/registration-scheduling/${lesson.slug}`}
                          className="flex items-center gap-4 p-4 pl-8 hover:bg-gray-100 transition-all duration-300"
                        >
                          <div
                            className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center ${
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
                            <h4 className="font-normal text-gray-900">{lesson.title}</h4>
                            <p className="text-sm text-gray-500 line-clamp-1">{lesson.description}</p>
                          </div>
                          <div className="flex-shrink-0 flex items-center gap-3 text-sm text-gray-500">
                            <span className="px-2.5 py-0.5 bg-blue-50 text-blue-600 rounded-full text-xs font-medium">Video</span>
                            <span>{lesson.duration_minutes} min</span>
                            <ChevronRight className="w-4 h-4" />
                          </div>
                        </Link>

                        {/* Companion Written SOP */}
                        {lesson.sop_slug && (
                          <button
                            onClick={() => openSOP(lesson.sop_slug!)}
                            className="w-full flex items-center gap-4 p-3 pl-16 bg-gray-100/50 hover:bg-gray-100 transition-all duration-300 border-t border-gray-100 text-left"
                          >
                            <div className="flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center bg-gray-200">
                              <FileText className="w-3.5 h-3.5 text-gray-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <span className="text-sm text-gray-600">{lesson.sop_title || 'Written SOP Companion'}</span>
                            </div>
                            <div className="flex-shrink-0 flex items-center gap-2 text-xs text-gray-400">
                              <span className="px-2 py-0.5 bg-gray-200 text-gray-600 rounded-full font-medium">SOP</span>
                              <ChevronRight className="w-3 h-3" />
                            </div>
                          </button>
                        )}
                      </div>
                    ))}

                    {/* Separator if both video and reading lessons exist */}
                    {videoLessons.length > 0 && readingLessons.length > 0 && (
                      <div className="mx-4 my-3 flex items-center gap-3">
                        <div className="flex-1 h-px bg-gray-200"></div>
                        <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full">
                          <FileText className="w-3.5 h-3.5 text-gray-400" />
                          <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Written SOPs</span>
                        </div>
                        <div className="flex-1 h-px bg-gray-200"></div>
                      </div>
                    )}

                    {/* Reading/SOP-only Lessons */}
                    {readingLessons.map((lesson) => {
                      // Reading lessons with sop_slug open the SOP modal; without sop_slug, link to LessonPlayer
                      if (lesson.sop_slug) {
                        return (
                          <button
                            key={lesson.id}
                            onClick={() => openSOP(lesson.sop_slug!)}
                            className="w-full flex items-center gap-4 p-4 pl-8 hover:bg-gray-100 transition-all duration-300 text-left border-b border-gray-100 last:border-b-0"
                          >
                            <div
                              className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center ${
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
                              <h4 className="font-normal text-gray-900">{lesson.title}</h4>
                              <p className="text-sm text-gray-500 line-clamp-1">{lesson.description}</p>
                            </div>
                            <div className="flex-shrink-0 flex items-center gap-3 text-sm text-gray-500">
                              <span className="px-2.5 py-0.5 bg-gray-200 text-gray-600 rounded-full text-xs font-medium">SOP</span>
                              <span>{lesson.duration_minutes} min</span>
                              <ChevronRight className="w-4 h-4" />
                            </div>
                          </button>
                        );
                      }
                      // Reading lesson without SOP — link to LessonPlayer
                      return (
                        <Link
                          key={lesson.id}
                          to={`/workflows/lessons/admin-procedures/${lesson.slug}`}
                          className="flex items-center gap-4 p-4 pl-8 hover:bg-gray-100 transition-all duration-300 border-b border-gray-100 last:border-b-0"
                        >
                          <div
                            className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center ${
                              isLessonDone(lesson.slug) ? 'bg-green-100' : 'bg-blue-600'
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
                            <span className="px-2.5 py-0.5 bg-blue-50 text-blue-600 rounded-full text-xs font-medium">Reading</span>
                            <span>{lesson.duration_minutes} min</span>
                            <ChevronRight className="w-4 h-4" />
                          </div>
                        </Link>
                      );
                    })}

                    {/* Quiz link for phases with quizzes */}
                    {phase.id === 'admin-skills' && (
                      <div className="border-t border-gray-200">
                        <Link
                          to="/workflows/lessons/admin-procedures/quiz"
                          className="flex items-center gap-4 p-4 pl-8 hover:bg-gray-100 transition-all duration-300"
                        >
                          <div
                            className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center ${
                              progress.hasPassedQuiz('admin-procedures') ? 'bg-green-100' : 'bg-blue-600'
                            }`}
                          >
                            {progress.hasPassedQuiz('admin-procedures') ? (
                              <Trophy className="w-4 h-4 text-green-600" />
                            ) : (
                              <ClipboardCheck className="w-4 h-4 text-white" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900">Administrative Skills Quiz</h4>
                            <p className="text-sm text-gray-500">
                              {progress.hasPassedQuiz('admin-procedures')
                                ? `Passed with ${progress.getBestQuizScore('admin-procedures')}%`
                                : 'Pass with 80% to complete this section'}
                            </p>
                          </div>
                          <div className="flex-shrink-0 flex items-center gap-2">
                            {progress.hasPassedQuiz('admin-procedures') ? (
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
            );
          })}
        </div>

        {/* Interactive Practice */}
        <div className="mt-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <ListOrdered className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-medium text-gray-900">Interactive Practice</h2>
              <p className="text-sm text-gray-500">Test your knowledge by ordering workflow steps correctly</p>
            </div>
          </div>
          <WorkflowSequencer />
        </div>

        {/* Browse All SOPs Link */}
        <div className="mt-8 p-6 bg-blue-50/50 rounded-2xl border border-blue-100">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center">
              <ListChecks className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-900 mb-1">All Workflow SOPs</h3>
              <p className="text-sm text-gray-500 mb-3">
                Browse the complete collection of step-by-step workflow guides for front office procedures.
              </p>
              <Link
                to="/workflows/sops"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-medium rounded-2xl hover:bg-blue-700 shadow-apple-sm transition-all duration-300"
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
