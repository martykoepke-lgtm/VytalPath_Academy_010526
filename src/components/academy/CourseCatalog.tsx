import { useState } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Clock, BookOpen, Lock, ChevronRight, CheckCircle, Play, Sparkles, X } from 'lucide-react';
import type { Course } from '../../types/course';

// Supabase Storage base URL for videos
const VIDEO_BASE_URL = 'https://vwieorhlcapeeamvltqa.supabase.co/storage/v1/object/public/videos';

// Temporary hardcoded data - will be replaced with database fetch
const courses: (Course & { modules_count: number; lessons_count: number; progress_percent?: number })[] = [
  {
    id: '1',
    slug: 'healthcare-admin-essentials',
    title: 'Healthcare Foundations',
    description: 'Build the foundation for any healthcare administrative role. Learn about healthcare settings, medical law and ethics, insurance fundamentals, and essential terminology.',
    type: 'foundation',
    prerequisite_ids: [],
    sort_order: 1,
    is_published: true,
    estimated_hours: 2,
    certificate_title: 'Healthcare Foundations Certificate',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    modules_count: 4,
    lessons_count: 14,
  },
  {
    id: '2',
    slug: 'front-office-specialist',
    title: 'Front Office Specialist',
    description: 'Master the daily operations of a healthcare front office. Deep-dive into insurance verification, eligibility, copays, deductibles, and payment collection.',
    type: 'role',
    prerequisite_ids: ['1'],
    sort_order: 2,
    is_published: true,
    estimated_hours: 1,
    certificate_title: 'Front Office Specialist Certificate',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    modules_count: 1,
    lessons_count: 6,
  },
  {
    id: '3',
    slug: 'referrals-prior-auth',
    title: 'Referrals & Prior Authorization',
    description: 'Specialize in managing referrals and prior authorizations. Learn insurance portals, clinical documentation, and follow-up tracking.',
    type: 'role',
    prerequisite_ids: ['1'],
    sort_order: 3,
    is_published: false,
    estimated_hours: 3,
    certificate_title: 'Referrals & Prior Auth Specialist Certificate',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    modules_count: 3,
    lessons_count: 8,
  },
];

const courseTypeLabels: Record<string, { label: string; color: string }> = {
  foundation: { label: 'Foundation', color: 'bg-blue-100 text-blue-700' },
  role: { label: 'Role Specialty', color: 'bg-blue-100 text-blue-700' },
  advanced: { label: 'Advanced', color: 'bg-indigo-100 text-indigo-700' },
};

export function CourseCatalog() {
  const [showIntroVideo, setShowIntroVideo] = useState(false);

  // DEVELOPMENT MODE: All courses unlocked for testing
  // TODO: Re-enable locking when content is finalized
  const isCourseLocked = (_course: typeof courses[0]) => {
    return false; // All unlocked for testing
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 mb-4">
          <img src="/icons/courses-icon.png" alt="Courses" className="w-14 h-14" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-3">Learning Paths</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Build your healthcare administration career step by step. Start with the foundation course, then specialize in your role.
        </p>
      </div>

      {/* Welcome Video Section */}
      {showIntroVideo ? (
        <div className="mb-10 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-teal-50 border-b border-blue-100">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-gray-900">Welcome to VytalPath Academy</span>
            </div>
            <button
              onClick={() => setShowIntroVideo(false)}
              className="p-1 hover:bg-blue-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          <div className="aspect-video bg-black">
            <video
              controls
              autoPlay
              className="w-full h-full"
              controlsList="nodownload"
            >
              <source src={`${VIDEO_BASE_URL}/vytalpath-academy-introduction.mp4`} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      ) : (
        <div className="mb-10 bg-gradient-to-r from-blue-50 via-teal-50 to-blue-50 rounded-xl border border-teal-200 overflow-hidden">
          <div className="p-6 flex items-center gap-6">
            <button
              onClick={() => setShowIntroVideo(true)}
              className="flex-shrink-0 w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105 transition-all cursor-pointer"
            >
              <Play className="w-10 h-10 text-white ml-1" />
            </button>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-600">Start Here</span>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Welcome to VytalPath Academy</h2>
              <p className="text-gray-600 text-sm">
                Meet your AI instructor and discover how this program will prepare you for success in healthcare front office roles.
              </p>
            </div>
            <button
              onClick={() => setShowIntroVideo(true)}
              className="flex-shrink-0 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
            >
              <Play className="w-4 h-4" />
              Watch Intro
            </button>
          </div>
        </div>
      )}

      {/* Learning Path Visual */}
      <div className="mb-10 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">Your Learning Path</h2>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm border-2 border-blue-600">
            <CheckCircle className="w-5 h-5 text-blue-700" />
            <span className="font-medium text-gray-900">Foundation</span>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200">
            <Lock className="w-5 h-5 text-gray-400" />
            <span className="font-medium text-gray-500">Role Specialty</span>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200">
            <Lock className="w-5 h-5 text-gray-400" />
            <span className="font-medium text-gray-500">Advanced</span>
          </div>
        </div>
      </div>

      {/* Course Cards */}
      <div className="space-y-6">
        {courses.map((course) => {
          const locked = isCourseLocked(course);
          const typeInfo = courseTypeLabels[course.type];

          return (
            <div
              key={course.id}
              className={`bg-white rounded-xl shadow-sm border overflow-hidden transition-all ${
                locked ? 'border-gray-200 opacity-75' : 'border-gray-200 hover:shadow-md hover:border-blue-200'
              }`}
            >
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center ${
                    locked ? 'bg-gray-100' : 'bg-gradient-to-br from-blue-600 to-blue-700'
                  }`}>
                    {locked ? (
                      <Lock className="w-7 h-7 text-gray-400" />
                    ) : (
                      <BookOpen className="w-7 h-7 text-white" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${typeInfo.color}`}>
                        {typeInfo.label}
                      </span>
                      {!course.is_published && (
                        <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                          Coming Soon
                        </span>
                      )}
                    </div>

                    <h3 className={`text-xl font-bold mb-2 ${locked ? 'text-gray-500' : 'text-gray-900'}`}>
                      {course.title}
                    </h3>

                    <p className={`text-sm mb-4 ${locked ? 'text-gray-400' : 'text-gray-600'}`}>
                      {course.description}
                    </p>

                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-4 h-4" />
                        {course.modules_count} modules
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        ~{course.estimated_hours} hours
                      </span>
                    </div>

                    {locked && course.prerequisite_ids.length > 0 && (
                      <p className="mt-3 text-sm text-amber-600 flex items-center gap-1">
                        <Lock className="w-4 h-4" />
                        Complete "Healthcare Foundations" to unlock
                      </p>
                    )}
                  </div>

                  <div className="flex-shrink-0">
                    {locked ? (
                      <div className="px-4 py-2 text-sm font-medium text-gray-400 bg-gray-100 rounded-lg">
                        Locked
                      </div>
                    ) : (
                      <Link
                        to={`/courses/${course.slug}`}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all"
                      >
                        {course.progress_percent !== undefined ? 'Continue' : 'Start Course'}
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    )}
                  </div>
                </div>

                {/* Progress bar (if enrolled) */}
                {course.progress_percent !== undefined && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium text-blue-700">{course.progress_percent}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all"
                        style={{ width: `${course.progress_percent}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Certificate Info */}
      <div className="mt-10 p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
            <img src="/icons/courses-icon.png" alt="Progress" className="w-10 h-10" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 mb-1">Track Your Progress</h3>
            <p className="text-sm text-gray-600">
              Complete each course and knowledge check to track your understanding across all healthcare front office topics.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
