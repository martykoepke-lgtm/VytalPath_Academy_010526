import { BookOpen, FileText, Search, GraduationCap, MapPin, ArrowRight, Stethoscope, ClipboardCheck, Building2, Info, Lightbulb } from 'lucide-react';
import type { NavigationView } from './Navigation';
import { FeatureCard } from './FeatureCard';

interface HomeViewProps {
  termCount: number;
  sopCount: number;
  onNavigate: (view: NavigationView) => void;
}

export function HomeView({ termCount, sopCount, onNavigate }: HomeViewProps) {
  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Welcome to Your Clinic Navigator
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-2">
          Essential resources for new healthcare clinic staff
        </p>
        <p className="text-sm text-gray-500">
          Learn the basics • Find what you need • Build confidence
        </p>
      </div>

      {/* Important Context Banner */}
      <div className="mb-12">
        <div className="bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 rounded-2xl border-2 border-blue-200 shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-teal-600 px-6 py-3">
            <div className="flex items-center gap-2 text-white">
              <Info className="w-5 h-5" />
              <h2 className="text-lg font-bold">What This Resource Is (And Isn't)</h2>
            </div>
          </div>
          <div className="p-6 md:p-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center mt-1">
                    <Lightbulb className="w-5 h-5 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2 text-lg">This Is Your Foundation</h3>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      This resource helps you understand <strong>foundational concepts</strong> you'll encounter in clinic work:
                      medical terminology, coding basics, HIPAA compliance, and common workflows. Think of it as your
                      "healthcare language learning\" tool.
                    </p>
                  </div>
                </div>
                <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
                  <p className="text-sm text-teal-900 font-medium mb-2">✓ You'll learn:</p>
                  <ul className="text-sm text-teal-800 space-y-1">
                    <li>• What terms like "superbill" and "co-pay" mean</li>
                    <li>• How ICD-10 and CPT codes work</li>
                    <li>• Why HIPAA matters and what PHI is</li>
                    <li>• General clinic processes and workflows</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mt-1">
                    <Building2 className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2 text-lg">Your Clinic Will Train You</h3>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      Every clinic, hospital, or practice has <strong>specific onboarding training</strong> tailored to their
                      systems, technology, and organizational processes. They'll teach you their specific EHR system,
                      their workflows, and their unique standard operating procedures.
                    </p>
                  </div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-900 font-medium mb-2">✓ Your employer will teach:</p>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Their specific EHR/PMS system (Epic, Cerner, Athena, etc.)</li>
                    <li>• Their internal policies and procedures</li>
                    <li>• Their scheduling and billing workflows</li>
                    <li>• Location-specific processes and protocols</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-white rounded-lg p-5 border-2 border-gray-200">
              <div className="flex items-start gap-3">
                <span className="text-2xl">💡</span>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">The Goal: Start Your Job with Confidence</h4>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    This resource helps you <strong>understand what your trainer is talking about</strong> when they mention
                    "checking eligibility," "posting payments,\" or \"updating the problem list.\" You'll walk into your first
                    day knowing the <em>language</em> and <em>concepts</em>, making your organization-specific training easier to absorb.
                    Think of this as learning grammar before traveling to a new country - your employer will teach you their
                    local dialect.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Guide */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">What Can You Find Here?</h2>
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Clinic Basics */}
          <button
            onClick={() => onNavigate('academy')}
            className="group bg-white rounded-xl p-6 shadow-md border-2 border-teal-200 hover:border-teal-400 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 text-left"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center shadow-md">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Clinic Basics</h3>
                <p className="text-xs text-teal-600 font-medium">Start here if you're new!</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Learn foundational clinic knowledge: HIPAA compliance, medical coding (ICD-10, CPT), EHR basics, and patient privacy essentials.
            </p>
            <div className="flex items-center gap-2 text-teal-600 text-sm font-semibold">
              <span>Begin Learning</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Terms in Healthcare */}
          <button
            onClick={() => onNavigate('terms')}
            className="group bg-white rounded-xl p-6 shadow-md border-2 border-blue-200 hover:border-blue-400 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 text-left"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Terms in Healthcare</h3>
                <p className="text-xs text-blue-600 font-medium">{termCount.toLocaleString()} clinic terms</p>
              </div>
            </div>
            <div className="space-y-3 mb-4">
              <p className="text-sm text-gray-900 font-semibold">
                Find complete, ready-to-use terms:
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                Healthcare acronyms (HIPAA, PHI, CT, MRI), clinic operations (Eligibility, Co-pay, Prior Authorization), imaging procedures (CT Head, MRI Brain), and step-by-step workflows (Patient Check-In, Scheduling)
              </p>
              <p className="text-xs text-gray-500 italic border-t border-gray-200 pt-2">
                Need to break down medical word parts? Visit the Medical Terminology tab for prefixes (hyper-, pre-), suffixes (-ectomy, -itis), and root words (cardi-, gastro-)
              </p>
            </div>
            <div className="flex items-center gap-2 text-blue-600 text-sm font-semibold">
              <span>Browse Terms</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Front Office Common Workflows */}
          <button
            onClick={() => onNavigate('sops')}
            className="group bg-white rounded-xl p-6 shadow-md border-2 border-indigo-200 hover:border-indigo-400 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 text-left"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
                <ClipboardCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Front Office Common Workflows</h3>
                <p className="text-xs text-indigo-600 font-medium">{sopCount} workflows</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Step-by-step guides for clinic tasks: patient check-in, insurance verification, appointment scheduling, and common front desk workflows.
            </p>
            <div className="flex items-center gap-2 text-indigo-600 text-sm font-semibold">
              <span>View Workflows</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </div>
      </div>

      {/* Additional Resources */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Additional Resources</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Quick Search */}
          <button
            onClick={() => onNavigate('search')}
            className="group bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-6 shadow-md border border-emerald-200 hover:border-emerald-400 transition-all duration-300 hover:shadow-xl text-left"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center shadow-md">
                <Search className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Quick Search</h3>
            </div>
            <p className="text-sm text-gray-600">
              Need to find something fast? Search across all clinic terms, workflows, and resources instantly.
            </p>
          </button>

          {/* Medical Terminology */}
          <button
            onClick={() => onNavigate('terminology')}
            className="group bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 shadow-md border border-purple-200 hover:border-purple-400 transition-all duration-300 hover:shadow-xl text-left"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center shadow-md">
                <Stethoscope className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Medical Terminology</h3>
            </div>
            <p className="text-sm text-gray-600">
              Build your medical vocabulary: prefixes, suffixes, root words, and anatomical terms for clinical understanding.
            </p>
          </button>
        </div>
      </div>

      {/* Your Learning Path */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-8 shadow-md border border-amber-200 mb-12">
        <div className="flex items-center gap-3 mb-6">
          <MapPin className="w-6 h-6 text-amber-600" />
          <h2 className="text-2xl font-bold text-gray-900">Your Learning Path</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-5 shadow-sm">
            <div className="w-10 h-10 bg-teal-600 text-white rounded-full flex items-center justify-center mb-3 text-lg font-bold">1</div>
            <h3 className="font-bold text-gray-900 mb-2">Foundation First</h3>
            <p className="text-sm text-gray-600">
              Start with <strong>Clinic Basics</strong> to learn HIPAA, coding systems, and core compliance requirements.
            </p>
          </div>
          <div className="bg-white rounded-lg p-5 shadow-sm">
            <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center mb-3 text-lg font-bold">2</div>
            <h3 className="font-bold text-gray-900 mb-2">Build Vocabulary</h3>
            <p className="text-sm text-gray-600">
              Use <strong>Terms in Healthcare</strong> as your daily reference for clinic-specific language and abbreviations.
            </p>
          </div>
          <div className="bg-white rounded-lg p-5 shadow-sm">
            <div className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center mb-3 text-lg font-bold">3</div>
            <h3 className="font-bold text-gray-900 mb-2">Apply in Practice</h3>
            <p className="text-sm text-gray-600">
              Follow <strong>Common Workflows</strong> step-by-step as you perform actual clinic tasks and workflows.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Tips */}
      <div className="bg-white rounded-xl shadow-md p-8 border-l-4 border-teal-500">
        <h3 className="text-2xl font-semibold text-gray-900 mb-6">Tips for Success</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
              <span className="text-teal-600 font-bold">✓</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">Don't memorize everything</h4>
              <p className="text-sm text-gray-600">Use this as a reference tool. You'll naturally learn terms as you use them in context.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-bold">✓</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">Keep it handy</h4>
              <p className="text-sm text-gray-600">Bookmark this site on your phone for quick lookups during your shift.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
              <span className="text-indigo-600 font-bold">✓</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">Start with basics</h4>
              <p className="text-sm text-gray-600">HIPAA and patient privacy are critical - review Clinic Basics first.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
              <span className="text-emerald-600 font-bold">✓</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">Ask questions</h4>
              <p className="text-sm text-gray-600">This is a learning resource, but always verify procedures with your supervisor.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
