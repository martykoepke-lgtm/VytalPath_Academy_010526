import { useState } from 'react';
import { Play, BookOpen, Stethoscope, Scale, ChevronRight, CheckCircle2, Clock, Video } from 'lucide-react';

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
    id: 'intro',
    title: 'Course Introduction',
    description: 'Get started with the fundamentals of healthcare front office operations',
    icon: BookOpen,
    color: 'teal',
    lessons: [
      {
        id: 'foundations',
        title: 'Healthcare Front Office Foundations',
        description: 'An introduction to the essential skills and knowledge needed for front office success in healthcare settings.',
        duration: '~5 min',
        videoUrl: '/videos/Healthcare Front Office Foundations.mp4',
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
        duration: '~5 min',
        videoUrl: '/videos/Acute vs. Ambulatory Care.mp4',
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
        duration: '~5 min',
        videoUrl: '/videos/HIPAA Essentials Explained.mp4',
      },
    ],
  },
];

const colorClasses: Record<string, { bg: string; text: string; border: string; light: string }> = {
  teal: { bg: 'bg-teal-600', text: 'text-teal-600', border: 'border-teal-600', light: 'bg-teal-50' },
  blue: { bg: 'bg-blue-600', text: 'text-blue-600', border: 'border-blue-600', light: 'bg-blue-50' },
  purple: { bg: 'bg-purple-600', text: 'text-purple-600', border: 'border-purple-600', light: 'bg-purple-50' },
};

export function VideoTraining() {
  const [activeVideo, setActiveVideo] = useState<VideoLesson | null>(null);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const totalLessons = trainingSections.reduce((sum, section) => sum + section.lessons.length, 0);

  if (activeVideo) {
    return (
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => setActiveVideo(null)}
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
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-teal-500 to-blue-600 rounded-2xl mb-4">
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
            ~15 min total
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
      <div className="mt-8 p-6 bg-gradient-to-r from-teal-50 to-blue-50 rounded-xl border border-teal-100">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
            <BookOpen className="w-5 h-5 text-teal-600" />
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
