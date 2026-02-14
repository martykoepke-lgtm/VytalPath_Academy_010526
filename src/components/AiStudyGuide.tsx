import { Link } from 'react-router-dom';
import {
  Bot, Stethoscope, ClipboardCheck, Users, FileText,
  MessageCircle, MousePointerClick, ArrowRight, Sparkles,
  Phone, Briefcase, ShieldCheck, Target, Monitor, RotateCcw,
  type LucideIcon
} from 'lucide-react';
import { SEO, seoConfigs } from './SEO';

interface ModeCardProps {
  icon: LucideIcon;
  label: string;
  color: string;
  bg: string;
  badgeBg: string;
  category: 'Page-aware' | 'You-aware';
  categoryColor: string;
  description: string;
  examples: string[];
  bestWith: string;
}

function ModeCard({ icon: Icon, label, color, bg, badgeBg, category, categoryColor, description, examples, bestWith }: ModeCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-apple border border-gray-200/50 p-6 hover-lift transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-11 h-11 ${bg} rounded-xl flex items-center justify-center`}>
          <Icon className={`w-5.5 h-5.5 ${color}`} />
        </div>
        <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${badgeBg} ${categoryColor}`}>
          {category}
        </span>
      </div>
      <h3 className="text-base font-semibold text-gray-900 mb-1">{label}</h3>
      <p className="text-sm text-gray-500 leading-relaxed mb-4">{description}</p>

      <div className="space-y-1.5 mb-4">
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Try saying</p>
        {examples.map((ex) => (
          <div key={ex} className="text-xs text-gray-600 bg-gray-50 rounded-lg px-3 py-1.5 italic">
            "{ex}"
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-400">
        <span className="font-medium">Best with:</span> {bestWith}
      </p>
    </div>
  );
}

function StepCard({ step, icon: Icon, title, description }: { step: number; icon: LucideIcon; title: string; description: string }) {
  return (
    <div className="flex-1 text-center">
      <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-3 relative">
        <Icon className="w-6 h-6 text-blue-600" />
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
          {step}
        </span>
      </div>
      <h4 className="text-sm font-semibold text-gray-900 mb-1">{title}</h4>
      <p className="text-xs text-gray-500 leading-relaxed">{description}</p>
    </div>
  );
}

function JobReadinessCard({ icon: Icon, title, aiRole, description }: { icon: LucideIcon; title: string; aiRole: string; description: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200/50 p-4 hover-lift transition-all duration-300">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-9 h-9 bg-slate-50 rounded-lg flex items-center justify-center">
          <Icon className="w-4.5 h-4.5 text-slate-600" />
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-900">{title}</h4>
          <p className="text-[10px] text-gray-400">AI plays: {aiRole}</p>
        </div>
      </div>
      <p className="text-xs text-gray-500 leading-relaxed">{description}</p>
    </div>
  );
}

export function AiStudyGuide() {
  return (
    <>
      <SEO {...seoConfigs.aiGuide} />
      <article className="max-w-3xl mx-auto">
        {/* Hero */}
        <header className="text-center mb-10">
          <div className="w-16 h-16 bg-slate-600 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <Bot className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-gray-900 mb-3">
            Your AI Study Assistant
          </h1>
          <p className="text-lg font-light text-gray-500 leading-relaxed max-w-xl mx-auto">
            One button. Five learning experiences. Available on every page. No navigation required.
          </p>
        </header>

        {/* How It Works — 3 Steps */}
        <section className="mb-14">
          <div className="bg-gradient-to-br from-blue-50/80 to-slate-50 rounded-2xl border border-blue-100/60 p-8">
            <h2 className="text-lg font-semibold text-gray-900 text-center mb-6">How It Works</h2>
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-4">
              <StepCard
                step={1}
                icon={MousePointerClick}
                title="Click the chat icon"
                description="Look for the chat bubble in the bottom-right corner of any page. It's always there."
              />
              <div className="hidden sm:flex items-center justify-center">
                <ArrowRight className="w-5 h-5 text-gray-300" />
              </div>
              <StepCard
                step={2}
                icon={Sparkles}
                title="Choose a mode"
                description="Click the mode badge at the top of the chat panel to open a dropdown with all five modes."
              />
              <div className="hidden sm:flex items-center justify-center">
                <ArrowRight className="w-5 h-5 text-gray-300" />
              </div>
              <StepCard
                step={3}
                icon={MessageCircle}
                title="Start learning"
                description="Ask questions, practice scenarios, or get coaching. Switch modes anytime without leaving the page."
              />
            </div>
          </div>
        </section>

        {/* Page-Aware vs You-Aware */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold tracking-tight text-gray-900 mb-2 text-center">
            Two Ways the AI Adapts to You
          </h2>
          <p className="text-gray-500 text-center mb-6 max-w-xl mx-auto text-sm">
            Some modes change based on what page you are on. Others change based on your personal progress. Both are always available from the dropdown.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-blue-50/50 rounded-2xl border border-blue-100 p-5">
              <div className="flex items-center gap-2 mb-2">
                <Monitor className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-semibold text-blue-800">Page-Aware Modes</h3>
              </div>
              <p className="text-xs text-blue-700/70 leading-relaxed">
                These modes adapt to <strong>where you are</strong>. The Tutor tailors answers to your current section. The EHR Coach reads your live lab state.
              </p>
            </div>
            <div className="bg-green-50/50 rounded-2xl border border-green-100 p-5">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-green-600" />
                <h3 className="text-sm font-semibold text-green-800">You-Aware Modes</h3>
              </div>
              <p className="text-xs text-green-700/70 leading-relaxed">
                These modes adapt to <strong>your progress</strong>. They read your quiz scores and competency levels to personalize every interaction, from any page.
              </p>
            </div>
          </div>
        </section>

        {/* Five Mode Cards */}
        <section className="mb-14">
          <h2 className="text-xl font-semibold tracking-tight text-gray-900 mb-2 text-center">
            Five Modes, Five Experiences
          </h2>
          <p className="text-gray-500 text-center mb-6 max-w-xl mx-auto text-sm">
            Each mode gives you a completely different type of support. Switch between them anytime using the dropdown at the top of the chat panel.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ModeCard
              icon={Bot}
              label="Tutor"
              color="text-blue-700"
              bg="bg-blue-100"
              badgeBg="bg-blue-50"
              category="Page-aware"
              categoryColor="text-blue-600"
              description="Answers questions about whatever section you are currently studying. Keeps answers short and focused on your current topic."
              examples={[
                "What is the difference between a copay and coinsurance?",
                "Explain the minimum necessary standard.",
                "What are the steps for new patient registration?"
              ]}
              bestWith="Any lesson or section page"
            />
            <ModeCard
              icon={Stethoscope}
              label="EHR Coach"
              color="text-teal-700"
              bg="bg-teal-100"
              badgeBg="bg-teal-50"
              category="Page-aware"
              categoryColor="text-teal-600"
              description="Guides you through EHR Practice Lab workflows step by step. Sees your live session: which patient, which screen, which appointment."
              examples={[
                "How do I check in Maria Santos?",
                "Walk me through scheduling a follow-up.",
                "What do I do after the provider finishes?"
              ]}
              bestWith="EHR Practice Lab"
            />
            <ModeCard
              icon={ClipboardCheck}
              label="Practice"
              color="text-green-700"
              bg="bg-green-100"
              badgeBg="bg-green-50"
              category="You-aware"
              categoryColor="text-green-600"
              description="Generates ungraded practice questions targeted at your weakest areas. Adapts difficulty as you answer: harder after 2 correct, easier after 2 wrong."
              examples={[
                "Quiz me on my weakest areas.",
                "Give me an insurance verification question.",
                "I want to practice HIPAA scenarios."
              ]}
              bestWith="Progress dashboard or after any quiz"
            />
            <ModeCard
              icon={Users}
              label="Patient Sim"
              color="text-purple-700"
              bg="bg-purple-100"
              badgeBg="bg-purple-50"
              category="You-aware"
              categoryColor="text-purple-600"
              description="Role-plays as a patient at your front desk. The scenario is calibrated to your gaps: if insurance is weak, the patient brings complex coverage questions."
              examples={[
                "Start a new patient scenario.",
                "I want to practice with a difficult patient.",
                "Give me a scenario involving insurance."
              ]}
              bestWith="Communication or Insurance sections"
            />
            <ModeCard
              icon={FileText}
              label="Scenarios"
              color="text-amber-700"
              bg="bg-amber-100"
              badgeBg="bg-amber-50"
              category="You-aware"
              categoryColor="text-amber-600"
              description="Presents realistic workplace scenarios that test your SOP knowledge. After you describe your steps, it evaluates correctness, completeness, and sequencing."
              examples={[
                "Give me a morning opening scenario.",
                "Test me on check-in procedures.",
                "I want a scheduling conflict scenario."
              ]}
              bestWith="Workflows section or SOP Library"
            />
          </div>
        </section>

        {/* Practice Is Ungraded */}
        <section className="mb-14">
          <div className="bg-emerald-50/60 rounded-2xl border border-emerald-200/60 p-6 flex items-start gap-4">
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-emerald-900 mb-1">Practice Is Always Safe</h3>
              <p className="text-sm text-emerald-700/80 leading-relaxed">
                Everything you do with the AI agents is completely ungraded. Practice questions, patient simulations, and SOP scenarios are tracked separately from your standardized quizzes. They will never affect your quiz scores, progress percentages, or certificate eligibility. Use them as much as you want.
              </p>
            </div>
          </div>
        </section>

        {/* Suggested Actions */}
        <section className="mb-14">
          <h2 className="text-xl font-semibold tracking-tight text-gray-900 mb-2 text-center">
            The AI Finds Your Next Step
          </h2>
          <p className="text-gray-500 text-center mb-6 max-w-xl mx-auto text-sm">
            When you open the chat panel, the system may show a personalized recommendation card based on your progress. You do not need to search for it.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { icon: RotateCcw, title: 'Retry Quiz', desc: 'Appears when you scored below passing on a quiz. One click opens Practice mode on that topic.', color: 'text-amber-600', bg: 'bg-amber-50' },
              { icon: Target, title: 'Practice Weak Area', desc: 'Appears when a competency domain falls below 70%. Targets adaptive questions at that gap.', color: 'text-green-600', bg: 'bg-green-50' },
              { icon: Monitor, title: 'Try EHR Lab', desc: 'Appears if you have not yet opened the EHR Practice Lab. Navigates there with coaching active.', color: 'text-teal-600', bg: 'bg-teal-50' },
              { icon: FileText, title: 'Practice SOPs', desc: 'Appears if you have not tried SOP scenarios yet. Opens Scenarios mode with a workplace situation.', color: 'text-blue-600', bg: 'bg-blue-50' },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-xl border border-gray-200/50 p-4 flex items-start gap-3">
                <div className={`w-9 h-9 ${item.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <item.icon className={`w-4.5 h-4.5 ${item.color}`} />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-0.5">{item.title}</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Job Readiness AI Tools */}
        <section className="mb-14">
          <h2 className="text-xl font-semibold tracking-tight text-gray-900 mb-2 text-center">
            AI-Powered Job Readiness Tools
          </h2>
          <p className="text-gray-500 text-center mb-6 max-w-xl mx-auto text-sm">
            The Job Readiness section includes four additional AI simulations with dedicated interfaces, separate from the chat panel modes.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <JobReadinessCard
              icon={Phone}
              title="Phone Simulator"
              aiRole="the caller"
              description="Practice handling incoming calls: new patient scheduling, insurance questions, prescription refills, angry patients, referrals, and emergencies."
            />
            <JobReadinessCard
              icon={Briefcase}
              title="Mock Interview"
              aiRole="the hiring manager"
              description="8-10 progressive questions with coaching after each answer. Get a final evaluation with strengths, improvement areas, and a hiring recommendation."
            />
            <JobReadinessCard
              icon={Phone}
              title="Insurance Hotline"
              aiRole="insurance representative"
              description="Call an insurance company to verify benefits. The rep requires proper verification before sharing information, just like real calls."
            />
            <JobReadinessCard
              icon={Sparkles}
              title="Day in the Life"
              aiRole="situation presenter"
              description="Experience 10-12 consecutive front office situations from 8 AM to 5 PM. Handle patients, phone calls, insurance issues, and emergencies."
            />
          </div>

          <div className="mt-4 text-center">
            <Link
              to="/practice"
              className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              Go to Job Readiness
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* CTA */}
        <div className="text-center pb-10">
          <div className="bg-gradient-to-br from-slate-50 to-blue-50/50 rounded-2xl border border-slate-200/60 p-8">
            <div className="w-12 h-12 bg-slate-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to Try It?</h3>
            <p className="text-sm text-gray-500 mb-4 max-w-md mx-auto">
              Click the chat icon in the bottom-right corner of any page. Start with Tutor mode, then explore the other modes as you get comfortable.
            </p>
            <Link
              to="/foundations"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-2xl hover:bg-blue-700 shadow-apple transition-all duration-300"
            >
              Start Learning
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </article>
    </>
  );
}
