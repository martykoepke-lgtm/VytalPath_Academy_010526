import { useEffect } from 'react';
import {
  X, CheckCircle, Clock,
  Heart, Scale, DollarSign, BookA, ClipboardList,
  Pill, Monitor, MessageCircle, Briefcase
} from 'lucide-react';

interface CurriculumModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const currentModules = [
  {
    id: 'foundations',
    title: 'Healthcare Foundations',
    description: 'Understand the healthcare system and your role in it.',
    icon: Heart,
    lessonCount: '3 lessons',
    duration: '~13 min',
    topics: [
      'Healthcare care settings and delivery models',
      'The inpatient encounter',
      'The ambulatory care journey',
      'Interactive healthcare setting sorter',
    ],
  },
  {
    id: 'law-ethics',
    title: 'Medical Law & Compliance',
    description: 'Master HIPAA, patient rights, and workplace compliance.',
    icon: Scale,
    lessonCount: '18 lessons',
    duration: '~130 min',
    topics: [
      'HIPAA essentials, PHI, and access rules',
      'Patient rights, authorization, and consent',
      'EMTALA, fraud, and Stark Law',
      'Workplace safety, OSHA, and emergency preparedness',
      'Professional ethics and data security',
    ],
  },
  {
    id: 'insurance',
    title: 'Insurance & Billing',
    description: 'From basics to coding and referrals — the deepest insurance training available.',
    icon: DollarSign,
    lessonCount: '18 lessons',
    duration: '~120 min',
    topics: [
      'Payer types, plan types, and key insurance terms',
      'Reading insurance cards and eligibility verification',
      'Copays, deductibles, coinsurance, and payment collection',
      'Government plans, coordination of benefits, and coverage rules',
      'EOBs, ERAs, ABNs, revenue cycle, and payment models',
      'ICD-10, CPT, HCPCS coding basics and medical necessity',
      'Referrals, prior authorization, tracking, and appeals',
    ],
  },
  {
    id: 'workflows',
    title: 'Front Office Workflows',
    description: 'Your entire workday — from opening the office to closing it down.',
    icon: ClipboardList,
    lessonCount: '10 lessons + 24 SOPs',
    duration: '~70 min',
    topics: [
      'Opening procedures: phone system, cash drawer, schedule prep',
      'Registration, scheduling, and appointment reminders',
      'Check-in and check-out for all patient types',
      'No-shows, waitlists, and multitasking strategies',
      'Cash reconciliation and end-of-day closing',
      'Administrative skills: filing, correspondence, ADA, downtime',
    ],
  },
  {
    id: 'communication',
    title: 'Patient Communication',
    description: 'Professional communication skills for the healthcare front office.',
    icon: MessageCircle,
    lessonCount: '11 lessons',
    duration: '~80 min',
    isNew: true,
    topics: [
      'Communication styles and nonverbal communication',
      'Active listening and overcoming barriers',
      'De-escalation, conflict resolution, and empathy',
      'Inclusive and culturally competent communication',
      'Telephone and email etiquette',
      'Intraoffice communication and documentation',
    ],
  },
  {
    id: 'ehr',
    title: 'EHR & Practice Management',
    description: 'Master the systems you\'ll use every day — PM and EHR.',
    icon: Monitor,
    lessonCount: '13 lessons',
    duration: '~95 min',
    topics: [
      'PM vs. EHR systems and how they connect',
      'Encounter types, patient identifiers (MRN/FIN)',
      'The encounter lifecycle and scheduling methods',
      'Phone encounters and non-visit encounters',
      'Duplicate records: prevention and resolution',
      'Telehealth platforms, patient portals, and procedures',
    ],
  },
  {
    id: 'terminology',
    title: 'Medical Terminology',
    description: 'Decode the language of healthcare.',
    icon: BookA,
    lessonCount: '5 lessons + flashcards',
    duration: '~50 min',
    topics: [
      'Medical word building (prefixes, roots, suffixes)',
      'Common abbreviations and the "Do Not Use" list',
      'Body systems and anatomical terms',
      'What you\'ll hear at the front desk',
      'Interactive flashcard study mode',
    ],
  },
  {
    id: 'ehr-lab',
    title: 'EHR Practice Lab',
    description: 'Hands-on simulation — schedule, register, check in, and manage a clinic day.',
    icon: Monitor,
    lessonCount: 'Simulation',
    duration: 'Unlimited',
    topics: [
      'Provider schedule and appointment management',
      'Patient registration and demographics',
      'Check-in and check-out workflows',
      'Encounter management and patient charts',
      'Message routing and inbox management',
    ],
  },
  {
    id: 'job-readiness',
    title: 'Job Readiness',
    description: 'Career preparation tools to land your first healthcare job.',
    icon: Briefcase,
    lessonCount: '6 tools',
    duration: 'Varies',
    topics: [
      'Phone call simulator with AI-powered scenarios',
      'Mock interview practice with real-time feedback',
      'Resume builder with healthcare-specific guidance',
      'Insurance hotline practice',
      'Readiness assessments',
    ],
  },
];

const upcomingModules = [
  {
    id: 'medications',
    title: 'Medications for Front Office',
    description: 'Handle prescriptions and refills confidently.',
    icon: Pill,
    topics: ['Prescription workflows', 'Drug classes overview', 'DEA schedules and controlled substances', 'Prior authorization for medications'],
  },
];

export function CurriculumModal({ isOpen, onClose }: CurriculumModalProps) {
  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Escape key closes
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-4xl max-h-[90vh] mt-[5vh] mx-4 bg-white rounded-2xl shadow-apple-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-gray-200/50 flex-shrink-0">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-gray-900">Full Curriculum</h2>
            <p className="text-sm text-gray-500 mt-0.5">9 training sections · 80+ lessons · 18 quizzes · 24 SOPs</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-2xl hover:bg-gray-100 transition-all duration-300"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          {/* Available Now */}
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-blue-600 uppercase tracking-wider">Available Now</span>
            </div>

            <div className="space-y-4">
              {currentModules.map((module, index) => {
                const Icon = module.icon;
                return (
                  <div
                    key={module.id}
                    className="bg-white rounded-2xl border border-gray-200/50 p-5 hover-lift transition-all duration-300 relative"
                  >
                    {'isNew' in module && module.isNew && (
                      <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-[10px] font-medium px-2.5 py-0.5 rounded-full">NEW</div>
                    )}
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center text-sm font-medium text-gray-400">
                        {String(index + 1).padStart(2, '0')}
                      </div>
                      <div className="flex-shrink-0 w-10 h-10 bg-blue-50 rounded-2xl flex items-center justify-center">
                        <Icon className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3 className="font-medium text-gray-900">{module.title}</h3>
                          <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">
                            {module.lessonCount}
                          </span>
                          <span className="text-xs text-gray-400">{module.duration}</span>
                        </div>
                        <p className="text-sm text-gray-500 mb-3">{module.description}</p>
                        <ul className="grid md:grid-cols-2 gap-1.5">
                          {module.topics.map((topic, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                              <CheckCircle className="w-3.5 h-3.5 text-blue-500 flex-shrink-0 mt-0.5" />
                              {topic}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Coming Soon */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-400 uppercase tracking-wider">Coming Soon</span>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {upcomingModules.map((module) => {
                const Icon = module.icon;
                return (
                  <div
                    key={module.id}
                    className="bg-gray-50/50 rounded-2xl p-5 border border-dashed border-gray-200"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-gray-200 rounded-xl flex items-center justify-center">
                        <Icon className="w-4 h-4 text-gray-500" />
                      </div>
                      <h3 className="font-medium text-gray-700">{module.title}</h3>
                    </div>
                    <p className="text-xs text-gray-500 mb-3">{module.description}</p>
                    <ul className="space-y-1">
                      {module.topics.map((topic, i) => (
                        <li key={i} className="text-xs text-gray-400 flex items-center gap-1.5">
                          <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                          {topic}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
