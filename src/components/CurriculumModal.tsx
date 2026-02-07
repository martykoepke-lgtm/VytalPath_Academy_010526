import { useEffect } from 'react';
import {
  X, CheckCircle, Clock,
  Heart, Scale, DollarSign, BookA, ClipboardList,
  Pill, Code, Monitor, MessageSquare, Video
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
    duration: '~25 min',
    topics: [
      'Acute care vs. ambulatory care settings',
      'The front office professional\'s role',
      'How healthcare delivery works',
      'Understanding the patient journey',
    ],
  },
  {
    id: 'law-ethics',
    title: 'Medical Law & Compliance',
    description: 'Master HIPAA and protect patient privacy.',
    icon: Scale,
    lessonCount: '9 lessons',
    duration: '~90 min',
    topics: [
      'HIPAA essentials and compliance',
      'Protected Health Information (PHI)',
      'Patient authorization & consent',
      'Violations, penalties, and EMTALA',
    ],
  },
  {
    id: 'insurance',
    title: 'Insurance & Billing',
    description: 'Navigate insurance like a pro.',
    icon: DollarSign,
    lessonCount: '9 lessons',
    duration: '~60 min',
    topics: [
      'Healthcare payers and plan types',
      'Reading insurance cards',
      'Eligibility verification',
      'Copays, deductibles, and coinsurance',
      'Payment collection best practices',
    ],
  },
  {
    id: 'workflows',
    title: 'Front Office Workflows',
    description: 'From opening to closing — every procedure in your day.',
    icon: ClipboardList,
    lessonCount: '4 lessons + 24 SOPs',
    duration: '~55 min',
    topics: [
      'Opening & closing procedures',
      'Patient registration & scheduling',
      'Check-in and check-out workflows',
      'Cash drawer & EOD reconciliation',
      'Administrative compliance documentation',
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
      'Common abbreviations (STAT, PRN, BID, etc.)',
      'Decoding and building medical terms',
      'Interactive flashcard practice',
    ],
  },
];

const upcomingModules = [
  {
    id: 'medications',
    title: 'Medications for Front Office',
    description: 'Handle prescriptions and refills confidently.',
    icon: Pill,
    topics: ['Prescription workflows', 'Drug classes overview', 'Controlled substances', 'Prior authorization for medications'],
  },
  {
    id: 'referrals',
    title: 'Referrals & Prior Authorization',
    description: 'High-demand skill for career advancement.',
    icon: ClipboardList,
    topics: ['The referral process', 'Initiating prior authorizations', 'Tracking authorizations', 'Handling denials and appeals'],
  },
  {
    id: 'coding',
    title: 'Coding Basics for Front Office',
    description: 'Understand codes without being a coder.',
    icon: Code,
    topics: ['ICD-10 basics', 'CPT code fundamentals', 'E&M visit levels', 'Reading an EOB'],
  },
  {
    id: 'ehr',
    title: 'EHR Practice Lab',
    description: 'Hands-on simulation with real EHR software.',
    icon: Monitor,
    featured: true,
    topics: ['EHR navigation', 'Patient registration', 'Scheduling in EHR', 'Chart basics and documentation'],
  },
  {
    id: 'communication',
    title: 'Patient Communication',
    description: 'Soft skills that set you apart.',
    icon: MessageSquare,
    topics: ['Professional phone etiquette', 'Handling difficult conversations', 'Communicating with empathy'],
  },
  {
    id: 'telehealth',
    title: 'Telehealth Support',
    description: 'Future-proof your skills.',
    icon: Video,
    topics: ['Telehealth basics', 'Preparing patients for virtual visits', 'Troubleshooting common issues'],
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
            <p className="text-sm text-gray-500 mt-0.5">5 modules available now, with new content added weekly</p>
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
                    className="bg-white rounded-2xl border border-gray-200/50 p-5 hover-lift transition-all duration-300"
                  >
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
                    className={`bg-gray-50/50 rounded-2xl p-5 border border-dashed border-gray-200 relative ${
                      module.featured ? 'ring-1 ring-blue-200' : ''
                    }`}
                  >
                    {module.featured && (
                      <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-[10px] font-medium px-2.5 py-0.5 rounded-full">
                        PRIORITY
                      </div>
                    )}
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-gray-200 rounded-xl flex items-center justify-center">
                        <Icon className="w-4 h-4 text-gray-500" />
                      </div>
                      <h3 className="font-medium text-gray-700">{module.title}</h3>
                    </div>
                    <p className="text-xs text-gray-500 mb-3">{module.description}</p>
                    <ul className="space-y-1">
                      {module.topics.slice(0, 3).map((topic, i) => (
                        <li key={i} className="text-xs text-gray-400 flex items-center gap-1.5">
                          <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                          {topic}
                        </li>
                      ))}
                      {module.topics.length > 3 && (
                        <li className="text-xs text-gray-400">+{module.topics.length - 3} more</li>
                      )}
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
