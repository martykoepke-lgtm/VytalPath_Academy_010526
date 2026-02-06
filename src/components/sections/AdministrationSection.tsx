import { useState } from 'react';
import {
  ChevronRight, ChevronDown, FileText,
  CheckCircle, Sunrise, Moon, ClipboardList, Building2
} from 'lucide-react';
import { useProgress } from '../../contexts/ProgressContext';
import { SEO, seoConfigs } from '../SEO';
import type { ContentType } from '../../types/course';
import { SOPModal, type SOPContent } from '../workflows/SOPModal';
import { getSOPBySlug } from '../../data/sopContent';

// Administration modules organized by phase

interface AdminLesson {
  id: string;
  slug: string;
  title: string;
  description: string;
  content_type: ContentType;
  duration_minutes: number;
  sop_slug: string;
}

interface AdminPhase {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: 'sunrise' | 'moon' | 'clipboard';
  lessons: AdminLesson[];
}

// OPENING THE OFFICE - Morning setup procedures
const openingPhase: AdminPhase = {
  id: 'opening',
  slug: 'opening',
  title: 'Opening the Office',
  description: 'Morning setup procedures to start the day smoothly.',
  icon: 'sunrise',
  lessons: [
    {
      id: 'admin-1',
      slug: 'phone-system-login',
      title: 'Phone System Login & Setup',
      description: 'Morning phone system setup enables call tracking, routing, and message retrieval.',
      content_type: 'reading' as ContentType,
      duration_minutes: 8,
      sop_slug: 'phone-system-login',
    },
    {
      id: 'admin-2',
      slug: 'cash-drawer-opening',
      title: 'Cash Drawer Opening',
      description: 'Proper cash drawer setup ensures accurate financial tracking throughout the day.',
      content_type: 'reading' as ContentType,
      duration_minutes: 10,
      sop_slug: 'cash-drawer-opening',
    },
    {
      id: 'admin-3',
      slug: 'pre-scrubbing-schedule',
      title: 'Pre-Scrubbing the Schedule',
      description: 'Pre-scrubbing reduces day-of surprises and ensures smooth patient flow.',
      content_type: 'reading' as ContentType,
      duration_minutes: 12,
      sop_slug: 'pre-scrubbing-schedule',
    },
  ],
};

// CLOSING THE OFFICE - End-of-day procedures
const closingPhase: AdminPhase = {
  id: 'closing',
  slug: 'closing',
  title: 'Closing the Office',
  description: 'End-of-day reconciliation and closing procedures.',
  icon: 'moon',
  lessons: [
    {
      id: 'admin-4',
      slug: 'cash-drawer-closing',
      title: 'Cash Drawer Closing & Reconciliation',
      description: 'Accurate closing ensures financial integrity and protects you and the practice.',
      content_type: 'reading' as ContentType,
      duration_minutes: 12,
      sop_slug: 'cash-drawer-closing',
    },
    {
      id: 'admin-5',
      slug: 'eod-reconciliation',
      title: 'End-of-Day Reconciliation & Deposit',
      description: 'Daily financial reconciliation ensures accurate records and prepares deposits.',
      content_type: 'reading' as ContentType,
      duration_minutes: 15,
      sop_slug: 'eod-reconciliation',
    },
  ],
};

// ADMINISTRATIVE TASKS - Ongoing administrative duties
const adminTasksPhase: AdminPhase = {
  id: 'admin-tasks',
  slug: 'admin-tasks',
  title: 'Administrative Tasks',
  description: 'Ongoing administrative duties and compliance requirements.',
  icon: 'clipboard',
  lessons: [
    {
      id: 'admin-6',
      slug: 'no-show-letters',
      title: 'No-Show Letters',
      description: 'Formal documentation of no-show occurrences per clinic policy.',
      content_type: 'reading' as ContentType,
      duration_minutes: 8,
      sop_slug: 'no-show-letters',
    },
    {
      id: 'admin-7',
      slug: 'ordering-supplies',
      title: 'Ordering Front Office Supplies',
      description: 'Maintaining adequate supplies ensures uninterrupted office operations.',
      content_type: 'reading' as ContentType,
      duration_minutes: 8,
      sop_slug: 'ordering-supplies',
    },
    {
      id: 'admin-8',
      slug: 'monthly-compliance-logs',
      title: 'Monthly Compliance Logs',
      description: 'Required monthly documentation for regulatory compliance.',
      content_type: 'reading' as ContentType,
      duration_minutes: 10,
      sop_slug: 'monthly-compliance-logs',
    },
  ],
};

const adminPhases = [openingPhase, closingPhase, adminTasksPhase];

const phaseIcons = {
  sunrise: Sunrise,
  moon: Moon,
  clipboard: ClipboardList,
};

export function AdministrationSection() {
  const [expandedPhases, setExpandedPhases] = useState<Set<string>>(new Set(['opening', 'closing']));
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

  const totalLessons = adminPhases.reduce((sum, p) => sum + p.lessons.length, 0);
  const completedLessons = adminPhases.reduce(
    (sum, p) => sum + p.lessons.filter((l) => progress.isLessonCompleted(l.slug)).length,
    0
  );

  const isLessonDone = (lessonSlug: string) => progress.isLessonCompleted(lessonSlug);

  return (
    <>
      <SEO
        title="Office Administration | VytalPath Academy"
        description="Learn essential office administration procedures including opening, closing, cash management, and compliance documentation."
      />
      <article className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl">
            <Building2 className="w-10 h-10 text-amber-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Office Administration</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Master the operational procedures that keep the office running smoothly. From opening to closing, these administrative tasks are essential for every front office professional.
          </p>
        </header>

        {/* CMAA Domain Badge */}
        <div className="mb-6 p-4 bg-amber-50 rounded-xl border border-amber-200">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
              <ClipboardList className="w-4 h-4 text-amber-700" />
            </div>
            <div>
              <h3 className="font-semibold text-amber-900">CMAA Domain 7: Administrative Procedures</h3>
              <p className="text-sm text-amber-800 mt-1">
                These procedures align with the Medical Practice Administrative Procedures domain, covering 16% of the certification exam.
              </p>
            </div>
          </div>
        </div>

        {/* Progress Summary */}
        {completedLessons > 0 && (
          <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-600">Your Progress</span>
              <span className="font-medium text-amber-600">
                {completedLessons} of {totalLessons} procedures completed
              </span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all"
                style={{ width: `${(completedLessons / totalLessons) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Admin Phases */}
        <div className="space-y-6">
          {adminPhases.map((phase) => {
            const isExpanded = expandedPhases.has(phase.id);
            const phaseCompleted = phase.lessons.filter((l) => isLessonDone(l.slug)).length;
            const PhaseIcon = phaseIcons[phase.icon];

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
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center bg-amber-100">
                    <PhaseIcon className="w-5 h-5 text-amber-600" />
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
                    {phase.lessons.map((lesson) => (
                      <button
                        key={lesson.id}
                        onClick={() => openSOP(lesson.sop_slug)}
                        className="w-full flex items-center gap-4 p-4 pl-8 hover:bg-gray-100 transition-colors text-left border-b border-gray-100 last:border-b-0"
                      >
                        <div
                          className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                            isLessonDone(lesson.slug) ? 'bg-green-100' : 'bg-amber-500'
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
                          <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-xs font-medium">SOP</span>
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

        {/* Tips Card */}
        <div className="mt-8 p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 mb-1">Office Administration Tips</h3>
              <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                <li>Create checklists for opening and closing procedures</li>
                <li>Document everything—it protects you and the practice</li>
                <li>Reconcile cash before leaving, not the next day</li>
                <li>Keep compliance logs organized for easy audit access</li>
              </ul>
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
