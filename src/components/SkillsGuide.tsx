import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield, CreditCard, Monitor, ClipboardCheck, Calendar,
  BookOpen, Phone, FileText, ArrowRightLeft, AlertTriangle,
  ArrowRight, Mail, User, Loader2, CheckCircle, AlertCircle,
  type LucideIcon
} from 'lucide-react';
import { SEO, seoConfigs } from './SEO';
import { supabase } from '../lib/supabase';

const STORAGE_KEY = 'vytalpath_skills_unlocked';

interface Skill {
  number: number;
  icon: LucideIcon;
  title: string;
  description: string;
  atVytalPath: string;
}

const skills: Skill[] = [
  {
    number: 1,
    icon: Shield,
    title: 'HIPAA Compliance & Patient Privacy',
    description:
      'Every conversation at the front desk involves Protected Health Information, and a single violation can cost your clinic $50,000 or more. You need to know the 18 HIPAA identifiers, when authorization is required, and how to apply the Minimum Necessary Standard in real scenarios.',
    atVytalPath:
      '18 compliance lessons with video and reading modules, plus an interactive HIPAA Scenario Sorter exercise.',
  },
  {
    number: 2,
    icon: CreditCard,
    title: 'Insurance Verification & Eligibility',
    description:
      'Before a patient sits down, you need to confirm active coverage, know their copay, check referral requirements, and document the verification. Most billing errors and patient complaints start right here.',
    atVytalPath:
      '18 insurance lessons covering eligibility verification, copays, deductibles, coinsurance, and an Insurance Term Match exercise.',
  },
  {
    number: 3,
    icon: Monitor,
    title: 'EHR Navigation & Documentation',
    description:
      'Every clinic runs on an electronic health record system. You\'ll register patients, schedule visits, route messages, and manage encounters in it all day. Clinics don\'t have time to teach you from scratch.',
    atVytalPath:
      '13 EHR & Practice Management lessons plus the only built-in EHR Practice Lab in any learning platform — no external software needed.',
  },
  {
    number: 4,
    icon: ClipboardCheck,
    title: 'Patient Registration & Data Entry',
    description:
      'Collecting demographics, scanning insurance cards, verifying identity, confirming consent forms — the registration workflow touches compliance, billing, and clinical care all at once. Errors here cascade everywhere.',
    atVytalPath:
      'Registration workflow lessons, 24 step-by-step SOP guides, and hands-on check-in/check-out practice in the EHR Lab.',
  },
  {
    number: 5,
    icon: Calendar,
    title: 'Scheduling & Appointment Management',
    description:
      'It\'s not just picking a time slot. You need to know visit types (new patient vs. follow-up vs. annual wellness), provider templates, appointment durations, and how to handle cancellations without wrecking the schedule.',
    atVytalPath:
      'Scheduling workflow lessons, encounter type training, and full appointment management in the EHR Practice Lab.',
  },
  {
    number: 6,
    icon: BookOpen,
    title: 'Medical Terminology',
    description:
      'Doctors and nurses won\'t slow down for you. When someone says "the tachycardic patient in room 3 needs a CBC and BMP stat," you need to follow. You don\'t need fluency — but you need to decode fast.',
    atVytalPath:
      '5 terminology lessons covering prefixes, roots, suffixes, and abbreviations, plus interactive flashcard study mode.',
  },
  {
    number: 7,
    icon: Phone,
    title: 'Phone Communication & Professionalism',
    description:
      'The phone rings constantly. You\'re the first voice patients hear. You need a professional greeting, hold etiquette, warm transfers, HIPAA-safe voicemails, and the ability to de-escalate an upset caller.',
    atVytalPath:
      'Phone Call Simulator with realistic AI-powered scenarios, plus 11 lessons on communication foundations and difficult conversations.',
  },
  {
    number: 8,
    icon: FileText,
    title: 'Billing & Payment Collection',
    description:
      'You\'ll collect copays, explain balances, handle payment questions, and understand EOBs. You don\'t need to be a coder — but you need to explain how copays, deductibles, and coinsurance work to a confused patient.',
    atVytalPath:
      'ICD-10, CPT, HCPCS, and SNOMED CT coding basics, plus lessons on copay collection and revenue cycle fundamentals.',
  },
  {
    number: 9,
    icon: ArrowRightLeft,
    title: 'Referrals & Prior Authorization',
    description:
      'Referrals and prior authorizations are one of the fastest-growing administrative burdens in healthcare. Getting them wrong means delayed care, denied claims, and frustrated patients and providers.',
    atVytalPath:
      '6-lesson referral module covering inbound/outbound referrals, prior auth workflows, imaging/procedure/Rx authorizations, and tracking appeals.',
  },
  {
    number: 10,
    icon: AlertTriangle,
    title: 'Workplace Compliance & Safety',
    description:
      'OSHA standards, mandatory reporting, incident documentation, emergency preparedness — these aren\'t optional. Clinics get audited, and staff who don\'t know the basics are a liability.',
    atVytalPath:
      '6 workplace safety lessons covering OSHA regulations, mandatory reporting, incident reports, regulatory agencies, and emergency preparedness.',
  },
];

function SkillCard({ skill, locked }: { skill: Skill; locked?: boolean }) {
  const Icon = skill.icon;
  return (
    <div
      className={`bg-white rounded-2xl shadow-apple-sm border border-gray-200/50 p-6 transition-all duration-300 ${
        locked ? '' : 'hover-lift'
      }`}
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center relative">
            <Icon className="w-6 h-6 text-blue-600" />
            <span className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-blue-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
              {skill.number}
            </span>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {skill.title}
          </h3>
          <p className="text-sm text-gray-500 leading-relaxed mb-3">
            {skill.description}
          </p>
          <div className="bg-blue-50/50 rounded-xl px-4 py-3 border border-blue-100/50">
            <p className="text-xs text-blue-700 leading-relaxed">
              <span className="font-semibold">At VytalPath:</span>{' '}
              {skill.atVytalPath}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SkillsGuide() {
  const [unlocked, setUnlocked] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) === 'true';
  });
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);

    const { error: insertError } = await supabase.from('leads').insert({
      email: trimmedEmail,
      name: name.trim() || null,
      source: '10-skills-guide',
    });

    if (insertError) {
      console.error('Lead submission error:', insertError);
      setError('Something went wrong. Please try again.');
      setLoading(false);
      return;
    }

    localStorage.setItem(STORAGE_KEY, 'true');
    setUnlocked(true);
    setSuccess(true);
    setLoading(false);
  };

  const teaserSkills = skills.slice(0, 3);
  const gatedSkills = skills.slice(3);

  return (
    <>
      <SEO {...seoConfigs.skillsGuide} />
      <article className="min-h-screen bg-gray-50/30">
        {/* Hero */}
        <section className="bg-white border-b border-gray-100">
          <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 pt-10 pb-12 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold uppercase tracking-wider mb-6">
              <BookOpen className="w-3.5 h-3.5" />
              Free Guide
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-gray-900 mb-4 leading-tight">
              The 10 Skills Every Healthcare{' '}
              <span className="text-blue-600">Front Office Professional</span>{' '}
              Needs
            </h1>
            <p className="text-lg font-light text-gray-500 max-w-2xl mx-auto leading-relaxed">
              Whether you're exploring a front desk role or learning
              what the job involves, these are the 10 skills that matter most.
            </p>
          </div>
        </section>

        {/* Skills */}
        <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 py-10">
          {/* Always-visible skills 1-3 */}
          <div className="space-y-4 mb-4">
            {teaserSkills.map((skill) => (
              <SkillCard key={skill.number} skill={skill} />
            ))}
          </div>

          {/* Gated section: skills 4-10 */}
          {!unlocked ? (
            <div className="relative">
              {/* Blurred preview of skills 4-5 */}
              <div
                className="space-y-4 select-none pointer-events-none"
                aria-hidden="true"
                style={{ filter: 'blur(8px)', opacity: 0.5 }}
              >
                {gatedSkills.slice(0, 2).map((skill) => (
                  <SkillCard key={skill.number} skill={skill} locked />
                ))}
              </div>

              {/* Email gate overlay */}
              <div className="absolute inset-0 flex items-start justify-center pt-6">
                <div className="bg-white rounded-2xl shadow-apple border border-gray-200/50 p-8 w-full max-w-md mx-4">
                  {success ? (
                    <div className="text-center py-4">
                      <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-7 h-7 text-green-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        You're in!
                      </h3>
                      <p className="text-sm text-gray-500">
                        Scroll down to see all 10 skills.
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="text-center mb-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          Unlock all 10 skills
                        </h3>
                        <p className="text-sm text-gray-500">
                          Enter your email to get instant access to the full
                          guide — free, no strings attached.
                        </p>
                      </div>

                      {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                          <AlertCircle
                            size={18}
                            className="text-red-600 mt-0.5 flex-shrink-0"
                          />
                          <span className="text-red-800 text-sm">{error}</span>
                        </div>
                      )}

                      <form onSubmit={handleSubmit} className="space-y-3">
                        <div className="relative">
                          <User
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                          />
                          <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            placeholder="Your name (optional)"
                            disabled={loading}
                          />
                        </div>
                        <div className="relative">
                          <Mail
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                          />
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            placeholder="Your email address"
                            required
                            disabled={loading}
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={loading}
                          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          {loading ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Submitting...
                            </>
                          ) : (
                            'Unlock All 10 Skills'
                          )}
                        </button>
                      </form>
                      <p className="text-xs text-gray-400 text-center mt-3">
                        No spam. No credit card. Just the guide.
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* Unlocked: show all remaining skills */
            <div className="space-y-4">
              {gatedSkills.map((skill) => (
                <SkillCard key={skill.number} skill={skill} />
              ))}
            </div>
          )}
        </div>

        {/* The closer */}
        {unlocked && (
          <section className="border-t border-gray-100">
            <div className="max-w-3xl mx-auto px-6 sm:px-8 lg:px-12 py-14 text-center">
              <p className="text-sm text-gray-400 uppercase tracking-wider font-medium mb-4">
                The bottom line
              </p>
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-gray-900 mb-4 leading-snug">
                Most people start in healthcare front office work knowing 2-3
                of these skills. The ones who understand all 10 stand out in
                any healthcare setting.
              </h2>
              <p className="text-gray-500 mb-8 max-w-xl mx-auto leading-relaxed">
                VytalPath Academy covers every skill on this list — 80+ lessons,
                18 quizzes, 24 SOPs, a built-in EHR Practice Lab, and AI
                coaching on every page. $327/year.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  to="/"
                  className="group px-8 py-3.5 text-lg font-medium text-white bg-gray-900 rounded-2xl hover:bg-gray-800 transition-all duration-300 shadow-apple hover:shadow-apple-lg flex items-center gap-2"
                >
                  Start Your 3-Day Risk-Free Trial
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </div>
              <p className="text-sm text-gray-400 mt-3 font-light">
                3-day full refund guarantee · No hidden fees
              </p>
            </div>
          </section>
        )}

        {/* Footer back link */}
        <div className="bg-white border-t border-gray-100 py-6">
          <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
            <Link
              to="/"
              className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
            >
              &larr; Back to VytalPath Academy
            </Link>
          </div>
        </div>
      </article>
    </>
  );
}
