import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  Shield, FileText, BookOpen, Zap, Clock, CheckCircle, ArrowRight,
  Pill, ClipboardList, Code, Monitor, MessageSquare, Video
} from 'lucide-react';

// Structured data for Course collection
const courseStructuredData = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "VytalPath Academy Healthcare Front Office Training Curriculum",
  "description": "Complete training curriculum for healthcare front office professionals including HIPAA, insurance, medical terminology, and workflow training.",
  "numberOfItems": 10,
  "itemListElement": [
    {
      "@type": "Course",
      "position": 1,
      "name": "Healthcare Foundations",
      "description": "Learn the fundamentals of healthcare delivery, acute vs ambulatory care, and the front office role.",
      "provider": {
        "@type": "Organization",
        "name": "VytalPath Academy",
        "url": "https://academy.vytalpath.com"
      },
      "hasCourseInstance": {
        "@type": "CourseInstance",
        "courseMode": "online",
        "courseWorkload": "PT45M"
      }
    },
    {
      "@type": "Course",
      "position": 2,
      "name": "Medical Law & Ethics",
      "description": "Master HIPAA compliance, PHI protection, patient authorization, and healthcare privacy regulations.",
      "provider": {
        "@type": "Organization",
        "name": "VytalPath Academy"
      }
    },
    {
      "@type": "Course",
      "position": 3,
      "name": "Insurance Training",
      "description": "Comprehensive training on healthcare payers, plan types, eligibility verification, and payment collection.",
      "provider": {
        "@type": "Organization",
        "name": "VytalPath Academy"
      }
    },
    {
      "@type": "Course",
      "position": 4,
      "name": "Medical Terminology",
      "description": "Learn medical prefixes, roots, suffixes, and common abbreviations used in healthcare settings.",
      "provider": {
        "@type": "Organization",
        "name": "VytalPath Academy"
      }
    },
    {
      "@type": "Course",
      "position": 5,
      "name": "Front Office Workflows",
      "description": "Step-by-step standard operating procedures for patient check-in, scheduling, and daily operations.",
      "provider": {
        "@type": "Organization",
        "name": "VytalPath Academy"
      }
    }
  ]
};

const currentModules = [
  {
    id: 'foundations',
    title: 'Healthcare Foundations',
    description: 'Understand the healthcare system and your role in it.',
    icon: Shield,
    color: 'blue',
    lessonCount: '3 lessons',
    duration: '~25 min',
    topics: [
      'Acute care vs. ambulatory care settings',
      'The front office professional\'s role',
      'How healthcare delivery works',
      'Understanding the patient journey'
    ],
    path: '/foundations'
  },
  {
    id: 'law-ethics',
    title: 'Medical Law & Ethics',
    description: 'Master HIPAA and protect patient privacy.',
    icon: Shield,
    color: 'red',
    lessonCount: '4 lessons',
    duration: '~35 min',
    topics: [
      'HIPAA essentials and compliance',
      'Protected Health Information (PHI)',
      'Patient authorization requirements',
      'Consent and access rules'
    ],
    path: '/medical-law-ethics'
  },
  {
    id: 'insurance',
    title: 'Insurance Training',
    description: 'Navigate insurance like a pro.',
    icon: FileText,
    color: 'indigo',
    lessonCount: '9 lessons',
    duration: '~60 min',
    topics: [
      'Healthcare payers and plan types',
      'Reading insurance cards',
      'Eligibility verification',
      'Copays, deductibles, and coinsurance',
      'Payment collection best practices'
    ],
    path: '/insurance'
  },
  {
    id: 'terminology',
    title: 'Medical Terminology',
    description: 'Decode the language of healthcare.',
    icon: BookOpen,
    color: 'purple',
    lessonCount: '5 lessons + flashcards',
    duration: '~50 min',
    topics: [
      'Medical word building (prefixes, roots, suffixes)',
      'Common abbreviations (STAT, PRN, BID, etc.)',
      'Body system terminology',
      'Interactive flashcard practice'
    ],
    path: '/terminology'
  },
  {
    id: 'workflows',
    title: 'Front Office Workflows',
    description: 'Ready-to-use procedures for daily operations.',
    icon: Zap,
    color: 'emerald',
    lessonCount: '24 SOPs',
    duration: '~40 min',
    topics: [
      'Patient check-in and check-out',
      'Appointment scheduling',
      'Registration workflows',
      'Opening and closing procedures',
      'Compliance documentation'
    ],
    path: '/workflows'
  }
];

const upcomingModules = [
  {
    id: 'medications',
    title: 'Medications for Front Office',
    description: 'Handle prescriptions and refills confidently.',
    icon: Pill,
    topics: ['Prescription workflows', 'Drug classes overview', 'Controlled substances (DEA schedules)', 'Prior authorization for medications']
  },
  {
    id: 'referrals',
    title: 'Referrals & Prior Authorization',
    description: 'High-demand skill for career advancement.',
    icon: ClipboardList,
    topics: ['The referral process', 'Initiating prior authorizations', 'Tracking and managing authorizations', 'Handling denials and appeals']
  },
  {
    id: 'coding',
    title: 'Coding Basics for Front Office',
    description: 'Understand codes without being a coder.',
    icon: Code,
    topics: ['ICD-10 basics', 'CPT code fundamentals', 'E&M visit levels', 'Reading an EOB']
  },
  {
    id: 'ehr',
    title: 'EHR Practice Lab',
    description: 'Hands-on simulation with real EHR software.',
    icon: Monitor,
    featured: true,
    topics: ['EHR navigation', 'Patient registration', 'Scheduling in EHR', 'Chart basics and documentation']
  },
  {
    id: 'communication',
    title: 'Patient Communication',
    description: 'Soft skills that set you apart.',
    icon: MessageSquare,
    topics: ['Professional phone etiquette', 'Handling difficult conversations', 'Communicating with empathy', 'HIPAA-compliant communication']
  },
  {
    id: 'telehealth',
    title: 'Telehealth Support',
    description: 'Future-proof your skills.',
    icon: Video,
    topics: ['Telehealth basics', 'Preparing patients for virtual visits', 'Troubleshooting common issues']
  }
];

const colorClasses: Record<string, { bg: string; text: string; lightBg: string }> = {
  blue: { bg: 'bg-blue-100', text: 'text-blue-600', lightBg: 'bg-blue-50' },
  red: { bg: 'bg-red-100', text: 'text-red-600', lightBg: 'bg-red-50' },
  indigo: { bg: 'bg-indigo-100', text: 'text-indigo-600', lightBg: 'bg-indigo-50' },
  purple: { bg: 'bg-purple-100', text: 'text-purple-600', lightBg: 'bg-purple-50' },
  emerald: { bg: 'bg-emerald-100', text: 'text-emerald-600', lightBg: 'bg-emerald-50' }
};

export function CurriculumPage() {
  return (
    <>
      <Helmet>
        <title>Healthcare Front Office Training Curriculum | VytalPath Academy</title>
        <meta
          name="description"
          content="Complete healthcare front office training curriculum: HIPAA compliance, insurance verification, medical terminology, and workflow procedures. 10 modules, 40+ lessons, 24 SOPs."
        />
        <meta
          name="keywords"
          content="healthcare training, front office training, medical receptionist course, HIPAA training, insurance verification training, medical terminology course, healthcare administration training"
        />
        <link rel="canonical" href="https://academy.vytalpath.com/curriculum" />
        <meta property="og:title" content="Healthcare Front Office Training Curriculum | VytalPath Academy" />
        <meta property="og:description" content="Complete training curriculum for healthcare front office professionals. Master HIPAA, insurance, terminology, and workflows." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://academy.vytalpath.com/curriculum" />
        <script type="application/ld+json">
          {JSON.stringify(courseStructuredData)}
        </script>
      </Helmet>

      <article className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <header className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="text-sm mb-6" aria-label="Breadcrumb">
              <ol className="flex items-center gap-2">
                <li><Link to="/" className="text-blue-200 hover:text-white">Home</Link></li>
                <li className="text-blue-300">/</li>
                <li className="text-white font-medium">Curriculum</li>
              </ol>
            </nav>

            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Healthcare Front Office Training Curriculum
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mb-8">
              Everything you need to excel as a medical receptionist, referral coordinator, or clinic administrator.
              10 comprehensive modules covering HIPAA, insurance, terminology, and daily workflows.
            </p>

            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>5 modules available now</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-300" />
                <span>New content added weekly</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>Certificate of completion</span>
              </div>
            </div>
          </div>
        </header>

        {/* Current Modules */}
        <section className="py-16" aria-labelledby="current-modules">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <h2 id="current-modules" className="text-2xl font-bold text-gray-900">
                Available Now
              </h2>
            </div>

            <div className="space-y-6">
              {currentModules.map((module, index) => {
                const Icon = module.icon;
                const colors = colorClasses[module.color];

                return (
                  <article
                    key={module.id}
                    className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="p-6 md:p-8">
                      <div className="flex flex-col md:flex-row md:items-start gap-6">
                        {/* Module Number & Icon */}
                        <div className="flex items-center gap-4 md:flex-col md:items-center md:w-24">
                          <span className="text-3xl font-bold text-gray-300">0{index + 1}</span>
                          <div className={`w-12 h-12 ${colors.bg} rounded-xl flex items-center justify-center`}>
                            <Icon className={`w-6 h-6 ${colors.text}`} />
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold text-gray-900">{module.title}</h3>
                            <span className={`text-xs font-medium ${colors.text} ${colors.lightBg} px-2 py-1 rounded`}>
                              {module.lessonCount}
                            </span>
                            <span className="text-xs text-gray-500">{module.duration}</span>
                          </div>

                          <p className="text-gray-600 mb-4">{module.description}</p>

                          <div className="mb-4">
                            <h4 className="text-sm font-semibold text-gray-700 mb-2">What you'll learn:</h4>
                            <ul className="grid md:grid-cols-2 gap-2">
                              {module.topics.map((topic, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                                  <CheckCircle className={`w-4 h-4 ${colors.text} flex-shrink-0 mt-0.5`} />
                                  {topic}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* Upcoming Modules */}
        <section className="py-16 bg-white" aria-labelledby="upcoming-modules">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-8">
              <Clock className="w-5 h-5 text-amber-600" />
              <h2 id="upcoming-modules" className="text-2xl font-bold text-gray-900">
                Coming Soon
              </h2>
            </div>

            <p className="text-gray-600 mb-8 max-w-2xl">
              New modules are added weekly. Subscribe now and get access to all future content at no additional cost during your subscription.
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingModules.map((module) => {
                const Icon = module.icon;

                return (
                  <article
                    key={module.id}
                    className={`bg-gray-50 rounded-xl p-6 border-2 border-dashed border-gray-200 relative ${
                      module.featured ? 'ring-2 ring-amber-400 ring-offset-2' : ''
                    }`}
                  >
                    {module.featured && (
                      <div className="absolute -top-3 -right-3 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                        COMING NEXT
                      </div>
                    )}

                    <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="w-5 h-5 text-gray-500" />
                    </div>

                    <h3 className="text-lg font-bold text-gray-800 mb-2">{module.title}</h3>
                    <p className="text-sm text-gray-600 mb-4">{module.description}</p>

                    <ul className="space-y-1">
                      {module.topics.slice(0, 3).map((topic, i) => (
                        <li key={i} className="text-xs text-gray-500 flex items-center gap-1">
                          <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                          {topic}
                        </li>
                      ))}
                      {module.topics.length > 3 && (
                        <li className="text-xs text-gray-400">+{module.topics.length - 3} more topics</li>
                      )}
                    </ul>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-600" aria-labelledby="cta-heading">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 id="cta-heading" className="text-3xl font-bold text-white mb-4">
              Start Your Healthcare Career Today
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Get instant access to 5 modules with 20+ lessons and 24 workflow guides.
              New content added weekly.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/pricing"
                className="px-8 py-4 text-lg font-semibold text-blue-700 bg-white rounded-xl hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                View Pricing
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/"
                className="px-8 py-4 text-lg font-semibold text-white border-2 border-white/50 rounded-xl hover:bg-white/10 transition-all"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ Section for SEO */}
        <section className="py-16" aria-labelledby="faq-heading">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 id="faq-heading" className="text-2xl font-bold text-gray-900 mb-8 text-center">
              Frequently Asked Questions
            </h2>

            <dl className="space-y-6">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <dt className="font-semibold text-gray-900 mb-2">
                  How long does it take to complete the curriculum?
                </dt>
                <dd className="text-gray-600">
                  The current 5 modules take approximately 3-4 hours to complete. Most learners finish within 1-2 weeks studying at their own pace. New modules are added weekly, expanding the curriculum over time.
                </dd>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm">
                <dt className="font-semibold text-gray-900 mb-2">
                  Do I need any prior healthcare experience?
                </dt>
                <dd className="text-gray-600">
                  No prior experience is required. This curriculum is designed for complete beginners entering healthcare administration, as well as experienced staff looking to formalize their knowledge.
                </dd>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm">
                <dt className="font-semibold text-gray-900 mb-2">
                  Will I get access to future modules?
                </dt>
                <dd className="text-gray-600">
                  Yes! Your subscription includes access to all current and future modules. As we release new content weekly, it automatically becomes available in your account at no additional cost.
                </dd>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm">
                <dt className="font-semibold text-gray-900 mb-2">
                  Is there a certificate upon completion?
                </dt>
                <dd className="text-gray-600">
                  Yes, you'll receive a certificate of completion for each module and a comprehensive certificate when you finish the entire curriculum. These can be added to your resume and LinkedIn profile.
                </dd>
              </div>
            </dl>
          </div>
        </section>
      </article>
    </>
  );
}
