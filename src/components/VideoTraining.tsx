import { useState } from 'react';
import { Play, BookOpen, Stethoscope, Scale, ChevronRight, CheckCircle2, Clock, Video, CreditCard, Sparkles } from 'lucide-react';
import { KnowledgeCheck } from './learning/KnowledgeCheck';

// Supabase Storage base URL for videos
const VIDEO_BASE_URL = 'https://vwieorhlcapeeamvltqa.supabase.co/storage/v1/object/public/videos';

interface VideoLesson {
  id: string;
  title: string;
  description: string;
  duration: string;
  videoUrl: string;
  completed?: boolean;
}

interface TrainingSection {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  lessons: VideoLesson[];
}

const trainingSections: TrainingSection[] = [
  {
    id: 'welcome',
    title: 'Welcome to VytalPath Academy',
    description: 'Meet your AI instructor and learn what VytalPath Academy is all about',
    icon: Sparkles,
    color: 'rose',
    lessons: [
      {
        id: 'academy-intro',
        title: 'VytalPath Academy Introduction',
        description: 'Meet your AI instructor and discover how VytalPath Academy will prepare you for success in healthcare front office roles.',
        duration: '3-5 min',
        videoUrl: `${VIDEO_BASE_URL}/vytalpath-academy-introduction.mp4`,
      },
    ],
  },
  {
    id: 'intro',
    title: 'Course Introduction',
    description: 'Get started with the fundamentals of healthcare front office operations',
    icon: BookOpen,
    color: 'blue',
    lessons: [
      {
        id: 'foundations',
        title: 'Healthcare Front Office Foundations',
        description: 'An introduction to the essential skills and knowledge needed for front office success in healthcare settings.',
        duration: '3-5 min',
        videoUrl: `${VIDEO_BASE_URL}/healthcare-front-office-foundations.mp4`,
      },
    ],
  },
  {
    id: 'ambulatory',
    title: 'Welcome to Ambulatory Care',
    description: 'Understanding the ambulatory care environment and your role in it',
    icon: Stethoscope,
    color: 'blue',
    lessons: [
      {
        id: 'acute-vs-ambulatory',
        title: 'Acute vs. Ambulatory Care',
        description: 'Learn the key differences between acute care (hospitals) and ambulatory care (outpatient clinics) settings.',
        duration: '3-5 min',
        videoUrl: `${VIDEO_BASE_URL}/acute-vs-ambulatory-care.mp4`,
      },
    ],
  },
  {
    id: 'compliance',
    title: 'Medical Law & Ethics',
    description: 'Essential legal and ethical guidelines for healthcare professionals',
    icon: Scale,
    color: 'purple',
    lessons: [
      {
        id: 'hipaa',
        title: 'HIPAA Essentials Explained',
        description: 'Understanding HIPAA regulations, patient privacy rights, and your responsibilities in protecting health information.',
        duration: '3-5 min',
        videoUrl: `${VIDEO_BASE_URL}/hipaa-essentials-explained.mp4`,
      },
      {
        id: 'phi',
        title: 'PHI Explained',
        description: 'Learn what Protected Health Information (PHI) is and how to identify it in your daily work.',
        duration: '3-5 min',
        videoUrl: `${VIDEO_BASE_URL}/phi-explained.mp4`,
      },
      {
        id: 'hipaa-access',
        title: 'HIPAA Access Rules',
        description: 'Learn about HIPAA access rules and who can access patient health information.',
        duration: '3-5 min',
        videoUrl: `${VIDEO_BASE_URL}/hipaa-access-rules.mp4`,
      },
    ],
  },
  {
    id: 'insurance',
    title: 'Understanding Insurance',
    description: 'Master the essentials of health insurance for front office operations',
    icon: CreditCard,
    color: 'amber',
    lessons: [
      {
        id: 'intro-health-insurance',
        title: 'Introduction to Health Insurance',
        description: 'A broad overview of how health insurance works in the US healthcare system.',
        duration: '3-5 min',
        videoUrl: `${VIDEO_BASE_URL}/introduction-to-health-insurance.mp4`,
      },
      {
        id: 'payer-types',
        title: 'Types of Payers & Plan Types',
        description: 'Learn about different insurance payers (Medicare, Medicaid, commercial) and plan types (HMO, PPO, EPO).',
        duration: '3-5 min',
        videoUrl: `${VIDEO_BASE_URL}/types-of-payers-and-plan-types.mp4`,
      },
      {
        id: 'key-insurance-terms',
        title: 'Key Insurance Terms',
        description: 'Define essential insurance vocabulary: premium, deductible, copay, coinsurance, and out-of-pocket maximum.',
        duration: '3-5 min',
        videoUrl: `${VIDEO_BASE_URL}/key-insurance-terms.mp4`,
      },
      {
        id: 'reading-insurance-card',
        title: 'Reading an Insurance Card',
        description: 'Learn to identify key information on insurance cards including Member ID, Group Number, copays, and more.',
        duration: '3-5 min',
        videoUrl: `${VIDEO_BASE_URL}/reading-an-insurance-card.mp4`,
      },
      {
        id: 'eligibility-verification',
        title: 'Insurance Eligibility Verification',
        description: 'Understand the process and workflow for verifying patient insurance eligibility before appointments.',
        duration: '3-5 min',
        videoUrl: `${VIDEO_BASE_URL}/insurance-eligibility-verification.mp4`,
      },
      {
        id: 'understanding-copays',
        title: 'Understanding Copays',
        description: 'Learn what copays are, how to identify them on insurance cards, and best practices for collection.',
        duration: '3-5 min',
        videoUrl: `${VIDEO_BASE_URL}/understanding-copays.mp4`,
      },
      {
        id: 'understanding-deductibles',
        title: 'Deductibles and Out-of-Pocket Maximum',
        description: 'Master deductibles, out-of-pocket maximums, and how to explain them to patients.',
        duration: '3-5 min',
        videoUrl: `${VIDEO_BASE_URL}/deductibles-and-out-of-pocket-maximum.mp4`,
      },
      {
        id: 'coinsurance',
        title: 'Coinsurance Calculations',
        description: 'Learn how to calculate and explain coinsurance to patients.',
        duration: '3-5 min',
        videoUrl: `${VIDEO_BASE_URL}/coinsurance-calculations.mp4`,
      },
      {
        id: 'collecting-payments',
        title: 'Collecting Patient Payments',
        description: 'Best practices for collecting copays, coinsurance, and outstanding balances from patients.',
        duration: '3-5 min',
        videoUrl: `${VIDEO_BASE_URL}/collecting-patient-payments.mp4`,
      },
    ],
  },
];

const colorClasses: Record<string, { bg: string; text: string; border: string; light: string }> = {
  rose: { bg: 'bg-rose-600', text: 'text-rose-600', border: 'border-rose-600', light: 'bg-rose-50' },
  blue: { bg: 'bg-blue-600', text: 'text-blue-600', border: 'border-blue-600', light: 'bg-blue-50' },
  blue: { bg: 'bg-blue-600', text: 'text-blue-600', border: 'border-blue-600', light: 'bg-blue-50' },
  purple: { bg: 'bg-blue-700', text: 'text-blue-700', border: 'border-blue-700', light: 'bg-blue-50' },
  amber: { bg: 'bg-amber-600', text: 'text-amber-600', border: 'border-amber-600', light: 'bg-amber-50' },
};

export function VideoTraining() {
  const [activeVideo, setActiveVideo] = useState<VideoLesson | null>(null);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [showKnowledgeCheck, setShowKnowledgeCheck] = useState(false);

  const totalLessons = trainingSections.reduce((sum, section) => sum + section.lessons.length, 0);

  const handleBackToTraining = () => {
    setActiveVideo(null);
    setShowKnowledgeCheck(false);
  };

  const handleVideoEnded = () => {
    setShowKnowledgeCheck(true);
  };

  const handleKnowledgeCheckComplete = () => {
    setActiveVideo(null);
    setShowKnowledgeCheck(false);
  };

  if (activeVideo) {
    // Show knowledge check after video ends
    if (showKnowledgeCheck) {
      return (
        <div className="max-w-3xl mx-auto">
          <button
            onClick={handleBackToTraining}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
            Back to Training
          </button>
          <KnowledgeCheck
            lessonId={activeVideo.id}
            lessonTitle={activeVideo.title}
            onComplete={handleKnowledgeCheckComplete}
          />
        </div>
      );
    }

    // Show video player
    return (
      <div className="max-w-5xl mx-auto">
        <button
          onClick={handleBackToTraining}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ChevronRight className="w-4 h-4 rotate-180" />
          Back to Training
        </button>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="aspect-video bg-black">
            <video
              key={activeVideo.videoUrl}
              controls
              autoPlay
              className="w-full h-full"
              controlsList="nodownload"
              onEnded={handleVideoEnded}
            >
              <source src={activeVideo.videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>

          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{activeVideo.title}</h2>
            <p className="text-gray-600">{activeVideo.description}</p>
            <div className="flex items-center gap-2 mt-4 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              <span>{activeVideo.duration}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mb-4">
          <Video className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-3">Video Training</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Learn essential front office skills through guided video lessons. Each module builds your knowledge for success in ambulatory care.
        </p>
        <div className="flex items-center justify-center gap-6 mt-4 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <Video className="w-4 h-4" />
            {totalLessons} {totalLessons === 1 ? 'Lesson' : 'Lessons'}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            ~60 min total
          </span>
        </div>
      </div>

      {/* Training Sections */}
      <div className="space-y-6">
        {trainingSections.map((section, index) => {
          const Icon = section.icon;
          const colors = colorClasses[section.color];
          const isExpanded = activeSection === section.id;

          return (
            <div
              key={section.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
            >
              {/* Section Header */}
              <button
                onClick={() => setActiveSection(isExpanded ? null : section.id)}
                className="w-full p-6 flex items-center gap-4 hover:bg-gray-50 transition-colors text-left"
              >
                <div className={`flex-shrink-0 w-12 h-12 ${colors.light} rounded-xl flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${colors.text}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-500">Module {index + 1}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">{section.title}</h3>
                  <p className="text-gray-600 text-sm mt-1">{section.description}</p>
                </div>
                <div className="flex-shrink-0 flex items-center gap-3">
                  <span className="text-sm text-gray-500">{section.lessons.length} {section.lessons.length === 1 ? 'lesson' : 'lessons'}</span>
                  <ChevronRight
                    className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                  />
                </div>
              </button>

              {/* Expanded Lessons */}
              {isExpanded && (
                <div className="border-t border-gray-200 bg-gray-50">
                  {section.lessons.map((lesson) => (
                    <button
                      key={lesson.id}
                      onClick={() => setActiveVideo(lesson)}
                      className="w-full p-4 pl-20 flex items-center gap-4 hover:bg-gray-100 transition-colors text-left border-b border-gray-200 last:border-b-0"
                    >
                      <div className={`flex-shrink-0 w-10 h-10 ${colors.bg} rounded-lg flex items-center justify-center`}>
                        <Play className="w-5 h-5 text-white ml-0.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900">{lesson.title}</h4>
                        <p className="text-sm text-gray-500 line-clamp-1">{lesson.description}</p>
                      </div>
                      <div className="flex-shrink-0 flex items-center gap-3">
                        <span className="text-sm text-gray-500">{lesson.duration}</span>
                        {lesson.completed && (
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Coming Soon Note */}
      <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-blue-50 rounded-xl border border-blue-100">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
            <BookOpen className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">More Training Coming Soon</h4>
            <p className="text-sm text-gray-600 mt-1">
              Additional modules covering patient scheduling, insurance verification, and daily workflows are in development.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
