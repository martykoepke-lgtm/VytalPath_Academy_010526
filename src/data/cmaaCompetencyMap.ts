// CMAA Competency Map — All 101 NHA Knowledge Statements
// Maps each knowledge statement to VytalPath Academy activities for progress tracking

export type CoverageStatus = 'covered' | 'partial' | 'gap';

export type ActivityType = 'lesson' | 'quiz' | 'sop' | 'exercise' | 'ai-practice' | 'knowledge-check';

export interface ActivityRef {
  type: ActivityType;
  slug: string;
  label: string;
  section: string;
  link?: string;
}

export interface KnowledgeStatement {
  id: string;
  text: string;
  coverageStatus: CoverageStatus;
  activities: ActivityRef[];
  plannedContent?: string;
}

export interface CMAAdomain {
  id: string;
  name: string;
  shortName: string;
  examItems: number;
  examWeight: number;
  knowledgeStatements: KnowledgeStatement[];
}

export const cmaaDomains: CMAAdomain[] = [
  // ─────────────────────────────────────────────────────
  // DOMAIN 1: Foundational Knowledge (10 items, 9%)
  // ─────────────────────────────────────────────────────
  {
    id: 'd1',
    name: 'Foundational Knowledge',
    shortName: 'Foundations',
    examItems: 10,
    examWeight: 0.09,
    knowledgeStatements: [
      {
        id: 'k1',
        text: 'Types of healthcare organizations and delivery models (outpatient, inpatient, PCMH, ACO, hospice, home health, mobile health)',
        coverageStatus: 'covered',
        activities: [
          { type: 'lesson', slug: 'understanding-healthcare-delivery', label: 'Understanding Healthcare Delivery', section: 'Foundations', link: '/foundations/healthcare-delivery/understanding-healthcare-delivery' },
          { type: 'lesson', slug: 'the-inpatient-encounter', label: 'The Inpatient Encounter', section: 'Foundations', link: '/foundations/healthcare-delivery/the-inpatient-encounter' },
          { type: 'lesson', slug: 'the-ambulatory-care-journey', label: 'The Ambulatory Care Journey', section: 'Foundations', link: '/foundations/healthcare-delivery/the-ambulatory-care-journey' },
          { type: 'quiz', slug: 'healthcare-delivery', label: 'Healthcare Delivery Quiz', section: 'Foundations', link: '/foundations/healthcare-delivery/quiz' },
          { type: 'exercise', slug: 'vytalpath_foundations_sorter', label: 'Healthcare Setting Sorter', section: 'Foundations', link: '/foundations' },
          { type: 'lesson', slug: 'encounters-and-identifiers', label: 'Encounter Types & Patient Identifiers', section: 'Foundations', link: '/foundations/healthcare-delivery/encounters-and-identifiers' },
        ],
      },
      {
        id: 'k2',
        text: 'Relationship between front office and clinical processes and procedures',
        coverageStatus: 'covered',
        activities: [
          { type: 'lesson', slug: 'understanding-healthcare-delivery', label: 'Understanding Healthcare Delivery', section: 'Foundations', link: '/foundations/healthcare-delivery/understanding-healthcare-delivery' },
          { type: 'quiz', slug: 'healthcare-delivery', label: 'Healthcare Delivery Quiz', section: 'Foundations', link: '/foundations/healthcare-delivery/quiz' },
        ],
      },
      {
        id: 'k3',
        text: 'Types of health records (paper, electronic, app-based, cloud-based) and implications for use',
        coverageStatus: 'partial',
        activities: [
          { type: 'lesson', slug: 'encounters-and-identifiers', label: 'Encounter Types & Patient Identifiers', section: 'Foundations', link: '/foundations/healthcare-delivery/encounters-and-identifiers' },
        ],
        plannedContent: 'EHR Practice Lab module (deeper coverage)',
      },
      {
        id: 'k4',
        text: 'EHR and EMR components (demographics, clinical records, medication administration record, diagnoses, lab reports, orders, billing)',
        coverageStatus: 'partial',
        activities: [
          { type: 'lesson', slug: 'encounters-and-identifiers', label: 'Encounter Types & Patient Identifiers', section: 'Foundations', link: '/foundations/healthcare-delivery/encounters-and-identifiers' },
        ],
        plannedContent: 'EHR Practice Lab module (deeper coverage)',
      },
      {
        id: 'k5',
        text: 'Spelling, pronunciation, and definition of medical terms',
        coverageStatus: 'covered',
        activities: [
          { type: 'lesson', slug: 'word-building-decoding-terms', label: 'Word Building: Decoding Terms', section: 'Terminology', link: '/terminology/medical-terminology-basics/word-building-decoding-terms' },
          { type: 'lesson', slug: 'common-prefixes', label: 'Common Prefixes', section: 'Terminology', link: '/terminology/medical-terminology-basics/common-prefixes' },
          { type: 'lesson', slug: 'common-root-words', label: 'Common Root Words', section: 'Terminology', link: '/terminology/medical-terminology-basics/common-root-words' },
          { type: 'lesson', slug: 'common-suffixes', label: 'Common Suffixes', section: 'Terminology', link: '/terminology/medical-terminology-basics/common-suffixes' },
          { type: 'exercise', slug: 'vytalpath_term_builder', label: 'Term Builder Workshop', section: 'Terminology', link: '/terminology' },
        ],
      },
      {
        id: 'k6',
        text: 'Common professional abbreviations and acronyms',
        coverageStatus: 'covered',
        activities: [
          { type: 'lesson', slug: 'common-abbreviations-video', label: 'Common Abbreviations (Video)', section: 'Terminology', link: '/terminology/medical-terminology-basics/common-abbreviations-video' },
          { type: 'lesson', slug: 'common-abbreviations', label: 'Common Medical Abbreviations', section: 'Terminology', link: '/terminology/medical-terminology-basics/common-abbreviations' },
        ],
      },
      {
        id: 'k7',
        text: 'Acceptable and unacceptable abbreviation practices',
        coverageStatus: 'covered',
        activities: [
          { type: 'lesson', slug: 'do-not-use-abbreviations', label: 'The "Do Not Use" List', section: 'Terminology', link: '/terminology/medical-terminology-basics/do-not-use-abbreviations' },
        ],
      },
      {
        id: 'k8',
        text: 'The Joint Commission\'s "Do Not Use" List',
        coverageStatus: 'covered',
        activities: [
          { type: 'lesson', slug: 'do-not-use-abbreviations', label: 'The "Do Not Use" List', section: 'Terminology', link: '/terminology/medical-terminology-basics/do-not-use-abbreviations' },
        ],
      },
      {
        id: 'k9',
        text: 'Prefixes, roots, and suffixes (an-, hyper-, hypo-, cardi/o, vascul/o, -osis, -pathy, -ist)',
        coverageStatus: 'covered',
        activities: [
          { type: 'lesson', slug: 'common-prefixes', label: 'Common Prefixes', section: 'Terminology', link: '/terminology/medical-terminology-basics/common-prefixes' },
          { type: 'lesson', slug: 'common-root-words', label: 'Common Root Words', section: 'Terminology', link: '/terminology/medical-terminology-basics/common-root-words' },
          { type: 'lesson', slug: 'common-suffixes', label: 'Common Suffixes', section: 'Terminology', link: '/terminology/medical-terminology-basics/common-suffixes' },
          { type: 'quiz', slug: 'medical-terminology-basics', label: 'Terminology Quiz', section: 'Terminology', link: '/terminology/medical-terminology-basics/quiz' },
          { type: 'exercise', slug: 'vytalpath_term_builder', label: 'Term Builder Workshop', section: 'Terminology', link: '/terminology' },
        ],
      },
      {
        id: 'k10',
        text: 'Signs and symptoms of common diseases, conditions, and injuries',
        coverageStatus: 'covered',
        activities: [
          { type: 'lesson', slug: 'common-diseases-symptoms', label: 'Common Diseases & Symptoms', section: 'Terminology', link: '/terminology/medical-terminology-basics/common-diseases-symptoms' },
        ],
      },
      {
        id: 'k11',
        text: 'Anatomical structures, locations, and positions',
        coverageStatus: 'covered',
        activities: [
          { type: 'lesson', slug: 'body-systems-overview', label: 'Body Systems Overview', section: 'Terminology', link: '/terminology/medical-terminology-basics/body-systems-overview' },
        ],
      },
      {
        id: 'k12',
        text: 'Functions of major body systems',
        coverageStatus: 'covered',
        activities: [
          { type: 'lesson', slug: 'body-systems-overview', label: 'Body Systems Overview', section: 'Terminology', link: '/terminology/medical-terminology-basics/body-systems-overview' },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────
  // DOMAIN 2: Communication & Professionalism (21 items, 19%)
  // ─────────────────────────────────────────────────────
  {
    id: 'd2',
    name: 'Communication & Professionalism',
    shortName: 'Communication',
    examItems: 21,
    examWeight: 0.19,
    knowledgeStatements: [
      {
        id: 'k13',
        text: 'Communication styles',
        coverageStatus: 'gap',
        activities: [],
        plannedContent: 'Patient Communication Excellence module',
      },
      {
        id: 'k14',
        text: 'Nonverbal communication and cues',
        coverageStatus: 'gap',
        activities: [],
        plannedContent: 'Patient Communication Excellence module',
      },
      {
        id: 'k15',
        text: 'Interviewing and questioning techniques (screening, open-ended, closed-ended, probing)',
        coverageStatus: 'gap',
        activities: [],
        plannedContent: 'Patient Communication Excellence module',
      },
      {
        id: 'k16',
        text: 'Techniques to handle difficult situations (irate clients, custody issues, chain of command)',
        coverageStatus: 'gap',
        activities: [
          { type: 'ai-practice', slug: 'vytalpath_phone_sim', label: 'Phone Simulator (Angry Patient)', section: 'Practice', link: '/practice/phone-simulator' },
        ],
        plannedContent: 'Patient Communication Excellence module',
      },
      {
        id: 'k17',
        text: 'Common barriers to communication (cultural differences, language, cognitive levels, developmental stages, sensory/physical disabilities, age)',
        coverageStatus: 'gap',
        activities: [],
        plannedContent: 'Patient Communication Excellence module',
      },
      {
        id: 'k18',
        text: 'Gender identity and expression, use of pronouns',
        coverageStatus: 'gap',
        activities: [],
        plannedContent: 'Patient Communication Excellence module',
      },
      {
        id: 'k19',
        text: 'Medical terminology and layman\'s terms',
        coverageStatus: 'partial',
        activities: [
          { type: 'lesson', slug: 'word-building-decoding-terms', label: 'Word Building: Decoding Terms', section: 'Terminology', link: '/terminology/medical-terminology-basics/word-building-decoding-terms' },
        ],
        plannedContent: 'Needs patient-facing translation exercises',
      },
      {
        id: 'k20',
        text: 'Scope of permitted questions and boundaries',
        coverageStatus: 'gap',
        activities: [],
        plannedContent: 'Patient Communication Excellence module',
      },
      {
        id: 'k21',
        text: 'Active listening',
        coverageStatus: 'gap',
        activities: [],
        plannedContent: 'Patient Communication Excellence module',
      },
      {
        id: 'k22',
        text: 'Empathy and compassion',
        coverageStatus: 'gap',
        activities: [],
        plannedContent: 'Patient Communication Excellence module',
      },
      {
        id: 'k23',
        text: 'Communication cycle (clear, concise message relay)',
        coverageStatus: 'gap',
        activities: [],
        plannedContent: 'Patient Communication Excellence module',
      },
      {
        id: 'k24',
        text: 'Professional presence (appearance, hygiene, demeanor, boundaries, language, tone)',
        coverageStatus: 'gap',
        activities: [],
        plannedContent: 'Patient Communication Excellence module',
      },
      {
        id: 'k25',
        text: 'When and how to escalate problem situations',
        coverageStatus: 'gap',
        activities: [],
        plannedContent: 'Patient Communication Excellence module',
      },
      {
        id: 'k26',
        text: 'Conflict resolution and de-escalation strategies',
        coverageStatus: 'gap',
        activities: [
          { type: 'ai-practice', slug: 'vytalpath_phone_sim', label: 'Phone Simulator (De-escalation)', section: 'Practice', link: '/practice/phone-simulator' },
        ],
        plannedContent: 'Patient Communication Excellence module',
      },
      {
        id: 'k27',
        text: 'Telecommunications and email etiquette',
        coverageStatus: 'partial',
        activities: [
          { type: 'lesson', slug: 'balancing-phones-messages-walk-ins', label: 'Balancing Phones, Messages & Walk-Ins', section: 'Workflows', link: '/workflows/lessons/throughout-day/balancing-phones-messages-walk-ins' },
          { type: 'lesson', slug: 'phone-system-login', label: 'Phone System Login & Setup', section: 'Workflows', link: '/workflows/lessons/opening/phone-system-login' },
          { type: 'sop', slug: 'balancing-tasks', label: 'Balancing Tasks SOP', section: 'Workflows', link: '/workflows/sops/balancing-tasks' },
          { type: 'sop', slug: 'phone-system-login', label: 'Phone System Login SOP', section: 'Workflows', link: '/workflows/sops/phone-system-login' },
        ],
        plannedContent: 'Needs dedicated telecommunications etiquette lesson',
      },
      {
        id: 'k28',
        text: 'Proper use of intraoffice messaging (chat, EHR messaging templates)',
        coverageStatus: 'gap',
        activities: [],
        plannedContent: 'Patient Communication Excellence module',
      },
      {
        id: 'k29',
        text: 'Documentation requirements for communication and correspondence',
        coverageStatus: 'gap',
        activities: [],
        plannedContent: 'Patient Communication Excellence module',
      },
      {
        id: 'k30',
        text: 'Available educational and community resources',
        coverageStatus: 'gap',
        activities: [],
        plannedContent: 'Patient Communication Excellence module',
      },
    ],
  },

  // ─────────────────────────────────────────────────────
  // DOMAIN 3: Medical Law, Ethics & Compliance (17 items, 15%)
  // ─────────────────────────────────────────────────────
  {
    id: 'd3',
    name: 'Medical Law, Ethics & Compliance',
    shortName: 'Law & Ethics',
    examItems: 17,
    examWeight: 0.15,
    knowledgeStatements: [
      {
        id: 'k31',
        text: 'Basic medical law (patient abandonment, malpractice, negligence, contracts)',
        coverageStatus: 'partial',
        activities: [
          { type: 'lesson', slug: 'fraud-abuse-stark-law', label: 'Fraud, Abuse & Stark Law', section: 'Medical Law', link: '/medical-law-ethics/healthcare-laws/fraud-abuse-stark-law' },
        ],
        plannedContent: 'Needs malpractice, negligence, patient abandonment coverage',
      },
      {
        id: 'k32',
        text: 'Patient\'s Bill of Rights',
        coverageStatus: 'covered',
        activities: [
          { type: 'lesson', slug: 'patient-rights-under-hipaa', label: 'Patient Rights Under HIPAA', section: 'Medical Law', link: '/medical-law-ethics/patient-privacy-rights/patient-rights-under-hipaa' },
          { type: 'quiz', slug: 'patient-privacy-rights', label: 'Patient Privacy & Rights Quiz', section: 'Medical Law', link: '/medical-law-ethics/patient-privacy-rights/quiz' },
        ],
      },
      {
        id: 'k33',
        text: 'HIPAA guidelines',
        coverageStatus: 'covered',
        activities: [
          { type: 'lesson', slug: 'hipaa-basics', label: 'HIPAA Basics', section: 'Medical Law', link: '/medical-law-ethics/hipaa-foundations/hipaa-basics' },
          { type: 'lesson', slug: 'phi-explained', label: 'PHI Explained', section: 'Medical Law', link: '/medical-law-ethics/hipaa-foundations/phi-explained' },
          { type: 'lesson', slug: 'minimum-necessary-standard', label: 'Minimum Necessary Standard', section: 'Medical Law', link: '/medical-law-ethics/hipaa-foundations/minimum-necessary-standard' },
          { type: 'quiz', slug: 'hipaa-foundations', label: 'HIPAA Foundations Quiz', section: 'Medical Law', link: '/medical-law-ethics/hipaa-foundations/quiz' },
        ],
      },
      {
        id: 'k34',
        text: 'Penalties for violating HIPAA practices (unknowingly, reasonable cause, willful neglect)',
        coverageStatus: 'covered',
        activities: [
          { type: 'lesson', slug: 'hipaa-violations-fines-penalties', label: 'HIPAA Violations & Penalties', section: 'Medical Law', link: '/medical-law-ethics/hipaa-foundations/hipaa-violations-fines-penalties' },
          { type: 'quiz', slug: 'hipaa-foundations', label: 'HIPAA Foundations Quiz', section: 'Medical Law', link: '/medical-law-ethics/hipaa-foundations/quiz' },
        ],
      },
      {
        id: 'k35',
        text: 'Types of data considered PHI (email, phone, SSN)',
        coverageStatus: 'covered',
        activities: [
          { type: 'lesson', slug: 'phi-explained', label: 'PHI Explained', section: 'Medical Law', link: '/medical-law-ethics/hipaa-foundations/phi-explained' },
          { type: 'exercise', slug: 'vytalpath_phi_challenge', label: 'PHI Identifier Challenge', section: 'Medical Law', link: '/medical-law-ethics' },
        ],
      },
      {
        id: 'k36',
        text: 'Permitted use and disclosure of patient information (access, release, peer-to-peer sharing)',
        coverageStatus: 'covered',
        activities: [
          { type: 'lesson', slug: 'minimum-necessary-standard', label: 'Minimum Necessary Standard', section: 'Medical Law', link: '/medical-law-ethics/hipaa-foundations/minimum-necessary-standard' },
          { type: 'lesson', slug: 'authorization-consent', label: 'Authorization & Consent', section: 'Medical Law', link: '/medical-law-ethics/patient-privacy-rights/authorization-consent' },
          { type: 'quiz', slug: 'patient-privacy-rights', label: 'Patient Privacy & Rights Quiz', section: 'Medical Law', link: '/medical-law-ethics/patient-privacy-rights/quiz' },
        ],
      },
      {
        id: 'k37',
        text: 'Information not private for authorities (child abuse, STDs, gunshots, communicable diseases)',
        coverageStatus: 'gap',
        activities: [],
        plannedContent: 'Workplace Compliance module (coming soon)',
      },
      {
        id: 'k38',
        text: 'Procedures to safeguard data (screen savers, passwords, screen visors, mobile device policies)',
        coverageStatus: 'partial',
        activities: [
          { type: 'lesson', slug: 'phi-explained', label: 'PHI Explained', section: 'Medical Law', link: '/medical-law-ethics/hipaa-foundations/phi-explained' },
          { type: 'exercise', slug: 'vytalpath_phi_challenge', label: 'PHI Identifier Challenge', section: 'Medical Law', link: '/medical-law-ethics' },
        ],
        plannedContent: 'Needs procedural detail on passwords, screen savers, mobile device policies',
      },
      {
        id: 'k39',
        text: 'Requirements for storage and retention of medical records',
        coverageStatus: 'gap',
        activities: [],
        plannedContent: 'Medical Law Expansion',
      },
      {
        id: 'k40',
        text: 'Consent types (expressed, implied, informed, waived)',
        coverageStatus: 'covered',
        activities: [
          { type: 'lesson', slug: 'authorization-consent', label: 'Authorization & Consent', section: 'Medical Law', link: '/medical-law-ethics/patient-privacy-rights/authorization-consent' },
          { type: 'quiz', slug: 'patient-privacy-rights', label: 'Patient Privacy & Rights Quiz', section: 'Medical Law', link: '/medical-law-ethics/patient-privacy-rights/quiz' },
        ],
      },
      {
        id: 'k41',
        text: 'OSHA guidelines (Safety Data Sheets, Needlestick Safety and Prevention Act)',
        coverageStatus: 'gap',
        activities: [],
        plannedContent: 'Medical Law Expansion — OSHA & Workplace Safety lesson',
      },
      {
        id: 'k42',
        text: 'The Joint Commission guidelines including National Patient Safety Goals',
        coverageStatus: 'gap',
        activities: [],
        plannedContent: 'Medical Law Expansion — Joint Commission Standards lesson',
      },
      {
        id: 'k43',
        text: 'Mandatory reporting laws, triggers for reporting, and reporting agencies',
        coverageStatus: 'gap',
        activities: [],
        plannedContent: 'Workplace Compliance module (coming soon)',
      },
      {
        id: 'k44',
        text: 'Incident reporting requirements (errors in patient care, workplace accidents)',
        coverageStatus: 'gap',
        activities: [],
        plannedContent: 'Workplace Compliance module (coming soon)',
      },
      {
        id: 'k45',
        text: 'Evacuation plans and emergency procedures',
        coverageStatus: 'gap',
        activities: [],
        plannedContent: 'Medical Law Expansion — Emergency Procedures lesson',
      },
      {
        id: 'k46',
        text: 'Differences between fraud and abuse and reporting requirements including CMS',
        coverageStatus: 'covered',
        activities: [
          { type: 'lesson', slug: 'fraud-abuse-stark-law', label: 'Fraud, Abuse & Stark Law', section: 'Medical Law', link: '/medical-law-ethics/healthcare-laws/fraud-abuse-stark-law' },
          { type: 'quiz', slug: 'healthcare-laws', label: 'Healthcare Laws Quiz', section: 'Medical Law', link: '/medical-law-ethics/healthcare-laws/quiz' },
        ],
      },
      {
        id: 'k47',
        text: 'Professional codes of ethics',
        coverageStatus: 'gap',
        activities: [],
        plannedContent: 'Medical Law Expansion — Scope of Practice & Ethics lesson',
      },
      {
        id: 'k48',
        text: 'Medical administrative assistant scope of practice',
        coverageStatus: 'gap',
        activities: [],
        plannedContent: 'Medical Law Expansion — Scope of Practice & Ethics lesson',
      },
    ],
  },

  // ─────────────────────────────────────────────────────
  // DOMAIN 4: Scheduling (16 items, 15%)
  // ─────────────────────────────────────────────────────
  {
    id: 'd4',
    name: 'Scheduling',
    shortName: 'Scheduling',
    examItems: 16,
    examWeight: 0.15,
    knowledgeStatements: [
      {
        id: 'k49',
        text: 'EHR scheduling including templates and techniques',
        coverageStatus: 'gap',
        activities: [],
        plannedContent: 'EHR Practice Lab module',
      },
      {
        id: 'k50',
        text: 'Manual scheduling procedures',
        coverageStatus: 'gap',
        activities: [],
        plannedContent: 'Scheduling Expansion',
      },
      {
        id: 'k51',
        text: 'Types of appointment scheduling (time-specified, wave, modified wave, double booking, open booking, block)',
        coverageStatus: 'gap',
        activities: [],
        plannedContent: 'Scheduling Expansion',
      },
      {
        id: 'k52',
        text: 'Considerations for scheduling (new vs established, purpose, type, requested provider, urgency, intervals)',
        coverageStatus: 'covered',
        activities: [
          { type: 'lesson', slug: 'new-patient-registration', label: 'New Patient Registration', section: 'Workflows', link: '/workflows/lessons/before-visit/new-patient-registration' },
          { type: 'lesson', slug: 'existing-patient-scheduling', label: 'Existing Patient Scheduling', section: 'Workflows', link: '/workflows/lessons/before-visit/existing-patient-scheduling' },
          { type: 'sop', slug: 'new-patient-registration-sop', label: 'New Patient Registration SOP', section: 'Workflows', link: '/workflows/sops/new-patient-registration-sop' },
          { type: 'sop', slug: 'existing-patient-scheduling-sop', label: 'Existing Patient Scheduling SOP', section: 'Workflows', link: '/workflows/sops/existing-patient-scheduling-sop' },
          { type: 'exercise', slug: 'vytalpath_workflow_seq', label: 'Workflow Sequencer', section: 'Workflows', link: '/workflows' },
        ],
      },
      {
        id: 'k53',
        text: 'Provider preferences, needs, and schedule',
        coverageStatus: 'partial',
        activities: [
          { type: 'lesson', slug: 'pre-scrubbing-schedule', label: 'Pre-Scrubbing the Schedule', section: 'Workflows', link: '/workflows/lessons/opening/pre-scrubbing-schedule' },
          { type: 'sop', slug: 'pre-scrubbing-schedule', label: 'Pre-Scrubbing Schedule SOP', section: 'Workflows', link: '/workflows/sops/pre-scrubbing-schedule' },
        ],
        plannedContent: 'Needs scheduling matrix and provider template detail',
      },
      {
        id: 'k54',
        text: 'Types of appointments appropriate for telehealth',
        coverageStatus: 'gap',
        activities: [],
        plannedContent: 'Telehealth Support module',
      },
      {
        id: 'k55',
        text: 'Telehealth platforms and technology',
        coverageStatus: 'gap',
        activities: [],
        plannedContent: 'Telehealth Support module',
      },
      {
        id: 'k56',
        text: 'Patient portals including notifications, self-scheduling, technical support',
        coverageStatus: 'gap',
        activities: [],
        plannedContent: 'Telehealth Support module',
      },
      {
        id: 'k57',
        text: 'Procedures to avoid duplicate EHR creation during scheduling (two identifiers, maiden/married name)',
        coverageStatus: 'gap',
        activities: [],
        plannedContent: 'EHR Practice Lab module',
      },
      {
        id: 'k58',
        text: 'Insurance eligibility and benefits verification',
        coverageStatus: 'covered',
        activities: [
          { type: 'lesson', slug: 'real-time-eligibility', label: 'Real-Time Eligibility Verification', section: 'Insurance', link: '/insurance/insurance-operations/real-time-eligibility' },
          { type: 'lesson', slug: 'reading-insurance-card', label: 'Reading an Insurance Card', section: 'Insurance', link: '/insurance/insurance-operations/reading-insurance-card' },
          { type: 'quiz', slug: 'insurance-operations', label: 'Insurance Operations Quiz', section: 'Insurance', link: '/insurance/insurance-operations/quiz' },
          { type: 'exercise', slug: 'insurance-card-explorer', label: 'Insurance Card Explorer', section: 'Insurance', link: '/insurance' },
          { type: 'exercise', slug: 'eligibility-explorer', label: 'Eligibility Report Explorer', section: 'Insurance', link: '/insurance' },
          { type: 'ai-practice', slug: 'vytalpath_ins_hotline', label: 'Insurance Verification Hotline', section: 'Practice', link: '/practice/insurance-hotline' },
        ],
      },
      {
        id: 'k59',
        text: 'Information to provide to patient prior to appointment',
        coverageStatus: 'covered',
        activities: [
          { type: 'lesson', slug: 'appointment-reminders', label: 'Appointment Reminder Calls', section: 'Workflows', link: '/workflows/lessons/before-visit/appointment-reminders' },
          { type: 'sop', slug: 'reminder-calls-sop', label: 'Reminder Calls SOP', section: 'Workflows', link: '/workflows/sops/reminder-calls-sop' },
          { type: 'exercise', slug: 'vytalpath_workflow_seq', label: 'Workflow Sequencer: Reminders', section: 'Workflows', link: '/workflows' },
        ],
      },
      {
        id: 'k60',
        text: 'Policies and procedures for no-show, missed, and cancelled appointments including documentation',
        coverageStatus: 'covered',
        activities: [
          { type: 'lesson', slug: 'no-shows-late-arrivals', label: 'No-Shows and Late Arrivals', section: 'Workflows', link: '/workflows/lessons/throughout-day/no-shows-late-arrivals' },
          { type: 'sop', slug: 'no-shows-late-arrivals', label: 'No-Shows SOP', section: 'Workflows', link: '/workflows/sops/no-shows-late-arrivals' },
          { type: 'lesson', slug: 'no-show-letters', label: 'No-Show Letters', section: 'Workflows', link: '/workflows/lessons/admin-tasks/no-show-letters' },
          { type: 'sop', slug: 'no-show-letters', label: 'No-Show Letters SOP', section: 'Workflows', link: '/workflows/sops/no-show-letters' },
        ],
      },
      {
        id: 'k61',
        text: 'Considerations for in-network and out-of-network coverage',
        coverageStatus: 'partial',
        activities: [
          { type: 'lesson', slug: 'payer-types-plan-types', label: 'Payer Types & Plan Types', section: 'Insurance', link: '/insurance/insurance-fundamentals/payer-types-plan-types' },
          { type: 'quiz', slug: 'insurance-fundamentals', label: 'Insurance Fundamentals Quiz', section: 'Insurance', link: '/insurance/insurance-fundamentals/quiz' },
        ],
        plannedContent: 'Needs deeper in-network/out-of-network coverage',
      },
      {
        id: 'k62',
        text: 'Pre-appointment screening requirements (symptom screening, vaccination, insurance changes, telehealth tech checks)',
        coverageStatus: 'partial',
        activities: [
          { type: 'lesson', slug: 'appointment-reminders', label: 'Appointment Reminder Calls', section: 'Workflows', link: '/workflows/lessons/before-visit/appointment-reminders' },
          { type: 'lesson', slug: 'pre-scrubbing-schedule', label: 'Pre-Scrubbing the Schedule', section: 'Workflows', link: '/workflows/lessons/opening/pre-scrubbing-schedule' },
        ],
        plannedContent: 'Needs comprehensive pre-appointment screening lesson',
      },
    ],
  },

  // ─────────────────────────────────────────────────────
  // DOMAIN 5: Patient Encounter (21 items, 19%)
  // ─────────────────────────────────────────────────────
  {
    id: 'd5',
    name: 'Patient Encounter',
    shortName: 'Patient Encounter',
    examItems: 21,
    examWeight: 0.19,
    knowledgeStatements: [
      {
        id: 'k63',
        text: 'How to enter information for new and established patients',
        coverageStatus: 'covered',
        activities: [
          { type: 'lesson', slug: 'new-patient-check-in', label: 'New Patient Check-In', section: 'Workflows', link: '/workflows/lessons/during-visit/new-patient-check-in' },
          { type: 'lesson', slug: 'existing-patient-check-in', label: 'Existing Patient Check-In', section: 'Workflows', link: '/workflows/lessons/during-visit/existing-patient-check-in' },
          { type: 'sop', slug: 'patient-check-in', label: 'Patient Check-In SOP', section: 'Workflows', link: '/workflows/sops/patient-check-in' },
          { type: 'sop', slug: 'existing-patient-check-in', label: 'Existing Patient Check-In SOP', section: 'Workflows', link: '/workflows/sops/existing-patient-check-in' },
        ],
      },
      {
        id: 'k64',
        text: 'Required patient intake forms (assignment of benefits, notice of privacy practices, advance directives, release forms, financial responsibility)',
        coverageStatus: 'partial',
        activities: [
          { type: 'lesson', slug: 'new-patient-check-in', label: 'New Patient Check-In', section: 'Workflows', link: '/workflows/lessons/during-visit/new-patient-check-in' },
        ],
        plannedContent: 'Needs dedicated AOB, NPP, advance directive content',
      },
      {
        id: 'k65',
        text: 'Special considerations for intake (visually impaired, language barriers, kiosk/tablet support)',
        coverageStatus: 'gap',
        activities: [],
        plannedContent: 'Patient Communication Excellence module',
      },
      {
        id: 'k66',
        text: 'Identification, demographic, and insurance verification processes',
        coverageStatus: 'covered',
        activities: [
          { type: 'lesson', slug: 'new-patient-check-in', label: 'New Patient Check-In', section: 'Workflows', link: '/workflows/lessons/during-visit/new-patient-check-in' },
          { type: 'lesson', slug: 'reading-insurance-card', label: 'Reading an Insurance Card', section: 'Insurance', link: '/insurance/insurance-operations/reading-insurance-card' },
          { type: 'lesson', slug: 'real-time-eligibility', label: 'Real-Time Eligibility', section: 'Insurance', link: '/insurance/insurance-operations/real-time-eligibility' },
          { type: 'exercise', slug: 'insurance-card-explorer', label: 'Insurance Card Explorer', section: 'Insurance', link: '/insurance' },
        ],
      },
      {
        id: 'k67',
        text: 'Referral, precertification/preauthorization, and predetermination requirements',
        coverageStatus: 'gap',
        activities: [],
        plannedContent: 'Referrals & Prior Authorization module',
      },
      {
        id: 'k68',
        text: 'Basic recognition and purpose of code sets (ICD-10-CM, ICD-10-PCS, CPT, HCPCS)',
        coverageStatus: 'gap',
        activities: [],
        plannedContent: 'Coding Basics for Front Office module',
      },
      {
        id: 'k69',
        text: 'Concepts related to medical necessity',
        coverageStatus: 'gap',
        activities: [],
        plannedContent: 'Coding Basics for Front Office module',
      },
      {
        id: 'k70',
        text: 'Procedures to identify and avoid creation of duplicate electronic health records',
        coverageStatus: 'gap',
        activities: [],
        plannedContent: 'EHR Practice Lab module',
      },
      {
        id: 'k71',
        text: 'Procedures to follow if duplicate health record is identified (notify staff, merging)',
        coverageStatus: 'gap',
        activities: [],
        plannedContent: 'EHR Practice Lab module',
      },
      {
        id: 'k72',
        text: 'Acceptable secondary health records (workers\' compensation, liability, minors\' rights)',
        coverageStatus: 'gap',
        activities: [],
        plannedContent: 'Insurance Expansion',
      },
      {
        id: 'k73',
        text: 'Commercial insurance plan types (employer-sponsored, HMO, PPO)',
        coverageStatus: 'covered',
        activities: [
          { type: 'lesson', slug: 'payer-types-plan-types', label: 'Payer Types & Plan Types', section: 'Insurance', link: '/insurance/insurance-fundamentals/payer-types-plan-types' },
          { type: 'lesson', slug: 'key-insurance-terms', label: 'Key Insurance Terms', section: 'Insurance', link: '/insurance/insurance-fundamentals/key-insurance-terms' },
          { type: 'quiz', slug: 'insurance-fundamentals', label: 'Insurance Fundamentals Quiz', section: 'Insurance', link: '/insurance/insurance-fundamentals/quiz' },
        ],
      },
      {
        id: 'k74',
        text: 'Government insurance plans (Medicare, Medicaid, Medigap, TRICARE)',
        coverageStatus: 'partial',
        activities: [
          { type: 'lesson', slug: 'payer-types-plan-types', label: 'Payer Types & Plan Types', section: 'Insurance', link: '/insurance/insurance-fundamentals/payer-types-plan-types' },
        ],
        plannedContent: 'Needs Medicare Parts A-D, Medicaid, TRICARE depth',
      },
      {
        id: 'k75',
        text: 'Insurance rules (dependent and birthday rules, coordination of benefits)',
        coverageStatus: 'gap',
        activities: [],
        plannedContent: 'Billing & Revenue Cycle module',
      },
      {
        id: 'k76',
        text: 'Difference between copayments and coinsurance',
        coverageStatus: 'covered',
        activities: [
          { type: 'lesson', slug: 'understanding-copays', label: 'Understanding Copays', section: 'Insurance', link: '/insurance/insurance-operations/understanding-copays' },
          { type: 'lesson', slug: 'coinsurance-calculations', label: 'Coinsurance Calculations', section: 'Insurance', link: '/insurance/insurance-operations/coinsurance-calculations' },
          { type: 'lesson', slug: 'deductibles-oop-max', label: 'Deductibles & OOP Max', section: 'Insurance', link: '/insurance/insurance-operations/deductibles-oop-max' },
          { type: 'quiz', slug: 'insurance-operations', label: 'Insurance Operations Quiz', section: 'Insurance', link: '/insurance/insurance-operations/quiz' },
          { type: 'exercise', slug: 'vytalpath_payment_calc', label: 'Patient Payment Calculator', section: 'Insurance', link: '/insurance' },
        ],
      },
      {
        id: 'k77',
        text: 'Advanced Beneficiary Notice (ABN)',
        coverageStatus: 'gap',
        activities: [],
        plannedContent: 'Billing & Revenue Cycle module',
      },
      {
        id: 'k78',
        text: 'Contents of Explanation of Benefits (EOB)',
        coverageStatus: 'gap',
        activities: [],
        plannedContent: 'Coding Basics for Front Office module',
      },
      {
        id: 'k79',
        text: 'Electronic remittance advice (ERA)',
        coverageStatus: 'gap',
        activities: [],
        plannedContent: 'Billing & Revenue Cycle module',
      },
      {
        id: 'k80',
        text: 'Procedures for telehealth appointments including troubleshooting and support',
        coverageStatus: 'gap',
        activities: [],
        plannedContent: 'Telehealth Support module',
      },
    ],
  },

  // ─────────────────────────────────────────────────────
  // DOMAIN 6: Billing & Revenue Cycle (11 items, 10%)
  // ─────────────────────────────────────────────────────
  {
    id: 'd6',
    name: 'Billing & Revenue Cycle',
    shortName: 'Billing',
    examItems: 11,
    examWeight: 0.10,
    knowledgeStatements: [
      {
        id: 'k81',
        text: 'Phases of the revenue cycle and how they interact/impact each other',
        coverageStatus: 'gap',
        activities: [],
        plannedContent: 'Billing & Revenue Cycle module',
      },
      {
        id: 'k82',
        text: 'Healthcare payment models (fee for service, value-based plans)',
        coverageStatus: 'gap',
        activities: [],
        plannedContent: 'Billing & Revenue Cycle module',
      },
      {
        id: 'k83',
        text: 'Financial eligibility, sliding scales, and indigent programs',
        coverageStatus: 'gap',
        activities: [],
        plannedContent: 'Billing & Revenue Cycle module',
      },
      {
        id: 'k84',
        text: 'Difference between Medicare and Medicaid',
        coverageStatus: 'partial',
        activities: [
          { type: 'lesson', slug: 'payer-types-plan-types', label: 'Payer Types & Plan Types', section: 'Insurance', link: '/insurance/insurance-fundamentals/payer-types-plan-types' },
        ],
        plannedContent: 'Needs billing-level Medicare vs Medicaid comparison',
      },
      {
        id: 'k85',
        text: 'CMS billing and documentation requirements',
        coverageStatus: 'gap',
        activities: [],
        plannedContent: 'Billing & Revenue Cycle module',
      },
      {
        id: 'k86',
        text: 'Aging reports, collections due, adjustments, and write-offs',
        coverageStatus: 'gap',
        activities: [],
        plannedContent: 'Billing & Revenue Cycle module',
      },
      {
        id: 'k87',
        text: 'Third-party payer billing requirements',
        coverageStatus: 'gap',
        activities: [],
        plannedContent: 'Billing & Revenue Cycle module',
      },
      {
        id: 'k88',
        text: 'Referral and insurance authorizations',
        coverageStatus: 'gap',
        activities: [],
        plannedContent: 'Referrals & Prior Authorization module',
      },
      {
        id: 'k89',
        text: 'Clearinghouse and claim scrubbing processes',
        coverageStatus: 'gap',
        activities: [],
        plannedContent: 'Billing & Revenue Cycle module',
      },
    ],
  },

  // ─────────────────────────────────────────────────────
  // DOMAIN 7: Medical Practice Admin Procedures (14 items, 13%)
  // ─────────────────────────────────────────────────────
  {
    id: 'd7',
    name: 'Medical Practice Admin Procedures',
    shortName: 'Admin',
    examItems: 14,
    examWeight: 0.13,
    knowledgeStatements: [
      {
        id: 'k90',
        text: 'Organization/facility policies and procedures',
        coverageStatus: 'partial',
        activities: [
          { type: 'sop', slug: 'sop-library', label: 'SOP Library (24 procedures)', section: 'Workflows', link: '/workflows/sops' },
        ],
        plannedContent: 'Needs explicit organization policies lesson',
      },
      {
        id: 'k91',
        text: 'Filing systems (alphabetical, color, terminal digit — primary, secondary, tertiary)',
        coverageStatus: 'gap',
        activities: [],
        plannedContent: 'Admin Procedures Expansion',
      },
      {
        id: 'k92',
        text: 'Petty cash management and end-of-day financial reconciliation requirements',
        coverageStatus: 'covered',
        activities: [
          { type: 'lesson', slug: 'cash-drawer-opening', label: 'Cash Drawer Opening', section: 'Workflows', link: '/workflows/lessons/opening/cash-drawer-opening' },
          { type: 'lesson', slug: 'cash-drawer-closing', label: 'Cash Drawer Closing', section: 'Workflows', link: '/workflows/lessons/closing/cash-drawer-closing' },
          { type: 'lesson', slug: 'eod-reconciliation', label: 'End-of-Day Reconciliation', section: 'Workflows', link: '/workflows/lessons/closing/eod-reconciliation' },
          { type: 'sop', slug: 'cash-drawer-opening', label: 'Cash Drawer Opening SOP', section: 'Workflows', link: '/workflows/sops/cash-drawer-opening' },
          { type: 'sop', slug: 'cash-drawer-closing', label: 'Cash Drawer Closing SOP', section: 'Workflows', link: '/workflows/sops/cash-drawer-closing' },
          { type: 'sop', slug: 'eod-reconciliation', label: 'EOD Reconciliation SOP', section: 'Workflows', link: '/workflows/sops/eod-reconciliation' },
        ],
      },
      {
        id: 'k93',
        text: 'Organization/facility opening and closing procedures',
        coverageStatus: 'covered',
        activities: [
          { type: 'lesson', slug: 'phone-system-login', label: 'Phone System Login', section: 'Workflows', link: '/workflows/lessons/opening/phone-system-login' },
          { type: 'lesson', slug: 'cash-drawer-opening', label: 'Cash Drawer Opening', section: 'Workflows', link: '/workflows/lessons/opening/cash-drawer-opening' },
          { type: 'lesson', slug: 'pre-scrubbing-schedule', label: 'Pre-Scrubbing the Schedule', section: 'Workflows', link: '/workflows/lessons/opening/pre-scrubbing-schedule' },
          { type: 'lesson', slug: 'cash-drawer-closing', label: 'Cash Drawer Closing', section: 'Workflows', link: '/workflows/lessons/closing/cash-drawer-closing' },
          { type: 'lesson', slug: 'eod-reconciliation', label: 'End-of-Day Reconciliation', section: 'Workflows', link: '/workflows/lessons/closing/eod-reconciliation' },
          { type: 'exercise', slug: 'vytalpath_workflow_seq', label: 'Workflow Sequencer: Opening', section: 'Workflows', link: '/workflows' },
        ],
      },
      {
        id: 'k94',
        text: 'Telephone procedures (introduction, caller identification, hold management, call directing)',
        coverageStatus: 'covered',
        activities: [
          { type: 'lesson', slug: 'balancing-phones-messages-walk-ins', label: 'Balancing Phones & Walk-Ins', section: 'Workflows', link: '/workflows/lessons/throughout-day/balancing-phones-messages-walk-ins' },
          { type: 'lesson', slug: 'phone-system-login', label: 'Phone System Login', section: 'Workflows', link: '/workflows/lessons/opening/phone-system-login' },
          { type: 'sop', slug: 'balancing-tasks', label: 'Balancing Tasks SOP', section: 'Workflows', link: '/workflows/sops/balancing-tasks' },
          { type: 'ai-practice', slug: 'vytalpath_phone_sim', label: 'Phone Call Simulator', section: 'Practice', link: '/practice/phone-simulator' },
        ],
      },
      {
        id: 'k95',
        text: 'Types of letters and templates',
        coverageStatus: 'partial',
        activities: [
          { type: 'lesson', slug: 'no-show-letters', label: 'No-Show Letters', section: 'Workflows', link: '/workflows/lessons/admin-tasks/no-show-letters' },
          { type: 'sop', slug: 'no-show-letters', label: 'No-Show Letters SOP', section: 'Workflows', link: '/workflows/sops/no-show-letters' },
        ],
        plannedContent: 'Needs general business correspondence lesson',
      },
      {
        id: 'k96',
        text: 'Proper greetings, salutations, and signatories',
        coverageStatus: 'gap',
        activities: [],
        plannedContent: 'Admin Procedures Expansion',
      },
      {
        id: 'k97',
        text: 'Basic computer skills (email, word processing, spreadsheets, internet, hardware)',
        coverageStatus: 'gap',
        activities: [],
        plannedContent: 'Admin Procedures Expansion',
      },
      {
        id: 'k98',
        text: 'Americans with Disabilities Act Amendments Act compliance procedures',
        coverageStatus: 'gap',
        activities: [],
        plannedContent: 'Admin Procedures Expansion',
      },
      {
        id: 'k99',
        text: 'Inventory management requirements',
        coverageStatus: 'covered',
        activities: [
          { type: 'lesson', slug: 'ordering-supplies', label: 'Ordering Front Office Supplies', section: 'Workflows', link: '/workflows/lessons/admin-tasks/ordering-supplies' },
          { type: 'sop', slug: 'ordering-supplies', label: 'Ordering Supplies SOP', section: 'Workflows', link: '/workflows/sops/ordering-supplies' },
        ],
      },
      {
        id: 'k100',
        text: 'Data storage and back-up requirements',
        coverageStatus: 'gap',
        activities: [],
        plannedContent: 'Admin Procedures Expansion',
      },
      {
        id: 'k101',
        text: 'Downtime procedures when technology or systems are not functioning properly',
        coverageStatus: 'gap',
        activities: [],
        plannedContent: 'Admin Procedures Expansion',
      },
    ],
  },
];
