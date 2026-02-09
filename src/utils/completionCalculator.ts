// ─── Completion Calculator ───
// Shared utility for calculating course completion percentage.
// Used by CertificatePage, AccountPage (refund tier), and ProgressContext (sync).

export interface SectionRequirement {
  name: string;
  modules: {
    slug: string;
    hasQuiz: boolean;
    lessons: string[];
  }[];
}

export const COMPLETION_REQUIREMENTS: SectionRequirement[] = [
  {
    name: 'Foundations of Healthcare',
    modules: [
      {
        slug: 'healthcare-delivery',
        hasQuiz: true,
        lessons: ['understanding-healthcare-delivery', 'the-inpatient-encounter', 'the-ambulatory-care-journey'],
      },
      {
        slug: 'your-role-in-healthcare',
        hasQuiz: true,
        lessons: ['healthcare-team-roles', 'patient-journey-overview'],
      },
    ],
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
        lessons: ['emtala-patient-anti-dumping', 'fraud-abuse-stark-law', 'anti-kickback-statute', 'false-claims-act'],
      },
      {
        slug: 'workplace-safety',
        hasQuiz: true,
        lessons: [
          'basic-medical-law-concepts', 'osha-workplace-safety', 'regulatory-agencies',
          'mandatory-reporting', 'incident-reporting-response', 'emergency-preparedness',
        ],
      },
      {
        slug: 'ethics-data-security',
        hasQuiz: true,
        lessons: ['professional-ethics-boundaries', 'data-safeguards-security', 'medical-records-retention'],
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
        lessons: [
          'reading-insurance-card', 'real-time-eligibility', 'understanding-copays',
          'deductibles-oop-max', 'coinsurance-calculations', 'collecting-patient-payments',
        ],
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
      {
        slug: 'coding-basics',
        hasQuiz: true,
        lessons: [
          'icd-10-diagnosis-coding', 'cpt-procedure-coding', 'hcpcs-supply-coding',
          'snomed-ct-overview', 'medical-necessity',
        ],
      },
      {
        slug: 'referrals-prior-auth',
        hasQuiz: true,
        lessons: [
          'referral-fundamentals', 'outbound-referrals', 'inbound-referrals',
          'prior-authorization-workflows', 'auth-imaging-procedures-rx', 'auth-tracking-appeals',
        ],
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
      {
        slug: 'admin-procedures',
        hasQuiz: true,
        lessons: [
          'filing-systems', 'business-correspondence', 'computer-skills-medical-office',
          'ada-compliance', 'data-storage-backup', 'system-downtime-procedures',
        ],
      },
    ],
  },
  {
    name: 'Patient Communication',
    modules: [
      {
        slug: 'comm-foundations',
        hasQuiz: true,
        lessons: ['communication-styles-and-cycle', 'active-listening-empathy', 'nonverbal-communication'],
      },
      {
        slug: 'patient-interactions',
        hasQuiz: true,
        lessons: ['interviewing-techniques', 'communication-barriers', 'gender-identity-inclusivity', 'medical-to-layman-terms'],
      },
      {
        slug: 'professional-standards',
        hasQuiz: true,
        lessons: ['professional-presence', 'difficult-situations-de-escalation', 'telecom-email-messaging', 'documentation-community-resources'],
      },
    ],
  },
  {
    name: 'EHR & Practice Management',
    modules: [
      { slug: 'ehr-basics', hasQuiz: true, lessons: ['encounters-and-identifiers', 'pm-vs-ehr', 'ehr-navigation'] },
      { slug: 'clinic-encounters', hasQuiz: true, lessons: ['clinic-encounter-types', 'encounter-lifecycle', 'scheduling-types-templates'] },
      { slug: 'non-clinic-encounters', hasQuiz: true, lessons: ['phone-encounters', 'non-visit-encounters', 'duplicate-records'] },
      {
        slug: 'telehealth-portals',
        hasQuiz: true,
        lessons: ['telehealth-appointment-types', 'telehealth-platforms-technology', 'patient-portals', 'telehealth-procedures-troubleshooting'],
      },
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

export interface CompletionResult {
  percent: number;
  completedLessons: number;
  totalLessons: number;
  passedQuizzes: number;
  totalQuizzes: number;
}

export function calculateCompletionPercent(
  isLessonCompleted: (slug: string) => boolean,
  hasPassedQuiz: (slug: string) => boolean,
): CompletionResult {
  let totalLessons = 0;
  let completedLessons = 0;
  let totalQuizzes = 0;
  let passedQuizzes = 0;

  for (const section of COMPLETION_REQUIREMENTS) {
    for (const mod of section.modules) {
      for (const lessonSlug of mod.lessons) {
        totalLessons++;
        if (isLessonCompleted(lessonSlug)) completedLessons++;
      }
      if (mod.hasQuiz) {
        totalQuizzes++;
        if (hasPassedQuiz(mod.slug)) passedQuizzes++;
      }
    }
  }

  const totalItems = totalLessons + totalQuizzes;
  const completedItems = completedLessons + passedQuizzes;
  const percent = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  return { percent, completedLessons, totalLessons, passedQuizzes, totalQuizzes };
}
