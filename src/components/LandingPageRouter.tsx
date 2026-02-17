import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  ArrowRight, CheckCircle, Shield, BookOpen, Award, Play, Star,
  Building2, GraduationCap, Target
} from 'lucide-react';

export function LandingPageRouter() {
  const navigate = useNavigate();

  const handleEnter = () => {
    navigate('/foundations');
  };

  return (
    <>
      <Helmet>
        <title>VytalPath Academy | Healthcare Front Office Learning</title>
        <meta name="description" content="Online learning platform for healthcare front office topics. Explore HIPAA compliance, insurance verification, medical terminology, and clinical workflows. Start learning today." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* Header/Nav */}
        <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src="/vp-checkmark.png"
                  alt="VytalPath"
                  className="h-10 w-auto"
                />
                <span className="text-xl font-bold text-gray-900">VytalPath Academy</span>
              </div>
              <button
                onClick={handleEnter}
                className="px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
              >
                Start Training
              </button>
            </div>
          </div>
        </header>

        {/* Hero Section - Problem-Agitation-Solution */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6">
                <Shield className="w-4 h-4" />
                <span>Professional Healthcare Training</span>
              </div>

              {/* Headline - Benefit focused */}
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Learn Healthcare Front Office Fundamentals
                <span className="text-blue-600"> At Your Own Pace</span>
              </h1>

              {/* Subheadline - Address the problem */}
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Don't struggle through your first weeks on the job. Our structured video training
                teaches you HIPAA, insurance verification, medical terminology, and daily workflows
                — everything clinics expect you to know on day one.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button
                  onClick={handleEnter}
                  className="group px-8 py-4 text-lg font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  Start Learning Now
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => document.getElementById('curriculum')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-8 py-4 text-lg font-semibold text-gray-700 bg-white border-2 border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
                >
                  <Play className="w-5 h-5" />
                  View Curriculum
                </button>
              </div>

              {/* Quick trust indicators */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>No signup required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Self-paced learning</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Certificate included</span>
                </div>
              </div>
            </div>

            {/* Hero Image/Stats Card */}
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
                {/* Stats Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
                  <h3 className="text-lg font-semibold mb-1">Complete Learning Platform</h3>
                  <p className="text-blue-100 text-sm">Everything you need to learn</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-px bg-gray-100">
                  <div className="bg-white p-6 text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-1">20+</div>
                    <div className="text-sm text-gray-600">Video Lessons</div>
                  </div>
                  <div className="bg-white p-6 text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-1">4</div>
                    <div className="text-sm text-gray-600">Core Modules</div>
                  </div>
                  <div className="bg-white p-6 text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-1">24</div>
                    <div className="text-sm text-gray-600">Workflow Guides</div>
                  </div>
                  <div className="bg-white p-6 text-center">
                    <div className="text-3xl font-bold text-green-600 mb-1">100%</div>
                    <div className="text-sm text-gray-600">Self-Paced</div>
                  </div>
                </div>

                {/* Bottom CTA */}
                <div className="p-4 bg-gray-50 border-t border-gray-100">
                  <button
                    onClick={handleEnter}
                    className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Begin Training Now
                  </button>
                </div>
              </div>

              {/* Floating badge */}
              <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg p-4 border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Award className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Earn Certificates</div>
                    <div className="text-sm text-gray-500">Add to your resume</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Who This Is For Section */}
        <section className="bg-white py-16 border-y border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Perfect For Your Career Stage
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Whether you're just starting out or leveling up, we've got you covered
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
                <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center mb-6">
                  <GraduationCap className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">New to Healthcare</h3>
                <p className="text-gray-600 mb-4">
                  Starting your first clinic job? Build confidence before day one with
                  comprehensive training on everything you'll encounter.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                    Learn HIPAA from scratch
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                    Understand insurance basics
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                    Master check-in workflows
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-100">
                <div className="w-14 h-14 bg-green-600 rounded-xl flex items-center justify-center mb-6">
                  <Building2 className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Career Changers</h3>
                <p className="text-gray-600 mb-4">
                  Transitioning from retail, hospitality, or another field?
                  Get healthcare-specific skills that set you apart.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Medical terminology crash course
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Insurance operations training
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Certificates for interviews
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-8 border border-purple-100">
                <div className="w-14 h-14 bg-purple-600 rounded-xl flex items-center justify-center mb-6">
                  <Target className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Clinic Trainers</h3>
                <p className="text-gray-600 mb-4">
                  Need to train your team? Use our platform as your
                  standardized onboarding curriculum.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-purple-600" />
                    Consistent training for all staff
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-purple-600" />
                    Quizzes verify comprehension
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-purple-600" />
                    Self-paced, frees up your time
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Curriculum Section */}
        <section id="curriculum" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Your Complete Training Curriculum
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Four comprehensive modules covering everything front office staff need to know
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Module 1 */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-blue-100 text-sm font-medium">Module 1</div>
                    <h3 className="text-xl font-bold text-white">Foundations of Healthcare</h3>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4">
                  Understand healthcare settings, HIPAA regulations, patient privacy, and medical ethics.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2 text-gray-700">
                    <Play className="w-4 h-4 text-blue-600" />
                    Healthcare Front Office Foundations
                  </li>
                  <li className="flex items-center gap-2 text-gray-700">
                    <Play className="w-4 h-4 text-blue-600" />
                    Acute vs. Ambulatory Care
                  </li>
                  <li className="flex items-center gap-2 text-gray-700">
                    <Play className="w-4 h-4 text-blue-600" />
                    HIPAA & PHI Essentials
                  </li>
                  <li className="flex items-center gap-2 text-gray-700">
                    <Play className="w-4 h-4 text-blue-600" />
                    Authorization & Consent
                  </li>
                </ul>
              </div>
            </div>

            {/* Module 2 */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow">
              <div className="bg-gradient-to-r from-green-600 to-green-700 p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-green-100 text-sm font-medium">Module 2</div>
                    <h3 className="text-xl font-bold text-white">Insurance Training</h3>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4">
                  Master insurance verification, copays, deductibles, and payment collection.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2 text-gray-700">
                    <Play className="w-4 h-4 text-green-600" />
                    Reading Insurance Cards
                  </li>
                  <li className="flex items-center gap-2 text-gray-700">
                    <Play className="w-4 h-4 text-green-600" />
                    Eligibility Verification
                  </li>
                  <li className="flex items-center gap-2 text-gray-700">
                    <Play className="w-4 h-4 text-green-600" />
                    Copays, Deductibles & Coinsurance
                  </li>
                  <li className="flex items-center gap-2 text-gray-700">
                    <Play className="w-4 h-4 text-green-600" />
                    Collecting Patient Payments
                  </li>
                </ul>
              </div>
            </div>

            {/* Module 3 */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow">
              <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <GraduationCap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-purple-100 text-sm font-medium">Module 3</div>
                    <h3 className="text-xl font-bold text-white">Medical Terminology</h3>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4">
                  Learn medical prefixes, roots, suffixes, and common abbreviations with interactive flashcards.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2 text-gray-700">
                    <BookOpen className="w-4 h-4 text-purple-600" />
                    Prefixes & Suffixes Guide
                  </li>
                  <li className="flex items-center gap-2 text-gray-700">
                    <BookOpen className="w-4 h-4 text-purple-600" />
                    Root Words for Body Systems
                  </li>
                  <li className="flex items-center gap-2 text-gray-700">
                    <BookOpen className="w-4 h-4 text-purple-600" />
                    Common Abbreviations
                  </li>
                  <li className="flex items-center gap-2 text-gray-700">
                    <Star className="w-4 h-4 text-purple-600" />
                    Interactive Study Mode
                  </li>
                </ul>
              </div>
            </div>

            {/* Module 4 */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow">
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-amber-100 text-sm font-medium">Module 4</div>
                    <h3 className="text-xl font-bold text-white">Navigating Workflows</h3>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4">
                  Master patient registration, scheduling, and daily front office procedures.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2 text-gray-700">
                    <Play className="w-4 h-4 text-amber-600" />
                    New Patient Registration
                  </li>
                  <li className="flex items-center gap-2 text-gray-700">
                    <Play className="w-4 h-4 text-amber-600" />
                    Appointment Scheduling
                  </li>
                  <li className="flex items-center gap-2 text-gray-700">
                    <Play className="w-4 h-4 text-amber-600" />
                    Check-In & Check-Out
                  </li>
                  <li className="flex items-center gap-2 text-gray-700">
                    <Star className="w-4 h-4 text-amber-600" />
                    24 Quick Reference SOPs
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <button
              onClick={handleEnter}
              className="group px-8 py-4 text-lg font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl inline-flex items-center gap-2"
            >
              Start Module 1 Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-12 shadow-2xl">
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Start Learning?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of healthcare professionals who started here.
              Your first lesson is waiting.
            </p>
            <button
              onClick={handleEnter}
              className="px-10 py-4 text-lg font-bold text-blue-700 bg-white rounded-xl hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl inline-flex items-center gap-2"
            >
              Start Your Training
              <ArrowRight className="w-5 h-5" />
            </button>
            <p className="text-sm text-blue-200 mt-4">
              No signup required. Start learning in 30 seconds.
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-gray-400 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <img
                  src="/vp-checkmark.png"
                  alt="VytalPath"
                  className="h-8 w-auto brightness-0 invert"
                />
                <span className="text-white font-semibold">VytalPath Academy</span>
              </div>
              <p className="text-sm text-center md:text-left">
                Professional healthcare front office training. HIPAA, insurance, terminology, and workflows.
              </p>
              <div className="text-sm">
                &copy; {new Date().getFullYear()} VytalPath Academy
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
