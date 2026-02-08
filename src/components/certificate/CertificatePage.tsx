import { useMemo, useState } from 'react';
import { Award, CheckCircle, Circle, Printer } from 'lucide-react';
import { useProgress } from '../../contexts/ProgressContext';

// ─── Completion Requirements ───
// All active (non-coming-soon) lessons and quizzes across all sections

interface SectionRequirement {
  name: string;
  modules: {
    slug: string;
    hasQuiz: boolean;
    lessons: string[];
  }[];
}

const COMPLETION_REQUIREMENTS: SectionRequirement[] = [
  {
    name: 'Foundations of Healthcare',
    modules: [{
      slug: 'healthcare-delivery',
      hasQuiz: true,
      lessons: ['understanding-healthcare-delivery', 'the-inpatient-encounter', 'the-ambulatory-care-journey'],
    }],
  },
  {
    name: 'Medical Law & Compliance',
    modules: [
      {
        slug: 'hipaa-foundations',
        hasQuiz: true,
        lessons: ['hipaa-basics', 'phi-explained', 'minimum-necessary-standard'],
      },
      {
        slug: 'patient-privacy-rights',
        hasQuiz: true,
        lessons: ['patient-rights-under-hipaa', 'authorization-consent', 'hipaa-violations-fines-penalties'],
      },
      {
        slug: 'healthcare-laws',
        hasQuiz: true,
        lessons: ['emtala-patient-anti-dumping', 'fraud-abuse-stark-law'],
      },
    ],
  },
  {
    name: 'Insurance & Billing',
    modules: [
      {
        slug: 'insurance-fundamentals',
        hasQuiz: true,
        lessons: ['why-insurance-exists', 'payer-types-plan-types', 'key-insurance-terms', 'eligibility-and-payments'],
      },
      {
        slug: 'insurance-operations',
        hasQuiz: true,
        lessons: ['reading-insurance-card', 'real-time-eligibility', 'understanding-copays', 'deductibles-oop-max', 'coinsurance-calculations', 'collecting-patient-payments'],
      },
      {
        slug: 'coverage-rules',
        hasQuiz: true,
        lessons: ['government-plans-deep-dive', 'network-status-special-coverage', 'coordination-of-benefits'],
      },
      {
        slug: 'financial-documents',
        hasQuiz: true,
        lessons: ['explanation-of-benefits', 'era-and-claim-processing', 'advanced-beneficiary-notice'],
      },
      {
        slug: 'revenue-cycle',
        hasQuiz: true,
        lessons: ['revenue-cycle-overview', 'payment-models', 'financial-assistance-collections'],
      },
    ],
  },
  {
    name: 'Front Office Workflows',
    modules: [
      { slug: 'opening', hasQuiz: false, lessons: ['phone-system-login', 'cash-drawer-opening', 'pre-scrubbing-schedule'] },
      { slug: 'before-visit', hasQuiz: false, lessons: ['new-patient-registration', 'existing-patient-scheduling', 'appointment-reminders'] },
      { slug: 'during-visit', hasQuiz: false, lessons: ['new-patient-check-in', 'existing-patient-check-in', 'urgent-walk-in-check-in', 'patient-check-out'] },
      { slug: 'throughout-day', hasQuiz: false, lessons: ['no-shows-late-arrivals', 'waitlists-same-day-add-ons', 'balancing-phones-messages-walk-ins'] },
      { slug: 'closing', hasQuiz: false, lessons: ['cash-drawer-closing', 'eod-reconciliation'] },
      { slug: 'admin-tasks', hasQuiz: false, lessons: ['no-show-letters', 'ordering-supplies', 'monthly-compliance-logs'] },
    ],
  },
  {
    name: 'EHR & Practice Management',
    modules: [
      { slug: 'ehr-basics', hasQuiz: true, lessons: ['encounters-and-identifiers', 'pm-vs-ehr', 'ehr-navigation'] },
      { slug: 'clinic-encounters', hasQuiz: true, lessons: ['clinic-encounter-types', 'encounter-lifecycle', 'scheduling-types-templates'] },
      { slug: 'non-clinic-encounters', hasQuiz: true, lessons: ['phone-encounters', 'non-visit-encounters', 'duplicate-records'] },
    ],
  },
  {
    name: 'Medical Terminology',
    modules: [{
      slug: 'medical-terminology-basics',
      hasQuiz: true,
      lessons: [
        'common-abbreviations-video', 'word-building-decoding-terms', 'common-prefixes',
        'common-root-words', 'common-suffixes', 'common-abbreviations',
        'do-not-use-abbreviations', 'body-systems-overview', 'common-diseases-symptoms',
      ],
    }],
  },
];

// ─── Certificate Number ───
const CERT_STORAGE_KEY = 'vytalpath_certificate_number';

function getCertificateNumber(): string {
  const stored = localStorage.getItem(CERT_STORAGE_KEY);
  if (stored) return stored;
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  const certNum = `VPA-${code}`;
  localStorage.setItem(CERT_STORAGE_KEY, certNum);
  return certNum;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

// ─── Component ───

export function CertificatePage() {
  const progress = useProgress();
  const [studentName, setStudentName] = useState('');

  const completionStatus = useMemo(() => {
    let totalLessons = 0;
    let completedLessons = 0;
    let totalQuizzes = 0;
    let passedQuizzes = 0;
    const sections: { name: string; lessonsComplete: number; lessonsTotal: number; quizzesComplete: number; quizzesTotal: number }[] = [];

    for (const section of COMPLETION_REQUIREMENTS) {
      let sLessons = 0;
      let sLessonsComplete = 0;
      let sQuizzes = 0;
      let sQuizzesComplete = 0;

      for (const mod of section.modules) {
        for (const lessonSlug of mod.lessons) {
          sLessons++;
          if (progress.isLessonCompleted(lessonSlug)) sLessonsComplete++;
        }
        if (mod.hasQuiz) {
          sQuizzes++;
          if (progress.hasPassedQuiz(mod.slug)) sQuizzesComplete++;
        }
      }

      totalLessons += sLessons;
      completedLessons += sLessonsComplete;
      totalQuizzes += sQuizzes;
      passedQuizzes += sQuizzesComplete;
      sections.push({
        name: section.name,
        lessonsComplete: sLessonsComplete,
        lessonsTotal: sLessons,
        quizzesComplete: sQuizzesComplete,
        quizzesTotal: sQuizzes,
      });
    }

    const isComplete = completedLessons === totalLessons && passedQuizzes === totalQuizzes;
    return { totalLessons, completedLessons, totalQuizzes, passedQuizzes, sections, isComplete };
  }, [progress]);

  const certNumber = useMemo(() => getCertificateNumber(), []);
  const certDate = useMemo(() => formatDate(new Date()), []);

  const handlePrint = () => window.print();

  // ─── Locked State ───
  if (!completionStatus.isComplete) {
    return (
      <article className="max-w-3xl mx-auto">
        <header className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 mb-4 bg-amber-100 rounded-3xl shadow-apple-sm">
            <Award className="w-10 h-10 text-amber-600" />
          </div>
          <h1 className="text-4xl font-semibold tracking-tight text-gray-900 mb-3">Certificate of Completion</h1>
          <p className="text-xl font-light text-gray-500 leading-relaxed max-w-2xl mx-auto">
            Complete all lessons and quizzes to earn your certificate in Healthcare Foundations for Front Office Professionals.
          </p>
        </header>

        {/* Progress Summary */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-apple-sm p-6 mb-6">
          <div className="flex items-center gap-4 mb-5">
            <div className="flex-1">
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-gray-700">Lessons</span>
                <span className="text-gray-500">{completionStatus.completedLessons} / {completionStatus.totalLessons}</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all"
                  style={{ width: `${(completionStatus.completedLessons / completionStatus.totalLessons) * 100}%` }}
                />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-gray-700">Quizzes Passed</span>
                <span className="text-gray-500">{completionStatus.passedQuizzes} / {completionStatus.totalQuizzes}</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full transition-all"
                  style={{ width: `${(completionStatus.passedQuizzes / completionStatus.totalQuizzes) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section Checklist */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-apple-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Section Progress</h2>
          <div className="space-y-3">
            {completionStatus.sections.map((section) => {
              const sectionComplete =
                section.lessonsComplete === section.lessonsTotal &&
                section.quizzesComplete === section.quizzesTotal;
              return (
                <div key={section.name} className="flex items-center gap-3">
                  {sectionComplete ? (
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-300 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <span className={`text-sm ${sectionComplete ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
                      {section.name}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400 flex-shrink-0">
                    {section.lessonsComplete}/{section.lessonsTotal} lessons
                    {section.quizzesTotal > 0 && (
                      <> &middot; {section.quizzesComplete}/{section.quizzesTotal} quiz{section.quizzesTotal > 1 ? 'zes' : ''}</>
                    )}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </article>
    );
  }

  // ─── Unlocked State ───
  return (
    <article className="max-w-5xl mx-auto">
      {/* Controls — hidden when printing */}
      <div className="no-print text-center mb-8">
        <header className="mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 mb-4 bg-green-100 rounded-3xl shadow-apple-sm">
            <Award className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-4xl font-semibold tracking-tight text-gray-900 mb-3">Congratulations!</h1>
          <p className="text-xl font-light text-gray-500 leading-relaxed max-w-2xl mx-auto">
            You've completed all requirements. Enter your name below, then print or save your certificate as a PDF.
          </p>
        </header>

        <div className="max-w-md mx-auto mb-4">
          <label htmlFor="student-name" className="block text-sm font-medium text-gray-700 mb-1 text-left">
            Your Name (as it should appear on the certificate)
          </label>
          <input
            id="student-name"
            type="text"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            placeholder="Enter your full name"
            className="w-full px-4 py-3 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center"
          />
        </div>

        <button
          onClick={handlePrint}
          disabled={!studentName.trim()}
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl transition-colors font-medium shadow-apple-sm"
        >
          <Printer className="w-5 h-5" />
          Print Certificate
        </button>
        <p className="text-sm text-gray-400 mt-2">
          Tip: In the print dialog, choose "Save as PDF" to download a copy.
        </p>
      </div>

      {/* ─── Certificate ─── */}
      <div
        className="certificate-printable bg-white mx-auto border border-gray-200 shadow-apple-lg overflow-hidden"
        style={{ aspectRatio: '11 / 8.5', maxWidth: '1056px' }}
      >
        {/* Outer padding creates a margin effect */}
        <div className="w-full h-full p-[3%]">
          {/* Decorative double border */}
          <div
            className="w-full h-full flex flex-col items-center justify-between py-[4%] px-[6%]"
            style={{
              border: '3px double #1e3a5f',
              boxShadow: 'inset 0 0 0 1px #d4af37, inset 0 0 0 4px #fff, inset 0 0 0 5px #1e3a5f',
            }}
          >
            {/* Logo — pinned to top */}
            <div className="w-full flex justify-center pt-[1%]">
              <img
                src="/vytalpath-logo.png"
                alt="VytalPath Academy"
                className="h-32 object-contain"
              />
            </div>

            {/* Centered content — pb offsets the taller logo so text feels page-centered */}
            <div className="text-center flex-1 flex flex-col items-center justify-center w-full pb-[4%]">
              {/* Title */}
              <h2
                className="text-3xl font-bold tracking-wide mb-1"
                style={{ fontFamily: 'Georgia, "Times New Roman", serif', color: '#1e3a5f' }}
              >
                CERTIFICATE OF COMPLETION
              </h2>

              {/* Decorative line */}
              <div className="w-48 mx-auto mb-4" style={{ borderTop: '2px solid #d4af37' }} />

              {/* Certifies */}
              <p className="text-sm text-gray-500 mb-3 tracking-wide">This certifies that</p>

              {/* Student Name */}
              <div className="flex items-center gap-4 mb-3 max-w-lg w-full justify-center">
                <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, transparent, #d4af37)' }} />
                <p
                  className="text-2xl font-semibold min-w-0 px-2"
                  style={{ fontFamily: 'Georgia, "Times New Roman", serif', color: '#1e3a5f' }}
                >
                  {studentName || 'Your Name'}
                </p>
                <div className="flex-1 h-px" style={{ background: 'linear-gradient(to left, transparent, #d4af37)' }} />
              </div>

              {/* Completion text */}
              <p className="text-sm text-gray-600 mb-2">has successfully completed all requirements of the program</p>

              {/* Course name */}
              <h3
                className="text-xl font-bold tracking-wide mb-3"
                style={{ fontFamily: 'Georgia, "Times New Roman", serif', color: '#1e3a5f' }}
              >
                Healthcare Foundations for Front Office Professionals
              </h3>

              {/* Description */}
              <p className="text-xs text-gray-500 max-w-md leading-relaxed">
                Including {completionStatus.totalLessons} lessons across 6 training sections,
                {' '}{completionStatus.totalQuizzes} competency assessments, hands-on EHR simulation,
                and job readiness preparation.
              </p>
            </div>

            {/* Bottom row: Date — Seal — Signature */}
            <div className="w-full flex items-end justify-between mt-4">
              {/* Date & Cert # */}
              <div className="text-left">
                <p className="text-sm font-medium" style={{ color: '#1e3a5f' }}>{certDate}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">Certificate #{certNumber}</p>
              </div>

              {/* Seal */}
              <div className="flex flex-col items-center">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, #1e3a5f, #2d5a8e)',
                    boxShadow: '0 0 0 3px #d4af37, 0 0 0 5px #1e3a5f, 0 2px 8px rgba(0,0,0,0.2)',
                  }}
                >
                  <span
                    className="text-lg font-bold text-white"
                    style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
                  >
                    VP
                  </span>
                </div>
              </div>

              {/* Signature */}
              <div className="text-right">
                <img
                  src="/images/m-koepke-signature.png"
                  alt="M Koepke"
                  className="h-10 ml-auto mb-1 object-contain"
                />
                <div className="w-40 mb-1" style={{ borderTop: '1px solid #1e3a5f' }} />
                <p className="text-sm font-medium" style={{ color: '#1e3a5f' }}>VytalPath Academy</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
