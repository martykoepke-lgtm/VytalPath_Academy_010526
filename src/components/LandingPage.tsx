import { BookOpen, Search, GraduationCap, FileText, ArrowRight, CheckCircle, Users, Clock, Zap } from 'lucide-react';

interface LandingPageProps {
  onEnter: () => void;
}

export function LandingPage({ onEnter }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-indigo-50">
      {/* Header/Nav */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-600 to-blue-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">VytalPath Academy</h1>
                <p className="text-xs text-gray-500">Reference & Training</p>
              </div>
            </div>
            <button
              onClick={onEnter}
              className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-teal-600 to-blue-600 rounded-lg hover:from-teal-700 hover:to-blue-700 transition-all shadow-md hover:shadow-lg"
            >
              Enter the App
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center mb-12">
          <div className="inline-block mb-6">
            <div className="bg-gradient-to-r from-teal-600 to-blue-600 rounded-2xl p-1 shadow-xl mb-4">
              <div className="bg-white rounded-xl px-6 py-3">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-6 h-6 text-teal-600" />
                  <span className="text-lg font-bold text-gray-900">Powered by VytalPath Academy</span>
                </div>
              </div>
            </div>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Your First Day
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-blue-600">
              Starts Here
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Learn the terminology, workflows, and skills you need to thrive at the front desk.
            Built specifically for new clinic staff like you.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onEnter}
              className="group px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-teal-600 to-blue-600 rounded-xl hover:from-teal-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              Enter the App
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mt-16">
          <div className="bg-white rounded-xl p-6 shadow-md text-center">
            <div className="text-3xl font-bold text-teal-600 mb-1">1,000+</div>
            <div className="text-sm text-gray-600">Healthcare Terms</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md text-center">
            <div className="text-3xl font-bold text-blue-600 mb-1">12</div>
            <div className="text-sm text-gray-600">Common Workflows</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md text-center">
            <div className="text-3xl font-bold text-indigo-600 mb-1">20+</div>
            <div className="text-sm text-gray-600">Learning Modules</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md text-center">
            <div className="text-3xl font-bold text-purple-600 mb-1">Free</div>
            <div className="text-sm text-gray-600">Forever</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Succeed
            </h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive resources designed specifically for new healthcare clinic staff
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">Clinic Terminology</h4>
              <p className="text-gray-600 text-sm">
                Master essential healthcare terms, abbreviations, and operational definitions
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">Common Workflows</h4>
              <p className="text-gray-600 text-sm">
                Step-by-step guides for patient check-in, scheduling, and front desk procedures
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">Clinic Basics</h4>
              <p className="text-gray-600 text-sm">
                Learn HIPAA compliance, medical coding, billing fundamentals, and regulations
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Search className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">Quick Search</h4>
              <p className="text-gray-600 text-sm">
                Instantly find definitions, workflows, and procedures when you need them
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-4xl font-bold text-gray-900 mb-6">
              Why VytalPath Academy?
            </h3>
            <p className="text-lg text-gray-600 mb-8">
              Starting a new healthcare job can be overwhelming. VytalPath Academy prepares you with the
              foundational knowledge you need to understand your training and succeed from day one.
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center mt-1">
                  <CheckCircle className="w-4 h-4 text-teal-600" />
                </div>
                <div>
                  <h5 className="font-semibold text-gray-900 mb-1">Foundation First</h5>
                  <p className="text-gray-600 text-sm">
                    Learn the language and concepts before your first day so you can understand what your trainer is teaching you
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-1">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h5 className="font-semibold text-gray-900 mb-1">Self-Paced Learning</h5>
                  <p className="text-gray-600 text-sm">
                    Access materials anytime, anywhere. Review concepts as many times as you need
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center mt-1">
                  <CheckCircle className="w-4 h-4 text-indigo-600" />
                </div>
                <div>
                  <h5 className="font-semibold text-gray-900 mb-1">Practical & Relevant</h5>
                  <p className="text-gray-600 text-sm">
                    Real-world workflows and terminology you'll actually use in clinic operations
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mt-1">
                  <CheckCircle className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <h5 className="font-semibold text-gray-900 mb-1">Always Free</h5>
                  <p className="text-gray-600 text-sm">
                    Complete access to all resources at no cost. No hidden fees, ever
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-teal-50 to-blue-50 rounded-2xl p-8 border-2 border-teal-200 shadow-xl">
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="flex items-center gap-3 mb-3">
                  <Users className="w-8 h-8 text-teal-600" />
                  <h5 className="font-bold text-gray-900">Perfect for New Staff</h5>
                </div>
                <p className="text-gray-600 text-sm">
                  Whether you're starting your first healthcare job or transitioning to clinic work,
                  this platform gives you the foundation you need
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="flex items-center gap-3 mb-3">
                  <Clock className="w-8 h-8 text-blue-600" />
                  <h5 className="font-bold text-gray-900">Learn at Your Pace</h5>
                </div>
                <p className="text-gray-600 text-sm">
                  Study before you start, review during training, or reference while on the job.
                  It's your personal healthcare knowledge base
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-md">
                <div className="flex items-center gap-3 mb-3">
                  <Zap className="w-8 h-8 text-indigo-600" />
                  <h5 className="font-bold text-gray-900">Start Immediately</h5>
                </div>
                <p className="text-gray-600 text-sm">
                  Create your free account and begin learning right away. No waiting, no approval process
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-teal-600 to-blue-600 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-4xl font-bold text-white mb-4">
            Ready to Start Learning?
          </h3>
          <p className="text-xl text-teal-50 mb-8">
            Join VytalPath Academy today and build the foundation for your healthcare career
          </p>
          <button
            onClick={onEnter}
            className="px-8 py-4 text-lg font-semibold text-teal-700 bg-white rounded-xl hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl"
          >
            Enter the App
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-teal-400" />
            <span className="text-white font-semibold">VytalPath Academy</span>
          </div>
          <p className="text-sm">
            Your comprehensive healthcare training and reference platform
          </p>
        </div>
      </footer>
    </div>
  );
}
